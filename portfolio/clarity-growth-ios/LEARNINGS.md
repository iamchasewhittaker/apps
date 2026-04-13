# LEARNINGS — Clarity Growth (iOS)

## Build / test verification

- `xcodebuild build` can pass while `xcodebuild test` hangs if Simulator services are unhealthy on host macOS. Use `-showdestinations` first, retry after Simulator restart, or run tests from Xcode when CLI hangs.

## ClarityUI token usage

- `ClarityPalette` does not expose `faint`; use available tokens like `surface`, `border`, `accent`, and `muted` to avoid compile-time palette errors.
