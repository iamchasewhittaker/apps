# Inbox Zero — Mislabeled Sender Audit Log

Purpose: Track confirmed Newsletter vs Cold Email misclassifications from daily reports before editing `gmail-filters.xml`.

## Weekly Audit Loop

1. Capture candidate mislabels from daily reports during the week.
2. Confirm classification based on sender behavior (newsletter/digest vs unsolicited outreach).
3. Apply only confirmed changes in `gmail-filters.xml`.
4. Re-import filters in Gmail with "Also apply filter to matching conversations" enabled.

## Audit Entries

| Date | Sender | Current Label | Updated Label | Evidence | Action |
|---|---|---|---|---|---|
| 2026-04-12 | natia@space-leads.com | Cold Email | Newsletter | Confirmed recurring newsletter-style content | Updated in `gmail-filters.xml` (already applied) |
| 2026-04-13 | Baseline review | Newsletter / Cold Email set | No change | No new confirmed mislabels in available records | No XML change required |
