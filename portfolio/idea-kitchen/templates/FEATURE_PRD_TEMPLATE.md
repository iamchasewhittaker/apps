# Feature PRD — <FeatureName>

> Lives at: `portfolio/<target-app>/docs/features/<feature-slug>/FEATURE_PRD.md`
> Output of STEP 3F in the Idea Kitchen Claude Project flow (feature mode).

## Target app

`<target-app-slug>` — version, stack, storage (inherits from `portfolio/<target-app>/CLAUDE.md`).

## V1 features

Numbered. Each gets a "done when" acceptance line.

1. **<Feature 1 name>.** <One-sentence description.>
   - **Done when:** <observable behavior that proves it works>
2. **<Feature 2 name>.** <One-sentence description.>
   - **Done when:** <…>
3. …

## NOT in V1

Explicit cut list. Everything considered but deferred. This is the main tool for preventing scope creep later.

- <Deferred item 1 — why deferred>
- <Deferred item 2 — why deferred>
- …

## Portfolio scan & positioning

*Verbatim verdict block from STEP 1F.*

```
Verdict: EXTEND_TARGET | EXTRACT_SHARED | NEW_APP | KILL
Portfolio scan:
  Target: <target-app> — <what exists today that overlaps, or "nothing similar">
  Siblings with overlap:
    - <app-slug> — <overlapping feature> — <lift, share, or ignore>
    - ...
  Shared package candidate: <yes/no + rationale>
Architecture fit: <one sentence>
Justification: <one sentence>
Recommendation: <one sentence>
```

## Competitor findings

*Verbatim verdict block from STEP 1.5F (includes all 4 research layers).*

```
Verdict: KILL | DIFFERENTIATE | PROCEED

Layer 1 — Feature matrix
  <competitor> | <pricing> | <platform> | <capability> | <gap>
  ...

Layer 2 — UX/design teardown
  <competitor>: <2–3 bullets on UI patterns, icons, interaction model>
  ...

Layer 3 — Review mining
  <competitor>: <top complaints from Reddit / App Store / G2, with source>
  ...

Layer 4 — Technical approach
  <competitor>: <inferred stack, public APIs, OSS equivalents>
  ...

Alternatives found:
  - <Name> — <one-line what it does> — <one-line gap>
  - ...

Justification: <one sentence>

Differentiation levers (DIFFERENTIATE only): 3–5 concrete angles tied to the 4 research layers. Not vibes.
  - <Lever> — <why it's defensible>
  - ...

Positioning: <one sentence — why Chase's version of this feature earns a seat>
```

## Constraints

- **Platform:** <inherited from target app — iOS / web / CLI / Apps Script>
- **Stack:** <inherited — SwiftUI + @Observable / CRA + localStorage / etc.>
- **Storage:** <inherited — UserDefaults / localStorage key / Supabase table>
- **New dependencies:** <none, or list them + justification>
- **Accessibility:** Dynamic Type, 44pt targets, VoiceOver labels, 4.5:1 contrast (non-negotiable — Chase has low vision)

## Success metrics

One or two. Usage-based.

- <Metric 1 — e.g. "Chase uses this feature at least 3× per week for 2 weeks">
- <Metric 2 — optional>

## Risks

Top 3. Each with a mitigation.

1. **<Risk 1>** — <mitigation>
2. **<Risk 2>** — <mitigation>
3. **<Risk 3>** — <mitigation>
