-- Per-app changelog + roadmap entries, populated by scripts/scan.ts

create table if not exists changelog_entries (
  id uuid primary key default gen_random_uuid(),
  project_slug text not null references projects(slug) on delete cascade,
  version text,
  entry_date date,
  heading text not null,
  body_md text not null default '',
  sort_index int not null default 0,
  scanned_at timestamptz default now(),
  unique (project_slug, version, heading)
);

create index if not exists idx_changelog_entries_project on changelog_entries (project_slug);
create index if not exists idx_changelog_entries_entry_date on changelog_entries (entry_date desc nulls last);

create table if not exists roadmap_entries (
  id uuid primary key default gen_random_uuid(),
  project_slug text not null references projects(slug) on delete cascade,
  phase_name text not null,
  phase_status text,
  item_text text not null,
  item_done boolean not null default false,
  item_date date,
  sort_index int not null default 0,
  scanned_at timestamptz default now(),
  unique (project_slug, phase_name, item_text)
);

create index if not exists idx_roadmap_entries_project on roadmap_entries (project_slug);
create index if not exists idx_roadmap_entries_done on roadmap_entries (project_slug, item_done);
