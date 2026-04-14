"""
main.py — Entry point and orchestrator for YNAB transaction enrichment.

Usage:
    python src/main.py --auth           # Complete Gmail OAuth for Chase's account
    python src/main.py --auth-kassie    # Complete Gmail OAuth for Kassie's account
    python src/main.py                  # Run full enrichment (DRY_RUN from .env)
    python src/main.py --dry-run        # Preview changes without writing to YNAB
    python src/main.py --merchants amazon apple   # Limit to specific merchants
"""

import argparse
import json
import logging
import os
import sys
from datetime import date, timedelta, datetime, timezone
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv

load_dotenv()

from gmail_client import GmailClient
from ynab_client import YNABClient
from privacy_client import PrivacyClient
from receipt_parser import parse_receipt
from matcher import match_receipts_to_transactions
from memo_formatter import format_memo
from categorizer import Categorizer
from payee_formatter import display_payee
from pipeline_state import PipelineState

# ---------------------------------------------------------------------------
# Logging setup
# ---------------------------------------------------------------------------

Path("output").mkdir(exist_ok=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("output/enrichment_log.txt"),
    ],
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Merchant config
# ---------------------------------------------------------------------------

MERCHANTS = {
    "amazon": {
        "senders": ["ship-confirm@amazon.com", "digital-no-reply@amazon.com"],
        "payee_keywords": ["amazon"],
    },
    "audible": {
        "senders": ["no-reply@audible.com"],
        "payee_keywords": ["audible", "amazon"],
    },
    "apple": {
        "senders": ["no_reply@email.apple.com"],
        "payee_keywords": ["apple"],
    },
    "doordash": {
        "senders": ["no-reply@doordash.com"],
        "payee_keywords": ["doordash", "doordas"],
    },
    "privacy": {
        "senders": ["support@privacy.com"],
        "payee_keywords": ["privacy", "privacycom"],
    },
    "netflix": {
        "senders": ["info@mailer.netflix.com"],
        "payee_keywords": ["netflix"],
    },
    "spotify": {
        "senders": ["no-reply@spotify.com"],
        "payee_keywords": ["spotify"],
    },
    "hulu": {
        "senders": ["no-reply@hulu.com"],
        "payee_keywords": ["hulu"],
    },
    "disney": {
        "senders": ["noreply@disneyplus.com"],
        "payee_keywords": ["disney"],
    },
    "walmart": {
        "senders": ["help@walmart.com"],
        "payee_keywords": ["walmart"],
    },
    "target": {
        "senders": ["target@e.target.com"],
        "payee_keywords": ["target"],
    },
    "costco": {
        "senders": ["costco@e.costco.com"],
        "payee_keywords": ["costco"],
    },
    "venmo": {
        "senders": ["venmo@venmo.com"],
        "payee_keywords": ["venmo"],
    },
}

# Merchants to also search in Kassie's Gmail account (in addition to Chase's)
KASSIE_MERCHANTS = {"walmart", "target", "amazon", "doordash", "costco"}


