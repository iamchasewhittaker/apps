import Foundation
import SwiftData

/// A user-taught categorization rule: when a payee matches `payeeSubstring`,
/// always suggest `ynabCategoryID` first.
///
/// Created automatically when the user assigns a category via AssignCategorySheet.
/// Checked by CategorySuggestionEngine before built-in payeeRules.
@Model
final class CategoryOverride {
    /// Lowercased substring to match against the cleaned payee name.
    var payeeSubstring: String
    /// The YNAB category ID to suggest.
    var ynabCategoryID: String
    /// Human-readable category name for display.
    var ynabCategoryName: String
    /// When this override was created.
    var createdAt: Date

    init(payeeSubstring: String, ynabCategoryID: String, ynabCategoryName: String) {
        self.payeeSubstring = payeeSubstring.lowercased().trimmingCharacters(in: .whitespaces)
        self.ynabCategoryID = ynabCategoryID
        self.ynabCategoryName = ynabCategoryName
        self.createdAt = Date()
    }
}
