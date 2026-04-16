import Foundation
import SwiftData

/// Local metadata for a YNAB transaction after the user confirms categorization in Funded.
/// YNAB memo holds the combined notes line; this model keeps structured fields for review and future UI.
@Model
final class TransactionMetadata {
    @Attribute(.unique) var ynabTransactionID: String
    var purchaserName: String
    /// True = necessary household spend; false = discretionary.
    var isNecessary: Bool
    var updatedAt: Date

    init(
        ynabTransactionID: String,
        purchaserName: String = "",
        isNecessary: Bool = true,
        updatedAt: Date = Date()
    ) {
        self.ynabTransactionID = ynabTransactionID
        self.purchaserName = purchaserName
        self.isNecessary = isNecessary
        self.updatedAt = updatedAt
    }
}
