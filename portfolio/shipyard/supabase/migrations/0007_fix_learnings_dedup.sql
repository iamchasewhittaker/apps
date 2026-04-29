-- Fix: replace partial unique index with full unique index
-- so Supabase JS .upsert({ onConflict }) can target it.
-- NULL values remain distinct in PostgreSQL unique indexes,
-- so manual learnings (null raw_source_ref) won't collide.
drop index if exists idx_learnings_dedup;
create unique index idx_learnings_dedup on learnings(project_slug, source, raw_source_ref);
