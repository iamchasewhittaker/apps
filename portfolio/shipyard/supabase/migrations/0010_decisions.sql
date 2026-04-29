-- Add decisions tracking to projects + new decisions table

alter table projects add column if not exists decisions_count int default 0;

create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  project_slug text not null references projects(slug) on delete cascade,
  decision_date date,
  title text not null,
  body_md text not null,
  has_reflection boolean default false,
  raw_source_ref text,
  scanned_at timestamptz default now()
);

create index if not exists idx_decisions_project on decisions(project_slug);
create unique index if not exists idx_decisions_dedup on decisions(project_slug, raw_source_ref) where raw_source_ref is not null;
