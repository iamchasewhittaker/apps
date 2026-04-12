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
import sys
from pathlib import Path

from dotenv import load_dotenv
import yaml

# Allow imports from src/
sys.path.insert(0, str(Path(__file__).parent))
load_dotenv()

from ynab_client import YNABClient

# Maps each top-level key in category_rules.yaml to the expected YNAB category name.
# Only needed for entries where the key doesn't match the YNAB name directly.
CATEGORY_NAME_MAP = {
    "Electronics": "Amazon/Online Shopping",  # electronics go to shopping bucket
    "Household": "Amazon/Online Shopping",
    "Clothing": "Amazon/Online Shopping",
    "Books & Media": "Amazon/Online Shopping",
    "Groceries": "Groceries",
    "Health Expenses": "Medical",
    "Personal Care": "Medical",
    "Kids": "Kids Activities",
    "Pets": "Amazon/Online Shopping",
}


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
        print(f"\n{group['name']}")
        for cat in group.get("categories", []):
            if cat.get("hidden") or cat.get("deleted"):
                continue
            print(f"  {cat['name']:<35} {cat['id']}")


def build_name_to_id(groups: list[dict]) -> dict[str, str]:
    """Build a case-insensitive name → id map from all non-hidden categories."""
    mapping = {}
    for group in groups:
        if group.get("deleted"):
            continue
        for cat in group.get("categories", []):
            if cat.get("deleted"):
                continue
            mapping[cat["name"].lower()] = cat["id"]
    return mapping


def update_category_rules(rules_path: Path, name_to_id: dict[str, str]) -> list[str]:
    """
    Rewrite category_id fields in category_rules.yaml using name_to_id lookup.
    Returns list of unmatched rule keys.
    """
    with open(rules_path) as f:
        content = f.read()

    rules = yaml.safe_load(content)
    unmatched = []

    for rule_key in rules:
        target_name = CATEGORY_NAME_MAP.get(rule_key, rule_key)
        matched_id = name_to_id.get(target_name.lower())

        if not matched_id:
            unmatched.append(f"  {rule_key!r} → looking for {target_name!r} (not found)")
            continue

        old_id = rules[rule_key]["category_id"]
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
