import Foundation
import SwiftData

@Model
final class ProfitLedgerEntry {
    var id: UUID
    var createdAt: Date
    /// Profit in whole dollars (park dollars).
    var amount: Int
    /// Source task id when tied to an attraction; nil for manual entries.
    var taskId: String?
    var note: String

    init(amount: Int, taskId: UUID?, note: String, createdAt: Date = Date()) {
        self.id = UUID()
        self.createdAt = createdAt
        self.amount = max(0, amount)
        self.taskId = taskId?.uuidString
        self.note = note
    }

    init(id: UUID, createdAt: Date, amount: Int, taskId: String?, note: String) {
        self.id = id
        self.createdAt = createdAt
        self.amount = max(0, amount)
        self.taskId = taskId
        self.note = note
    }
}
