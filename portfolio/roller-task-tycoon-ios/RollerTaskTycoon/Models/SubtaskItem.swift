import Foundation
import SwiftData

@Model
final class SubtaskItem {
    var id: UUID
    var text: String
    var sortIndex: Int
    var isDone: Bool
    var parent: ChecklistTaskItem?

    init(text: String, sortIndex: Int, parent: ChecklistTaskItem?) {
        self.id = UUID()
        self.text = text
        self.sortIndex = sortIndex
        self.isDone = false
        self.parent = parent
    }

    init(id: UUID, text: String, sortIndex: Int, isDone: Bool, parent: ChecklistTaskItem?) {
        self.id = id
        self.text = text
        self.sortIndex = sortIndex
        self.isDone = isDone
        self.parent = parent
    }
}