def main():
    parser = argparse.ArgumentParser(description="YNAB transaction enrichment tool")
    parser.add_argument("--auth", action="store_true", help="Complete Gmail OAuth for Chase's account and exit")
    parser.add_argument("--auth-kassie", action="store_true", help="Complete Gmail OAuth for Kassie's account and exit")
    parser.add_argument("--dry-run", action="store_true", help="Preview changes without writing to YNAB")
    parser.add_argument(
        "--merchants",
        nargs="+",
        choices=list(MERCHANTS.keys()),
        help="Limit processing to specific merchants",
    )
    parser.add_argument(
        "--pipeline-auto",
        action="store_true",
        help="Run full-auto pipeline using label queries + dedupe state",
    )
    parser.add_argument(
        "--print-launchd-plist",
        action="store_true",
        help="Print a launchd plist configured for this project and exit",
    )
    args = parser.parse_args()

    dry_run = args.dry_run or os.getenv("DRY_RUN", "true").lower() == "true"
    if args.print_launchd_plist:
        print(_render_launchd_plist(dry_run=dry_run))
        return

    if dry_run:
        log.info("DRY RUN mode — no changes will be written to YNAB")

    credentials_file = os.getenv("GMAIL_CREDENTIALS_FILE", "config/gmail_credentials.json")

    # --auth: OAuth only for Chase's account
    gmail = GmailClient(
        credentials_file=credentials_file,
        token_file=os.getenv("GMAIL_TOKEN_FILE", "config/gmail_token.json"),
    )
    if args.auth:
        gmail.authenticate()
        log.info("Gmail authentication complete (Chase). Token saved.")
        return

    # --auth-kassie: OAuth only for Kassie's account
    kassie_token_file = os.getenv("KASSIE_GMAIL_TOKEN_FILE", "")
    if args.auth_kassie:
        if not kassie_token_file:
            log.error("KASSIE_GMAIL_TOKEN_FILE not set in .env")
            return
        kassie_login_hint = os.getenv("KASSIE_GMAIL_LOGIN_HINT", "")
        kassie_gmail = GmailClient(credentials_file=credentials_file, token_file=kassie_token_file, login_hint=kassie_login_hint)
        kassie_gmail.authenticate()
        log.info("Gmail authentication complete (Kassie). Token saved.")
        return

    gmail.authenticate()

    # Kassie's Gmail client (optional — only if token file is configured)
    kassie_gmail = None
    if kassie_token_file:
        try:
            kassie_gmail = GmailClient(credentials_file=credentials_file, token_file=kassie_token_file)
            kassie_gmail.authenticate()
            log.info("Kassie's Gmail account connected")
        except Exception as e:
            log.warning(f"Could not connect Kassie's Gmail ({e}) — skipping")

    # Step 1 — Fetch YNAB transactions
    log.info("Step 1: Fetching YNAB transactions...")
    ynab = YNABClient(
        api_token=os.getenv("YNAB_API_TOKEN", ""),
        budget_id=os.getenv("YNAB_BUDGET_ID", ""),
    )
    lookback_days = int(os.getenv("LOOKBACK_DAYS", "365"))
    since_date = date.today() - timedelta(days=lookback_days)
    transactions = ynab.get_transactions(since_date=since_date)
    log.info(f"  Fetched {len(transactions)} transactions with blank memos")

    # Step 2 — Fetch and parse Gmail receipts per merchant
    log.info("Step 2: Fetching Gmail receipts...")
    active_merchants = args.merchants or list(MERCHANTS.keys())
    all_receipts = []
    pipeline_summary = None
    state = None

    if args.pipeline_auto:
        state_path = os.getenv("PIPELINE_STATE_FILE", "output/pipeline_state.json")
        state = PipelineState.load(
            state_path=state_path,
            retention_days=int(os.getenv("PIPELINE_RETENTION_DAYS", "30")),
            max_ids=int(os.getenv("PIPELINE_MAX_IDS", "10000")),
        )
        pipeline_since = state.get_since_date(
            default_lookback_days=int(os.getenv("PIPELINE_LOOKBACK_DAYS", "7")),
            overlap_minutes=int(os.getenv("PIPELINE_OVERLAP_MINUTES", "120")),
        )
        log.info(f"  Pipeline mode: loading Gmail emails since {pipeline_since} using state file {state_path}")

        all_receipts, pipeline_summary = _collect_pipeline_receipts(
            gmail=gmail,
            since_date=pipeline_since,
            active_merchants=active_merchants,
            state=state,
        )
        log.info(
            "  Pipeline parse summary: fetched=%s new=%s dedupe_skipped=%s "
            "parsed=%s parse_failed=%s unknown_sender=%s",
            pipeline_summary["fetched_total"],
            pipeline_summary["new_messages"],
            pipeline_summary["dedupe_skipped"],
            pipeline_summary["parsed_receipts"],
            pipeline_summary["parse_failed"],
            pipeline_summary["unknown_sender"],
        )

    else:
        # Privacy.com: use API if key is available, otherwise fall back to email
        privacy_api_key = os.getenv("PRIVACY_API_KEY", "")
        if "privacy" in active_merchants and privacy_api_key:
            log.info("  Fetching privacy receipts via API...")
            try:
                privacy_client = PrivacyClient(api_key=privacy_api_key)
                privacy_receipts = privacy_client.get_receipts(since_date=since_date)
                all_receipts.extend(privacy_receipts)
                log.info(f"    Privacy.com API: {len(privacy_receipts)} transactions")
            except Exception as e:
                log.warning(f"  Privacy.com API failed ({e}), skipping")
            email_merchants = [m for m in active_merchants if m != "privacy"]
        else:
            email_merchants = active_merchants

        for merchant_name in email_merchants:
            merchant_cfg = MERCHANTS[merchant_name]
            log.info(f"  Fetching {merchant_name} receipts...")

            # Determine which Gmail accounts to search for this merchant
            accounts = [("chase", gmail)]
            if kassie_gmail and merchant_name in KASSIE_MERCHANTS:
                accounts.append(("kassie", kassie_gmail))

            for sender in merchant_cfg["senders"]:
                for account_name, account_client in accounts:
                    emails = account_client.search_emails(sender=sender, since_date=since_date)
                    log.info(f"    {sender} ({account_name}): {len(emails)} emails found")
                    for email in emails:
                        receipt = parse_receipt(email, merchant=merchant_name)
                        if receipt:
                            receipt.merchant = merchant_name
                            all_receipts.append(receipt)
    log.info(f"  Parsed {len(all_receipts)} receipts total")

    # Step 3 — Match receipts to transactions
    log.info("Step 3: Matching receipts to transactions...")
    date_tolerance = int(os.getenv("DATE_TOLERANCE_DAYS", "6"))
    amount_tolerance = float(os.getenv("AMOUNT_TOLERANCE_DOLLARS", "0.50"))
    matches = match_receipts_to_transactions(
        transactions=transactions,
        receipts=all_receipts,
        active_merchants=active_merchants,
        merchant_config=MERCHANTS,
        date_tolerance_days=date_tolerance,
        amount_tolerance_dollars=amount_tolerance,
    )
    log.info(f"  Matched {len(matches)} transactions")

    # Step 4 & 5 — Generate memos and categorize matched transactions
    auto_categorize = os.getenv("AUTO_CATEGORIZE", "true").lower() == "true"
    categorizer = Categorizer(
        rules_path="config/category_rules.yaml",
        overrides_path="config/category_overrides.yaml",
    ) if auto_categorize else None
    if categorizer:
        _validate_category_configuration(ynab, categorizer)

    matched_ids: set[str] = set()
    updates = []

    for match in matches:
        matched_ids.add(match.transaction["id"])
        memo = format_memo(match.receipt.items, is_split=match.is_split, split_total=match.receipt.amount)
        clean_payee = display_payee(match.transaction.get("payee_name"))
        category_id = None
        if categorizer:
            category_id = categorizer.categorize_transaction(
                payee=clean_payee,
                items=match.receipt.items,
            )

        log.info(
            f"  MATCH [{match.match_type}] {match.transaction['date']} "
            f"{clean_payee} ${match.transaction['amount'] / 1000:.2f} "
            f"→ memo: {memo!r}"
            + (f" category: {category_id}" if category_id else "")
        )

        update = {"id": match.transaction["id"], "memo": memo}
        if category_id:
            update["category_id"] = category_id
        updates.append(update)

    # Step 4.5 — Payee-based categorization for ALL unmatched blank-memo transactions
    if categorizer:
        log.info("Step 4.5: Payee-categorizing unmatched transactions...")
        payee_cat_count = 0
        for txn in transactions:
            if txn["id"] in matched_ids:
                continue
            clean_payee = display_payee(txn.get("payee_name"))
            category_id = categorizer.categorize_transaction(payee=clean_payee)
            if category_id:
                updates.append({"id": txn["id"], "category_id": category_id})
                matched_ids.add(txn["id"])
                payee_cat_count += 1
                log.info(
                    f"  PAYEE-CAT {txn['date']} {clean_payee} "
                    f"${txn['amount'] / 1000:.2f} → {category_id}"
                )
        log.info(f"  Payee-categorized {payee_cat_count} additional transactions")

    # Step 6 — Write to YNAB
    log.info("Step 6: Writing to YNAB...")
    if dry_run:
        log.info(f"  [DRY RUN] Would update {len(updates)} transactions")
    else:
        ynab.bulk_update(updates)
        log.info(f"  Updated {len(updates)} transactions")

    # Step 7 — Unmatched report
    log.info("Step 7: Generating unmatched report...")
    # Filter to only transactions for active merchants (receipt-eligible)
    def matched_active_merchants(txn):
        payee = (txn.get("payee_name") or "").lower()
        merchants = []
        for merchant_name in active_merchants:
            for keyword in MERCHANTS[merchant_name]["payee_keywords"]:
                if keyword in payee:
                    merchants.append(merchant_name)
                    break
        return merchants

    relevant_txns = []
    for txn in transactions:
        merchants = matched_active_merchants(txn)
        if merchants:
            txn["_active_merchant_matches"] = merchants
            relevant_txns.append(txn)

    unmatched = [t for t in relevant_txns if t["id"] not in matched_ids]
    report_rows = []
    for txn in unmatched:
        merchant_candidates = txn.get("_merchant_candidates") or txn.get("_active_merchant_matches") or []
        report_rows.append({
            "txn": txn,
            "merchant_candidates": ", ".join(merchant_candidates) if merchant_candidates else "n/a",
        })

    _write_unmatched_report(report_rows, total=len(relevant_txns))
    log.info(f"  {len(unmatched)} unmatched of {len(relevant_txns)} relevant transactions")

    if args.pipeline_auto and state and pipeline_summary is not None:
        state.mark_many_processed(pipeline_summary["new_message_ids"])
        state.record_success()
        state.save()
        _write_pipeline_summary(
            pipeline_summary=pipeline_summary,
            receipts_parsed=len(all_receipts),
            matches_found=len(matches),
            updates_count=len(updates),
            unmatched_count=len(unmatched),
            dry_run=dry_run,
        )
        log.info(
            "  Pipeline state updated: processed_ids=%s last_success_at=%s",
            len(state.processed_ids),
            state.last_success_at.isoformat() if state.last_success_at else "n/a",
        )

    log.info("Done.")


