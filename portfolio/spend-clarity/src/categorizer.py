"""
categorizer.py — Multi-tier YNAB category assignment.

Priority order (first match wins):
  1. User overrides     (config/category_overrides.yaml) — highest priority
  2. Payee rules        (category_rules.yaml > payee_rules) — known merchants
  3. Item keyword rules (category_rules.yaml > keyword sections) — receipt items
"""

import logging
import re
from pathlib import Path
from typing import Optional

import yaml

log = logging.getLogger(__name__)


class Categorizer:
    def __init__(self, rules_path: str, overrides_path: Optional[str] = None):
        self._keyword_rules = self._load_keyword_rules(rules_path)
        self._payee_rules = self._load_payee_rules(rules_path)
        self._overrides = self._load_overrides(overrides_path) if overrides_path else []

    # ------------------------------------------------------------------
    # Loaders
    # ------------------------------------------------------------------

    def _load_keyword_rules(self, path: str) -> list[tuple[str, list[str]]]:
        """Returns list of (category_id, [keywords]) for keyword sections."""
        with open(path) as f:
            data = yaml.safe_load(f)

        rules = []
        for key, cfg in data.items():
            if key == "payee_rules" or not isinstance(cfg, dict):
                continue
            category_id = (cfg.get("category_id") or "").strip()
            keywords = [kw.lower() for kw in cfg.get("keywords", [])]
            if category_id and keywords:
                rules.append((category_id, keywords))
            elif not category_id:
                log.debug(f"Skipping keyword rule '{key}' — no category_id set")
        return rules

    def _load_payee_rules(self, path: str) -> list[tuple[str, list[str]]]:
        """Returns list of (category_id, [patterns]) for payee_rules section."""
        with open(path) as f:
            data = yaml.safe_load(f)

        rules = []
        payee_section = data.get("payee_rules", [])
        if not isinstance(payee_section, list):
            return rules

        for entry in payee_section:
            category_id = (entry.get("category_id") or "").strip()
            patterns = [p.lower() for p in entry.get("patterns", [])]
            if category_id and patterns:
                rules.append((category_id, patterns))
        return rules

    def _load_overrides(self, path: str) -> list[tuple[str, str]]:
        """Returns list of (pattern, category_id) from overrides file."""
        p = Path(path)
        if not p.exists():
            return []
        with open(p) as f:
            data = yaml.safe_load(f)
        overrides = []
        for entry in (data.get("overrides") or []):
            pattern = (entry.get("pattern") or "").lower().strip()
            category_id = (entry.get("category_id") or "").strip()
            if pattern and category_id:
                overrides.append((pattern, category_id))
                log.debug(f"Loaded override: '{pattern}' → {category_id}")
        return overrides

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def categorize_by_payee(self, payee: str) -> Optional[str]:
        """
        Match a (cleaned) payee name against payee_rules.
        Returns first matching YNAB category_id, or None.
        """
        lower = payee.lower()
        for category_id, patterns in self._payee_rules:
            for pat in patterns:
                if pat in lower:
                    log.debug(f"Payee pattern '{pat}' matched category {category_id}")
                    return category_id
        return None

    def categorize(self, items: list[str]) -> Optional[str]:
        """
        Match item names against keyword rules (receipt-based).
        Returns first matching YNAB category_id, or None.
        """
        combined = " ".join(items).lower()
        for category_id, keywords in self._keyword_rules:
            for kw in keywords:
                if kw in combined:
                    log.debug(f"Keyword '{kw}' matched category {category_id}")
                    return category_id
        return None

    def categorize_transaction(self, payee: str, items: Optional[list[str]] = None) -> Optional[str]:
        """
        Full categorization pipeline. Priority:
          1. User overrides (exact payee substring match)
          2. Payee rules
          3. Item keyword rules (if items provided)

        Args:
            payee: Cleaned payee name (from display_payee()).
            items: Optional list of item names from receipt parsing.

        Returns:
            YNAB category_id string, or None if no match.
        """
        lower = payee.lower()

        # 1. User overrides
        for pattern, category_id in self._overrides:
            if pattern in lower:
                log.debug(f"Override '{pattern}' matched for payee '{payee}' → {category_id}")
                return category_id

        # 2. Payee rules
        result = self.categorize_by_payee(payee)
        if result:
            return result

        # 3. Item keyword rules
        if items:
            result = self.categorize(items)
            if result:
                return result

        return None

    def configured_category_ids(self) -> set[str]:
        """
        Return all category IDs configured in payee rules, keyword rules, and overrides.
        Used for startup validation against live YNAB categories.
        """
        ids = {category_id for category_id, _ in self._keyword_rules}
        ids.update(category_id for category_id, _ in self._payee_rules)
        ids.update(category_id for _, category_id in self._overrides)
        return ids
