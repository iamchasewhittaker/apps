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
import logging
import os
import sys
from datetime import date, timedelta
from pathlib import Path

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
    args = parser.parse_args()

    dry_run = args.dry_run or os.getenv("DRY_RUN", "true").lower() == "true"
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
    def is_active_merchant(txn):
        payee = (txn.get("payee_name") or "").lower()
        for merchant_name in active_merchants:
            for keyword in MERCHANTS[merchant_name]["payee_keywords"]:
                if keyword in payee:
                    return True
        return False

    relevant_txns = [t for t in transactions if is_active_merchant(t)]
    unmatched = [t for t in relevant_txns if t["id"] not in matched_ids]
    _write_unmatched_report(unmatched, total=len(relevant_txns))
    log.info(f"  {len(unmatched)} unmatched of {len(relevant_txns)} relevant transactions")
    log.info("Done.")


def _write_unmatched_report(unmatched: list, total: int):
    lines = ["=== UNMATCHED TRANSACTIONS ===\n"]
    lines.append(f"{'Date':<12} {'Payee':<30} {'Amount':>10}  Reason\n")
    lines.append("-" * 70 + "\n")
    for txn in unmatched:
        amount = txn["amount"] / 1000
        clean = display_payee(txn.get("payee_name"))[:28]
        reason = txn.get("_unmatched_reason", "No receipt found in date window")
        lines.append(f"{txn['date']:<12} {clean:<30} ${amount:>9.2f}  {reason}\n")
    lines.append("\n")
    lines.append(f"Total unmatched: {len(unmatched)} of {total}\n")

    Path("output").mkdir(exist_ok=True)
    Path("output/unmatched_report.txt").write_text("".join(lines))


if __name__ == "__main__":
    main()
