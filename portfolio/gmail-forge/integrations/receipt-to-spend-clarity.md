# Receipt label → Spend Clarity

Spend Clarity lives in the sibling folder [`../spend-clarity/`](../spend-clarity/) (same parent as this `gmail-forge` repo). It enriches YNAB transactions using Gmail receipts.

## Contract

1. **Gmail Forge** labels transactional mail with the user-visible label **Receipt** (XML filters + Apps Script).
2. **Spend Clarity** queries Gmail with `label:Receipt` (see `GmailClient.search_emails` in `spend-clarity/src/gmail_client.py`) so only pre-sorted mail is scanned.

**Privacy.com:** When `PRIVACY_API_KEY` is set in Spend Clarity’s `.env`, virtual-card transactions are loaded from the **Privacy.com API** — Gmail Receipt coverage is not required for that path. Receipt labeling still matters for Amazon, Apple, DoorDash, and other email-based merchants.

Keep Receipt coverage aligned: when Spend Clarity adds a merchant sender, add the same domain or address to Gmail Forge (`gmail-filters.xml` and `apps-script/rules.gs`).

## Run Spend Clarity after Gmail Forge has labeled mail

```bash
cd ../spend-clarity
python src/main.py --dry-run
```

(From `gmail-forge/integrations/`, use `cd ../../spend-clarity` instead.)

Use `python src/main.py` when ready to write to YNAB. OAuth and `.env` are documented in that project’s `README.md` and `HANDOFF.md`.

## Related

- [prompts/spend-clarity-handshake.md](../prompts/spend-clarity-handshake.md) — original design notes (query alignment is implemented in Spend Clarity).
