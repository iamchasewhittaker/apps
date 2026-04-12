import Foundation

// MARK: - CategorySuggestion

struct CategorySuggestion: Identifiable {
    let id = UUID()
    /// The user's mapped category to assign.
    let mapping: CategoryMapping
    /// Match confidence (0.0–1.0). 0.9 = keyword hit, 0.3 = fallback flexible.
    let confidence: Double
    /// The keyword that triggered this match (empty string for fallback suggestions).
    let matchedKeyword: String
}

// MARK: - CategorySuggestionEngine
// Pure enum — no state, no SwiftUI imports.
// Input: a YNAB transaction + user's CategoryMapping list.
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
        // Insurance / utilities → bill
        ("geico", .bill),
        ("progressive", .bill),
        ("state farm", .bill),
        ("allstate", .bill),
        ("safeco", .bill),
        ("xfinity", .bill),
        ("comcast", .bill),
        ("spectrum", .bill),
        ("at&t", .bill),
        ("verizon", .bill),
        ("t-mobile", .bill),
        // Groceries / fuel → essential
        ("whole foods", .essential),
        ("costco", .essential),
        ("walmart", .essential),
        ("kroger", .essential),
        ("safeway", .essential),
        ("publix", .essential),
        ("trader joe", .essential),
        ("aldi", .essential),
        ("chevron", .essential),
        ("shell", .essential),
        ("bp", .essential),
        ("exxon", .essential),
        ("speedway", .essential),
        ("circle k", .essential),
        // Dining / shopping → flexible
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
        ("venmo", .flexible),
        ("paypal", .flexible),
        ("zelle", .flexible),
        ("square", .flexible),
    ]

    /// Returns ranked category suggestions for a transaction.
    /// Checks payee name against keyword rules; falls back to flexible categories.
    /// Returns empty array if the transaction already has a valid category assigned.
    static func suggest(
        for transaction: YNABTransaction,
        from mappings: [CategoryMapping]
    ) -> [CategorySuggestion] {
        guard let payee = transaction.payeeName?.lowercased(), !payee.isEmpty else { return [] }

        for (pattern, role) in payeeRules where payee.contains(pattern) {
            let matches = mappings
                .filter { $0.role == role }
                .sorted { $0.ynabCategoryName < $1.ynabCategoryName }
                .map { CategorySuggestion(mapping: $0, confidence: 0.9, matchedKeyword: pattern) }
            if !matches.isEmpty { return matches }
        }

        // Fallback: offer flexible categories as low-confidence options (all mapped flexibles).
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
