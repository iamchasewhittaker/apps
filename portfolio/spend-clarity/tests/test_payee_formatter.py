"""Tests for payee_formatter.py"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from payee_formatter import display_payee


class TestKnownMerchants:
    def test_amazon(self):
        assert display_payee("ACH WITHDRAWAL AMAZON.COM AMZN.COM/BILL WA") == "Amazon"

    def test_amzn_short(self):
        assert display_payee("AMZN MKTP US*AB12CD34EF") == "Amazon"

    def test_walmart(self):
        assert display_payee("WALMART SUPERCENTER #1234") == "Walmart"
        assert display_payee("WAL-MART #5678") == "Walmart"

    def test_target(self):
        assert display_payee("TARGET 00123456 CHARLOTTE NC") == "Target"

    def test_costco(self):
        assert display_payee("COSTCO WHSE #1234") == "Costco"

    def test_whole_foods(self):
        assert display_payee("WHOLEFDS CHR 10101") == "Whole Foods"
        assert display_payee("WHOLE FOODS MARKET") == "Whole Foods"

    def test_netflix(self):
        assert display_payee("NETFLIX.COM") == "Netflix"

    def test_spotify(self):
        assert display_payee("SPOTIFY USA") == "Spotify"

    def test_starbucks(self):
        assert display_payee("STARBUCKS #12345 CHARLOTTE") == "Starbucks"

    def test_chipotle(self):
        assert display_payee("CHIPOTLE 1234") == "Chipotle"

    def test_mcdonalds(self):
        assert display_payee("MCDONALD'S F12345") == "McDonald's"

    def test_chick_fil_a(self):
        assert display_payee("CHICK-FIL-A #01234") == "Chick-fil-A"

    def test_doordash(self):
        assert display_payee("DOORDASH*PIZZA HUT") == "DoorDash"

    def test_uber_eats(self):
        assert display_payee("UBER EATS 12345678") == "Uber Eats"

    def test_uber_rideshare(self):
        assert display_payee("UBER *TRIP 12345") == "Uber"

    def test_lyft(self):
        assert display_payee("LYFT *RIDE SUN 12PM") == "Lyft"

    def test_walgreens(self):
        assert display_payee("WALGREENS #12345") == "Walgreens"

    def test_cvs(self):
        assert display_payee("CVS PHARMACY #1234") == "CVS"

    def test_kroger(self):
        assert display_payee("KROGER #123 CHARLOTTE") == "Kroger"

    def test_trader_joes(self):
        assert display_payee("TRADER JOE'S #678") == "Trader Joe's"

    def test_home_depot(self):
        assert display_payee("THE HOME DEPOT #1234") == "Home Depot"

    def test_best_buy(self):
        assert display_payee("BEST BUY #1234") == "Best Buy"

    def test_hulu(self):
        assert display_payee("HULU 1234567890") == "Hulu"

    def test_paypal(self):
        assert display_payee("PAYPAL *MERCHANT") == "PayPal"

    def test_venmo(self):
        assert display_payee("VENMO PAYMENT") == "Venmo"


class TestBankNoiseStripping:
    def test_ach_withdrawal_prefix(self):
        result = display_payee("ACH WITHDRAWAL CHEVRON GAS")
        assert "Chevron" in result or result == "Chevron"

    def test_debit_purchase_prefix(self):
        result = display_payee("DEBIT PURCHASE STARBUCKS #123")
        assert result == "Starbucks"

    def test_pos_prefix(self):
        result = display_payee("POS PURCHASE KROGER #456")
        assert result == "Kroger"

    def test_online_bill_pay(self):
        result = display_payee("ONLINE BILL PAY NETFLIX")
        assert result == "Netflix"


class TestTrailingNoiseStripping:
    def test_trailing_asterisk_alphanum(self):
        result = display_payee("AMZN MKTP US*1A2B3C4D")
        assert result == "Amazon"

    def test_trailing_hash_digits(self):
        result = display_payee("STARBUCKS #12345")
        assert result == "Starbucks"


class TestAllCapsConversion:
    def test_all_caps_becomes_title_case(self):
        result = display_payee("UNKNOWN LOCAL RESTAURANT")
        assert result == "Unknown Local Restaurant"

    def test_short_caps_not_converted(self):
        # Under 4 letters — leave as-is
        result = display_payee("BP")
        assert result == "BP"


class TestEdgeCases:
    def test_none_input(self):
        assert display_payee(None) == "Unknown Payee"

    def test_empty_string(self):
        assert display_payee("") == "Unknown Payee"

    def test_whitespace_only(self):
        assert display_payee("   ") == "Unknown Payee"

    def test_already_clean_name(self):
        result = display_payee("Local Coffee Shop")
        assert result == "Local Coffee Shop"
