# Design docs — portfolio

Single index so branding and icon rules are **not** scattered across chats.

| Document | Audience | Summary |
|----------|----------|---------|
| **[`docs/templates/PORTFOLIO_APP_BRANDING.md`](../templates/PORTFOLIO_APP_BRANDING.md)** | **Every new app** | **Copy into `portfolio/<app>/docs/BRANDING.md`** (or `projects/...`). Placeholders for identity + checklists; link from `CLAUDE.md` so you do not repeat rules each session. |
| **[`CLARITY_IOS_APP_ICON_SPEC.md`](CLARITY_IOS_APP_ICON_SPEC.md)** | Clarity **iOS** suite | Shared **app icon** geometry, colors, Xcode layout, `sips` export notes. |

**Workflow:** New app → copy **PORTFOLIO_APP_BRANDING** → fill → link from app `CLAUDE.md` → for Clarity iOS icons, follow **CLARITY_IOS_APP_ICON_SPEC** when producing assets.

**Clarity iOS suite (five apps):** Each ships **`docs/BRANDING.md`** + **`AppIcon.appiconset/AppIcon.png`** (1024). Glyphs: Check-in (horizon + pill), Triage (nested chevron), Time (clock + arc), Budget (stacked coins), Growth (sprout). Details and explore mockups live in each app’s **`docs/BRANDING.md`**.

**Handoff — change one launcher:** paste **[`docs/templates/SESSION_START_CLARITY_IOS_LOGOS.md`](../templates/SESSION_START_CLARITY_IOS_LOGOS.md)** into a new chat and name the app.
