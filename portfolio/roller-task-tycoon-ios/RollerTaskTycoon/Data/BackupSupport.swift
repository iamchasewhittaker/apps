import Foundation
import SwiftData
import SwiftUI
import UIKit

/// Current backup JSON `schemaVersion` (export and import).
enum BackupFormat {
    static let schemaVersion = 2
}

struct BackupEnvelope: Codable {
    let schemaVersion: Int
    let exportedAt: String
    let cash: Int
    let tasks: [BackupTaskRow]
    /// Present in schema 2; omitted or empty in schema 1 imports.
    let ledger: [BackupLedgerRow]?
}

struct BackupSubtaskRow: Codable {
    let id: String
    let text: String
    let sortIndex: Int
    let isDone: Bool
}

struct BackupTaskRow: Codable {
    let id: String
    let text: String
    let createdAt: String
    /// Schema 1 only.
    let isDone: Bool?
    /// Schema 2 fields (optional for decoding older files).
    let statusRaw: String?
    let zoneRaw: String?
    let staffTypeRaw: String?
    let priorityRaw: String?
    let rewardDollars: Int?
    let dueDate: String?
    let details: String?
    let closedAt: String?
    let subtasks: [BackupSubtaskRow]?
}

struct BackupLedgerRow: Codable {
    let id: String
    let createdAt: String
    let amount: Int
    let taskId: String?
    let note: String
}

enum BackupImportError: LocalizedError, Equatable {
    case invalidJSON
    case unsupportedSchema(Int)
    case invalidTaskUUID(String)
    case invalidTaskDate(id: String)
    case invalidLedgerUUID(String)
    case invalidLedgerDate(id: String)

    var errorDescription: String? {
        switch self {
        case .invalidJSON:
            return "This file isn’t valid RollerTask Tycoon backup JSON."
        case .unsupportedSchema(let v):
            if v > BackupFormat.schemaVersion {
                return "This backup needs a newer version of the app (schema \(v))."
            }
            return "This backup format isn’t supported (schema \(v))."
        case .invalidTaskUUID:
            return "This backup has a task with an invalid id."
        case .invalidTaskDate(let id):
            return "This backup has an invalid date for task \(id)."
        case .invalidLedgerUUID:
            return "This backup has a ledger row with an invalid id."
        case .invalidLedgerDate(let id):
            return "This backup has an invalid date for ledger row \(id)."
        }
    }
}

enum BackupImporter {
    private static let isoParser: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime]
        return f
    }()

    /// Decodes backup data and validates schema and rows. No SwiftData writes.
    static func decodeAndValidate(data: Data) throws -> BackupEnvelope {
        let envelope: BackupEnvelope
        do {
            envelope = try JSONDecoder().decode(BackupEnvelope.self, from: data)
        } catch {
            throw BackupImportError.invalidJSON
        }
        guard envelope.schemaVersion == 1 || envelope.schemaVersion == BackupFormat.schemaVersion else {
            throw BackupImportError.unsupportedSchema(envelope.schemaVersion)
        }
        for row in envelope.tasks {
            guard UUID(uuidString: row.id) != nil else {
                throw BackupImportError.invalidTaskUUID(row.id)
            }
            guard isoParser.date(from: row.createdAt) != nil else {
                throw BackupImportError.invalidTaskDate(id: row.id)
            }
            if envelope.schemaVersion == 1 {
                guard row.isDone != nil else {
                    throw BackupImportError.invalidJSON
                }
            } else {
                guard row.statusRaw != nil else {
                    throw BackupImportError.invalidJSON
                }
            }
            if let subs = row.subtasks {
                for s in subs {
                    guard UUID(uuidString: s.id) != nil else {
                        throw BackupImportError.invalidTaskUUID(s.id)
                    }
                }
            }
        }
        if let ledger = envelope.ledger {
            for row in ledger {
                guard UUID(uuidString: row.id) != nil else {
                    throw BackupImportError.invalidLedgerUUID(row.id)
                }
                guard isoParser.date(from: row.createdAt) != nil else {
                    throw BackupImportError.invalidLedgerDate(id: row.id)
                }
                if let tid = row.taskId {
                    guard UUID(uuidString: tid) != nil else {
                        throw BackupImportError.invalidTaskUUID(tid)
                    }
                }
            }
        }
        return envelope
    }

    static func loadFromFile(url: URL) throws -> BackupEnvelope {
        let accessing = url.startAccessingSecurityScopedResource()
        defer {
            if accessing {
                url.stopAccessingSecurityScopedResource()
            }
        }
        let data = try Data(contentsOf: url)
        return try decodeAndValidate(data: data)
    }
}

enum BackupExporter {
    static func buildEnvelope(cash: Int, items: [ChecklistTaskItem], ledger: [ProfitLedgerEntry]) -> BackupEnvelope {
        let iso = ISO8601DateFormatter()
        iso.formatOptions = [.withInternetDateTime]
        let rows = items.map { item in
            let due = item.dueDate.map { iso.string(from: $0) }
            let closed = item.closedAt.map { iso.string(from: $0) }
            let subs: [BackupSubtaskRow] = item.subtasks
                .sorted { $0.sortIndex < $1.sortIndex }
                .map {
                    BackupSubtaskRow(
                        id: $0.id.uuidString,
                        text: $0.text,
                        sortIndex: $0.sortIndex,
                        isDone: $0.isDone
                    )
                }
            return BackupTaskRow(
                id: item.id.uuidString,
                text: item.text,
                createdAt: iso.string(from: item.createdAt),
                isDone: nil,
                statusRaw: item.statusRaw,
                zoneRaw: item.zoneRaw,
                staffTypeRaw: item.staffTypeRaw,
                priorityRaw: item.priorityRaw,
                rewardDollars: item.rewardDollars,
                dueDate: due,
                details: item.details,
                closedAt: closed,
                subtasks: subs.isEmpty ? nil : subs
            )
        }
        let led = ledger.map { e in
            BackupLedgerRow(
                id: e.id.uuidString,
                createdAt: iso.string(from: e.createdAt),
                amount: e.amount,
                taskId: e.taskId,
                note: e.note
            )
        }
        return BackupEnvelope(
            schemaVersion: BackupFormat.schemaVersion,
            exportedAt: iso.string(from: Date()),
            cash: cash,
            tasks: rows,
            ledger: led
        )
    }

    static func writeJSONFile(envelope: BackupEnvelope) throws -> URL {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        let data = try encoder.encode(envelope)
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        let day = formatter.string(from: Date())
        let name = "RollerTaskTycoon-backup-\(day).json"
        let url = FileManager.default.temporaryDirectory.appendingPathComponent(name)
        try data.write(to: url, options: [.atomic])
        return url
    }
}

struct ActivityShareView: UIViewControllerRepresentable {
    var items: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: items, applicationActivities: nil)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}
