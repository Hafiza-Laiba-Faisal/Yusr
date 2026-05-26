
-- Roles enum
create type public.app_role as enum ('admin', 'member');

-- Workspaces (one per business / signup)
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My Workspace',
  owner_id uuid not null references auth.users(id) on delete cascade,
  whatsapp_phone_number_id text,
  whatsapp_business_account_id text,
  default_mode text not null default 'human' check (default_mode in ('human','ai')),
  system_prompt text not null default 'You are a helpful, concise WhatsApp support agent for our business. Always be polite, accurate, and brief. Use the provided knowledge base context when relevant.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.workspaces enable row level security;

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  active_workspace_id uuid references public.workspaces(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- Workspace members + roles
create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'admin',
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);
alter table public.workspace_members enable row level security;

-- Security definer: is user member of workspace?
create or replace function public.is_workspace_member(_user_id uuid, _workspace_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members
    where user_id = _user_id and workspace_id = _workspace_id
  )
$$;

create or replace function public.has_workspace_role(_user_id uuid, _workspace_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.workspace_members
    where user_id = _user_id and workspace_id = _workspace_id and role = _role
  )
$$;

-- Contacts (whoever messaged us on WhatsApp)
create table public.contacts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  wa_phone text not null,
  display_name text,
  avatar_url text,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  unique (workspace_id, wa_phone)
);
alter table public.contacts enable row level security;
create index on public.contacts (workspace_id, last_message_at desc);

-- Conversations (one per contact)
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  contact_id uuid not null references public.contacts(id) on delete cascade,
  mode text not null default 'human' check (mode in ('human','ai')),
  unread_count integer not null default 0,
  last_message_preview text,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  unique (workspace_id, contact_id)
);
alter table public.conversations enable row level security;
create index on public.conversations (workspace_id, last_message_at desc);

-- Messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  direction text not null check (direction in ('inbound','outbound')),
  sender text not null check (sender in ('contact','agent','ai')),
  message_type text not null default 'text' check (message_type in ('text','image','document','audio','video')),
  body text,
  media_url text,
  media_mime text,
  status text default 'delivered',
  created_at timestamptz not null default now()
);
alter table public.messages enable row level security;
create index on public.messages (conversation_id, created_at);

-- Knowledge base documents
create table public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  title text not null,
  source_type text not null default 'file' check (source_type in ('file','text','url')),
  file_path text,
  size_bytes bigint,
  status text not null default 'processing' check (status in ('processing','ready','error')),
  error_message text,
  created_at timestamptz not null default now()
);
alter table public.knowledge_documents enable row level security;

-- Knowledge chunks (lightweight RAG via keyword search; embeddings can be added later)
create table public.knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  document_id uuid not null references public.knowledge_documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  tsv tsvector generated always as (to_tsvector('english', content)) stored,
  created_at timestamptz not null default now()
);
alter table public.knowledge_chunks enable row level security;
create index on public.knowledge_chunks using gin (tsv);
create index on public.knowledge_chunks (workspace_id);

-- Workspaces policies
create policy "members can view workspace" on public.workspaces for select
  using (public.is_workspace_member(auth.uid(), id));
create policy "owner can update workspace" on public.workspaces for update
  using (owner_id = auth.uid());
create policy "authenticated can create workspace" on public.workspaces for insert
  with check (owner_id = auth.uid());

-- Profiles policies
create policy "users can view own profile" on public.profiles for select
  using (id = auth.uid());
create policy "users can update own profile" on public.profiles for update
  using (id = auth.uid());
create policy "users can insert own profile" on public.profiles for insert
  with check (id = auth.uid());

-- workspace_members policies
create policy "members can view their memberships" on public.workspace_members for select
  using (user_id = auth.uid() or public.is_workspace_member(auth.uid(), workspace_id));
create policy "owners insert membership" on public.workspace_members for insert
  with check (user_id = auth.uid());

-- Generic workspace-scoped policies (members have full access)
create policy "members all on contacts" on public.contacts for all
  using (public.is_workspace_member(auth.uid(), workspace_id))
  with check (public.is_workspace_member(auth.uid(), workspace_id));

create policy "members all on conversations" on public.conversations for all
  using (public.is_workspace_member(auth.uid(), workspace_id))
  with check (public.is_workspace_member(auth.uid(), workspace_id));

create policy "members all on messages" on public.messages for all
  using (public.is_workspace_member(auth.uid(), workspace_id))
  with check (public.is_workspace_member(auth.uid(), workspace_id));

create policy "members all on knowledge_documents" on public.knowledge_documents for all
  using (public.is_workspace_member(auth.uid(), workspace_id))
  with check (public.is_workspace_member(auth.uid(), workspace_id));

create policy "members all on knowledge_chunks" on public.knowledge_chunks for all
  using (public.is_workspace_member(auth.uid(), workspace_id))
  with check (public.is_workspace_member(auth.uid(), workspace_id));

-- Trigger: on signup -> create profile + workspace + membership
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ws_id uuid;
begin
  insert into public.workspaces (name, owner_id)
  values (coalesce(new.raw_user_meta_data->>'workspace_name', split_part(new.email,'@',1) || '''s Workspace'), new.id)
  returning id into ws_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (ws_id, new.id, 'admin');

  insert into public.profiles (id, email, full_name, active_workspace_id)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', ws_id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at trigger for workspaces
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger workspaces_touch before update on public.workspaces
  for each row execute function public.touch_updated_at();

-- Realtime publication
alter table public.messages replica identity full;
alter table public.conversations replica identity full;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.conversations;

-- Storage bucket for KB files
insert into storage.buckets (id, name, public) values ('kb-files', 'kb-files', false)
on conflict (id) do nothing;

create policy "members read kb files" on storage.objects for select
  using (bucket_id = 'kb-files' and public.is_workspace_member(auth.uid(), (storage.foldername(name))[1]::uuid));
create policy "members upload kb files" on storage.objects for insert
  with check (bucket_id = 'kb-files' and public.is_workspace_member(auth.uid(), (storage.foldername(name))[1]::uuid));
create policy "members delete kb files" on storage.objects for delete
  using (bucket_id = 'kb-files' and public.is_workspace_member(auth.uid(), (storage.foldername(name))[1]::uuid));
