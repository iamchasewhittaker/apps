# Clarity iOS Logo Family - V1 Direction

## Family DNA

- Base tile: rounded-square dark navy container with soft inner depth.
- Contrast: bright white primary symbol, minimal strokes, no clutter.
- Accent motif: blue circular check badge is optional and used only when semantically helpful.
- Mood: calm, serious, and practical (not playful), with iOS homescreen legibility first.

## Shared Visual Rules

- Keep symbol centered and readable at small size.
- Use a dark-first palette from Clarity: `bg`, `surface`, `accent`, and semantic colors.
- Limit each icon to one primary symbol and one optional secondary accent.
- Keep lighting subtle: gentle vignette and soft layered gradient only.

## App Symbol Mapping

- Check-in: pulse/heartbeat loop (wellness snapshot + daily check).
- Triage: stacked priority bars or funnel path (capacity-based sorting).
- Time: session ring + clock cue (focus sessions and streaks).
- Budget: envelope/ledger mark (planned money allocation).
- Growth: upward curve/seedling arrow (progress over time).

## App Accent Intent

- Check-in: blue + safe green touches for wellness.
- Triage: blue + amber touches for prioritization decisions.
- Time: blue + muted silver for timing precision.
- Budget: blue + subtle purple/green for money confidence.
- Growth: blue + green for progress and momentum.

## Optional Badge Guidance

- Use the blue check badge only when it reinforces completion/approval meaning.
- Avoid forcing the badge into icons where it competes with symbol clarity.

---

## V2 (client direction — Apr 2026)

- **Lead mark:** Time icon treatment is the family template: thick white outer ring, inner cool-blue ring, blue accent arc on the outer ring, centered glyph.
- **Badge:** Blue circular checkmark appears on **all five** icons for portfolio consistency.
- **Outputs:** See `portfolio/clarity-logo-mockups-assets/*-v2.png`, `clarity-homescreen-mockup-v2.png`, `clarity-icon-comparison-board-v2.png`, and `generate_clarity_icons.py` to regenerate.

## V3 (Time locked + iterate others)

- **Time:** `draw_time_center` is frozen; ship `clarity-time-icon-canonical.png` (same glyph as v2 Time).
- **Others:** Revised center marks only — same rings + blue badge as v2 Time family.
- **Outputs:** `*-icon-v3.png` for Check-in, Triage, Budget, Growth; `clarity-time-icon-canonical.png`; `clarity-homescreen-mockup-v3.png`; `clarity-icon-comparison-board-v3.png`. Run `python3 portfolio/clarity-logo-mockups-assets/generate_clarity_icons.py` from repo root (or that directory).

