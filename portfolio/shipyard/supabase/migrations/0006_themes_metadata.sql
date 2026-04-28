-- Extend themes with two new kinds (common_prompt, glossary_term)
-- and a metadata jsonb column for kind-specific structured data.

alter table themes drop constraint if exists themes_kind_check;

alter table themes add constraint themes_kind_check
  check (kind in (
    'portfolio_thesis',
    'narrative_thread',
    'cross_app_pattern',
    'common_input',
    'common_prompt',
    'glossary_term'
  ));

alter table themes add column if not exists metadata jsonb default '{}'::jsonb;

create index if not exists idx_themes_kind on themes (kind);
