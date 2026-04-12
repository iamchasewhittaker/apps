"""
receipt_parser.py — Per-merchant email receipt parsing.

Each parser extracts:
  - order_id: str  (for deduplication)
  - date: date     (order date)
  - amount: float  (order total)
  - items: list[str]

Returns None if parsing fails for any reason.
"""

import logging
import re
from dataclasses import dataclass, field
from datetime import date
from email.utils import parsedate_to_datetime
from typing import Optional

from bs4 import BeautifulSoup

log = logging.getLogger(__name__)


@dataclass
class ParsedReceipt:
    order_id: str
    date: date
    amount: float
    items: list[str]
    merchant: str = ""


def parse_receipt(email: dict, merchant: str) -> Optional[ParsedReceipt]:
    """Dispatch to the correct parser based on merchant name."""
    parsers = {
        "amazon": _parse_amazon,
        "apple": _parse_apple,
        "audible": _parse_audible,
        "doordash": _parse_doordash,
        "netflix": _parse_subscription,
        "spotify": _parse_subscription,
        "hulu": _parse_subscription,
        "disney": _parse_subscription,
        "privacy": _parse_privacy,
        "walmart": _parse_walmart,
        "target": _parse_generic_order,
        "costco": _parse_generic_order,
        "venmo": _parse_venmo,
    }
    parser = parsers.get(merchant)
    if not parser:
        log.warning(f"No parser for merchant: {merchant}")
        return None

    try:
        return parser(email)
    except Exception as e:
        log.warning(f"Failed to parse {merchant} receipt (id={email.get('id')}): {e}")
        return None


# ---------------------------------------------------------------------------
# Amazon
# ---------------------------------------------------------------------------

def _parse_amazon(email: dict) -> Optional[ParsedReceipt]:
    soup = _soup(email)
    if not soup:
        return None

    order_id = _find_text(soup, r"Order\s*#[:\s]*([\w\-]+)")
    amount = (
        _find_amount(soup, r"\*?(?:Grand Total|Order Total|Charged to[^$\n]*)[:\s]+\$([0-9,]+\.[0-9]{2})")
        or _find_last_amount(soup)
    )
    order_date = _parse_email_date(email["date"])
    items = _extract_amazon_items(soup)

    log.debug(f"Amazon parse: order_id={order_id!r} amount={amount} date={order_date} items={items}")

    if not order_id or amount is None:
        return None

    return ParsedReceipt(
        order_id=order_id,
        date=order_date,
        amount=amount,
        items=items,
    )


def _extract_amazon_items(soup: BeautifulSoup) -> list[str]:
    items = []
    # Amazon item links typically contain product names
    for a in soup.find_all("a", href=re.compile(r"amazon\.com/.*dp/")):
        text = a.get_text(strip=True)
        if text and len(text) > 5:
            items.append(_truncate_item(text))
    # Fallback: look for bold/cell text that looks like a product name
    if not items:
        _SKIP = re.compile(
            r"\$[\d,.]+|sold by|amazon\.com|thank you|shopping|visit|help|"
            r"order #|subtotal|tax|grand total|trademark|affiliates|©|view order|"
            r"start reading|your books|notification-only|cannot accept",
            re.I,
        )
        for td in soup.find_all(["td", "p", "span"]):
            text = td.get_text(strip=True)
            if 10 < len(text) < 150 and not _SKIP.search(text):
                items.append(_truncate_item(text))
    return list(dict.fromkeys(items))[:10]  # deduplicate, cap at 10


# ---------------------------------------------------------------------------
# Apple
# ---------------------------------------------------------------------------

