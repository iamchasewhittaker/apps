/**
 * Mirrors Funded iOS CategorySuggestionEngine — payee keyword → role → mapped categories.
 * @param {object} transaction — mapped YNAB transaction (amount in milliunits)
 * @param {Array<{ynabCategoryID, ynabCategoryName, ynabGroupName, roleRaw}>} mappings
 * @param {Array<{payeeSubstring, ynabCategoryID, ynabCategoryName}>} overrides
 */

const PAYEE_RULES = [
  ["netflix", "bill"],
  ["spotify", "bill"],
  ["hulu", "bill"],
  ["disney+", "bill"],
  ["disneyplus", "bill"],
  ["youtube", "bill"],
  ["apple.com/bill", "bill"],
  ["itunes", "bill"],
  ["amazon prime", "bill"],
  ["siriusxm", "bill"],
  ["peacock", "bill"],
  ["paramount", "bill"],
  ["max.com", "bill"],
  ["vivint", "bill"],
  ["burn boot camp", "bill"],
  ["planet fitness", "bill"],
  ["anytime fitness", "bill"],
  ["macrofactor", "bill"],
  ["oura", "bill"],
  ["grammarly", "bill"],
  ["backblaze", "bill"],
  ["1password", "bill"],
  ["evernote", "bill"],
  ["sunsama", "bill"],
  ["geico", "bill"],
  ["progressive", "bill"],
  ["state farm", "bill"],
  ["allstate", "bill"],
  ["safeco", "bill"],
  ["nationwide", "bill"],
  ["liberty mutual", "bill"],
  ["xfinity", "bill"],
  ["comcast", "bill"],
  ["spectrum", "bill"],
  ["at&t", "bill"],
  ["verizon", "bill"],
  ["t-mobile", "bill"],
  ["whole foods", "essential"],
  ["costco", "essential"],
  ["walmart", "essential"],
  ["kroger", "essential"],
  ["safeway", "essential"],
  ["publix", "essential"],
  ["trader joe", "essential"],
  ["aldi", "essential"],
  ["h-e-b", "essential"],
  ["wegmans", "essential"],
  ["sprouts", "essential"],
  ["chevron", "essential"],
  ["shell", "essential"],
  ["bp ", "essential"],
  ["exxon", "essential"],
  ["speedway", "essential"],
  ["circle k", "essential"],
  ["quiktrip", "essential"],
  ["quik trip", "essential"],
  ["wawa", "essential"],
  ["sheetz", "essential"],
  ["walgreens", "essential"],
  ["cvs", "essential"],
  ["rite aid", "essential"],
  ["amazon", "flexible"],
  ["target", "flexible"],
  ["doordash", "flexible"],
  ["uber eats", "flexible"],
  ["grubhub", "flexible"],
  ["instacart", "flexible"],
  ["mcdonald", "flexible"],
  ["starbucks", "flexible"],
  ["chipotle", "flexible"],
  ["chick-fil-a", "flexible"],
  ["wendy", "flexible"],
  ["taco bell", "flexible"],
  ["panera", "flexible"],
  ["subway", "flexible"],
  ["olive garden", "flexible"],
  ["five guys", "flexible"],
  ["popeyes", "flexible"],
  ["panda express", "flexible"],
  ["pizza hut", "flexible"],
  ["domino", "flexible"],
  ["dutch bros", "flexible"],
  ["dunkin", "flexible"],
  ["best buy", "flexible"],
  ["home depot", "flexible"],
  ["lowe", "flexible"],
  ["ace hardware", "flexible"],
  ["venmo", "flexible"],
  ["paypal", "flexible"],
  ["zelle", "flexible"],
  ["square", "flexible"],
  ["uber", "flexible"],
  ["lyft", "flexible"],
];

export function transactionNeedsReview(t) {
  if (t.deleted || t.transferAccountId) return false;
  if (t.amount >= 0) return false;
  const name = (t.categoryName || "").trim();
  return !name || name.toLowerCase() === "uncategorized";
}

export function suggestForTransaction(transaction, mappings, overrides = []) {
  const payee = (transaction.payeeName || "").toLowerCase();
  if (!payee) return [];

  const byRole = (role) =>
    mappings
      .filter((m) => m.roleRaw === role && m.roleRaw !== "ignore")
      .sort((a, b) => a.ynabCategoryName.localeCompare(b.ynabCategoryName));

  for (const o of overrides) {
    const sub = (o.payeeSubstring || "").toLowerCase();
    if (!sub || !payee.includes(sub)) continue;
    const matches = mappings.filter((m) => m.ynabCategoryID === o.ynabCategoryID).map((mapping) => ({
      mapping,
      confidence: 1,
      matchedKeyword: sub,
    }));
    if (matches.length) return matches;
  }

  for (const [pattern, role] of PAYEE_RULES) {
    if (!payee.includes(pattern)) continue;
    const matches = byRole(role).map((mapping) => ({
      mapping,
      confidence: 0.9,
      matchedKeyword: pattern,
    }));
    if (matches.length) return matches;
  }

  return byRole("flexible").map((mapping) => ({
    mapping,
    confidence: 0.3,
    matchedKeyword: "",
  }));
}
