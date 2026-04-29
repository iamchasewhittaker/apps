import Foundation
import SwiftData

enum ParkDataImport {
    private static let isoParser: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime]
        return f
    }()

    /// Replaces all attractions and ledger entries with backup contents. Returns cash from envelope.
    static func replaceAll(envelope: BackupEnvelope, modelContext: ModelContext) throws -> Int {
        let iso = isoParser

        let existingTasks = try modelContext.fetch(FetchDescriptor<ChecklistTaskItem>())
        for t in existingTasks { modelContext.delete(t) }

        let existingLedger = try modelContext.fetch(FetchDescriptor<ProfitLedgerEntry>())
        for e in existingLedger { modelContext.delete(e) }

        for row in envelope.tasks {
            guard let id = UUID(uuidString: row.id),
                  let created = iso.date(from: row.createdAt) else { continue }

            let statusRaw = AttractionStatus(rawValue: row.statusRaw ?? "")?.rawValue ?? AttractionStatus.open.rawValue
            let isClosed = statusRaw == AttractionStatus.closed.rawValue
            let closedAt: Date?
            if let cs = row.closedAt, let d = iso.date(from: cs) {
                closedAt = d
            } else {
                closedAt = isClosed ? created : nil
            }

            let item = ChecklistTaskItem(
                id: id,
                text: row.text,
                createdAt: created,
                statusRaw: statusRaw,
                zoneRaw: ParkZone(rawValue: row.zoneRaw ?? "")?.rawValue ?? ParkZone.home.rawValue,
                staffTypeRaw: StaffRole(rawValue: row.staffTypeRaw ?? "")?.rawValue ?? StaffRole.janitor.rawValue,
                priorityRaw: TaskPriority(rawValue: row.priorityRaw ?? "")?.rawValue ?? TaskPriority.medium.rawValue,
                rewardDollars: row.rewardDollars ?? 5,
                dueDate: row.dueDate.flatMap { iso.date(from: $0) },
                details: row.details ?? "",
                closedAt: closedAt
            )
            modelContext.insert(item)

            for srow in row.subtasks ?? [] {
                let sub = SubtaskItem(text: srow.text, sortOrder: srow.sortOrder)
                sub.isDone = srow.isDone
                if let sid = UUID(uuidString: srow.id) { sub.id = sid }
                if let sd = iso.date(from: srow.createdAt) { sub.createdAt = sd }
                sub.task = item
                modelContext.insert(sub)
            }
        }

        if let rows = envelope.ledger {
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
