import Foundation
import SwiftData

@Model
final class ChecklistTaskItem {
    var id: UUID
    var text: String
    /// Legacy field — kept for lightweight migration; UI uses `status`.
    var isDone: Bool
    var createdAt: Date

    var statusRaw: String = AttractionStatus.open.rawValue
    var zoneRaw: String = ParkZone.home.rawValue
    var staffTypeRaw: String = StaffRole.janitor.rawValue
    var priorityRaw: String = TaskPriority.medium.rawValue
    var rewardDollars: Int = 5
    var dueDate: Date?
    var details: String = ""
    var closedAt: Date?

    @Relationship(deleteRule: .cascade, inverse: \SubtaskItem.parent)
    var subtasks: [SubtaskItem] = []

    init(text: String) {
        self.id = UUID()
        self.text = text
        self.isDone = false
        self.createdAt = Date()
        self.statusRaw = AttractionStatus.open.rawValue
        self.zoneRaw = ParkZone.home.rawValue
        self.staffTypeRaw = StaffRole.janitor.rawValue
        self.priorityRaw = TaskPriority.medium.rawValue
        self.rewardDollars = 5
        self.details = ""
        self.closedAt = nil
        self.subtasks = []
    }

    /// Restore from backup JSON; preserves id and timestamps.
    init(
        id: UUID,
        text: String,
        isDone: Bool,
        createdAt: Date,
        statusRaw: String,
        zoneRaw: String,
        staffTypeRaw: String,
        priorityRaw: String,
        rewardDollars: Int,
        dueDate: Date?,
        details: String,
        closedAt: Date?
    ) {
        self.id = id
        self.text = text
        self.isDone = isDone
        self.createdAt = createdAt
        self.statusRaw = statusRaw
        self.zoneRaw = zoneRaw
        self.staffTypeRaw = staffTypeRaw
        self.priorityRaw = priorityRaw
        self.rewardDollars = rewardDollars
        self.dueDate = dueDate
        self.details = details
        self.closedAt = closedAt
        self.subtasks = []
    }
}
