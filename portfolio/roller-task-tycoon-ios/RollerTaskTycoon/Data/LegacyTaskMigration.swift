import Foundation
import SwiftData

/// One-time migration from legacy `isDone` to `statusRaw` / `closedAt`.
enum LegacyTaskMigration {
    private static let key = "chase_roller_task_tycoon_ios_migrated_v2_fields"

    static func runIfNeeded(context: ModelContext) {
        let d = UserDefaults.standard
        guard !d.bool(forKey: key) else { return }
        let desc = FetchDescriptor<ChecklistTaskItem>()
        guard let items = try? context.fetch(desc) else {
            d.set(true, forKey: key)
            return
        }
        for item in items {
            item.status = item.isDone ? .closed : .open
            if item.isDone, item.closedAt == nil {
                item.closedAt = item.createdAt
            }
            item.isDone = (item.status == .closed)
        }
        try? context.save()
        d.set(true, forKey: key)
    }
}