def _parse_apple(email: dict) -> Optional[ParsedReceipt]:
    soup = _soup(email)
    if not soup:
        return None

    order_id = _find_text(soup, r"(?:Order|Document)\s*(?:ID|#)?\s*[:\s]*([\w]+)")
    amount = _find_amount(soup, r"\$([0-9,]+\.[0-9]{2})")
    order_date = _parse_email_date(email["date"])
    items = []

    # Apple receipts list items in a table — look for app/service names
    _APPLE_SKIP = re.compile(
        r"apple card|save|apply|receipt\s*save|%|@|"
        r"\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b.*\d{4}|"
        r"^(apple account|date|order id|document|billed to|subtotal|total|tax)",
        re.I,
    )
    for row in soup.find_all("tr"):
        cells = [td.get_text(strip=True) for td in row.find_all("td")]
        if cells:
            text = cells[0]
            # Skip label+value concatenations (ALL_CAPS run-on like "DATEJan 10")
            if re.match(r"^[A-Z ]{3,}\s*[A-Z]", text) and not re.match(r"^[A-Z][a-z]", text):
                continue
            if (len(text) > 3 and len(text) <= 80
                    and not re.match(r"^\$", text)
                    and not _APPLE_SKIP.search(text)):
                items.append(_truncate_item(text))

    if not items:
        # Subscription receipts: app/service name appears before "Renews" or "(Monthly)"
        full_text = soup.get_text(" ")
        m = re.search(r"([A-Z][^\n$]{4,50}?)\s+(?:Renews|Renewal|\(Monthly\)|\(Annual\)|\(Weekly\))", full_text)
        if m:
            items = [_truncate_item(m.group(1))]
        else:
            subject = email.get("subject", "").strip()
            items = [subject] if subject else ["Apple Purchase"]

    if not order_id or amount is None:
        return None

    return ParsedReceipt(
        order_id=order_id,
        date=order_date,
        amount=amount,
        items=list(dict.fromkeys(items))[:5],
    )


# ---------------------------------------------------------------------------
# DoorDash
# ---------------------------------------------------------------------------

def _parse_doordash(email: dict) -> Optional[ParsedReceipt]:
    subject = email.get("subject", "")

    # Only parse order confirmation emails, not delivery notifications or adjustments
    if not re.search(r"order confirmation", subject, re.I):
        return None

    soup = _soup(email)
    if not soup:
        return None

    order_id = _find_text(soup, r"Order\s*#?\s*([\w]+)")
    amount = (
        _find_amount(soup, r"(?:Order\s+)?Total[:\s]+\$([0-9,]+\.[0-9]{2})")
        or _find_last_amount(soup)
    )
    order_date = _parse_email_date(email["date"])

    # Extract restaurant name from subject: "Order Confirmation for Chase from Dairy Queen"
    restaurant = ""
    m = re.search(r"from\s+(.+)$", subject, re.I)
    if m:
        restaurant = m.group(1).strip()

    # Fallback: look in HTML tags
    if not restaurant:
        for candidate in soup.find_all(["h1", "h2", "strong", "b"]):
            text = candidate.get_text(strip=True)
            if text and "DoorDash" not in text and "Chase" not in text and len(text) > 3:
                restaurant = text
                break

    items = [f"DoorDash \u2014 {restaurant}"] if restaurant else ["DoorDash order"]

    if amount is None:
        return None

    return ParsedReceipt(
        order_id=order_id or email["id"],
        date=order_date,
        amount=amount,
        items=items,
    )


# ---------------------------------------------------------------------------
# Audible
# ---------------------------------------------------------------------------

def _parse_audible(email: dict) -> Optional[ParsedReceipt]:
    soup = _soup(email)
    if not soup:
        return None

    order_id = _find_text(soup, r"Order\s*(?:ID|#)?\s*[:\s]*([\w\-]+)")
    amount = (
        _find_amount(soup, r"(?:Order Total|Total)[:\s]+\$([0-9,]+\.[0-9]{2})")
        or _find_last_amount(soup)
    )
    order_date = _parse_email_date(email["date"])

    # Extract audiobook title from prominent tags
    title = ""
    for tag in soup.find_all(["h1", "h2", "h3", "strong", "b"]):
        text = tag.get_text(strip=True)
        if text and len(text) > 3 and len(text) < 120 and "audible" not in text.lower():
            title = text
            break

    # Try to find author ("By Author Name" or "Narrated by")
    author = ""
    full_text = soup.get_text(" ")
    m = re.search(r"\bBy\s+([A-Z][^,\n\r]{2,40})", full_text)
    if m:
        author = m.group(1).strip()

    if title and author:
        items = [f"{title} by {author}"]
    elif title:
        items = [title]
    else:
        subject = email.get("subject", "").strip()
        items = [subject] if subject else ["Audible purchase"]

    if amount is None:
        return None

    return ParsedReceipt(
        order_id=order_id or email["id"],
        date=order_date,
        amount=amount,
        items=items,
    )


# ---------------------------------------------------------------------------
# Subscriptions (Netflix, Spotify, Hulu, Disney+)
# ---------------------------------------------------------------------------

def _parse_subscription(email: dict) -> Optional[ParsedReceipt]:
    soup = _soup(email)
    if not soup:
        return None

    amount = _find_amount(soup, r"\$([0-9,]+\.[0-9]{2})")
    order_date = _parse_email_date(email["date"])

    # Subscription name from subject line
    subject = email.get("subject", "")
    items = [subject] if subject else ["Subscription"]

    return ParsedReceipt(
        order_id=email["id"],  # use email ID as dedup key
        date=order_date,
        amount=amount or 0.0,
        items=items,
    )


