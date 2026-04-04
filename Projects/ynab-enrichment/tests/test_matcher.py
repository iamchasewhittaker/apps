import pytest
from datetime import date
from src.matcher import match_receipts_to_transactions, _txn_amount, _txn_date
from src.receipt_parser import ParsedReceipt


def _make_txn(txn_id, payee, amount_dollars, txn_date, memo=""):
    return {
        "id": txn_id,
        "payee_name": payee,
        "amount": -int(amount_dollars * 1000),  # YNAB milliunits, negative = outflow
        "date": txn_date,
        "memo": memo,
    }


def _make_receipt(order_id, amount, order_date, items, merchant="amazon"):
    r = ParsedReceipt(order_id=order_id, date=order_date, amount=amount, items=items)
    r.merchant = merchant
    return r


MERCHANT_CONFIG = {
    "amazon": {"senders": [], "payee_keywords": ["amazon"]},
}


def test_exact_match():
    txns = [_make_txn("t1", "Amazon", 47.23, "2024-11-03")]
    receipts = [_make_receipt("ord1", 47.23, date(2024, 11, 3), ["Kindle Case"])]

    results = match_receipts_to_transactions(
        txns, receipts, ["amazon"], MERCHANT_CONFIG,
        date_tolerance_days=6, amount_tolerance_dollars=0.50,
    )
    assert len(results) == 1
    assert results[0].match_type == "exact"
    assert results[0].receipt.order_id == "ord1"


def test_fuzzy_match_within_tolerance():
    txns = [_make_txn("t2", "Amazon", 47.23, "2024-11-03")]
    receipts = [_make_receipt("ord2", 47.50, date(2024, 11, 5), ["USB Cable"])]

    results = match_receipts_to_transactions(
        txns, receipts, ["amazon"], MERCHANT_CONFIG,
        date_tolerance_days=6, amount_tolerance_dollars=0.50,
    )
    assert len(results) == 1
    assert results[0].match_type == "fuzzy"


def test_no_match_outside_date_window():
    txns = [_make_txn("t3", "Amazon", 47.23, "2024-11-03")]
    receipts = [_make_receipt("ord3", 47.23, date(2024, 10, 1), ["HDMI Cable"])]

    results = match_receipts_to_transactions(
        txns, receipts, ["amazon"], MERCHANT_CONFIG,
        date_tolerance_days=6, amount_tolerance_dollars=0.50,
    )
    assert len(results) == 0


def test_no_match_outside_amount_tolerance():
    txns = [_make_txn("t4", "Amazon", 47.23, "2024-11-03")]
    receipts = [_make_receipt("ord4", 52.00, date(2024, 11, 3), ["Keyboard"])]

    results = match_receipts_to_transactions(
        txns, receipts, ["amazon"], MERCHANT_CONFIG,
        date_tolerance_days=6, amount_tolerance_dollars=0.50,
    )
    assert len(results) == 0


def test_ambiguous_match_skipped():
    txns = [_make_txn("t5", "Amazon", 47.23, "2024-11-03")]
    receipts = [
        _make_receipt("ordA", 47.23, date(2024, 11, 3), ["Item A"]),
        _make_receipt("ordB", 47.23, date(2024, 11, 3), ["Item B"]),
    ]

    results = match_receipts_to_transactions(
        txns, receipts, ["amazon"], MERCHANT_CONFIG,
        date_tolerance_days=6, amount_tolerance_dollars=0.50,
    )
    assert len(results) == 0


def test_split_order_match():
    txns = [
        _make_txn("t6a", "Amazon", 60.00, "2024-11-03"),
        _make_txn("t6b", "Amazon", 64.99, "2024-11-03"),
    ]
    receipts = [_make_receipt("ord6", 124.99, date(2024, 11, 3), ["Item X", "Item Y"])]

    results = match_receipts_to_transactions(
        txns, receipts, ["amazon"], MERCHANT_CONFIG,
        date_tolerance_days=6, amount_tolerance_dollars=0.50,
    )
    assert len(results) == 2
    assert all(r.is_split for r in results)


def test_txn_amount_converts_milliunits():
    txn = {"amount": -47230}
    assert _txn_amount(txn) == pytest.approx(47.23)


def test_txn_date_parses():
    txn = {"date": "2024-11-03"}
    assert _txn_date(txn) == date(2024, 11, 3)
