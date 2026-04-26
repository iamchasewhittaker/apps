-- Clarity Budget Web — AI auto-categorization (suggestions table)
-- Run AFTER 0002_rls.sql.
-- Stores LLM-produced category suggestions for YNAB transactions. High-
-- confidence suggestions (>= 0.85) are auto-applied + approved on YNAB during
-- the run; lower-confidence rows surface in the /categorize review queue.

-- Allow `ynab_categorize` as a sync_state source so categorization runs can
-- stamp last_run_at / last_success_at / last_error alongside privacy + ynab.
alter table clarity_budget_sync_state
  drop constraint clarity_budget_sync_state_source_check;
alter table clarity_budget_sync_state
  add constraint clarity_budget_sync_state_source_check
    check (source in ('ynab', 'privacy', 'ynab_categorize'));

create table clarity_budget_categorization_suggestions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  ynab_txn_id text not null,
  status text not null default 'pending'
    check (status in ('pending', 'auto_applied', 'user_applied', 'dismissed', 'invalid')),
  category_id text,
  category_name text,
  confidence numeric not null,
  reasoning text,
  model_id text not null,
  prompt_hash text not null,
  subtransactions jsonb,             -- null unless the parent txn is a split
  txn_snapshot jsonb not null,       -- payee/amount/date at suggestion time (audit trail)
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by_action text
);

-- One open suggestion per (user, txn). Re-runs upsert; resolved rows stay
-- behind for audit but won't collide because the same txn won't reappear in
-- ?type=uncategorized once it's auto_applied.
create unique index uq_clarity_budget_cat_sugg_user_txn
  on clarity_budget_categorization_suggestions(user_id, ynab_txn_id);

create index idx_clarity_budget_cat_sugg_user_status_created
  on clarity_budget_categorization_suggestions(user_id, status, created_at desc);

alter table clarity_budget_categorization_suggestions enable row level security;

create policy "owner_all" on clarity_budget_categorization_suggestions
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
