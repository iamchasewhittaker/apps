/** Ported from Funded `YnabTab.jsx` / iOS `CategoryRole+Suggestion` — keep in sync. */

export type RoleRaw = "mortgage" | "bill" | "essential" | "flexible" | "ignore";

export function suggestRole(categoryName: string, groupName: string): RoleRaw {
  const combined = (categoryName + " " + groupName).toLowerCase();
  const groupOnly = groupName.toLowerCase();

  const ignoreGroups = ["saving", "savings", "goal", "goals", "investment", "next month", "rainy day"];
  const mortgageGroups = ["mortgage", "housing"];
  const billGroups = [
    "bill",
    "bills",
    "utilities",
    "utility",
    "subscription",
    "subscriptions",
    "insurance",
    "debt",
    "loan",
    "giving",
    "tithe",
    "tithes",
    "donation",
    "donations",
    "fixed",
  ];
  const essentialGroups = [
    "grocery",
    "groceries",
    "health",
    "medical",
    "healthcare",
    "transportation",
    "transit",
    "essential",
    "everyday",
    "needs",
    "kids",
    "children",
  ];
  const flexibleGroups = [
    "fun",
    "entertainment",
    "dining",
    "eating",
    "restaurant",
    "flexible",
    "discretionary",
    "gifts",
    "celebrations",
    "holiday",
    "holidays",
    "wants",
    "personal",
    "lifestyle",
    "career",
    "development",
  ];

  if (ignoreGroups.some((k) => groupOnly.includes(k))) return "ignore";
  if (mortgageGroups.some((k) => groupOnly.includes(k))) return "mortgage";
  if (billGroups.some((k) => groupOnly.includes(k))) return "bill";
  if (essentialGroups.some((k) => groupOnly.includes(k))) return "essential";
  if (flexibleGroups.some((k) => groupOnly.includes(k))) return "flexible";

  const mortgageKW = ["mortgage", "hoa", "home loan", "property tax"];
  const billKW = [
    "electric",
    "gas",
    "water",
    "internet",
    "phone",
    "cable",
    "insurance",
    "subscription",
    "netflix",
    "spotify",
    "hulu",
    "streaming",
    "car payment",
    "loan",
    "debt",
    "wifi",
    "cellular",
    "broadband",
    "amazon prime",
    "vivint",
    "utility",
    "utilities",
    "tithe",
    "tithing",
    "offering",
    "donation",
    "giving",
  ];
  const essentialKW = [
    "groceries",
    "grocery",
    "food",
    "medical",
    "health",
    "prescription",
    "medication",
    "fuel",
    "transportation",
    "transit",
    "clothing",
    "household",
    "childcare",
    "toiletries",
    "personal care",
    "maintenance",
    "repair",
    "pharmacy",
    "doctor",
    "dentist",
    "dental",
    "vision",
    "baby",
    "pet",
  ];
  const flexibleKW = [
    "dining",
    "restaurant",
    "eating out",
    "entertainment",
    "shopping",
    "hobbies",
    "vacation",
    "travel",
    "fun",
    "gifts",
    "hair",
    "gym",
    "fitness",
    "coffee",
    "bars",
    "games",
    "sports",
    "birthday",
    "christmas",
    "holiday",
    "books",
    "media",
  ];

  if (mortgageKW.some((k) => combined.includes(k))) return "mortgage";
  if (billKW.some((k) => combined.includes(k))) return "bill";
  if (essentialKW.some((k) => combined.includes(k))) return "essential";
  if (flexibleKW.some((k) => combined.includes(k))) return "flexible";
  return "ignore";
}
