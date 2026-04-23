# Feature Design — <FeatureName>

> Lives at: `portfolio/<target-app>/docs/features/<feature-slug>/FEATURE_DESIGN.md`
> Output of STEP 4F in the Idea Kitchen Claude Project flow (feature mode).

## Target app

`<target-app-slug>` — branding reference: `portfolio/<target-app>/docs/BRANDING.md`.

## Screens affected

### New screens

#### `<ScreenName1>`

- **Purpose:** <one sentence>
- **Key elements:** <ordered list of controls, text blocks, key UI affordances>
- **Empty state:** <what the user sees when there's no data yet>
- **Error state:** <what the user sees when something fails>
- **Loading state:** <if relevant>

#### `<ScreenName2>`

- (same shape)

### Existing screens modified

#### `<ExistingScreenName>`

- **What's added:** <new element, new section, new entry point>
- **What's changed:** <if anything>
- **Impact on existing behavior:** <regressions to watch for>

## Components

### New components

- **`<ComponentName1>`** — <purpose, props shape, states it renders>
- **`<ComponentName2>`** — <…>

### Reused components

Reference target app's existing component list in `portfolio/<target-app>/CLAUDE.md`.

- **`<ExistingComponent>`** — reused as-is for <purpose>
- **`<ExistingComponent2>`** — extended with new prop `<prop>` for <purpose>

### Shared-package candidates

If any component could serve 2+ apps, flag it here for eventual extraction (e.g. `ClarityUI` for Swift, shared `components/` for React).

- `<Component>` — <which other apps might benefit + why>

## States

Enumerate every interactive state the feature exposes:

- **Loading** — <spinner, skeleton, placeholder? first-load vs refresh?>
- **Empty** — <what prompts the user to add the first item?>
- **Error** — <retry, fallback, offline message?>
- **Success** — <confirmation, toast, nav change?>
- **Offline** — <if applicable: what works offline, what doesn't>

## Accessibility (per screen)

Not optional — Chase has low vision.

| Screen | Dynamic Type | Tap targets | VoiceOver labels | Contrast | Focus order |
|---|---|---|---|---|---|
| `<ScreenName1>` | ✅ scales from xSmall to xxxLarge | all ≥44pt | every control has accessibilityLabel | 4.5:1 text, 3:1 UI | top-to-bottom, left-to-right |
| `<ScreenName2>` | … | … | … | … | … |

## Theme tokens

Reuse from `portfolio/<target-app>/docs/BRANDING.md`. No new tokens without justification.

- **Colors:** `<token-name>` for <purpose>, `<token-name>` for <…>
- **Spacing:** `<token>` / `<token>` — standard app rhythm
- **Typography:** `<token>` for headings, `<token>` for body, `<token>` for monospace
- **New tokens (if any):** `<token>` — **justification:** <why target's palette doesn't cover this>

## Data delta

Additions/changes to the target app's data model. 3–10 lines of pseudo-shape.

```swift
// Example for SwiftUI + @Observable target:
struct HeadData {
  let id: UUID
  let zone: Int
  let nozzle: String
  var coordinate: CLLocationCoordinate2D?  // NEW — sprinkler map position
  var sprayPattern: SprayPattern?          // NEW — rendered as MKCircle
}

enum SprayPattern { case fullCircle(Double); case arc(start: Double, end: Double, radius: Double) }  // NEW type
```

```ts
// Example for CRA + localStorage target:
type Feature = {
  id: string;
  createdAt: number;
  // ...existing fields
  newField: string;  // NEW — <purpose>
};
```

## Primary flow

Numbered, each step = user action + system response. 5–8 steps.

1. User <action> → app <response>
2. User <action> → app <response>
3. …

## Alternate flows

1–3 branches — error, empty state, first-run.

- **First-run:** <flow>
- **Error recovery:** <flow>
- **Empty state CTA:** <flow>