# ---------------------------------------------------------------------------
# Privacy.com (virtual card transaction notifications)
# ---------------------------------------------------------------------------

def _parse_privacy(email: dict) -> Optional[ParsedReceipt]:
    soup = _soup(email)
    if not soup:
        return None

    full_text = soup.get_text(" ")
    amount = _find_amount(soup, r"\$([0-9,]+\.[0-9]{2})")
    order_date = _parse_email_date(email["date"])

    # Privacy.com emails: "$X.XX was authorized at MERCHANT NAME on your [card] card."
    merchant_name = ""
    m = re.search(r"\$[\d,.]+\s+was\s+authorized\s+at\s+(.+?)\s+on\s+your", full_text, re.I)
    if m:
        # Convert ALL CAPS merchant to title case
        raw = m.group(1).strip()
        merchant_name = _truncate_item(raw.title())

    # Fallback: look for merchant in subject line
    if not merchant_name:
        subject = email.get("subject", "")
        m = re.search(r"at\s+(.+?)(?:\s+for\s|\s*$)", subject, re.I)
        if m:
            merchant_name = _truncate_item(m.group(1))

    items = [merchant_name] if merchant_name else ["Privacy.com purchase"]

    if amount is None:
        return None

    return ParsedReceipt(
        order_id=email["id"],  # each notification is a unique transaction
        date=order_date,
        amount=amount,
        items=items,
    )


# ---------------------------------------------------------------------------
# Walmart (grocery delivery + standard orders)
# ---------------------------------------------------------------------------

def _parse_walmart(email: dict) -> Optional[ParsedReceipt]:
    soup = _soup(email)
    if not soup:
        return None

    # Grocery delivery: "Order number:#2000146-41987434" or standard "Order #XXXXX"
    order_id = _find_text(soup, r"Order\s+(?:number\s*:?\s*#?|#\s*)([\w\-]+)")
    order_date = _parse_email_date(email["date"])

    # Grocery delivery emails: "Includes all fees, taxes and discounts  $X.XX"
    amount = _find_amount(soup, r"Includes all fees[^$]*\$([0-9,]+\.[0-9]{2})")
    # Standard order emails: "Order Total  $X.XX" or "Total  $X.XX"
    if amount is None:
        amount = _find_amount(soup, r"(?:Order\s+Total|Total)[:\s]+\$([0-9,]+\.[0-9]{2})")

    # Grocery delivery: item names aren't in the confirmation email, use item count
    raw_text = soup.get_text(" ")
    subject = email.get("subject", "")
    is_grocery = bool(re.search(r"delivery order|grocery|delivery from store", raw_text + " " + subject, re.I))
    items = []
    if is_grocery:
        count_match = re.search(r"(\d+)\s+items?", raw_text, re.I)
        if count_match:
            items = [f"Grocery delivery ({count_match.group(1)} items)"]
        else:
            items = ["Grocery delivery"]
    else:
        for td in soup.find_all("td"):
            text = td.get_text(strip=True)
            if 5 < len(text) < 100 and not re.search(r"^\$|total|subtotal|tax|shipping|fee|discount|saved", text, re.I):
                items.append(_truncate_item(text))

    if amount is None:
        return None

    return ParsedReceipt(
        order_id=order_id or email["id"],
        date=order_date,
        amount=amount,
        items=items[:8],
    )


# ---------------------------------------------------------------------------
# Generic online order (Target, Costco)
# ---------------------------------------------------------------------------


def _parse_generic_order(email: dict) -> Optional[ParsedReceipt]:
    soup = _soup(email)
    if not soup:
        return None

    order_id = _find_text(soup, r"Order\s*#?\s*([\w\-]+)")
    amount = _find_amount(soup, r"(?:Total|Order Total)[:\s]+\$([0-9,]+\.[0-9]{2})")
    order_date = _parse_email_date(email["date"])
    items = []

    # Generic item extraction from table cells
    for td in soup.find_all("td"):
        text = td.get_text(strip=True)
        if 5 < len(text) < 100 and not re.search(r"^\$|total|subtotal|tax|shipping", text, re.I):
            items.append(_truncate_item(text))

    if amount is None:
        return None

    return ParsedReceipt(
        order_id=order_id or email["id"],
        date=order_date,
        amount=amount,
        items=items[:8],
    )


