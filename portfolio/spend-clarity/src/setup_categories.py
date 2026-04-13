"""
setup_categories.py — Fetch categories from YNAB and update category_rules.yaml with correct UUIDs.

Usage:
    python src/setup_categories.py            # Use YNAB_BUDGET_ID from .env
    python src/setup_categories.py --budget <id>  # Override budget ID

After creating categories manually in the YNAB UI, run this script to:
  1. Print all category groups/categories with their UUIDs (for reference)
  2. Auto-update config/category_rules.yaml with the correct category_id values
  3. Report any category_rules.yaml entries that couldn't be matched by name
"""

import argparse
import os
import re
import sys
from pathlib import Path

from dotenv import load_dotenv
import yaml

# Allow imports from src/
sys.path.insert(0, str(Path(__file__).parent))
load_dotenv()

from ynab_client import YNABClient

# Maps each top-level keyword rule key in category_rules.yaml to the expected YNAB category name.
# Uses clean names (no emoji) — strip_emojis() handles matching regardless of emoji presence.
# For categories with duplicate base names across groups, use "GROUP/Category" format.
CATEGORY_NAME_MAP = {
    "Electronics": "Miscellaneous",          # Fun & Entertainment group
    "Household": "Household Goods",          # NEEDS group
    "Clothing": "NEEDS/Clothing",            # Disambiguate from KIDS > Clothing
    "Books & Media": "Books/Media",          # Fun & Entertainment group
    "Groceries": "Groceries",               # GROCERIES group
    "Health Expenses": "Health Expenses",    # Health & Medical group
    "Personal Care": "Personal Care",        # NEEDS group
    "Kids": "KIDS/Miscellaneous",            # Disambiguate from Fun & Entertainment > Miscellaneous
    "Pets": "Pet Food",                      # NEEDS group
}


def strip_emojis(s: str) -> str:
    """Remove emoji and non-Latin characters, collapse whitespace."""
    cleaned = re.sub(r'[^\x00-\u024F]', '', s)
    return re.sub(r'\s+', ' ', cleaned).strip()


def fetch_all_groups(ynab: YNABClient) -> list[dict]:
    """Return raw category groups (with nested categories) from YNAB."""
    import requests
    url = f"https://api.ynab.com/v1/budgets/{ynab.budget_id}/categories"
    resp = requests.get(url, headers=ynab._headers)
    resp.raise_for_status()
    return resp.json()["data"]["category_groups"]


def print_all_categories(groups: list[dict]):
    print("\n=== YNAB Categories ===")
    for group in groups:
        if group.get("hidden") or group.get("deleted"):
            continue
        print(f"\n{strip_emojis(group['name'])}")
        for cat in group.get("categories", []):
            if cat.get("hidden") or cat.get("deleted"):
                continue
            clean = strip_emojis(cat["name"])
            print(f"  {clean:<35} {cat['id']}")


def build_name_to_id(groups: list[dict]) -> dict[str, str]:
    """
    Build a case-insensitive (emoji-stripped) name → id map.
    For duplicate base names across groups, adds "GROUP/Category" entries
    so CATEGORY_NAME_MAP can disambiguate (e.g. "NEEDS/Clothing" vs "KIDS/Clothing").
    """
    # First pass: collect all (clean_name, group_name, id)
    entries: list[tuple[str, str, str]] = []
    for group in groups:
        if group.get("deleted"):
            continue
        clean_group = strip_emojis(group["name"])
        for cat in group.get("categories", []):
            if cat.get("deleted"):
                continue
            clean_cat = strip_emojis(cat["name"])
            entries.append((clean_cat.lower(), clean_group, cat["id"]))

    # Detect duplicates
    from collections import Counter
    name_counts = Counter(name for name, _, _ in entries)

    mapping: dict[str, str] = {}
    for clean_name, clean_group, cat_id in entries:
        mapping[clean_name] = cat_id  # simple name (last write wins for dupes)
        if name_counts[clean_name] > 1:
            # Also add group-qualified key for disambiguation
            qualified = f"{clean_group}/{clean_name}".lower()
            mapping[qualified] = cat_id

    return mapping


def update_category_rules(rules_path: Path, name_to_id: dict[str, str]) -> list[str]:
    """
    Rewrite category_id fields in category_rules.yaml using name_to_id lookup.
    Skips the payee_rules section (those IDs are managed manually).
    Returns list of unmatched rule keys.
    """
    with open(rules_path) as f:
        content = f.read()

    rules = yaml.safe_load(content)
    unmatched = []

    for rule_key, rule_val in rules.items():
        # Skip payee_rules — those are lists, not category dicts
        if rule_key == "payee_rules" or not isinstance(rule_val, dict):
            continue

        target_name = CATEGORY_NAME_MAP.get(rule_key, rule_key)
        matched_id = name_to_id.get(target_name.lower())

        if not matched_id:
            unmatched.append(f"  {rule_key!r} → looking for {target_name!r} (not found)")
            continue

        old_id = rule_val.get("category_id", "")
        if old_id == matched_id:
            continue

        # Replace the UUID in the raw content string (preserves comments/formatting)
        content = content.replace(f'"{old_id}"', f'"{matched_id}"', 1)
        print(f"  Updated {rule_key:<20} → {matched_id}  (was {old_id})")

    with open(rules_path, "w") as f:
        f.write(content)

    return unmatched


def main():
    parser = argparse.ArgumentParser(description="Update category_rules.yaml from YNAB")
    parser.add_argument("--budget", help="YNAB budget ID (overrides .env)")
    args = parser.parse_args()

    api_token = os.getenv("YNAB_API_TOKEN")
    budget_id = args.budget or os.getenv("YNAB_BUDGET_ID")

    if not api_token:
        sys.exit("Error: YNAB_API_TOKEN not set in .env")
    if not budget_id:
        sys.exit("Error: YNAB_BUDGET_ID not set in .env (or pass --budget)")

    ynab = YNABClient(api_token, budget_id)

    print(f"Fetching categories from budget {budget_id}...")
    groups = fetch_all_groups(ynab)
    print_all_categories(groups)

    name_to_id = build_name_to_id(groups)
    rules_path = Path(__file__).parent.parent / "config" / "category_rules.yaml"

    print(f"\n=== Updating {rules_path} ===")
    unmatched = update_category_rules(rules_path, name_to_id)

    if unmatched:
        print("\nWarning — could not auto-match these rules (update category_id manually):")
        for msg in unmatched:
            print(msg)
    else:
        print("All rules matched successfully.")

    print("\nDone. Review config/category_rules.yaml and run:")
    print("  python src/main.py --dry-run")


if __name__ == "__main__":
    main()
