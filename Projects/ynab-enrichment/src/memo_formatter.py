"""
memo_formatter.py — Memo string generation.

Rules:
  - Single item:     "Item Name"
  - Multiple items:  "Item 1, Item 2, Item 3"
  - More than 4:     "Item 1, Item 2, Item 3 (+2 more)"
  - Split order:     "[Split $124.99 total] Item 1, Item 2"
  - Max 200 chars (YNAB limit)
"""

YNAB_MEMO_LIMIT = 200
ITEM_DISPLAY_LIMIT = 4


def format_memo(
    items: list[str],
    is_split: bool = False,
    split_total: float = 0.0,
) -> str:
    if not items:
        return ""

    prefix = f"[Split ${split_total:.2f} total] " if is_split else ""
    memo = _build_item_string(items)
    full = prefix + memo

    if len(full) <= YNAB_MEMO_LIMIT:
        return full

    # Truncate: try progressively shorter item lists
    for count in range(len(items) - 1, 0, -1):
        memo = _build_item_string(items, max_shown=count)
        full = prefix + memo
        if len(full) <= YNAB_MEMO_LIMIT:
            return full

    # Last resort: hard truncate
    return (prefix + items[0])[: YNAB_MEMO_LIMIT]


def _build_item_string(items: list[str], max_shown: int = ITEM_DISPLAY_LIMIT) -> str:
    if not items:
        return ""

    shown = items[:max_shown]
    remaining = len(items) - max_shown

    result = ", ".join(shown)
    if remaining > 0:
        result += f" (+{remaining} more)"

    return result
