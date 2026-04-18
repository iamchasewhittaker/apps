-- Phase 2: RLS + auth gate
-- Run this in the Supabase SQL editor AFTER 0001_init.sql.
-- The scanner (scripts/scan.ts) must use SUPABASE_SERVICE_ROLE_KEY to bypass RLS.
-- Web app server components authenticate via session cookie (Magic Link auth).

alter table projects        enable row level security;
alter table blockers        enable row level security;
alter table scans           enable row level security;
alter table wip_decisions   enable row level security;
alter table review_cadence  enable row level security;
alter table reviews         enable row level security;
alter table learnings       enable row level security;
alter table themes          enable row level security;

-- Single owner pattern: authenticated users (Chase) have full access.
-- Anon (scanner service role) bypasses RLS automatically.
create policy "owner_all" on projects       for all to authenticated using (true) with check (true);
create policy "owner_all" on blockers       for all to authenticated using (true) with check (true);
create policy "owner_all" on scans          for all to authenticated using (true) with check (true);
create policy "owner_all" on wip_decisions  for all to authenticated using (true) with check (true);
create policy "owner_all" on review_cadence for all to authenticated using (true) with check (true);
create policy "owner_all" on reviews        for all to authenticated using (true) with check (true);
create policy "owner_all" on learnings      for all to authenticated using (true) with check (true);
create policy "owner_all" on themes         for all to authenticated using (true) with check (true);
