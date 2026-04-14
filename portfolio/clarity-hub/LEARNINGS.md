# Clarity Hub — Learnings

## 2026-04-13 — Scaffold

### 7-blob save effects need eslint-disable
The save/push `useEffect` hooks for all 7 blobs intentionally only list the blob as a dependency (not `saveBlob`, `pushX`). CRA's eslint will warn about missing deps. Added `// eslint-disable-line react-hooks/exhaustive-deps` to suppress — this is the correct pattern for this architecture.

### hasLoaded ref must be set AFTER all blob states are initialized
In the load useEffect, `hasLoaded.current = true` is set at the end of the synchronous loop (after all `app.set(stored)` calls). This ensures the save effects don't fire before initial load completes. Async pulls can still update state after — that's intentional.

### YNAB engines: milliunits vs dollars
The YNAB API returns all monetary values in milliunits (1/1000 of a dollar). MetricsEngine.js divides by 1000 inside `buildBalances()`. All downstream functions work in dollars. Keep this conversion at the boundary — never divide by 1000 twice.

### CRA boilerplate cleanup
CRA creates App.js (not .jsx). After creating App.jsx, must delete App.js or CRA will try to compile both and error on duplicate component.
