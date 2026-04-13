# App branding — [APP_DISPLAY_NAME]

> **Purpose:** One place per app for **identity + visual rules**. After you copy this into your app folder and fill the brackets, **link here from `CLAUDE.md`** instead of repeating hex codes, icon geometry, or session-long branding briefs in every chat.

---

## How to use (once per new app)

1. **Copy this file** to your app’s docs folder and rename if you like:
   - Recommended: `portfolio/<kebab-app>/docs/BRANDING.md`
   - Or: `projects/<name>/docs/BRANDING.md`
2. **Replace every `[PLACEHOLDER]`** in the tables below.
3. In that app’s **`CLAUDE.md`**, add **one bullet** under *App identity* (or equivalent):

   ```markdown
   - **Branding:** [`docs/BRANDING.md`](docs/BRANDING.md) — single source for icons/palette; do not restate full rules in session prompts.
   ```

4. For **Clarity iOS** apps, also link the shared technical spec (path is from `portfolio/<app>/`):

   ```markdown
   - **Clarity iOS icon system:** [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../../docs/design/CLARITY_IOS_APP_ICON_SPEC.md)
   ```

5. **Session starts:** In [`SESSION_START_APP_CHANGE.md`](SESSION_START_APP_CHANGE.md) prompts, write only: *“Follow `docs/BRANDING.md` for branding.”* — not the spec again.

---

## App identity (fill once)

| Field | Your value |
|-------|------------|
| **Display name** | `[APP_DISPLAY_NAME]` |
| **Repo path** | `[portfolio/<kebab>/ or projects/<name>/]` |
| **Stack** | `[React CRA / SwiftUI iOS + ClarityUI / Python CLI / other]` |
| **Bundle ID** *(native only)* | `[com.example.App]` |
| **Storage / app key** | `[storage_key_or_APP_KEY]` |
| **Primary ritual** (one short phrase — drives the **center icon glyph**) | `[e.g. “Daily triage of capacity + tasks”]` |

---

## Visual system (pick the blocks that apply)

### A) Clarity iOS (SwiftUI, `ClarityUI`, dark suite)

**Canonical spec (do not fork the rules):** [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../design/CLARITY_IOS_APP_ICON_SPEC.md)

| Checklist | Done |
|-----------|------|
| `Assets.xcassets/AppIcon.appiconset/AppIcon.png` — **1024×1024**, opaque | [ ] |
| `AppIcon.appiconset/Contents.json` — `"filename": "AppIcon.png"` on universal iOS slot | [ ] |
| Icon uses **shared shell** (tile, band, white strokes, optional blue badge) + **unique center glyph** per spec §2–3 | [ ] |
| `AccentColor.colorset` matches badge / product accent | [ ] |
| Optional wide mockups / exports under `docs/design/` | [ ] |

**App-specific asset paths** *(fill)*:

| Asset | Path |
|-------|------|
| Shipped App Store / SpringBoard icon | `[e.g. MyApp/Assets.xcassets/AppIcon.appiconset/AppIcon.png]` |
| Design references | `[e.g. docs/design/…]` |

---

### B) Web (React CRA, inline styles, Vercel PWA)

| Checklist | Done |
|-----------|------|
| Dark palette + components consistent with existing portfolio apps | [ ] |
| `manifest.json` + `index.html` meta / theme aligned with this file | [ ] |

**Reference implementation:** [`portfolio/wellness-tracker/docs/BRANDING.md`](../../portfolio/wellness-tracker/docs/BRANDING.md) (Clarity family colors, W mark pattern, PWA notes).

---

### C) Python CLI

| Checklist | Done |
|-----------|------|
| No launcher icon — optional one-line name in `--help` only | [ ] |
| Reports/HTML exports: reuse Clarity-like neutrals if user-facing | [ ] |

---

## Voice & naming *(optional)*

| Rule | Value |
|------|-------|
| User-visible product name | `[same as display name or App Store name]` |
| Words to avoid in UI | `[e.g. §, internal codenames]` |

---

## Related monorepo docs

| Doc | Use when |
|-----|----------|
| [`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../design/CLARITY_IOS_APP_ICON_SPEC.md) | Drawing or exporting **any** Clarity-family iOS icon |
| [`docs/design/README.md`](../design/README.md) | Index of design specs |
| [`docs/templates/SESSION_START_APP_CHANGE.md`](SESSION_START_APP_CHANGE.md) | Starting a single-app AI session |
| [`docs/ios-app-starter-kit/README.md`](../ios-app-starter-kit/README.md) | Planning docs order before code |

---

## Changelog *(optional — append when branding ships or changes)*

| Date | Change |
|------|--------|
| `[YYYY-MM-DD]` | Initial `BRANDING.md` from template |