# ---------------------------------------------------------------------------
# Venmo
# ---------------------------------------------------------------------------

def _parse_venmo(email: dict) -> Optional[ParsedReceipt]:
    """Parse Venmo payment notification emails (sent and received).

    Handles:
      - "You paid Jimmy Lewis $160.00"
      - "Ryne Cardon paid your $25.50 request"
      - "Ann Whittaker paid you $300.00"
    Skips bank transfer and monthly history emails.
    """
    subject = email.get("subject", "")

    person = None
    amount = None
    direction = None  # "sent" or "received"

    # Sent: "You paid <Person> $<amount>"
    sent_m = re.match(r"You paid (.+?) \$([0-9,]+\.[0-9]{2})$", subject)
    if sent_m:
        person = sent_m.group(1).strip()
        amount = float(sent_m.group(2).replace(",", ""))
        direction = "sent"

    # Received (request): "<Person> paid your $<amount> request"
    if not person:
        recv_req_m = re.match(r"(.+?) paid your \$([0-9,]+\.[0-9]{2}) request", subject)
        if recv_req_m:
            person = recv_req_m.group(1).strip()
            amount = float(recv_req_m.group(2).replace(",", ""))
            direction = "received"

    # Received (direct): "<Person> paid you $<amount>"
    if not person:
        recv_m = re.match(r"(.+?) paid you \$([0-9,]+\.[0-9]{2})$", subject)
        if recv_m:
            person = recv_m.group(1).strip()
            amount = float(recv_m.group(2).replace(",", ""))
            direction = "received"

    if not person or not amount:
        return None

    # Parse HTML body for memo, transaction ID, and date
    soup = _soup(email)
    raw = soup.get_text(" ") if soup else ""

    # Memo: text between the spaced amount and "See transaction"
    # Venmo renders the amount with spaces in HTML: "$ 160 . 00   Soil test, consultation See transaction"
    memo_m = re.search(r"\$ \d[\d ]* \. \d{2}\s+(.+?)\s+See transaction", raw)
    memo_text = memo_m.group(1).strip() if memo_m else None
    # Discard if memo looks like boilerplate (very short or matches person name)
    if memo_text and (len(memo_text) < 2 or memo_text.lower() in (person.lower(), "venmo")):
        memo_text = None

    # Transaction ID for deduplication
    txn_id_m = re.search(r"Transaction ID\s+(\d+)", raw)
    order_id = txn_id_m.group(1) if txn_id_m else email["id"]

    # Date from body: "Date Mar 20, 2026"
    from datetime import datetime as _dt
    date_m = re.search(r"Date\s+([A-Z][a-z]+ \d+, \d{4})", raw)
    if date_m:
        try:
            order_date = _dt.strptime(date_m.group(1), "%b %d, %Y").date()
        except ValueError:
            order_date = _parse_email_date(email["date"])
    else:
        order_date = _parse_email_date(email["date"])

    label = f"Paid {person}" if direction == "sent" else f"From {person}"
    if memo_text:
        label += f" — {memo_text}"

    return ParsedReceipt(
        order_id=order_id,
        date=order_date,
        amount=amount,
        items=[label],
    )


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _soup(email: dict) -> Optional[BeautifulSoup]:
    html = email.get("body_html")
    if html:
        return BeautifulSoup(html, "lxml")
    text = email.get("body_text")
    if text:
        return BeautifulSoup(text, "html.parser")
    return None


def _find_text(soup: BeautifulSoup, pattern: str) -> Optional[str]:
    text = soup.get_text(" ")
    m = re.search(pattern, text, re.I)
    return m.group(1) if m else None


def _find_amount(soup: BeautifulSoup, pattern: str) -> Optional[float]:
    text = soup.get_text(" ")
    m = re.search(pattern, text, re.I)
    if m:
        return float(m.group(1).replace(",", ""))
    return None


def _find_last_amount(soup: BeautifulSoup) -> Optional[float]:
    """Return the last dollar amount found in the email — more likely to be the total."""
    text = soup.get_text(" ")
    matches = re.findall(r"\$([0-9,]+\.[0-9]{2})", text)
    if matches:
        return float(matches[-1].replace(",", ""))
    return None


def _parse_email_date(date_str: str) -> date:
    try:
        return parsedate_to_datetime(date_str).date()
    except Exception:
        return date.today()


def _truncate_item(text: str, max_len: int = 60) -> str:
    text = re.sub(r"\s+", " ", text).strip()
    return text[:max_len].rstrip() if len(text) > max_len else text
