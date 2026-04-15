# CLAUDE.md

## Project Overview
macOS menu bar app that tracks Claude Max subscription usage and API costs. Built with Electron + React + TypeScript + Vite.

## Commands
- `npm run electron:dev` — Run in development (Vite + TypeScript watcher + Electron)
- `npm run electron:build` — Build distributable macOS app (outputs to `release/`)
- `npm run dev` — Vite only (web UI, no Electron)
- `npm run build` — Build frontend (TypeScript + Vite)
- `npm run lint` — Lint with ESLint

## Architecture

### Electron Main Process (`electron/`)
- **main.ts** — App entry point. Creates tray icon, popup window, IPC handlers, and 60-second auto-refresh loop
- **scraper.ts** — Web scraping engine. Opens hidden BrowserWindows to `claude.ai/settings/usage` and `platform.claude.com/settings/billing`, executes JavaScript to parse usage data. Uses `persist:claude-session` partition for cookies
- **preload.ts** — IPC bridge between main process and renderer (contextIsolation)
- **adminApi.ts** — Anthropic Admin API client for usage/cost reports and credit balance (requires `ANTHROPIC_ADMIN_KEY`)

### React Frontend (`src/`)
- **App.tsx** — Main app component
- **components/ClaudeMaxUsage.tsx** — Displays usage bars scraped from claude.ai
- **components/ApiCosts.tsx** — Displays API billing/cost data
- **components/ErrorBoundary.tsx** — React error boundary wrapper

### Key Patterns
- Scraper windows are hidden (`show: false`) and use `stripElectronUA()` to remove Electron from user-agent
- `executeJavaScript` calls are wrapped in `Promise.race` with 5s timeout to prevent hangs from disposed render frames
- Usage page needs 7s render wait for SPA content to load
- `platform.claude.com` crashes in Electron 28 — platform login opens in system browser via `shell.openExternal()`
- Electron main process does NOT hot-reload; restart app after changing `electron/` files

## Config
- `.env.local` — Set `ANTHROPIC_ADMIN_KEY=sk-ant-admin-...` for Admin API features (optional)
- `electron-store` persists user preferences (e.g., Launch at Login)
- **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) — single source for icons/palette; do not restate full rules in session prompts.

## Build Output
- `dist/` — Vite frontend build
- `dist-electron/` — Compiled TypeScript for Electron main process
- `release/` — Distributable `.dmg` from electron-builder
