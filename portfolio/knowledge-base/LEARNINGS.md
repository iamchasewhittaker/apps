# Learnings — Knowledge Base

Mistakes, fixes, and "aha" moments. Read at session start; append after anything surprising.

---

## 2026-04-13 — Storage shape migration

**What happened:** Needed to add `categoryOrder` alongside `bookmarks` in localStorage but the blob was a bare array. Couldn't add top-level fields to an array.

**Fix:** Migrated blob shape from `[...]` to `{ bookmarks: [...], categoryOrder: [...] }`. Added auto-detect in `load()` — if parsed value is an array, wraps it in the new shape. Zero data loss on upgrade.

**Rule:** When adding new top-level state to a localStorage app, migrate the blob shape in `load()` and never assume the old format. Always check `Array.isArray(parsed)` before destructuring.

---

## 2026-04-13 — `persist` closure over `categoryOrder`

**What happened:** `persist(nextBookmarks)` needs to save `categoryOrder` too, but `categoryOrder` is state. Initially tried a `persistRef` object as a workaround.

**Fix:** Since `persist` is recreated on every render, it already closes over the current `categoryOrder`. Simplified to `const persist = (next) => save({ bookmarks: next, categoryOrder })` — no ref needed.

**Rule:** In React function components, helper functions defined in the component body always have access to current state values via closure. Only reach for refs when you need the value inside a `useEffect` or async callback that might have stale closure.

---

## 2026-04-13 — App appeared unchanged after code edits

**What happened:** All code changes were written to disk and build succeeded, but user saw no change. The live Vercel site was still the old version.

**Fix:** Ran `vercel --prod` to push the new build to production. Dev server (`npm start`) was already running separately on port 3000.

**Rule:** After any code change, explicitly confirm which environment the user is checking (local dev vs. live Vercel). Always deploy after shipping a feature.
