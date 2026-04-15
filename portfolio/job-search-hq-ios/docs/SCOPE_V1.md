# Job Search HQ iOS — v1 scope (locked)

Decisions that were open in the product plan; locked for implementation.

| Decision | Choice |
|----------|--------|
| **Tabs in v1** | Focus, Pipeline, Contacts, More |
| **AI tab / Claude** | **Deferred** — API key in Keychain + Anthropic calls are a later milestone; no AI UI in v1 |
| **Chrome extension** | **Out of scope** — no native iOS capture; web extension unchanged |
| **Bundle ID** | `com.chasewhittaker.JobSearchHQ` |
| **Display name** | Job Search HQ |
| **Device family** | iPhone only (`TARGETED_DEVICE_FAMILY = 1`) |
| **Background / surfaces** | **JSHQ web tokens** (`#0f1117` / `#1a1d27`) for screenshot parity with PWA; ClarityUI used for typography, metrics, components where applicable |
| **Persistence** | `UserDefaults` key `chase_job_search_ios_v1` — JSON `Codable` blob aligned with web `chase_job_search_v1` shape (separate key until import/sync story is defined) |
| **Supabase** | Phase 2 — see [`SYNC_PHASE2.md`](SYNC_PHASE2.md) and `Services/RemoteSync.swift` |

## Storage key rationale

iOS uses a **distinct** UserDefaults key from web localStorage so Simulator and device do not accidentally overwrite browser dev data during parallel testing. Shapes are compatible for future JSON import/export.
