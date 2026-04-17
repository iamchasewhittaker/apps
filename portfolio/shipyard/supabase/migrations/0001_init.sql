-- Shipyard schema — Phase 1 + Phase 2 tables

-- Projects: one row per app in the fleet
create table projects (
  slug text primary key,
  name text not null,
  type text not null check (type in ('web', 'ios', 'library', 'cli', 'desktop')),
  family text not null default 'standalone' check (family in ('clarity', 'standalone', 'portfolio', 'archived')),
  status text not null default 'active' check (status in ('active', 'stalled', 'frozen', 'archived')),
  location text,
  tech_stack text,
  framework_versions jsonb,
  mvp_step int,
  mvp_step_claimed text,
  mvp_step_actual int,
  last_commit_date timestamptz,
  days_since_commit int,
  feature_count int default 0,
  loc_count int default 0,
  disk_size_mb numeric(8,2),
  live_url text,
  has_live_url boolean default false,
  vercel_project text,
  github_url text,
  linear_project_url text,
  compliance_score int default 0,
  compliance jsonb default '{}',
  jtbd_primary text,
  recommendation text,
  next_action text,
  localstorage_keys text[] default '{}',
  supabase_tables text[] default '{}',
  external_apis text[] default '{}',
  features_list text,
  secrets_p0_count int default 0,
  breaking_change_risk text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Blockers per project
create table blockers (
  id uuid primary key default gen_random_uuid(),
  project_slug text not null references projects(slug) on delete cascade,
  text text not null,
  created_at timestamptz default now(),
  resolved_at timestamptz
);

create index idx_blockers_project on blockers(project_slug);

-- Scan history
create table scans (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz default now(),
  finished_at timestamptz,
  projects_found int default 0,
  projects_updated int default 0,
  learnings_captured int default 0,
  themes_updated int default 0,
  errors jsonb
);

-- WIP decisions log
create table wip_decisions (
  id uuid primary key default gen_random_uuid(),
  active_slug text not null references projects(slug),
  stalled_slugs text[] default '{}',
  decided_at timestamptz default now()
);

-- Review cadence config (3 rows)
create table review_cadence (
  kind text primary key check (kind in ('weekly', 'monthly', 'quarterly')),
  cadence_days int not null,
  last_review_at timestamptz,
  reminded_at timestamptz
);

insert into review_cadence (kind, cadence_days) values
  ('weekly', 7),
  ('monthly', 30),
  ('quarterly', 90);

-- Reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('weekly', 'monthly', 'quarterly')),
  started_at timestamptz default now(),
  finished_at timestamptz,
  stats jsonb,
  reflection_id uuid,
  csv_blob text
);

-- Learnings
create table learnings (
  id uuid primary key default gen_random_uuid(),
  project_slug text references projects(slug) on delete set null,
  review_id uuid references reviews(id) on delete set null,
  text text not null,
  tags text[] default '{}',
  scripture_ref text,
  source text not null default 'manual' check (source in ('manual', 'auto:commit', 'auto:changelog', 'auto:todo', 'auto:audit')),
  reviewed boolean default true,
  raw_source_ref text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_learnings_project on learnings(project_slug);
create index idx_learnings_source on learnings(source);
create unique index idx_learnings_dedup on learnings(project_slug, source, raw_source_ref) where raw_source_ref is not null;

-- Add FK from reviews.reflection_id to learnings
alter table reviews add constraint fk_reviews_reflection foreign key (reflection_id) references learnings(id) on delete set null;

-- Themes
create table themes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  kind text not null check (kind in ('portfolio_thesis', 'narrative_thread', 'cross_app_pattern', 'common_input')),
  description text default '',
  project_slugs text[] default '{}',
  auto_generated boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Updated_at trigger function
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_projects_updated_at before update on projects for each row execute function update_updated_at();
create trigger trg_learnings_updated_at before update on learnings for each row execute function update_updated_at();
create trigger trg_themes_updated_at before update on themes for each row execute function update_updated_at();
