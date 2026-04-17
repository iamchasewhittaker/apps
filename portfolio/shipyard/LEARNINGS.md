# Learnings — Shipyard

## 2026-04-16 (Phase 1 build session)

**GitHub repo has a 10-project limit for git connections.**
Had to disconnect growth-tracker and roller-task-tycoon (retired) to make room for shipyard. Check `vercel git list` before connecting a new project — you may need to free a slot first.

**`vercel --prod` from a subdirectory conflicts with rootDirectory project setting.**
For monorepo projects where `rootDirectory` is set (e.g., `portfolio/shipyard`), Vercel ignores the local CWD and re-reads the project config. Pushing via git is the correct deploy path. `vercel --prod` from a subdirectory will either fail or deploy the wrong root.

**The audit CSV has more `type` values than expected.**
Values like `automation`, `infrastructure`, and `macos_app` were not in the initial type enum. Map them explicitly in the seed script or use a fallback to `"other"`. Unrecognized types cause Supabase insert errors if the column is constrained.

**`csv-parse` throws on rows with fewer columns than headers.**
Fix: pass `{ relax_column_count: true }` to the parser. Without it, any short row (trailing comma missing, blank fields at end) will throw and abort the entire import.

**Supabase shared project (`unqtnnxlltiadzbqpyhh`) works fine for Shipyard.**
No need to create a new Supabase project. The shared project already has the credentials in `.env.supabase` at the repo root. Just add the two `NEXT_PUBLIC_SUPABASE_*` env vars to Vercel for this project.

**Vercel env vars added via CLI for `preview` target silently fail when a duplicate key already exists for `production`.**
The CLI does not error — it just skips. Use the Vercel API `PATCH /v9/projects/{id}/env/{envId}` approach instead, or delete the conflicting var first and re-add with all targets specified.
