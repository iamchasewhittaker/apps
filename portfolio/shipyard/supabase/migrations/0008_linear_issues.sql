create table if not exists linear_issues (
  id uuid primary key default gen_random_uuid(),
  project_slug text not null references projects(slug) on delete cascade,
  linear_id text not null,
  identifier text not null,
  title text not null,
  status_name text,
  status_type text,
  priority int default 0,
  url text,
  updated_at timestamptz,
  synced_at timestamptz default now()
);

create unique index if not exists idx_linear_issues_linear_id on linear_issues(linear_id);
create index if not exists idx_linear_issues_project on linear_issues(project_slug);

alter table linear_issues enable row level security;
create policy "owner_all" on linear_issues for all to authenticated using (true) with check (true);
