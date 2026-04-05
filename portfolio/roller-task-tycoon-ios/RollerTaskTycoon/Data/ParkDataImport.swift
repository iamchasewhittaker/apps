import Foundation
import SwiftData

enum ParkDataImport {
    private static let isoParser: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime]
        return f
    }()

    /// Replaces all attractions, subtasks, and ledger with backup contents. Returns cash from envelope.
    static func replaceAll(envelope: BackupEnvelope, modelContext: ModelContext) throws -> Int {
        let iso = isoParser
        let existingTasks = try modelContext.fetch(FetchDescriptor<ChecklistTaskItem>())
        for t in existingTasks {
            modelContext.delete(t)
        }
        let existingLedger = try modelContext.fetch(FetchDescriptor<ProfitLedgerEntry>())
        for e in existingLedger {
            modelContext.delete(e)
        }

        for row in envelope.tasks {
            guard let id = UUID(uuidString: row.id),
                  let created = iso.date(from: row.createdAt) else { continue }

            let statusRaw: String
            let closedAt: Date?
            let isDone: Bool
            if envelope.schemaVersion == 1 {
                let done = row.isDone ?? false
                isDone = done
                statusRaw = done ? AttractionStatus.closed.rawValue : AttractionStatus.open.rawValue
                closedAt = done ? created : nil
            } else {
                statusRaw = AttractionStatus(rawValue: row.statusRaw ?? "")?.rawValue ?? AttractionStatus.open.rawValue
                isDone = (statusRaw == AttractionStatus.closed.rawValue)
                if let cs = row.closedAt, let d = iso.date(from: cs) {
                    closedAt = d
                } else {
                    closedAt = isDone ? created : nil
                }
            }

            let zoneRaw = ParkZone(rawValue: row.zoneRaw ?? "")?.rawValue ?? ParkZone.home.rawValue
            let staffRaw = StaffRole(rawValue: row.staffTypeRaw ?? "")?.rawValue ?? StaffRole.janitor.rawValue
            let priRaw = TaskPriority(rawValue: row.priorityRaw ?? "")?.rawValue ?? TaskPriority.medium.rawValue
            let reward = row.rewardDollars ?? 5
            let details = row.details ?? ""
            var due: Date?
            if let ds = row.dueDate, let d = iso.date(from: ds) {
                due = d
            }

            let item = ChecklistTaskItem(
                id: id,
                text: row.text,
                isDone: isDone,
                createdAt: created,
                statusRaw: statusRaw,
                zoneRaw: zoneRaw,
                staffTypeRaw: staffRaw,
                priorityRaw: priRaw,
                rewardDollars: reward,
                dueDate: due,
                details: details,
                closedAt: closedAt
            )
            modelContext.insert(item)

            if let subs = row.subtasks {
                for s in subs {
                    guard let sid = UUID(uuidString: s.id) else { continue }
                    let sub = SubtaskItem(id: sid, text: s.text, sortIndex: s.sortIndex, isDone: s.isDone, parent: item)
                    modelContext.insert(sub)
                    item.subtasks.append(sub)
                }
            }
        }

        if envelope.schemaVersion >= 2, let rows = envelope.ledger {
            for row in rows {
                guard let id = UUID(uuidString: row.id),
                      let created = iso.date(from: row.createdAt) else { continue }
                let entry = ProfitLedgerEntry(
                    id: id,
                    createdAt: created,
                    amount: row.amount,
                    taskId: row.taskId,
                    note: row.note
                )
                modelContext.insert(entry)
            }
        }

        try modelContext.save()
        return max(0, envelope.cash)
    }
}
