import pytest
from datetime import date
from src.receipt_parser import parse_receipt, _truncate_item, _find_amount


def _email(body_html="", body_text="", subject="", sender="", date_str="Mon, 04 Nov 2024 10:00:00 +0000"):
    return {
        "id": "test-email-id",
        "subject": subject,
        "date": date_str,
        "from": sender,
        "body_html": body_html,
        "body_text": body_text,
    }


AMAZON_HTML = """
<html><body>
<p>Order #123-4567890-1234567</p>
<p>Order Total: $47.23</p>
<a href="https://amazon.com/gp/product/dp/B08N5KWB9H">Kindle Paperwhite</a>
<a href="https://amazon.com/gp/product/dp/B07XJ8C8F7">Echo Dot (4th Gen)</a>
</body></html>
"""

APPLE_HTML = """
<html><body>
<p>Document ID: ABC123</p>
<table>
<tr><td>iCloud+ 200GB</td><td>$2.99</td></tr>
</table>
<p>Total: $2.99</p>
</body></html>
"""

DOORDASH_HTML = """
<html><body>
<h1>Chick-fil-A</h1>
<p>Order #DD789</p>
<p>Total: $18.47</p>
</body></html>
"""


def test_parse_amazon_extracts_items():
    receipt = parse_receipt(_email(body_html=AMAZON_HTML), merchant="amazon")
    assert receipt is not None
    assert receipt.order_id == "123-4567890-1234567"
    assert receipt.amount == pytest.approx(47.23)
    assert any("Kindle" in item for item in receipt.items)


def test_parse_apple_extracts_amount():
    receipt = parse_receipt(_email(body_html=APPLE_HTML), merchant="apple")
    assert receipt is not None
    assert receipt.amount == pytest.approx(2.99)


def test_parse_doordash_restaurant_name():
    receipt = parse_receipt(_email(body_html=DOORDASH_HTML), merchant="doordash")
    assert receipt is not None
    assert receipt.amount == pytest.approx(18.47)
    assert any("Chick-fil-A" in item for item in receipt.items)


def test_parse_subscription_uses_subject():
    email = _email(
        body_html="<p>Total: $15.99</p>",
        subject="Your Netflix subscription receipt",
        sender="info@mailer.netflix.com",
    )
    receipt = parse_receipt(email, merchant="netflix")
    assert receipt is not None
    assert "Netflix" in receipt.items[0]


def test_parse_unknown_merchant_returns_none():
    receipt = parse_receipt(_email(body_html="<p>Order total: $9.99</p>"), merchant="unknown_merchant")
    assert receipt is None


def test_parse_malformed_html_returns_none():
    receipt = parse_receipt(_email(body_html="not html at all"), merchant="amazon")
    # Should not raise — may return None if required fields missing
    # (order_id and amount both absent from garbage input)
    assert receipt is None or isinstance(receipt.amount, float)


def test_truncate_item_short():
    assert _truncate_item("Short name") == "Short name"


def test_truncate_item_long():
    long = "A" * 100
    result = _truncate_item(long)
    assert len(result) <= 60


def test_find_amount_with_comma():
    from bs4 import BeautifulSoup
    soup = BeautifulSoup("<p>Order Total: $1,234.56</p>", "html.parser")
    assert _find_amount(soup, r"\$([0-9,]+\.[0-9]{2})") == pytest.approx(1234.56)
