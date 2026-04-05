# Product Brief — RollerTask Tycoon (iOS)

Product-specific; canonical blank: `docs/ios-app-starter-kit/PRODUCT_BRIEF.md`.

## App name

**RollerTask Tycoon** (system / App Store display). **Bundle ID** remains `com.chasewhittaker.ParkChecklist` for continuity.

## One-line summary

This app helps people enjoy a **park / tycoon–themed** checklist on iPhone: add tasks, complete them for **park cash**, use **templates**, and **export a JSON backup** — with **native iOS** navigation and HUD-style chrome (not desktop metaphors).

## Target user

- iPhone users who want **lightweight** todos with **personality** (theme, cash, status copy).
- People who care about **on-device** data and optional **file backup** (share sheet).
- Readers who may enable **readable system fonts** in Settings.

## Main pain point

Plain reminders feel sterile; export/restore paths are often cloud-only or opaque. Users still want something **fun** and **under their control** on device.

## Core value

Themed checklist + simple gamification (cash, banner, haptics) + **transparent JSON export** (`schemaVersion`, tasks, cash) so users can keep a file copy.

## Why now

v1 scaffold shipped locally: SwiftData checklist, templates, backup export, settings. Next increments (import, polish, sync) need **written scope** so V1 does not creep.

## Smallest useful V1 (shipped baseline)

Checklist with open/completed sections, templates sheet, park cash on complete, JSON export via share sheet, readable-font toggle — **local only**.

## V1 scope (baseline — done)

- SwiftData tasks; add / complete / strikethrough completed section.
- Toolbar: cash, rating line, templates, export, settings.
- Template library (preset tasks).
- Settings: readable fonts.
- Backup: export JSON only (`schemaVersion` 1).

## Non-goals (current)

- Win95 / fake desktop window chrome.
- Import/restore **until** explicitly specified in PRD + flow (see roadmap).
- Backend / Supabase in the same shape as web apps **until** product decision (CloudKit vs other).

## Success definition

- User completes a task and sees **feedback** (cash, toast, haptics) without confusion.
- User can **export** a backup and understand what the file is for.
- App stays **stable** on simulator and device (SwiftData, light mode enforced for palette).

## Risks

- Scope creep (sync, widgets, Siri) before **import** and polish are decided.
- Backup **import** semantics (replace vs merge) underspecified → data loss or duplicate tasks.
- Theming vs **accessibility** (custom fonts vs readable toggle).

## Notes

Keep this one page. If the next feature is not clear here, do not expand PRD yet.
