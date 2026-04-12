# Knowledge Base — App Flow

> Phase 3 of the [Product Build Framework](../../PRODUCT_BUILD_FRAMEWORK.md)

## First Screen

Single-page bookmark list with header, search bar, category filter pills, and bookmark rows.

## Main Action

Find and open a bookmark link.

## Primary Flow

1. User opens the artifact (or reloads the page)
2. Bookmarks load from `window.storage` (or seed on first load)
3. User types in search bar OR taps a category pill
4. Matching bookmarks filter in real-time
5. User clicks a bookmark row — link opens in new tab

**Taps to reach any link: 1–2** (filter/search + click)

## Where Could They Get Stuck?

- First load: no indication of how many bookmarks exist per category (count could help later)
- Adding a bookmark: category field is free-text, user might not know existing categories
- URL typos: auto-prefix helps, but no URL validation beyond that

## Screens

| Screen | Description |
|--------|-------------|
| Main view | Header + search + filter pills + bookmark list + count |
| Add form | Inline panel (title, URL, category fields + save/cancel) |
| Edit form | Same inline panel, pre-filled with bookmark data |

This is a single-page app — no routing, no navigation between screens.

## Empty States

| Context | Message |
|---------|---------|
| First load, no storage | Seed data loads automatically (22 AI docs + 7 My Projects) |
| Search with no results | "No bookmarks found." (centered, muted text) |
| All bookmarks deleted | "No bookmarks found." (same as above) |

## Error States

| Trigger | Behavior |
|---------|----------|
| `window.storage.get` throws | Falls back to SEED array, attempts to re-write storage |
| `window.storage.set` throws | Silently fails (data lives in React state for the session) |
| Add with empty title or URL | Submit is a no-op (button does nothing) |
| Add with empty category | Defaults to "Other" |
