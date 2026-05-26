create or replace function public.search_kb(_workspace_id uuid, _query text, _limit int default 4)
returns table (content text, rank real)
language sql stable security definer set search_path = public
as $$
  select kc.content, ts_rank(kc.tsv, plainto_tsquery('english', _query)) as rank
  from public.knowledge_chunks kc
  where kc.workspace_id = _workspace_id
    and kc.tsv @@ plainto_tsquery('english', _query)
  order by rank desc
  limit _limit
$$;