-- Clarity Budget Web — Phase 1 schema
-- Run this in the Supabase SQL editor (project unqtnnxlltiadzbqpyhh) before 0002_rls.sql.
-- All tables prefixed clarity_budget_ to avoid collision with other apps sharing the project.
-- user_id references auth.users implicitly; RLS in 0002 scopes rows to auth.uid().

-- Encrypted YNAB + Privacy tokens per user (AES-256-GCM ciphertext/iv/tag stored base64)
create table clarity_budget_credentials (
  user_id uuid primary key,
  ynab_token_ciphertext text,
  ynab_token_iv text,
  ynab_token_tag text,
  privacy_token_ciphertext text,
  privacy_token_iv text,
  privacy_token_tag text,
  default_budget_id text,
  key_version int not null default 1,
  updated_at timestamptz not null default now()
);

-- Privacy.com virtual cards (one row per card). linked_payee_id maps the card
-- to a YNAB payee — seeded via fuzzy match, user can override in /settings.
create table clarity_budget_privacy_cards (
  token text primary key,
  user_id uuid not null,
  memo text,
  state text,
  type text,
  linked_payee_id text,
  updated_at timestamptz not null default now()
);

create index idx_clarity_budget_privacy_cards_user on clarity_budget_privacy_cards(user_id);

-- Privacy.com transactions pulled from the API. matched_ynab_txn_id is set by
-- lib/reconcile/match.ts when a corresponding YNAB transaction is found.
create table clarity_budget_privacy_transactions (
  token text primary key,
  user_id uuid not null,
  card_token text,
  merchant_descriptor text,
  merchant_city text,
  amount_cents int,
  status text,
  created timestamptz,
  settled timestamptz,
  matched_ynab_txn_id text,
  updated_at timestamptz not null default now()
);

create index idx_clarity_budget_privacy_transactions_user_created
  on clarity_budget_privacy_transactions(user_id, created desc);

-- Proposals surfaced in the /review queue. v1 has a single type: payee_rename.
create table clarity_budget_proposals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null check (type in ('payee_rename')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'dismissed')),
  ynab_txn_id text,
  privacy_txn_token text,
  current_payee_name text,
  proposed_payee_name text,
  proposed_payee_id text,
  confidence numeric,
  reason text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by_action text
);

create unique index uq_clarity_budget_proposals_user_txn_type
  on clarity_budget_proposals(user_id, ynab_txn_id, type);
create index idx_clarity_budget_proposals_user_status_created
  on clarity_budget_proposals(user_id, status, created_at desc);

-- Weirdness flags surfaced in the /flags inbox. fingerprint is a deterministic
-- hash of related IDs so repeated cron runs hit the unique constraint.
create table clarity_budget_flags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  type text not null check (type in (
    'duplicate_txn',
    'orphan_privacy_charge',
    'orphan_ynab_privacy_payee'
  )),
  status text not null default 'open' check (status in ('open', 'acknowledged')),
  severity text,
  related_ids jsonb not null default '[]',
  details jsonb not null default '{}',
  fingerprint text not null,
  created_at timestamptz not null default now(),
  acknowledged_at timestamptz
);

create unique index uq_clarity_budget_flags_user_type_fingerprint
  on clarity_budget_flags(user_id, type, fingerprint);
create index idx_clarity_budget_flags_user_status_created
  on clarity_budget_flags(user_id, status, created_at desc);

-- Append-only audit log of user + cron + system actions.
create table clarity_budget_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  actor text not null check (actor in ('user', 'cron', 'system')),
  action text not null,
  entity_type text,
  entity_id text,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_clarity_budget_audit_log_user_created
  on clarity_budget_audit_log(user_id, created_at desc);

-- Per-user, per-source sync cursor. Source is 'ynab' or 'privacy'.
create table clarity_budget_sync_state (
  user_id uuid not null,
  source text not null check (source in ('ynab', 'privacy')),
  cursor text,
  last_run_at timestamptz,
  last_success_at timestamptz,
  last_error text,
  primary key (user_id, source)
);

-- updated_at trigger (distinct name to avoid collision with Shipyard's
-- update_updated_at() in the shared Supabase project)
create or replace function clarity_budget_update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_clarity_budget_credentials_updated_at
  before update on clarity_budget_credentials
  for each row execute function clarity_budget_update_updated_at();

create trigger trg_clarity_budget_privacy_cards_updated_at
  before update on clarity_budget_privacy_cards
  for each row execute function clarity_budget_update_updated_at();

create trigger trg_clarity_budget_privacy_transactions_updated_at
  before update on clarity_budget_privacy_transactions
  for each row execute function clarity_budget_update_updated_at();
