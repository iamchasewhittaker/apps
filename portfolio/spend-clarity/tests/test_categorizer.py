"""Tests for categorizer.py"""
import sys
import os
import tempfile
import yaml

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from categorizer import Categorizer

RULES_PATH = os.path.join(os.path.dirname(__file__), '..', 'config', 'category_rules.yaml')
OVERRIDES_PATH = os.path.join(os.path.dirname(__file__), '..', 'config', 'category_overrides.yaml')

# Real category IDs from the production config
SUBSCRIPTIONS_ID = "854f0f4c-de7e-4584-9de8-ac7b7ccfc2c3"
GROCERIES_ID = "0856160f-6845-46c5-bec6-df51bc9ea61f"
DINING_ID = "b013b72e-a3a1-4c73-8f4a-420633c9b5dd"
GAS_ID = "3c8e117f-11ca-4202-9d4a-fc83f40a0913"
PHARMACY_ID = "6308a24b-7146-4700-8b02-04da32cbf34d"
UTILITIES_ID = "5407f7b8-a9be-4a3b-ac30-f29011b58b24"
INSURANCE_ID = "9e692358-e411-4a03-a2bd-b380a2a83b36"
RIDESHARE_ID = "e84ad554-09a0-4fa5-ad9a-e1670be412bd"


class TestPayeeCategorization:
    def setup_method(self):
        self.cat = Categorizer(RULES_PATH, OVERRIDES_PATH)

    def test_netflix_subscription(self):
        assert self.cat.categorize_by_payee("Netflix") == SUBSCRIPTIONS_ID

    def test_spotify_subscription(self):
        assert self.cat.categorize_by_payee("Spotify USA") == SUBSCRIPTIONS_ID

    def test_hulu_subscription(self):
        assert self.cat.categorize_by_payee("Hulu") == SUBSCRIPTIONS_ID

    def test_xfinity_utility(self):
        assert self.cat.categorize_by_payee("Xfinity Internet") == UTILITIES_ID

    def test_geico_insurance(self):
        assert self.cat.categorize_by_payee("GEICO Auto Insurance") == INSURANCE_ID

    def test_kroger_groceries(self):
        assert self.cat.categorize_by_payee("Kroger #123") == GROCERIES_ID

    def test_walmart_groceries(self):
        assert self.cat.categorize_by_payee("Walmart Supercenter") == GROCERIES_ID

    def test_starbucks_dining(self):
        assert self.cat.categorize_by_payee("Starbucks #12345") == DINING_ID

    def test_chipotle_dining(self):
        assert self.cat.categorize_by_payee("Chipotle Mexican Grill") == DINING_ID

    def test_chevron_gas(self):
        assert self.cat.categorize_by_payee("Chevron Gas Station") == GAS_ID

    def test_walgreens_pharmacy(self):
        assert self.cat.categorize_by_payee("Walgreens #5678") == PHARMACY_ID

    def test_lyft_rideshare(self):
        assert self.cat.categorize_by_payee("Lyft *Ride") == RIDESHARE_ID

    def test_no_match_returns_none(self):
        assert self.cat.categorize_by_payee("Unknown Store XYZ") is None

    def test_case_insensitive(self):
        assert self.cat.categorize_by_payee("NETFLIX") == SUBSCRIPTIONS_ID
        assert self.cat.categorize_by_payee("netflix") == SUBSCRIPTIONS_ID


class TestCombinedCategorization:
    def setup_method(self):
        self.cat = Categorizer(RULES_PATH, OVERRIDES_PATH)

    def test_payee_wins_when_no_items(self):
        result = self.cat.categorize_transaction(payee="Netflix", items=[])
        assert result == SUBSCRIPTIONS_ID

    def test_payee_wins_when_items_is_none(self):
        result = self.cat.categorize_transaction(payee="Spotify", items=None)
        assert result == SUBSCRIPTIONS_ID

    def test_no_match_returns_none(self):
        result = self.cat.categorize_transaction(payee="Unknown XYZ", items=[])
        assert result is None


class TestOverrides:
    def test_override_takes_priority(self):
        with tempfile.NamedTemporaryFile(mode='w', suffix='.yaml', delete=False) as f:
            yaml.dump({
                'overrides': [
                    {
                        'pattern': 'costco gas',
                        'category_id': GAS_ID,
                        'note': 'Gas, not Groceries'
                    }
                ]
            }, f)
            override_path = f.name

        cat = Categorizer(RULES_PATH, override_path)
        # Without override, Costco maps to groceries; with override, "costco gas" maps to gas
        assert cat.categorize_transaction(payee="Costco Gas", items=[]) == GAS_ID
        os.unlink(override_path)

    def test_empty_overrides_file(self):
        cat = Categorizer(RULES_PATH, OVERRIDES_PATH)
        # Should work fine even with empty overrides
        assert cat.categorize_by_payee("Netflix") == SUBSCRIPTIONS_ID

    def test_no_overrides_path(self):
        cat = Categorizer(RULES_PATH, None)
        assert cat.categorize_by_payee("Netflix") == SUBSCRIPTIONS_ID
