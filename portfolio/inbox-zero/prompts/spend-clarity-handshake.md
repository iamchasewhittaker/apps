# Prompt for Spend Clarity

> Paste this into a Claude session opened from `portfolio/spend-clarity/`.

---

I have a sibling project called **Inbox Zero** (`portfolio/inbox-zero/`) that auto-labels all my Gmail with native XML filters. One of the labels is **Receipt** — it catches every transactional email from these senders:

| Sender | Domain |
|---|---|
| Venmo | venmo@venmo.com |
| Privacy.com | support@privacy.com |
| Anthropic | mail.anthropic.com |
| Citi | citi.com |
| Safeco | safeco.com |

There's also a **Notification** filter on `amazon.com` that catches Amazon order confirmations and shipping updates.

**Two things I'd like your help with:**

1. **Use `label:Receipt` as a pre-filter in `gmail_client.py`.** Instead of searching all emails for receipt patterns, query `label:Receipt` first. This narrows the search space and avoids false positives. Inbox Zero is already labeling these before Spend Clarity ever runs.

2. **Give me back a list of receipt/transaction senders you expect to parse** (Amazon, Apple, Privacy.com, any others from your parsers or reference repos) so I can add any missing ones as Receipt filters in Inbox Zero. The two projects should share a common sender list — Inbox Zero labels them, Spend Clarity reads them.

Read `CLAUDE.md` and `HANDOFF.md` in this folder for full context, then:
- Propose the `gmail_client.py` change to use `label:Receipt` as the default query
- Output the full list of senders you'll need filtered, formatted as a table with sender name, email/domain, and suggested Inbox Zero category (Receipt vs Notification)
