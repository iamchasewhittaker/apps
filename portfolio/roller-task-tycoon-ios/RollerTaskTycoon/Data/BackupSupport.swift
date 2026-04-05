import Foundation
import SwiftData
import SwiftUI
import UIKit

/// Current backup JSON `schemaVersion` (export and import).
enum BackupFormat {
    static let schemaVersion = 1
}

struct BackupEnvelope: Codable {
    let schemaVersion: Int
    let exportedAt: String
    let cash: Int
    let tasks: [BackupTaskRow]
}

struct BackupTaskRow: Codable {
    let id: String
    let text: String
    let isDone: Bool
    let createdAt: String
}

enum BackupImportError: LocalizedError, Equatable {
    case invalidJSON
    case unsupportedSchema(Int)
    case invalidTaskUUID(String)
    case invalidTaskDate(id: String)

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
        }
    }
}

enum BackupImporter {
    private static let isoParser: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime]
        return f
    }()

    /// Decodes backup data and validates schema and task rows. No SwiftData writes.
    static func decodeAndValidate(data: Data) throws -> BackupEnvelope {
        let envelope: BackupEnvelope
        do {
            envelope = try JSONDecoder().decode(BackupEnvelope.self, from: data)
        } catch {
            throw BackupImportError.invalidJSON
        }
        guard envelope.schemaVersion == BackupFormat.schemaVersion else {
            throw BackupImportError.unsupportedSchema(envelope.schemaVersion)
        }
        for row in envelope.tasks {
            guard UUID(uuidString: row.id) != nil else {
                throw BackupImportError.invalidTaskUUID(row.id)
            }
            guard isoParser.date(from: row.createdAt) != nil else {
                throw BackupImportError.invalidTaskDate(id: row.id)
            }
        }
        return envelope
    }

    /// Reads file URL (security-scoped when needed) and returns validated envelope.
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
    static func buildEnvelope(cash: Int, items: [ChecklistTaskItem]) -> BackupEnvelope {
        let iso = ISO8601DateFormatter()
        iso.formatOptions = [.withInternetDateTime]
        let rows = items.map { item in
            BackupTaskRow(
                id: item.id.uuidString,
                text: item.text,
                isDone: item.isDone,
                createdAt: iso.string(from: item.createdAt)
            )
        }
        return BackupEnvelope(
            schemaVersion: BackupFormat.schemaVersion,
            exportedAt: iso.string(from: Date()),
            cash: cash,
            tasks: rows
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
