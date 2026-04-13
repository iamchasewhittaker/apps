# iOS Theme Alignment Handoff

> Goal: Align the Clarity iOS app suite to the same BASE token set now used by all 4 web apps, so the portfolio feels like one cohesive family across platforms.

**Web reference:** `docs/design/PORTFOLIO_WEB_THEME_HANDOFF.md`
**Web alignment completed:** 2026-04-13 (Job Search HQ, Wellness, App Forge, Knowledge Base)

---

## Context

The Clarity iOS suite (5 apps + YNAB Clarity) shares a centralized theme via `clarity-ui`. The current palette (`ClarityPalette.swift`) is already dark and blue-tinted — the same **spirit** as the web BASE tokens, but not the same hex values. Aligning them closes the gap so switching between the web and iOS versions of the same product feels seamless.

---

## Token Comparison

| Token | Web BASE | iOS Current (hex) | iOS Current (SwiftUI) | Match? |
|-------|----------|-------------------|----------------------|--------|
| **bg** | `#0f1117` | `#0e1015` | `(0.055, 0.063, 0.082)` | ~Near (~3 units) |
| **surface** | `#161b27` | `#1a1e26` | `(0.102, 0.118, 0.149)` | ~Near |
| **border** | `#1f2937` | `#2c323e` | `(0.173, 0.196, 0.243)` | ⚠️ iOS is lighter |
| **text** | `#f3f4f6` | `#eaedf0` | `(0.918, 0.929, 0.941)` | ~Near |
| **muted** | `#6b7280` | `#b8c2d1` | `(0.720, 0.760, 0.820)` | ❌ Big gap — iOS is much lighter |

> YNAB Clarity uses its own local copy with `muted = (0.62, 0.66, 0.74)` — slightly darker than `clarity-ui` but still much lighter than web BASE.

---

## What Changes Visually

| Area | Before → After | Impact |
|------|---------------|--------|
| **App background** | `#0e1015` → `#0f1117` | Nearly imperceptible — ~1 shade shift |
| **Cards / surfaces** | `#1a1e26` → `#161b27` | Slightly deeper blue-tinted surface |
| **Borders** | `#2c323e` → `#1f2937` | More subtle — borders become lighter, less visible |
| **Primary text** | `#eaedf0` → `#f3f4f6` | Slightly brighter white — marginally higher contrast |
| **Muted / secondary text** | `#b8c2d1` → `#6b7280` | **Most visible change** — labels, captions, metadata go from near-white to mid-gray |

### The Muted Decision

This is the only token worth debating. The current iOS muted (`#b8c2d1`, luminance ~73%) was intentionally set high-contrast for low-vision readability. The web BASE muted (`#6b7280`, luminance ~44%) matches the Tailwind `gray-500` convention.

**Options:**
- **A — Full alignment** (`#6b7280`): perfect cross-platform parity; secondary text will feel darker / more subdued on iOS.
- **B — Compromise** (`#8b93a5`, midpoint): closer to web than current, still passes WCAG AA on dark bg.
- **C — Keep iOS muted as-is**: only update bg/surface/border/text. No disruption to accessibility baseline.

**Recommendation:** Start with **Option A** and verify visually in Simulator. The dark bg (`#0f1117`) provides enough contrast for `#6b7280` to still be readable. The low-vision concern is partially addressed by iOS system Dynamic Type and Bold Text settings, which override font weight regardless of color.

---

## Target SwiftUI Values

```swift
// clarity-ui/Sources/ClarityUI/Theme/ClarityPalette.swift

// ── Backgrounds ──────────────────────────────────────────────────
public static let bg      = Color(red: 0.059, green: 0.067, blue: 0.090)  // #0f1117 — was #0e1015
public static let surface = Color(red: 0.086, green: 0.106, blue: 0.153)  // #161b27 — was #1a1e26
public static let border  = Color(red: 0.122, green: 0.161, blue: 0.216)  // #1f2937 — was #2c323e

// ── Text ─────────────────────────────────────────────────────────
public static let text    = Color(red: 0.953, green: 0.957, blue: 0.965)  // #f3f4f6 — was #eaedf0
public static let muted   = Color(red: 0.420, green: 0.447, blue: 0.502)  // #6b7280 — was #b8c2d1 (see muted decision above)

// ── Semantic (no changes) ─────────────────────────────────────────
// accent, safe, caution, danger, purple — keep as-is
// mutedHighContrast — keep as-is or recalibrate after visual review
```

> Update the comment on line 11 from `/// (#0e1015)` to `/// (#0f1117)` and line 19 from `/// (#eaedf0)` to `/// (#f3f4f6)`.

---

## Migration Steps

### Step 1: Update `clarity-ui` (affects 5 apps instantly)

**File:** `portfolio/clarity-ui/Sources/ClarityUI/Theme/ClarityPalette.swift`

