import Foundation

// MARK: - CategorySuggestion

struct CategorySuggestion: Identifiable {
    let id = UUID()
    /// The user's mapped category to assign.
    let mapping: CategoryMapping
    /// Match confidence (0.0–1.0). 1.0 = user override, 0.9 = keyword hit, 0.3 = fallback flexible.
    let confidence: Double
    /// The keyword that triggered this match (empty string for fallback suggestions).
    let matchedKeyword: String
}

// MARK: - CategorySuggestionEngine
// Pure enum — no state, no SwiftUI imports.
// Input: a YNAB transaction + user's CategoryMapping list + learned CategoryOverride list.
// Output: ranked suggestions from the user's own mapped categories.

enum CategorySuggestionEngine {

    // (lowercased payee substring, inferred role)
    private static let payeeRules: [(pattern: String, role: CategoryRole)] = [
        // Streaming / subscriptions → bill
        ("netflix", .bill),
        ("spotify", .bill),
        ("hulu", .bill),
        ("disney+", .bill),
        ("disneyplus", .bill),
        ("youtube", .bill),
        ("apple.com/bill", .bill),
        ("itunes", .bill),
        ("amazon prime", .bill),
        ("siriusxm", .bill),
        ("peacock", .bill),
        ("paramount", .bill),
        ("max.com", .bill),
        ("vivint", .bill),
        ("burn boot camp", .bill),
        ("planet fitness", .bill),
        ("anytime fitness", .bill),
        ("macrofactor", .bill),
        ("oura", .bill),
        ("grammarly", .bill),
        ("backblaze", .bill),
        ("1password", .bill),
        ("evernote", .bill),
        ("sunsama", .bill),

        // Insurance / utilities → bill
        ("geico", .bill),
        ("progressive", .bill),
        ("state farm", .bill),
        ("allstate", .bill),
        ("safeco", .bill),
        ("nationwide", .bill),
        ("liberty mutual", .bill),
        ("xfinity", .bill),
        ("comcast", .bill),
        ("spectrum", .bill),
        ("at&t", .bill),
        ("verizon", .bill),
        ("t-mobile", .bill),

        // Groceries / essentials → essential
        ("whole foods", .essential),
        ("costco", .essential),
        ("walmart", .essential),
        ("kroger", .essential),
        ("safeway", .essential),
        ("publix", .essential),
        ("trader joe", .essential),
        ("aldi", .essential),
        ("h-e-b", .essential),
        ("wegmans", .essential),
        ("sprouts", .essential),

        // Gas → essential
        ("chevron", .essential),
        ("shell", .essential),
        ("bp ", .essential),
        ("exxon", .essential),
        ("speedway", .essential),
        ("circle k", .essential),
        ("quiktrip", .essential),
        ("quik trip", .essential),
        ("wawa", .essential),
        ("sheetz", .essential),

        // Pharmacy → essential
        ("walgreens", .essential),
        ("cvs", .essential),
        ("rite aid", .essential),

        // Dining / shopping / rideshare → flexible
        ("amazon", .flexible),
        ("target", .flexible),
        ("doordash", .flexible),
        ("uber eats", .flexible),
        ("grubhub", .flexible),
        ("instacart", .flexible),
        ("mcdonald", .flexible),
        ("starbucks", .flexible),
        ("chipotle", .flexible),
        ("chick-fil-a", .flexible),
        ("wendy", .flexible),
        ("taco bell", .flexible),
        ("panera", .flexible),
        ("subway", .flexible),
        ("olive garden", .flexible),
        ("five guys", .flexible),
        ("popeyes", .flexible),
        ("panda express", .flexible),
        ("pizza hut", .flexible),
        ("domino", .flexible),
        ("dutch bros", .flexible),
        ("dunkin", .flexible),
        ("best buy", .flexible),
        ("home depot", .flexible),
        ("lowe", .flexible),
        ("ace hardware", .flexible),
        ("venmo", .flexible),
        ("paypal", .flexible),
        ("zelle", .flexible),
        ("square", .flexible),
        ("uber", .flexible),
        ("lyft", .flexible),
    ]

    // MARK: - Public API

    /// Returns ranked category suggestions for a transaction.
    ///
    /// Priority:
    ///   1. User's learned overrides (CategoryOverride) — confidence 1.0
    ///   2. Built-in payee keyword rules — confidence 0.9
    ///   3. Fallback: all mapped flexible categories — confidence 0.3
    static func suggest(
        for transaction: YNABTransaction,
        from mappings: [CategoryMapping],
        overrides: [CategoryOverride] = []
    ) -> [CategorySuggestion] {
        guard let payee = transaction.payeeName?.lowercased(), !payee.isEmpty else { return [] }

        // 1. User overrides — highest priority
        for override in overrides {
            let sub = override.payeeSubstring.lowercased()
            guard !sub.isEmpty, payee.contains(sub) else { continue }
            let matches = mappings
                .filter { $0.ynabCategoryID == override.ynabCategoryID }
                .map { CategorySuggestion(mapping: $0, confidence: 1.0, matchedKeyword: sub) }
            if !matches.isEmpty {
                return matches
            }
        }

        // 2. Built-in payee rules
        for (pattern, role) in payeeRules where payee.contains(pattern) {
            let matches = mappings
                .filter { $0.role == role }
                .sorted { $0.ynabCategoryName < $1.ynabCategoryName }
                .map { CategorySuggestion(mapping: $0, confidence: 0.9, matchedKeyword: pattern) }
            if !matches.isEmpty { return matches }
        }

        // 3. Fallback: all flexible categories
        return mappings
            .filter { $0.role == .flexible }
            .sorted { $0.ynabCategoryName < $1.ynabCategoryName }
            .map { CategorySuggestion(mapping: $0, confidence: 0.3, matchedKeyword: "") }
    }

    /// True when a transaction needs category review — nil or "Uncategorized".
    static func needsReview(_ transaction: YNABTransaction) -> Bool {
        guard !transaction.deleted, !transaction.isTransfer else { return false }
        guard transaction.amountDollars < 0 else { return false } // only outflows
        let name = transaction.categoryName ?? ""
        return name.isEmpty || name.lowercased() == "uncategorized"
    }
}
