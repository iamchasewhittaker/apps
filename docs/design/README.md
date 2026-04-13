# Design docs — portfolio

Single index so branding and icon rules are **not** scattered across chats.

| Document | Audience | Summary |
|----------|----------|---------|
| **[`docs/templates/PORTFOLIO_APP_BRANDING.md`](../templates/PORTFOLIO_APP_BRANDING.md)** | **Every new app** | **Copy into `portfolio/<app>/docs/BRANDING.md`** (or `projects/...`). Placeholders for identity + checklists; tells you what to link from `CLAUDE.md` so you do not repeat yourself each session. |
| **[`CLARITY_IOS_APP_ICON_SPEC.md`](CLARITY_IOS_APP_ICON_SPEC.md)** | Clarity **iOS** suite (Check-in, Triage, Time, Budget, Growth, …) | Shared **app icon** geometry, colors, Xcode layout, `sips` export notes. |

**Workflow:** New app → copy **PORTFOLIO_APP_BRANDING** → fill → link from app `CLAUDE.md` → for Clarity iOS icons, follow **CLARITY_IOS_APP_ICON_SPEC** once when producing assets.

**Handoff — Clarity launcher icons:** Triage · Time · Budget **shipped** (see root `HANDOFF.md` + each app’s `docs/BRANDING.md`). **Remaining:** **Clarity Growth** — paste **[`docs/templates/SESSION_START_CLARITY_IOS_LOGOS.md`](../templates/SESSION_START_CLARITY_IOS_LOGOS.md)** into a new chat; Check-in stays the visual reference.