1. Replace the 5 `Color(red:green:blue:)` values for `bg`, `surface`, `border`, `text`, `muted` with the target values above
2. Update the inline hex comments (`#0e1015` → `#0f1117`, etc.)
3. Run `swift test` from `portfolio/clarity-ui/` — `ClarityPaletteTests` should pass
4. Open each of the 5 Clarity apps in Xcode, build (⌘B), and do a visual scan in Simulator

**Apps automatically updated:**
- Clarity Check-in
- Clarity Triage
- Clarity Time
- Clarity Budget
- Clarity Growth

### Step 2: Update YNAB Clarity (separate local copy)

**File:** `portfolio/ynab-clarity-ios/YNABClarity/Theme/ClarityTheme.swift`

Same 5 value changes. YNAB Clarity uses `ClarityTheme` (local) not `ClarityPalette` (package).

### Step 3: Verify in Simulator

Screens to check per app:
- Main list / home view (background + surface cards)
- Detail / modal (border visibility)
- Any screen with secondary text / metadata (muted impact)
- Settings or empty states

---

## Font

The web apps now use **DM Sans**. On iOS, the equivalent spirit is `.system(design: .rounded)` — which is already the `ClarityTypography` convention for display, title, and headline sizes.

**No font changes needed for iOS.** The rounded system font on iOS plays the same visual role DM Sans plays on web.

If DM Sans is ever added as a custom font to the iOS apps:
1. Add `DM_Sans` OTF files to each app's bundle (not to `clarity-ui` — Swift packages can't embed font resources)
2. Register in each app's `Info.plist` under `UIAppFonts`
3. Reference via `Font.custom("DMSans-Regular", size: ...)` — not recommended until Apple adds it to the system

---

## Mockup Comparison (Visual Preview)

The changes are deliberately subtle on bg/surface/text — the goal is a tighter cross-platform match, not a redesign. The noticeable shift is the muted color:

```
BEFORE (Clarity iOS current):
  ┌─────────────────────────────┐
  │ bg: ████ #0e1015            │
  │ surface cards: ████ #1a1e26 │
  │ borders: ████ #2c323e       │
  │ PRIMARY TEXT  ← #eaedf0     │
  │ secondary text  ← #b8c2d1  │   ← near-white, very visible
  └─────────────────────────────┘

AFTER (BASE-aligned):
  ┌─────────────────────────────┐
  │ bg: ████ #0f1117            │  ← almost identical
  │ surface cards: ████ #161b27 │  ← slightly deeper blue
  │ borders: ████ #1f2937       │  ← more subtle, less visible
  │ PRIMARY TEXT  ← #f3f4f6     │  ← slightly brighter
  │ secondary text  ← #6b7280  │   ← darker mid-gray (like web)
  └─────────────────────────────┘
```

---

## What NOT to Change

- App accent colors: `safe` (green), `caution` (amber), `danger` (red), `accent` (blue), `purple` — these are semantic and intentional
- `ClarityTypography` — all semantic `.system()` fonts, Dynamic Type compliant, no changes needed
- `ClarityMetrics` — spacing/corner radius values are platform-appropriate, not token-driven

---

## Files Summary

| File | Change | Apps affected |
|------|--------|--------------|
| `portfolio/clarity-ui/Sources/ClarityUI/Theme/ClarityPalette.swift` | 5 color token updates | Clarity Check-in, Triage, Time, Budget, Growth |
| `portfolio/ynab-clarity-ios/YNABClarity/Theme/ClarityTheme.swift` | 5 color token updates | YNAB Clarity only |

**Total effort: Low.** Two files, 5 color value changes each. No layout, logic, or component changes.

---

## Session Start Prompt

```
Read CLAUDE.md and HANDOFF.md first, then portfolio/clarity-ui/CLAUDE.md.

Goal: Apply the shared design token set from docs/design/IOS_THEME_ALIGNMENT_HANDOFF.md
to the Clarity iOS suite.

Step 1: Update clarity-ui/Sources/ClarityUI/Theme/ClarityPalette.swift
  bg:      Color(red: 0.059, green: 0.067, blue: 0.090)  // #0f1117
  surface: Color(red: 0.086, green: 0.106, blue: 0.153)  // #161b27
  border:  Color(red: 0.122, green: 0.161, blue: 0.216)  // #1f2937
  text:    Color(red: 0.953, green: 0.957, blue: 0.965)  // #f3f4f6
  muted:   Color(red: 0.420, green: 0.447, blue: 0.502)  // #6b7280

Step 2: Same changes in ynab-clarity-ios/YNABClarity/Theme/ClarityTheme.swift

Step 3: swift test from portfolio/clarity-ui/

Step 4: Build each app (⌘B), do visual scan in Simulator.

Keep all accent/semantic colors unchanged. No layout, logic, or font changes.
Update each app's CHANGELOG [Unreleased] when done.
```
