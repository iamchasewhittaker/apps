import Foundation
import Observation
import ClarityUI

/// Main observable store for Clarity Growth.
@Observable @MainActor
final class GrowthStore {

    private(set) var blob: GrowthBlob = .init()

    init() {}

    func load() {
        blob = StorageHelpers.load(GrowthBlob.self, key: GrowthConfig.storeKey) ?? .init()
    }

    func save() {
        _ = StorageHelpers.save(blob, key: GrowthConfig.storeKey)
    }

    func addSession(
        area: String,
        mins: Int,
        note: String,
        milestones: [String],
        backgrounds: [String],
        date: String? = nil
    ) {
        let day = date ?? DateHelpers.dateString(from: .now)
        let clampedMins = max(1, min(mins, 24 * 60))
        let entry = GrowthSessionEntry(
            id: UUID().uuidString,
            area: area,
            mins: clampedMins,
            note: note.trimmingCharacters(in: .whitespacesAndNewlines),
            milestones: milestones,
            backgrounds: backgrounds,
            date: day,
            timestampMs: Int64(Date().timeIntervalSince1970 * 1000)
        )
        blob.sessions.append(entry)
        save()
    }

    func deleteSessions(at offsets: IndexSet, inOrderedLogs logs: [GrowthSessionEntry]) {
        let ids = offsets.map { logs[$0].id }
        blob.sessions.removeAll { ids.contains($0.id) }
        save()
    }

    func streak(for areaId: String) -> Int {
        blob.streakCount(for: areaId, today: DateHelpers.todayString)
    }

    func activeStreakAreasCount(minimumDays: Int = 2) -> Int {
        GrowthCatalog.areas.filter { streak(for: $0.id) >= minimumDays }.count
    }
}
