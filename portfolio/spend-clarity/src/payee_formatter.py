"""
payee_formatter.py — Clean up messy bank/card payee strings for display and matching.

Ported from YNABClarity/Engine/PayeeDisplayFormatter.swift.

Pipeline:
  1. Collapse whitespace
  2. Strip leading bank noise (ACH, withdrawal, bill pay, POS, etc.) — iterative
  3. Check known merchant map (early return if matched)
  4. Strip trailing noise (*ALPHANUM codes, #digits)
  5. ALL CAPS → title case
"""

import re
from typing import Optional


# ---------------------------------------------------------------------------
# Known merchant map
# Checked after bank-noise stripping. Returns clean display name immediately.
# ---------------------------------------------------------------------------

def _known_merchant(lower: str) -> Optional[str]:
    """Return clean merchant name for known payees, or None if not recognized."""
    # Amazon family
    if "amazon" in lower or "amzn" in lower or "prime video" in lower:
        return "Amazon"

    # Big-box retail
    if "walmart" in lower or "wal-mart" in lower or "wm supercenter" in lower:
        return "Walmart"
    if ("target" in lower and "target.com" not in lower) or "tgt " in lower:
        return "Target"
    if "costco" in lower:
        return "Costco"
    if "wholefds" in lower or "whole foods" in lower:
        return "Whole Foods"
    if "best buy" in lower:
        return "Best Buy"
    if "home depot" in lower:
        return "Home Depot"
    if "lowe's" in lower or "lowes" in lower:
        return "Lowe's"

    # Grocery
    if "kroger" in lower:
        return "Kroger"
    if "publix" in lower:
        return "Publix"
    if "trader joe" in lower:
        return "Trader Joe's"
    if "aldi" in lower:
        return "ALDI"
    if "h-e-b" in lower or lower.startswith("heb ") or " heb " in lower:
        return "H-E-B"
    if "safeway" in lower:
        return "Safeway"
    if "wegmans" in lower:
        return "Wegmans"
    if "sprouts" in lower:
        return "Sprouts"

    # Food delivery / rideshare
    if "uber eats" in lower:
        return "Uber Eats"
    if "doordash" in lower:
        return "DoorDash"
    if "grubhub" in lower:
        return "Grubhub"
    if "instacart" in lower:
        return "Instacart"
    if "uber" in lower:
        return "Uber"
    if "lyft" in lower:
        return "Lyft"

    # Restaurants / coffee
    if "starbucks" in lower:
        return "Starbucks"
    if "chipotle" in lower:
        return "Chipotle"
    if "chick-fil-a" in lower or "chickfila" in lower:
        return "Chick-fil-A"
    if "mcdonald" in lower:
        return "McDonald's"
    if "wendy" in lower and "wendy" in lower:
        return "Wendy's"
    if "taco bell" in lower:
        return "Taco Bell"
    if "panera" in lower:
        return "Panera"
    if "subway" in lower and "payment" not in lower:
        return "Subway"
    if "pizza hut" in lower:
        return "Pizza Hut"
    if "domino" in lower:
        return "Domino's"
    if "five guys" in lower:
        return "Five Guys"
    if "dutch bros" in lower:
        return "Dutch Bros"
    if "dunkin" in lower:
        return "Dunkin'"

    # Pharmacy
    if "walgreens" in lower:
        return "Walgreens"
    if "cvs" in lower and len(lower) < 30:
        return "CVS"
    if "rite aid" in lower or "rite-aid" in lower:
        return "Rite Aid"

    # Gas / fuel
    if "chevron" in lower:
        return "Chevron"
    if "shell" in lower and "shell oil" in lower:
        return "Shell"
    if "exxon" in lower:
        return "Exxon"
    if "bp " in lower or lower.startswith("bp"):
        return "BP"
    if "speedway" in lower:
        return "Speedway"
    if "circle k" in lower:
        return "Circle K"
    if "quiktrip" in lower or "quik trip" in lower:
        return "QuikTrip"
    if "wawa" in lower:
        return "Wawa"
    if "sheetz" in lower:
        return "Sheetz"

    # P2P / payment
    if "paypal" in lower:
        return "PayPal"
    if "venmo" in lower:
        return "Venmo"
    if "zelle" in lower:
        return "Zelle"

    # Apple
    if "apple.com" in lower or "apple store" in lower:
        return "Apple"

    # Streaming
    if "youtube" in lower and "google" in lower:
        return "YouTube"
    if "netflix" in lower:
        return "Netflix"
    if "spotify" in lower:
        return "Spotify"
    if "hulu" in lower:
        return "Hulu"
    if "disney" in lower and "plus" in lower:
        return "Disney+"
    if "siriusxm" in lower or "sirius xm" in lower:
        return "SiriusXM"
    if "peacock" in lower:
        return "Peacock"
    if "max.com" in lower or ("hbo" in lower and "max" in lower):
        return "Max"
    if "paramount" in lower:
        return "Paramount+"

    return None