def _validate_category_configuration(ynab: YNABClient, categorizer: Categorizer):
    configured_ids = sorted(categorizer.configured_category_ids())
    if not configured_ids:
        log.warning("Startup validation skipped: no category IDs configured")
        return

    live_ids = ynab.get_category_ids()
    valid_ids = [cid for cid in configured_ids if cid in live_ids]
    invalid_ids = [cid for cid in configured_ids if cid not in live_ids]

    log.info(
        "Startup validation: %s configured category IDs (%s valid, %s invalid)",
        len(configured_ids),
        len(valid_ids),
        len(invalid_ids),
    )

    if not valid_ids:
        raise RuntimeError(
            "Category validation failed: none of the configured category IDs resolve "
            "against the current YNAB budget. Run src/setup_categories.py and update config files."
        )

    if invalid_ids:
        preview = ", ".join(invalid_ids[:5])
        suffix = "..." if len(invalid_ids) > 5 else ""
        log.warning(
            "Category validation warning: %s invalid category ID(s): %s%s",
            len(invalid_ids),
            preview,
            suffix,
        )


def _collect_pipeline_receipts(
    gmail: GmailClient,
    since_date: date,
    active_merchants: list[str],
    state: PipelineState,
) -> tuple[list, dict]:
    sender_lookup = _build_sender_lookup(active_merchants)
    queries = [
        {
            "name": "receipt_label",
            "query": GmailClient.build_label_query("Receipt", since_date),
        },
        {
            "name": "amazon_notification",
            "query": GmailClient.build_label_query(
                "Notification",
                since_date,
                "from:amazon.com subject:(order OR shipped)",
            ),
        },
    ]

    fetched_by_id: dict[str, dict] = {}
    fetched_total = 0

    for item in queries:
        emails = gmail.search_query(query=item["query"])
        fetched_total += len(emails)
        log.info("    Query %s: %s email(s)", item["name"], len(emails))
        for email in emails:
            fetched_by_id[email["id"]] = email

    dedupe_skipped = 0
    unknown_sender = 0
    parse_failed = 0
    parsed = []
    new_message_ids = []

    for message_id, email in fetched_by_id.items():
        if state.is_processed(message_id):
            dedupe_skipped += 1
            continue

        new_message_ids.append(message_id)
        merchant = _infer_merchant(email, sender_lookup)
        if not merchant:
            unknown_sender += 1
            continue

        receipt = parse_receipt(email, merchant=merchant)
        if receipt:
            receipt.merchant = merchant
            parsed.append(receipt)
        else:
            parse_failed += 1

    summary = {
        "fetched_total": fetched_total,
        "unique_messages": len(fetched_by_id),
        "new_messages": len(new_message_ids),
        "new_message_ids": new_message_ids,
        "dedupe_skipped": dedupe_skipped,
        "unknown_sender": unknown_sender,
        "parse_failed": parse_failed,
        "parsed_receipts": len(parsed),
        "since_date": since_date.isoformat(),
    }
    return parsed, summary


