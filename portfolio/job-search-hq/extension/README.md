# Job Search HQ — Chrome extension (MVP)

Captures the **active LinkedIn tab** into [Job Search HQ](https://job-search-hq.vercel.app):

- **Import profile → Contact** — same field extraction as the in-app Sales Navigator bookmarklet (name, role, company, LinkedIn URL, intel, hiring flag). Opens the app with `importContact=1` and `source=chrome_extension`.
- **Import job → Application** — reads title, company, posting URL, and job description when possible. Opens the app with either query params or `#importJob=<url-encoded JSON>` for long descriptions.

**Toolbar badge** — When you have Job Search HQ open (production or `localhost:3001`), the extension shows a badge with the same **Action Queue** item count as the Focus tab (next steps due, prep gaps, replies, follow-ups, stale Applied).

## Install (unpacked)

1. Open Chrome → **Extensions** → enable **Developer mode**.
2. **Load unpacked** → select this folder: `portfolio/job-search-hq/extension/`.
3. Pin the extension if you like.

## Before you capture

1. Sign in to Job Search HQ in Chrome (same profile as the extension) so imports can open the app while logged in.
2. For local dev, set **App origin** in the popup to `http://localhost:3001` and click **Save origin**.

## Permissions

- **activeTab** + **scripting** — read the current LinkedIn tab when you click a button in the popup.
- **tabs** — open Job Search HQ with import params.
- **storage** — remember custom app origin.
- **host_permissions** — LinkedIn + Job Search HQ origins for scripting and the HQ bridge script.

## Limitations (MVP)

- LinkedIn DOM changes often; if a capture fails, use the bookmarklet on Sales Nav or add the contact/application manually.
- Badge updates when the HQ tab is loaded (polls every ~45s while the page is open).

## Source

Shipped as part of Wave 3 in Job Search HQ — see app `ROADMAP.md` / `CHANGELOG.md`.
