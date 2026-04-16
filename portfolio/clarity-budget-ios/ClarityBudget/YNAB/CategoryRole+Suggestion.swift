import Foundation

// Ported from Funded `CategorySetupView.suggestRole` — keep keyword tables in sync with web `lib/suggestRole.ts`.

extension CategoryRole {
    /// Heuristic role from YNAB category + group names (not localized).
    static func suggest(categoryName: String, groupName: String) -> CategoryRole {
        let combined = (categoryName + " " + groupName).lowercased()
        let groupOnly = groupName.lowercased()

        let ignoreGroups = ["saving", "savings", "goal", "goals", "investment",
                            "next month", "rainy day"]
        let mortgageGroups = ["mortgage", "housing"]
        let billGroups = ["bill", "bills", "utilities", "utility", "subscription",
                          "subscriptions", "insurance", "debt", "loan", "giving",
                          "tithe", "tithes", "donation", "donations", "fixed"]
        let essentialGroups = ["grocery", "groceries", "health", "medical", "healthcare",
                               "transportation", "transit", "essential", "everyday",
                               "needs", "kids", "children"]
        let flexibleGroups = ["fun", "entertainment", "dining", "eating", "restaurant",
                              "flexible", "discretionary", "gifts", "celebrations",
                              "holiday", "holidays", "wants", "personal", "lifestyle",
                              "career", "development"]

        if ignoreGroups.contains(where: { groupOnly.contains($0) }) { return .ignore }
        if mortgageGroups.contains(where: { groupOnly.contains($0) }) { return .mortgage }
        if billGroups.contains(where: { groupOnly.contains($0) }) { return .bill }
        if essentialGroups.contains(where: { groupOnly.contains($0) }) { return .essential }
        if flexibleGroups.contains(where: { groupOnly.contains($0) }) { return .flexible }

        let mortgageKW = ["mortgage", "hoa", "home loan", "property tax"]
        let billKW = ["electric", "gas", "water", "internet", "phone", "cable",
                      "insurance", "subscription", "netflix", "spotify", "hulu",
                      "streaming", "car payment", "loan", "debt", "wifi", "cellular",
                      "broadband", "amazon prime", "vivint", "utility", "utilities",
                      "tithe", "tithing", "offering", "donation", "giving"]
        let essentialKW = ["groceries", "grocery", "food", "medical", "health",
                           "prescription", "medication", "fuel", "transportation",
                           "transit", "clothing", "household", "childcare", "toiletries",
                           "personal care", "maintenance", "repair", "pharmacy",
                           "doctor", "dentist", "dental", "vision", "baby", "pet"]
        let flexibleKW = ["dining", "restaurant", "eating out", "entertainment",
                          "shopping", "hobbies", "vacation", "travel", "fun", "gifts",
                          "hair", "gym", "fitness", "coffee", "bars", "games", "sports",
                          "birthday", "christmas", "holiday", "books", "media"]

        if mortgageKW.contains(where: { combined.contains($0) }) { return .mortgage }
        if billKW.contains(where: { combined.contains($0) }) { return .bill }
        if essentialKW.contains(where: { combined.contains($0) }) { return .essential }
        if flexibleKW.contains(where: { combined.contains($0) }) { return .flexible }
        return .ignore
    }
}
