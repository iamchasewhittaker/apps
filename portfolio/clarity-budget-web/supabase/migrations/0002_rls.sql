-- Clarity Budget Web — Phase 1 RLS
-- Run AFTER 0001_init.sql.
-- Every row has a user_id; policies scope all access to auth.uid() = user_id.
-- Cron and other server-side code uses SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.

alter table clarity_budget_credentials         enable row level security;
alter table clarity_budget_privacy_cards       enable row level security;
alter table clarity_budget_privacy_transactions enable row level security;
alter table clarity_budget_proposals           enable row level security;
alter table clarity_budget_flags               enable row level security;
alter table clarity_budget_audit_log           enable row level security;
alter table clarity_budget_sync_state          enable row level security;

create policy "owner_all" on clarity_budget_credentials
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owner_all" on clarity_budget_privacy_cards
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owner_all" on clarity_budget_privacy_transactions
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owner_all" on clarity_budget_proposals
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owner_all" on clarity_budget_flags
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owner_all" on clarity_budget_audit_log
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "owner_all" on clarity_budget_sync_state
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
