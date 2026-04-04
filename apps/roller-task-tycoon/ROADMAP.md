# Roadmap

## Now

- [x] Vite scaffold + original HTML/CSS/JS behavior
- [x] PWA manifest + Apple meta + safe-area layout
- [x] Supabase sync + email OTP auth gate
- [x] Documentation set (shortcut-reference parity)
- [x] Deploy to Vercel — **https://roller-task-tycoon.vercel.app**
- [ ] Add `VITE_SUPABASE_*` on Vercel + redeploy; add URL to Supabase redirect allowlist

## Next

- [ ] Optional: `vite-plugin-pwa` + service worker for offline shell (sync still needs network)
- [ ] Custom icon art (replace solid teal PNGs)
- [ ] Cross-link from other portfolio apps once URL is live

## Later

- [ ] Per-task metadata (due date, “ride type”) — schema change + migration note in ADR
- [ ] Conflict handling beyond last-write-wins (e.g. merge tasks by id)

## Parked / ideas

- Sound effects (toggle)
- Export park report as text/Markdown
