import Foundation
import SwiftData
import SwiftUI
import UIKit

private let backupSchemaVersion = 1

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
            schemaVersion: backupSchemaVersion,
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
        let name = "ParkChecklist-backup-\(day).json"
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
