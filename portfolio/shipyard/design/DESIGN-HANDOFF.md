# Shipyard — Design Handoff

> Visual identity, theme system, and iOS assets.

- **Last updated:** 2026-04-19
- **Status:** v0.1 assets complete — ready for Xcode integration
- **Assets location:** `design/`

---

## Theme: Shipyard

A dark nautical command aesthetic — deep navy infrastructure meets precision engineering. Every visual decision references chart rooms, compass bearings, and the quiet authority of fleet command.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#07101E` | Primary background |
| `--surface` | `#0C1A34` | Card / panel backgrounds |
| `--white` | `#F2EEE6` | Primary text, icons |
| `--steel` | `#4A90DE` | Accent — active states, bearing arcs |
| `--gold` | `#D7AA3A` | Highlight rule — use sparingly |
| `--dim` | `#346090` | Secondary text, muted labels |
| `--dimmer` | `#141A4C` | Subtle rules, grid lines |
| `--ghost` | `#0D1A34` | Background texture rings |

### Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Wordmark / Hero | BigShoulders | Bold | All caps, wide tracking |
| Eyebrow / Labels | DM Mono | Regular | Monospaced, uppercase |
| Body / UI | Instrument Sans | Regular / Bold | Clean sans for readable UI |

### Design Principles

- Background grid of faint horizontal rules (every 40px) — nautical chart paper
- Compass ring motifs (ghost circles + cardinal ticks) as ambient decoration
- Steel blue arc fragments for emphasis — always partial, never full circles
- Gold used as a single-line accent only — underlines, divider ticks
- Monospaced coordinates (`44°22'N / 68°12'W`) as micro-detail anchors
- Sonar arcs in corners to frame compositions

---

## Assets

All assets live in `design/`. Structure below.

```
design/
  theme/
    shipyard-theme.md         — Full theme spec (colors, fonts, principles)
  logo/
    shipyard-logo.png         — Horizontal lockup, 1200×480px @300dpi
  ios/
    AppIcon.appiconset/       — All Xcode-ready icon sizes (see below)
    launch-screen.png         — 1290×2796px @3x (iPhone 15 Pro Max)
    onboarding-1-welcome.png  — 1170×2532px @3x
    onboarding-2-fleet.png    — 1170×2532px @3x
    onboarding-3-inspection.png — 1170×2532px @3x
```

---

## App Icon

### File List (`design/ios/AppIcon.appiconset/`)

| File | Size | Usage |
|---|---|---|
| `icon-1024.png` | 1024×1024 | App Store listing |
| `icon-60@2x.png` | 120×120 | iPhone Home Screen @2x |
| `icon-60@3x.png` | 180×180 | iPhone Home Screen @3x |
| `icon-40@2x.png` | 80×80 | Spotlight / iPad @2x |
| `icon-40@3x.png` | 120×120 | Spotlight @3x |
| `icon-29@1x.png` | 29×29 | Settings @1x |
| `icon-29@2x.png` | 58×58 | Settings @2x |
| `icon-29@3x.png` | 87×87 | Settings @3x |
| `icon-20@2x.png` | 40×40 | Notification @2x |
| `icon-20@3x.png` | 60×60 | Notification @3x |
| `icon-76@1x.png` | 76×76 | iPad @1x |
| `icon-76@2x.png` | 152×152 | iPad @2x |
| `icon-83.5@2x.png` | 167×167 | iPad Pro @2x |

### Xcode Setup

1. In Xcode, open `Assets.xcassets`
2. Delete the default `AppIcon` entry if it exists
3. Drag the entire `AppIcon.appiconset/` folder into `Assets.xcassets`
4. Xcode will auto-map all sizes from the folder name + filenames

> **Note:** iOS 18+ supports a single 1024×1024 icon with automatic resizing. The full set is included for backwards compatibility with iOS 16/17.

---

## Launch Screen

**File:** `design/ios/launch-screen.png`
**Dimensions:** 1290×2796px (iPhone 15 Pro Max @3x logical equivalent)

### Implementation Options

