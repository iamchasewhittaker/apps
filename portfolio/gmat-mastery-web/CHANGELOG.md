# Changelog — GMAT Mastery Web

## [Unreleased]
- Added `vercel.json` to declare Next.js framework for Vercel deployment
- Became active WIP=1 Build slot (2026-04-26)

## [0.1.0] — 2026-04-21
- Initial scaffold: Next.js 16.2 + React 19 + TypeScript + Tailwind 4 + Framer Motion
- Claude API question generation via tool use (structured MCQ output)
- Socratic explanation engine (3-bullet breakdown per question)
- 4-screen flow: Landing (section/difficulty picker) -> Question -> Explanation -> Summary
- Game state reducer with localStorage persistence (XP, streak, level, per-topic metrics)
- Both API routes use `claude-haiku-4-5-20251001`