# ---------------------------------------------------------------------------
# Bank noise patterns (applied iteratively, leading anchor)
# Ported from PayeeDisplayFormatter.swift leadingBankNoisePatterns
# ---------------------------------------------------------------------------

_LEADING_NOISE_PATTERNS = [
    re.compile(r'^(withdrawal|wd|ach|eft|transfer|xfer)\s+', re.IGNORECASE),
    re.compile(r'^(online|web)\s+(payment|transfer|bill\s*pay|bill\s*payment)\s+', re.IGNORECASE),
    re.compile(r'^(bill\s*pay(?:ment)?|recurring\s+ach|direct\s+debit|auto\s*pay|autopay)\s+', re.IGNORECASE),
    re.compile(r'^(debit|credit)\s+(card\s+)?(purchase|payment|pmt|txn)?\s*', re.IGNORECASE),
    re.compile(r'^(pos|point\s+of\s+sale|purchase|purch)\s+', re.IGNORECASE),
    re.compile(r'^(electronic|digital)\s+(payment|funds\s+transfer|transfer)\s+', re.IGNORECASE),
    re.compile(r'^ach\s*[-–]\s*\w+\s+', re.IGNORECASE),
    re.compile(r'^ach\s+(credit|debit|payment|withdrawal)\s+', re.IGNORECASE),
    re.compile(r'^(ppd|ccd|web|tel)\s+(ach\s+)?', re.IGNORECASE),
    re.compile(r'^(checking|savings|chk|sv)\s+', re.IGNORECASE),
]

_TRAILING_NOISE_PATTERNS = [
    # Trailing *ALPHANUMERIC codes (e.g. AMZN MKTP US*AB12CD34EF)
    re.compile(r'\s*\*[A-Z0-9]{4,}\s*$', re.IGNORECASE),
    # Trailing #digits
    re.compile(r'\s*#\d{3,}\s*$'),
    # Remaining leading POS/DEBIT/CREDIT/PURCHASE prefix (after noise strip)
    re.compile(r'^(POS|DEBIT|CREDIT|PURCHASE)\s+', re.IGNORECASE),
]


def _collapse_whitespace(s: str) -> str:
    return re.sub(r'\s+', ' ', s).strip()


def _strip_leading_noise(s: str) -> str:
    for _ in range(8):  # max 8 passes
        before = s
        for pattern in _LEADING_NOISE_PATTERNS:
            s = pattern.sub('', s).strip()
        if s == before:
            break
    return s


def _strip_trailing_noise(s: str) -> str:
    for pattern in _TRAILING_NOISE_PATTERNS:
        s = pattern.sub('', s).strip()
    return s


def _title_case(s: str) -> str:
    return ' '.join(
        word.capitalize() if word else ''
        for word in s.lower().split(' ')
    )


def display_payee(raw: Optional[str]) -> str:
    """
    Return a clean, display-friendly merchant name from a raw YNAB payee string.

    Examples:
      "ACH WITHDRAWAL AMAZON.COM AMZN.COM/BILL WA"  →  "Amazon"
      "ONLINE PAYMENT NETFLIX.COM"                   →  "Netflix"
      "POS PURCHASE STARBUCKS #1234"                →  "Starbucks"
      "DAIRY QUEEN"                                  →  "Dairy Queen"
      None / ""                                      →  "Unknown Payee"
    """
    if not raw or not raw.strip():
        return "Unknown Payee"

    s = _collapse_whitespace(raw)
    s = _strip_leading_noise(s)
    lower = s.lower()

    # Check known merchants early (after bank noise removed)
    known = _known_merchant(lower)
    if known:
        return known

    # Strip trailing noise
    s = _strip_trailing_noise(s)
    s = s.strip()

    if not s:
        return "Unknown Payee"

    # If still ALL CAPS (4+ letter chars), convert to title case
    letters = ''.join(c for c in s if c.isalpha())
    if len(letters) >= 4 and letters == letters.upper():
        return _title_case(s)

    return s