def _build_sender_lookup(active_merchants: list[str]) -> dict[str, str]:
    sender_lookup: dict[str, str] = {}
    for merchant in active_merchants:
        cfg = MERCHANTS.get(merchant)
        if not cfg:
            continue
        for sender in cfg["senders"]:
            sender_lookup[sender.lower()] = merchant
    return sender_lookup


def _extract_sender_email(from_header: str) -> str:
    if "<" in from_header and ">" in from_header:
        try:
            return from_header.split("<", 1)[1].split(">", 1)[0].strip().lower()
        except Exception:
            return from_header.strip().lower()
    return from_header.strip().lower()


def _infer_merchant(email: dict, sender_lookup: dict[str, str]) -> Optional[str]:
    sender_header = email.get("from", "")
    sender_email = _extract_sender_email(sender_header)
    sender_domain = sender_email.split("@")[-1] if "@" in sender_email else sender_email

    if sender_email in sender_lookup:
        return sender_lookup[sender_email]

    for sender_key, merchant in sender_lookup.items():
        if "@" in sender_key and sender_email == sender_key:
            return merchant
        if "@" not in sender_key and sender_key in sender_domain:
            return merchant
        if "@" in sender_key:
            key_domain = sender_key.split("@", 1)[1]
            if key_domain and key_domain in sender_domain:
                return merchant

    # Amazon notification query intentionally sits outside Receipt label.
    if "amazon.com" in sender_domain:
        return "amazon"
    return None


