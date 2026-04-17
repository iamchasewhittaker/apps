# MVP Audit — Shipyard

*Audit date: 2026-04-16 · Framework: 6-step MVP*

- **What it is:** Live portfolio dashboard that replaces the static audit CSV with an always-current view of all ~29 projects (ships), enforces WIP-of-1 with a drydock gate, runs weekly/monthly/quarterly reviews, captures learnings, surfaces themes, and curates a public portfolio.
- **Current step:** Step 4 (Build)
- **Evidence:** App scaffolded with Next.js 15 + TypeScript + Tailwind. All Phase 1 pages built, scanner CLI written, database schema defined. Not yet deployed or connected to Supabase.
- **What's missing to Ship:** Supabase project created, migration run, scanner tested against real filesystem, deployed to Vercel, seeded with audit CSV data.
- **Biggest risk:** Scanner edge cases — projects with unusual structures may not scan cleanly.
- **Recommended next action:** Create Supabase project, run migration, set env vars, run scanner, deploy.
