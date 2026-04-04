"""
matcher.py — Receipt ↔ YNAB transaction matching logic.

Match priority:
  1. Exact match  — same amount, date within ±1 day
  2. Fuzzy match  — amount within $0.50, date within ±6 days
  3. Split match  — multiple YNAB transactions summing to one order total

Skip if:
  - Transaction already has a non-blank memo (caller filters these out)
  - No receipt found within tolerance
  - Ambiguous match (two receipts equally close)
"""

import logging
from dataclasses import dataclass
from datetime import date, timedelta
from typing import Optional

from receipt_parser import ParsedReceipt

log = logging.getLogger(__name__)

EXACT_DATE_TOLERANCE = 1   # days
EXACT_AMOUNT_TOLERANCE = 0.0  # dollars


@dataclass
class MatchResult:
    transaction: dict
    receipt: ParsedReceipt
    match_type: str   # "exact", "fuzzy", "split"
    is_split: bool = False


def match_receipts_to_transactions(
    transactions: list[dict],
    receipts: list[ParsedReceipt],
    active_merchants: list[str],
    merchant_config: dict,
    date_tolerance_days: int = 6,
    amount_tolerance_dollars: float = 0.50,
) -> list[MatchResult]:
    """
    For each transaction relevant to an active merchant, attempt to find
    a matching receipt. Returns all confident matches.
    """
    results = []
    used_receipt_ids: set[str] = set()
    used_txn_ids: set[str] = set()

    def txn_matches_merchant(txn: dict, merchant_name: str) -> bool:
        payee = (txn.get("payee_name") or "").lower()
        return any(kw in payee for kw in merchant_config[merchant_name]["payee_keywords"])

    for merchant_name in active_merchants:
        merchant_receipts = [r for r in receipts if r.merchant == merchant_name]
        merchant_txns = [t for t in transactions if txn_matches_merchant(t, merchant_name)]

        log.debug(
            f"{merchant_name}: {len(merchant_txns)} txns, {len(merchant_receipts)} receipts"
        )
        if merchant_receipts:
            for r in merchant_receipts[:5]:
                log.debug(f"  receipt: date={r.date} amount=${r.amount:.2f} order_id={r.order_id!r}")
        if merchant_txns:
            for t in merchant_txns[:5]:
                log.debug(f"  txn: date={t['date']} amount=${_txn_amount(t):.2f} payee={t.get('payee_name')!r}")

        for txn in merchant_txns:
            if txn["id"] in used_txn_ids:
                continue
            match = _find_match(
                txn,
                merchant_receipts,
                used_receipt_ids,
                date_tolerance_days,
                amount_tolerance_dollars,
            )
            if match:
                used_receipt_ids.add(match.receipt.order_id)
                used_txn_ids.add(txn["id"])
                results.append(match)
            else:
                txn["_unmatched_reason"] = _unmatched_reason(
                    txn, merchant_receipts, date_tolerance_days, amount_tolerance_dollars
                )

        # Split order matching — skip for high-volume merchants where coincidental
        # amount sums are likely (e.g. Privacy.com with hundreds of transactions)
        _NO_SPLIT = {"privacy", "audible"}
        if merchant_name in _NO_SPLIT:
            continue

        split_matches = _find_split_matches(
            merchant_txns,
            merchant_receipts,
            used_receipt_ids,
            date_tolerance_days,
        )
        for m in split_matches:
            used_receipt_ids.add(m.receipt.order_id)
            results.append(m)

    return results


def _txn_amount(txn: dict) -> float:
    """YNAB stores amounts in milliunits (1/1000). Convert to dollars."""
    return abs(txn["amount"]) / 1000.0


def _txn_date(txn: dict) -> date:
    return date.fromisoformat(txn["date"])


def _find_match(
    txn: dict,
    receipts: list[ParsedReceipt],
    used_ids: set[str],
    date_tol: int,
    amount_tol: float,
) -> Optional[MatchResult]:
    txn_amt = _txn_amount(txn)
    txn_dt = _txn_date(txn)
    candidates = []

    for receipt in receipts:
        if receipt.order_id in used_ids:
            continue
        date_diff = abs((receipt.date - txn_dt).days)
        amount_diff = abs(receipt.amount - txn_amt)

        if date_diff <= EXACT_DATE_TOLERANCE and amount_diff <= EXACT_AMOUNT_TOLERANCE:
            candidates.append(("exact", date_diff, amount_diff, receipt))
        elif date_diff <= date_tol and amount_diff <= amount_tol:
            candidates.append(("fuzzy", date_diff, amount_diff, receipt))

    if not candidates:
        return None
    if len(candidates) > 1:
        # Ambiguous — check if there's a clear winner (exact vs fuzzy, or closer)
        exact = [c for c in candidates if c[0] == "exact"]
        if len(exact) == 1:
            _, _, _, receipt = exact[0]
            return MatchResult(transaction=txn, receipt=receipt, match_type="exact")
        log.debug(f"Ambiguous match for txn {txn['id']} — skipping")
        txn["_unmatched_reason"] = f"Ambiguous — {len(candidates)} receipts matched"
        return None

    match_type, _, _, receipt = candidates[0]
    return MatchResult(transaction=txn, receipt=receipt, match_type=match_type)


def _find_split_matches(
    txns: list[dict],
    receipts: list[ParsedReceipt],
    used_ids: set[str],
    date_tol: int,
) -> list[MatchResult]:
    """
    Look for groups of 2-4 transactions that sum to a single receipt total.
    Only considers transactions within date_tol of the receipt date.
    """
    results = []
    unmatched_txns = [t for t in txns if "_unmatched_reason" in t]

    for receipt in receipts:
        if receipt.order_id in used_ids:
            continue

        nearby = [
            t for t in unmatched_txns
            if abs((_txn_date(t) - receipt.date).days) <= date_tol
        ]

        for group_size in range(2, 5):
            found = _find_subset_sum(nearby, receipt.amount, group_size, tolerance=0.01)
            if found:
                for txn in found:
                    results.append(
                        MatchResult(
                            transaction=txn,
                            receipt=receipt,
                            match_type="split",
                            is_split=True,
                        )
                    )
                used_ids.add(receipt.order_id)
                break

    return results


def _find_subset_sum(
    txns: list[dict], target: float, size: int, tolerance: float
) -> Optional[list[dict]]:
    """Find a subset of `size` transactions whose amounts sum to `target`."""
    from itertools import combinations

    for combo in combinations(txns, size):
        total = sum(_txn_amount(t) for t in combo)
        if abs(total - target) <= tolerance:
            return list(combo)
    return None


def _unmatched_reason(
    txn: dict,
    receipts: list[ParsedReceipt],
    date_tol: int,
    amount_tol: float,
) -> str:
    txn_dt = _txn_date(txn)
    txn_amt = _txn_amount(txn)

    in_date = [r for r in receipts if abs((r.date - txn_dt).days) <= date_tol]
    if not in_date:
        return "No receipt found in date window"

    in_amount = [r for r in in_date if abs(r.amount - txn_amt) <= amount_tol]
    if not in_amount:
        return "Receipt(s) found but amount outside tolerance"

    return f"Ambiguous — {len(in_amount)} receipts matched"
