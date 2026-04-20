-- Shipyard polish pass migration
-- Adds per-project priority rank (for Drydock Gate queue) + category/tagline/summary metadata.
-- Idempotent: re-runnable safely.

alter table projects add column if not exists priority_rank int;
alter table projects add column if not exists category text;
alter table projects add column if not exists tagline text;
alter table projects add column if not exists summary text;

-- Index priority lookups for queue sort
create index if not exists projects_priority_rank_idx on projects (priority_rank asc nulls last);
