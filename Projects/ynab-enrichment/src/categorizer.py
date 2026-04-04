"""
categorizer.py — Keyword-based YNAB category assignment.

Loads category_rules.yaml once and provides case-insensitive keyword
matching against a list of item name strings.
"""

import logging
from typing import Optional

import yaml

log = logging.getLogger(__name__)


class Categorizer:
    def __init__(self, rules_path: str):
        self._rules = self._load(rules_path)

    def _load(self, path: str) -> list[tuple[str, list[str]]]:
        """Returns list of (category_id, [keywords]) tuples."""
        with open(path) as f:
            data = yaml.safe_load(f)

        rules = []
        for category_name, cfg in data.items():
            category_id = (cfg.get("category_id") or "").strip()
            keywords = [kw.lower() for kw in cfg.get("keywords", [])]
            if category_id and keywords:
                rules.append((category_id, keywords))
            elif not category_id:
                log.debug(f"Skipping category '{category_name}' — no category_id set")
        return rules

    def categorize(self, items: list[str]) -> Optional[str]:
        """
        Scan item names against keyword rules.
        Returns the first matching YNAB category_id, or None if no match.
        """
        combined = " ".join(items).lower()
        for category_id, keywords in self._rules:
            for kw in keywords:
                if kw in combined:
                    log.debug(f"Keyword '{kw}' matched category {category_id}")
                    return category_id
        return None
