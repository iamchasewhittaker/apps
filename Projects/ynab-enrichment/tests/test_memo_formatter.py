import pytest
from src.memo_formatter import format_memo, YNAB_MEMO_LIMIT


def test_single_item():
    assert format_memo(["Kindle Paperwhite"]) == "Kindle Paperwhite"


def test_two_items():
    assert format_memo(["Item A", "Item B"]) == "Item A, Item B"


def test_four_items_no_overflow():
    items = ["A", "B", "C", "D"]
    assert format_memo(items) == "A, B, C, D"


def test_five_items_shows_overflow():
    items = ["A", "B", "C", "D", "E"]
    assert format_memo(items) == "A, B, C, D (+1 more)"


def test_seven_items_shows_overflow():
    items = ["A", "B", "C", "D", "E", "F", "G"]
    assert format_memo(items) == "A, B, C, D (+3 more)"


def test_split_order_prefix():
    result = format_memo(["Item A", "Item B"], is_split=True, split_total=124.99)
    assert result.startswith("[Split $124.99 total]")
    assert "Item A" in result


def test_empty_items():
    assert format_memo([]) == ""


def test_max_length_respected():
    long_item = "A" * 180
    result = format_memo([long_item])
    assert len(result) <= YNAB_MEMO_LIMIT


def test_truncation_when_many_long_items():
    items = ["A very long item name that takes up lots of space"] * 10
    result = format_memo(items)
    assert len(result) <= YNAB_MEMO_LIMIT