def _render_launchd_plist(dry_run: bool) -> str:
    project_dir = Path(__file__).resolve().parent.parent
    python_bin = os.getenv("PYTHON_BIN", str(project_dir / ".venv" / "bin" / "python"))
    log_dir = Path.home() / "Library" / "Logs"
    dry_run_arg = "      <string>--dry-run</string>\n" if dry_run else ""

    return f"""<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>com.chase.spend-clarity.enrich</string>

    <key>ProgramArguments</key>
    <array>
      <string>{python_bin}</string>
      <string>{project_dir / 'src' / 'main.py'}</string>
{dry_run_arg}    </array>

    <key>WorkingDirectory</key>
    <string>{project_dir}</string>

    <key>StartCalendarInterval</key>
    <dict>
      <key>Hour</key>
      <integer>2</integer>
      <key>Minute</key>
      <integer>30</integer>
    </dict>

    <key>StandardOutPath</key>
    <string>{log_dir / 'spend-clarity.stdout.log'}</string>
    <key>StandardErrorPath</key>
    <string>{log_dir / 'spend-clarity.stderr.log'}</string>

    <key>RunAtLoad</key>
    <false/>
  </dict>
</plist>
"""



def _write_pipeline_summary(
    pipeline_summary: dict,
    receipts_parsed: int,
    matches_found: int,
    updates_count: int,
    unmatched_count: int,
    dry_run: bool,
) -> None:
    Path("output").mkdir(exist_ok=True)
    now = datetime.now(timezone.utc).isoformat()
    payload = {
        "run_at": now,
        "dry_run": dry_run,
        "gmail": pipeline_summary,
        "receipts_parsed": receipts_parsed,
        "matches_found": matches_found,
        "updates_count": updates_count,
        "unmatched_count": unmatched_count,
    }
    Path("output/pipeline_summary.json").write_text(json.dumps(payload, indent=2, sort_keys=True))

    lines = [
        "=== SPEND CLARITY PIPELINE SUMMARY ===",
        f"Run at (UTC): {now}",
        f"Dry run: {dry_run}",
        f"Gmail fetched total: {pipeline_summary['fetched_total']}",
        f"Gmail unique messages: {pipeline_summary['unique_messages']}",
        f"New messages processed: {pipeline_summary['new_messages']}",
        f"Dedupe skipped: {pipeline_summary['dedupe_skipped']}",
        f"Unknown sender skipped: {pipeline_summary['unknown_sender']}",
        f"Parse failed: {pipeline_summary['parse_failed']}",
        f"Receipts parsed: {receipts_parsed}",
        f"YNAB matches found: {matches_found}",
        f"YNAB updates: {updates_count}",
        f"Unmatched relevant txns: {unmatched_count}",
    ]
    Path("output/pipeline_summary.txt").write_text("\n".join(lines) + "\n")


def _write_unmatched_report(rows: list[dict], total: int):
    lines = ["=== UNMATCHED TRANSACTIONS ===\n"]
    lines.append(f"{'Date':<12} {'Payee':<30} {'Amount':>10} {'Merchants':<18} Reason\n")
    lines.append("-" * 120 + "\n")
    for row in rows:
        txn = row["txn"]
        amount = txn["amount"] / 1000
        clean = display_payee(txn.get("payee_name"))[:28]
        merchants = row["merchant_candidates"][:18]
        reason = txn.get("_unmatched_reason", "No receipt found in date window")
        lines.append(
            f"{txn['date']:<12} {clean:<30} ${amount:>9.2f} {merchants:<18} {reason}\n"
        )
    lines.append("\n")
    lines.append(f"Total unmatched: {len(rows)} of {total}\n")

    Path("output").mkdir(exist_ok=True)
    Path("output/unmatched_report.txt").write_text("".join(lines))


if __name__ == "__main__":
    main()
