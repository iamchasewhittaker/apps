# Clarity Command (iOS) — device QA checklist

Run on a **signed physical iPhone** (team `9XVT527KP3`) after `xcodebuild` / **⌘R** from Xcode.

## Pre-flight

- [ ] Scheme **ClarityCommand** → destination = your device (not “Any iOS Device”).
- [ ] Signing: automatic, bundle `com.chasewhittaker.ClarityCommand`, team resolves without warnings.
- [ ] Delete old install if SpringBoard icon is stale (icon cache).

## Mission (morning)

- [ ] Open **Mission** tab before noon (or adjust device time): morning layout shows conviction, scripture, targets.
- [ ] **Commit** flow: tap commit → today shows committed; restart app → state persists.
- [ ] Log at least one **job action**; count matches target row.

## Mission (evening)

- [ ] Switch to evening (after noon or change time): reflection fields update; score day and save → persists across relaunch.

## Scoreboard

- [ ] Week grid shows last 7 days; month picker changes heatmap.
- [ ] Stats row numbers match visible logs.

## Settings

- [ ] Layoff date picker writes **Settings** → relaunch → date still set.
- [ ] Targets, reminders, scriptures edits persist.
- [ ] **Supabase** (if signed in): email OTP → verify → **Pull** then **Push**; confirm same account on [Clarity Command web](https://clarity-command.vercel.app) sees merged blob when remote is newer.

## Export / danger zone

- [ ] Export JSON produces valid text; **Clear logs** (if tested) only after backup.

## Done

Record date + device model in app `HANDOFF.md` when this list is fully checked.
