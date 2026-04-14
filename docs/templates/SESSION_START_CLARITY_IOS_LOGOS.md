# Session start — Clarity iOS app icons (fix · iterate · new app)

Copy everything below into a **new** chat, fill the brackets, then send.

---

**Instructions for the agent**

1. Read repo **[`CLAUDE.md`](../../CLAUDE.md)** and **[`HANDOFF.md`](../../HANDOFF.md)** first.
2. Use defaults from `CLAUDE.md` unless overridden below:
   - `update docs` means app + root docs scope (canonical default).
   - Shipped truth is git + Linear; `HANDOFF.md` is resume context.
3. Read the **shared rules** (do not invent a different visual language):
   - **[`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../design/CLARITY_IOS_APP_ICON_SPEC.md)** — tile shell, stroke weight, optional blue badge, center-glyph rules, Xcode layout, `sips` padding note.
   - **[`docs/templates/PORTFOLIO_APP_BRANDING.md`](PORTFOLIO_APP_BRANDING.md)** — per-app `docs/BRANDING.md` pattern; link from each app’s `CLAUDE.md` when you change assets.
4. **Suite shipped (reference):** all five Clarity iOS apps have **`AppIcon.png`** (1024) + **`docs/BRANDING.md`** + wide mockups where noted. Use **Check-in** as the family quality bar: [`portfolio/clarity-checkin-ios/docs/BRANDING.md`](../../portfolio/clarity-checkin-ios/docs/BRANDING.md) + [`portfolio/clarity-checkin-ios/docs/design/`](../../portfolio/clarity-checkin-ios/docs/design/).
5. **Scope:** Human names **one app** (or “new sixth Clarity app”) in chat. Default = **fix / iterate** launcher art for that app only — do not re-theme the whole suite unless asked.
6. For the **scoped** app: update **`AppIcon.png`** in `AppIcon.appiconset/`, keep **`Contents.json`** `"filename": "AppIcon.png"` on the universal iOS slot. Keep / add **`docs/design/app-icon-mockup-wide.png`** (wide canvas is fine); optional **`app-icon-mockup-explore-*.png`** for alternates (see Budget / Growth `docs/BRANDING.md`).
7. If the source art is **not** square, pad before scaling: `sips --padColor E6E7EB -p <W> <H> wide.png` then `sips -z 1024 1024` — see Check-in **`LEARNINGS.md`** and icon spec §5.
8. Run **`xcodebuild build`** for the touched scheme (`ClarityCheckin`, `ClarityTriage`, `ClarityTime`, `ClarityBudget`, `ClarityGrowth` — confirm with `-list`). Update that app’s **`CHANGELOG.md` `[Unreleased]`**, **`docs/BRANDING.md`**, **`HANDOFF.md`** / **`ROADMAP.md`** if needed, **`CLAUDE.md`** branding line, root **`ROADMAP.md`** Change Log, and root **`HANDOFF.md`** when you ship a glyph change.

**Human — paste one line:**

- **App:** [Clarity Check-in | Triage | Time | Budget | Growth | other]  
- **Goal:** [e.g. “Tighten Triage chevron stroke” / “Try alternate Budget mark, keep explore PNGs”]  
- **Docs scope override (optional):** [default app+root | app-only | handoff-only]

---

## Shipped suite (glyph summary — read app `docs/BRANDING.md` for paths & alternates)

| App | Folder | Scheme | Center glyph (shipped) |
|-----|--------|--------|-------------------------|
| **Clarity Check-in** | `portfolio/clarity-checkin-ios/` | `ClarityCheckin` | Morning horizon + tick + **pill** |
| **Clarity Triage** | `portfolio/clarity-triage-ios/` | `ClarityTriage` | **Nested chevron** (capacity / priority) |
| **Clarity Time** | `portfolio/clarity-time-ios/` | `ClarityTime` | **Clock + progress arc** + check badge |
| **Clarity Budget** | `portfolio/clarity-budget-ios/` | `ClarityBudget` | **Stacked coins** (dual-scenario / wants); explore wides in `docs/design/` |
| **Clarity Growth** | `portfolio/clarity-growth-ios/` | `ClarityGrowth` | **Sprout**; prior steps + explore wides in `docs/design/` |

**Asset path pattern:** `<Sources>/Assets.xcassets/AppIcon.appiconset/` (e.g. `ClarityTriage/Assets.xcassets/AppIcon.appiconset/` — confirm inside each repo).

---

## Acceptance (“done when”)

- [ ] Scoped app has valid **`AppIcon.png`** (1024×1024 opaque) + **`Contents.json`** filename entry.
- [ ] Mark still uses the **same shell** as the spec (navy tile, band, white strokes, optional blue check badge) unless product explicitly changes the system.
- [ ] **`xcodebuild build`** succeeds (`CODE_SIGNING_ALLOWED=NO` + installed simulator).
- [ ] **`docs/BRANDING.md`** + **`CLAUDE.md`** reflect changes; root **`ROADMAP.md`** + **`HANDOFF.md`** updated if the glyph shipped or docs materially changed.

---

## Constraints

- **No** forked icon geometry system — follow **`CLARITY_IOS_APP_ICON_SPEC.md`** only.
- **No** unrelated app refactors — icons + asset catalog + docs only unless the human expands scope.
- **SpringBoard:** after icon changes, delete the app from Simulator and reinstall to avoid cached tiles.

---

## Optional — image generation brief

**Minimal**, **high contrast**, **dark rounded tile** on optional **#E6E7EB** field; **white** line art; **blue** badge bottom-trailing with white check — match the **Clarity Check-in** family; never generic stock marks.

---

After the session: run **`checkpoint`** (or commit) and update root **`HANDOFF.md`**.
