import Foundation
import SwiftData

@Model
final class SubtaskItem {
    var id: UUID = UUID()
    var text: String = ""
    var isDone: Bool = false
    var sortOrder: Int = 0
    var createdAt: Date = Date()
    var task: ChecklistTaskItem?

    init(text: String, sortOrder: Int = 0) {
        self.id = UUID()
        self.text = text
        self.isDone = false
        self.sortOrder = sortOrder
        self.createdAt = Date()
    }
}
