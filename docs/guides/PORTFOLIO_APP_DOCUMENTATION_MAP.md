# Portfolio app documentation map

What each document is for, organized by app. Paths are relative to `chase/portfolio/<app>/` unless noted.

## Wellness Tracker (web)

| Document | Purpose |
| --- | --- |
| `CLAUDE.md` | Session context, stack, conventions for this app. |
| `README.md` | Setup, scripts, deploy notes. |

## Job Search HQ (web)

| Document | Purpose |
| --- | --- |
| `CLAUDE.md` | Agent/session start, product and technical context. |
| `README.md` | Local dev and deployment. |

## Knowledge Base (web)

| Document | Purpose |
| --- | --- |
| `CLAUDE.md` | Feature and data model notes for the KB app. |
| `README.md` | Build and deploy. |

## Clarity Command (web)

| Document | Purpose |
| --- | --- |
| `CLAUDE.md` | Web dashboard / command surface context. |
| `README.md` | Run and ship. |

## Clarity Hub (web)

| Document | Purpose |
| --- | --- |
| `CLAUDE.md` | Hub app role in the Clarity suite. |
| `README.md` | Setup. |

## RollerTask Tycoon (web)

| Document | Purpose |
| --- | --- |
| `CLAUDE.md` | Game/web app context. |
| `README.md` | Scripts and deploy. |

## Spend Clarity (CLI)

| Document | Purpose |
| --- | --- |
| `CLAUDE.md` | Python CLI behavior and data flow. |
| `README.md` | Install and usage. |

## Funded (web / iOS)

| Document | Purpose |
| --- | --- |
| `funded-web/CLAUDE.md`, `funded-ios/CLAUDE.md` | Per-platform agent context. |
| `README.md` (each) | Platform-specific setup. |

## Clarity iOS apps (native)

For each: **ClarityUI**, **Clarity Check-in**, **Clarity Triage**, **Clarity Time**, **Clarity Growth**, **Clarity Command**, **Clarity Budget**, **Wellness Tracker iOS**, **Job Search HQ iOS**, **RollerTask Tycoon iOS**

| Document | Purpose |
| --- | --- |
| `CLAUDE.md` | Swift/SwiftUI patterns, app scope, navigation. |
| `README.md` | Xcode, schemes, TestFlight notes. |

## Archive / secondary

| App | Notes |
| --- | --- |
| `archive/ai-dev-mastery` | Course material; `CLAUDE.md` for structure. |
| `archive/app-forge` | Historical; see `CLAUDE.md` if reviving. |
| `gmail-forge` | `claude.md` (lowercase) — email workflow tooling. |

## Monorepo root (`chase/`)

| Document | Purpose |
| --- | --- |
| `docs/guides/SESSION_GUIDE.md` | Cross-session handoff patterns. |
| `docs/guides/new-app-guide.md` | Spinning up new portfolio apps. |

When you add `HANDOFF.md`, `ROADMAP.md`, `PRD.md`, or `PROJECT_INSTRUCTIONS.md` to an app, append a row here with a one-line purpose.
