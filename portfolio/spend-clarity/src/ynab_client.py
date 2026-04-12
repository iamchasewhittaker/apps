"""
ynab_client.py — YNAB REST API wrapper.

Docs: https://api.ynab.com/v1
"""

import logging
from datetime import date
from typing import Optional

import requests

log = logging.getLogger(__name__)

BASE_URL = "https://api.ynab.com/v1"
BATCH_SIZE = 100


class YNABClient:
    def __init__(self, api_token: str, budget_id: str):
        if not api_token:
            raise ValueError("YNAB_API_TOKEN is not set")
        if not budget_id:
            raise ValueError("YNAB_BUDGET_ID is not set")
        self.budget_id = budget_id
        self._headers = {
            "Authorization": f"Bearer {api_token}",
            "Content-Type": "application/json",
        }

    def get_transactions(self, since_date: date) -> list[dict]:
        """
        Fetch all transactions since `since_date` where memo is blank.
        Returns list of raw YNAB transaction dicts.
        """
        url = f"{BASE_URL}/budgets/{self.budget_id}/transactions"
        params = {"since_date": since_date.isoformat()}

        log.debug(f"GET {url} since={since_date}")
        resp = requests.get(url, headers=self._headers, params=params)
        resp.raise_for_status()

        transactions = resp.json()["data"]["transactions"]
        log.info(f"  YNAB returned {len(transactions)} total transactions")

        # Filter to blank memos only — never overwrite existing memos
        blank_memo = [t for t in transactions if not (t.get("memo") or "").strip()]
        log.info(f"  {len(blank_memo)} have blank memos")
        return blank_memo

    def bulk_update(self, updates: list[dict]):
        """
        Write memo (and optionally category_id) to YNAB in batches of BATCH_SIZE.
        Each item in updates: {"id": str, "memo": str, "category_id"?: str}
        """
        url = f"{BASE_URL}/budgets/{self.budget_id}/transactions"

        for i in range(0, len(updates), BATCH_SIZE):
            batch = updates[i : i + BATCH_SIZE]
            payload = {"transactions": batch}

            log.debug(f"PATCH {url} batch {i // BATCH_SIZE + 1} ({len(batch)} txns)")
            resp = requests.patch(url, headers=self._headers, json=payload)
            resp.raise_for_status()
            log.info(f"  Wrote batch of {len(batch)} transactions to YNAB")

    def get_categories(self) -> list[dict]:
        """Return all category groups and their categories."""
        url = f"{BASE_URL}/budgets/{self.budget_id}/categories"
        resp = requests.get(url, headers=self._headers)
        resp.raise_for_status()
        groups = resp.json()["data"]["category_groups"]
        categories = []
        for group in groups:
            categories.extend(group.get("categories", []))
        return categories
