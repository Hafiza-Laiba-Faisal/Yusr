-- 1. Extend app_role to include agent and manager
-- Altering enum directly is simple in newer Postgres, but Supabase migrations usually prefer fresh definitions if possible.
-- However, we can just add the values.
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'agent';

-- 2. Waitlist table for capturing leads
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  service_interest TEXT, -- social-media, business-automation, etc.
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'ignored')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert to waitlist" ON public.waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow superadmin to manage waitlist" ON public.waitlist FOR ALL USING (auth.jwt() ->> 'email' = 'hafizalaibafaisal@gmail.com');

-- 3. Update profiles for custom roles (sync with app_role)
-- The existing handle_new_user trigger already sets the owner as 'admin' (which is now part of the new hierarchy).

-- 4. Enable RLS on waitlist for admin view
-- (Already handled above with superadmin check)

-- 5. Helper for granular RLS checks based on a future permissions table (placeholder logic)
-- For now, we rely on the client-side hasPermission for UI and RLS for data safety.
