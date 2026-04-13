# Session start — generate Clarity iOS app icons (Triage · Time · Budget · Growth)

Copy everything below into a **new** chat, adjust brackets if needed, then send.

---

**Instructions for the agent**

1. Read repo **[CLAUDE.md](../../CLAUDE.md)** and **[HANDOFF.md](../../HANDOFF.md)** first.
2. Read the **shared rules** (do not invent a different visual language):
   - **[`docs/design/CLARITY_IOS_APP_ICON_SPEC.md`](../design/CLARITY_IOS_APP_ICON_SPEC.md)** — tile shell, stroke weight, optional blue badge, center-glyph rules, Xcode layout, `sips` padding note.
   - **[`docs/templates/PORTFOLIO_APP_BRANDING.md`](PORTFOLIO_APP_BRANDING.md)** — per-app `docs/BRANDING.md` pattern; link from each app’s `CLAUDE.md` when done.
3. **Reference (already shipped):** [`portfolio/clarity-checkin-ios/docs/BRANDING.md`](../../portfolio/clarity-checkin-ios/docs/BRANDING.md) + [`portfolio/clarity-checkin-ios/docs/design/`](../../portfolio/clarity-checkin-ios/docs/design/) — Check-in icon matches the suite; treat as the quality bar.
4. For **each scoped app** (default: **Clarity Growth** only): produce a **1024×1024** opaque **`AppIcon.png`**, place it in that app’s `AppIcon.appiconset/`, set **`Contents.json`** `"filename": "AppIcon.png"` on the universal iOS slot (same pattern as Check-in). Keep a wide mockup under that app’s **`docs/design/app-icon-mockup-wide.png`** (1376×768 like Check-in when possible).
5. If the source art is **not** square, pad to square before scaling: `sips --padColor E6E7EB -p <W> <H> wide.png` then `sips -z 1024 1024` — see **LEARNINGS** in Check-in and §5 of the icon spec.
6. Run **`xcodebuild build`** for each touched scheme (Growth → **`ClarityGrowth`**; confirm with `-list` if unsure). Update that app’s **`CHANGELOG.md` `[Unreleased]`**, **`docs/BRANDING.md`** (create from portfolio template if missing), **`CLAUDE.md`** branding bullet, app **`HANDOFF`/`ROADMAP`** as needed, root **`ROADMAP.md`** Change Log, and root **`HANDOFF.md`** State when icons ship.

**Human — pick scope in chat if needed:**

- [x] **Triage + Time + Budget** — shipped (`AppIcon.png` 1024 + `docs/BRANDING.md` + wide mockups). **Default for new chats:** **Growth only** below.
- [ ] **Growth only** — `portfolio/clarity-growth-ios/` · scheme `ClarityGrowth` (last sibling for suite parity)
- [ ] **Fix / iterate** another app’s icon — name which app

---

## Target apps

**Shipped (skip unless fixing):** Clarity Check-in · Clarity Triage · Clarity Time · Clarity Budget — each has `docs/BRANDING.md`, `AppIcon.appiconset/AppIcon.png`, and (where applicable) `docs/design/app-icon-mockup-wide.png`. See root [`HANDOFF.md`](../../HANDOFF.md) State.

| App | Folder | Scheme (verify) | Primary ritual → **center glyph** idea (from spec §3 — refine, don’t clone Check-in) |
|-----|--------|-----------------|----------------------------------------------------------------------------------------|
| **Clarity Growth** *(next)* | `portfolio/clarity-growth-ios/` | `ClarityGrowth` | Seven areas + streaks — upward step, sprout, or multi-node minimal mark |

**Asset paths (each app):** `<AppFolder>/<AppSources>/Assets.xcassets/AppIcon.appiconset/`  
(e.g. `ClarityTriage/Assets.xcassets/AppIcon.appiconset/` — confirm folder name inside each repo.)

---

## Acceptance (“done when”)

- [ ] Each scoped app has **`AppIcon.png`** (1024×1024) + **`Contents.json`** filename entry.
- [ ] Marks use the **same shell** as the spec (navy tile, band, white strokes, optional blue check badge) with a **distinct** center glyph per app.
- [ ] **`xcodebuild build`** succeeds for each touched app (`CODE_SIGNING_ALLOWED=NO` + known-good simulator destination).
- [ ] Each touched app has **`docs/BRANDING.md`** (filled or updated) + **`CLAUDE.md`** links it; root **`ROADMAP.md`** Change Log row documents the work.

---

## Constraints

- **No** new icon geometry system — follow **`CLARITY_IOS_APP_ICON_SPEC.md`** only.
- **No** TypeScript / no web build — iOS assets and docs only unless explicitly expanded.
- Keep diffs **focused** (icons + `Contents.json` + docs; no unrelated refactors).

---

## Optional context for image generation

If using an image tool: **minimal**, **high contrast**, **dark rounded tile** on optional light gray field; **white** line art; **blue** badge bottom-trailing with white check — match Check-in’s **family** look, not generic stock icons.

---

After the session: update root **[`HANDOFF.md`](../../HANDOFF.md)** (State / Notes) and run **`checkpoint`** (or commit).