**Option A — Image-based (simplest):**
1. Add `launch-screen.png` to `Assets.xcassets` as an Image Set
2. In `LaunchScreen.storyboard`, set a full-bleed `UIImageView` with `scaleAspectFill`
3. Set background color to `#07101E` to avoid flash on other device sizes

**Option B — Native SwiftUI (recommended for future flexibility):**
```swift
// LaunchScreenView.swift
struct LaunchScreenView: View {
    var body: some View {
        ZStack {
            Color(hex: "07101E").ignoresSafeArea()
            VStack(spacing: 16) {
                // HelmView() — see icon reference
                Text("SHIPYARD")
                    .font(.custom("BigShoulders-Bold", size: 56))
                    .foregroundColor(Color(hex: "F2EEE6"))
                Text("FLEET COMMAND")
                    .font(.custom("DMMono-Regular", size: 16))
                    .foregroundColor(Color(hex: "346090"))
                    .kerning(2)
            }
        }
    }
}
```

---

## Onboarding Screens

Three screens, all 1170×2532px @3x. Implement as a `TabView` with `.tabViewStyle(.page)`.

| File | Screen | Headline | CTA |
|---|---|---|---|
| `onboarding-1-welcome.png` | Welcome | SHIPYARD | SET SAIL → |
| `onboarding-2-fleet.png` | Fleet | EVERY SHIP IN ONE VIEW | CONTINUE → |
| `onboarding-3-inspection.png` | Port Inspection | REVIEWS, LEARNINGS & WIP CONTROL | GET STARTED |

### SwiftUI Shell

```swift
struct OnboardingView: View {
    @State private var page = 0
    @AppStorage("hasOnboarded") var hasOnboarded = false

    let screens = ["onboarding-1-welcome", "onboarding-2-fleet", "onboarding-3-inspection"]

    var body: some View {
        TabView(selection: $page) {
            ForEach(screens.indices, id: \.self) { i in
                Image(screens[i])
                    .resizable()
                    .scaledToFill()
                    .ignoresSafeArea()
                    .tag(i)
            }
        }
        .tabViewStyle(.page(indexDisplayMode: .never))
        .background(Color(hex: "07101E"))
        .onTapGesture {
            if page < screens.count - 1 {
                withAnimation { page += 1 }
            } else {
                hasOnboarded = true
            }
        }
    }
}
```

> **Gate the onboarding** in your root view using `@AppStorage("hasOnboarded")` — show `OnboardingView` when false, `FleetDashboardView` when true.

---

## Fonts

Both fonts are open-source (OFL licensed) and available from Google Fonts.

| Font | Source | Files needed |
|---|---|---|
| BigShoulders | [fonts.google.com/specimen/Big+Shoulders+Display](https://fonts.google.com/specimen/Big+Shoulders+Display) | `BigShoulders-Bold.ttf` |
| DM Mono | [fonts.google.com/specimen/DM+Mono](https://fonts.google.com/specimen/DM+Mono) | `DMMono-Regular.ttf` |
| Instrument Sans | [fonts.google.com/specimen/Instrument+Sans](https://fonts.google.com/specimen/Instrument+Sans) | `InstrumentSans-Regular.ttf`, `InstrumentSans-Bold.ttf` |

### Adding to Xcode

1. Drag `.ttf` files into the Xcode project (check "Add to target")
2. Add each filename to `Info.plist` under `UIAppFonts` (Fonts provided by application):
```xml
<key>UIAppFonts</key>
<array>
    <string>BigShoulders-Bold.ttf</string>
    <string>DMMono-Regular.ttf</string>
    <string>InstrumentSans-Regular.ttf</string>
    <string>InstrumentSans-Bold.ttf</string>
</array>
```

---

## Recommended Next Steps

- [ ] Drop `AppIcon.appiconset/` into `Assets.xcassets`
- [ ] Add fonts to Xcode project + `Info.plist`
- [ ] Implement `LaunchScreenView` in SwiftUI (or use image fallback)
- [ ] Implement `OnboardingView` with `@AppStorage` gate
- [ ] Define `Color+Shipyard.swift` extension with all theme tokens
- [ ] Port theme tokens to web (`src/app/globals.css`) to keep web and iOS in sync
