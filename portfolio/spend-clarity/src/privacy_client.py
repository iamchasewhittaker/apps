"""
privacy_client.py — Privacy.com API client.

Fetches settled transactions and converts them to ParsedReceipt objects
so they can flow through the same matcher as email receipts.

API docs: https://developer.privacy.com/docs
"""

import logging
import re
from datetime import date, datetime, timezone
from typing import Optional

import requests

from receipt_parser import ParsedReceipt

log = logging.getLogger(__name__)

_BASE_URL = "https://api.privacy.com/v1"
_PAGE_SIZE = 50

# Maps truncated Privacy.com descriptors (lowercase) to their full names.
# Privacy.com truncates payment network descriptors to ~12 chars.
_DESCRIPTOR_ALIASES = {
    "linkedinprea": "LinkedIn Premium",
    "xbox game pa": "Xbox Game Pass",
}


class PrivacyClient:
    def __init__(self, api_key: str):
        if not api_key:
            raise ValueError("PRIVACY_API_KEY is not set")
        self._session = requests.Session()
        self._session.headers.update({"Authorization": f"api-key {api_key}"})

    def get_receipts(self, since_date: date) -> list[ParsedReceipt]:
        """
        Fetch all settled Privacy.com transactions since `since_date`
        and return them as ParsedReceipt objects.
        """
        receipts = []
        page = 1
        begin = since_date.strftime("%Y-%m-%d")

        while True:
            resp = self._session.get(
                f"{_BASE_URL}/transaction",
                params={"begin": begin, "page": page, "page_size": _PAGE_SIZE},
                timeout=30,
            )
            resp.raise_for_status()
            data = resp.json()

            transactions = data.get("data", [])
            for txn in transactions:
                receipt = self._to_receipt(txn)
                if receipt:
                    receipts.append(receipt)

            num_pages = data.get("total_pages", 1)
            log.debug(f"Privacy.com: page {page}/{num_pages}, {len(transactions)} txns")

            if page >= num_pages:
                break
            page += 1

        log.info(f"Privacy.com API: fetched {len(receipts)} settled transactions")
        return receipts

    def _to_receipt(self, txn: dict) -> Optional[ParsedReceipt]:
        # Only match settled transactions — pending/declined amounts may not match YNAB
        status = txn.get("status", "")
        if status not in ("SETTLED", "APPROVED"):
            return None

        token = txn.get("token")
        if not token:
            return None

        # Amount is in cents
        amount_cents = txn.get("amount", 0)
        amount = amount_cents / 100.0

        # Parse date from created timestamp
        created = txn.get("created", "")
        try:
            txn_date = datetime.fromisoformat(created.replace("Z", "+00:00")).date()
        except Exception:
            txn_date = date.today()

        # Clean merchant name — API uses "descriptor", not "name"
        merchant_info = txn.get("merchant") or {}
        merchant_name = (
            merchant_info.get("descriptor", "")
            or merchant_info.get("name", "")
        ).strip()
        if not merchant_name:
            merchant_name = "Privacy.com purchase"

        # Include card nickname if set (helps identify what the card was for)
        card = txn.get("card") or {}
        card_memo = (card.get("memo") or "").strip()
        # Handle * separators in descriptors:
        #   "Audible*DZ4065L83"   → "Audible"      (suffix is a token code → use prefix)
        #   "GOOGLE *YouTube TV"  → "YouTube TV"   (suffix is a product name → use suffix)
        #   "Microsoft*Xbox Game" → "Xbox Game"    (suffix is a product name → use suffix)
        if "*" in merchant_name:
            prefix, suffix = merchant_name.split("*", 1)
            prefix, suffix = prefix.strip(), suffix.strip()
            if re.match(r"^[A-Z0-9]{4,}$", suffix):
                merchant_name = prefix   # token code — drop it
            else:
                merchant_name = suffix   # product name — more specific

        # Normalize ALL CAPS to title case (but leave mixed-case like "YouTube" alone)
        if merchant_name == merchant_name.upper():
            merchant_name = merchant_name.title()

        # Expand known truncated descriptors
        alias = _DESCRIPTOR_ALIASES.get(merchant_name.lower())
        if alias:
            merchant_name = alias

        if card_memo and card_memo.lower() != merchant_name.lower():
            items = [f"{merchant_name} ({card_memo})"]
        else:
            items = [merchant_name]

        return ParsedReceipt(
            order_id=token,
            date=txn_date,
            amount=amount,
            items=items,
            merchant="privacy",
        )
