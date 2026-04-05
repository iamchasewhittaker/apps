import Foundation
import SwiftData

@Model
final class ChecklistTaskItem {
    var id: UUID
    var text: String
    var isDone: Bool
    var createdAt: Date

    init(text: String) {
        self.id = UUID()
        self.text = text
        self.isDone = false
        self.createdAt = Date()
    }

    /// Restore from backup JSON (`BackupTaskRow`); preserves id and timestamps.
    init(id: UUID, text: String, isDone: Bool, createdAt: Date) {
        self.id = id
        self.text = text
        self.isDone = isDone
        self.createdAt = createdAt
    }
}
