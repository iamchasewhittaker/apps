import Foundation
import Observation
import ClarityUI

/// Main observable store for Clarity Triage.
/// All views receive this via @Environment(TriageStore.self).
@Observable @MainActor
final class TriageStore {

    // MARK: - Persisted state

    private(set) var blob: TriageBlob = .init()

    // MARK: - UI state

    var showFitOnly: Bool = true

    // MARK: - Lifecycle

    nonisolated init() {}

    func load() {
        blob = StorageHelpers.load(TriageBlob.self, key: TriageConfig.storeKey) ?? .init()
        resetCapacityIfNeeded()
    }

    func save() {
        _ = StorageHelpers.save(blob, key: TriageConfig.storeKey)
    }

    // MARK: - Capacity

    var capacity: Int { blob.capacity }
    var capacitySlots: Int { TriageConfig.slots(for: blob.capacity) }

    var activeTasks: [TriageTask] {
        blob.tasks.filter { !$0.isComplete }
    }

    var slotsUsed: Int {
        activeTasks.reduce(0) { $0 + slotsRequired(for: $1.size) }
    }

    var slotsAvailable: Int {
        max(0, capacitySlots - slotsUsed)
    }

    var canAddMoreTasks: Bool {
        slotsAvailable > 0
    }

    func setCapacity(_ level: Int) {
        blob.capacity = min(4, max(0, level))
        blob.capacityDate = DateHelpers.todayString
        save()
    }

    func resetCapacityIfNeeded() {
        guard !blob.capacityDate.isEmpty else { return }
        if !DateHelpers.isToday(blob.capacityDate) {
            blob.capacity = 0
            blob.capacityDate = DateHelpers.todayString
            save()
        }
    }

    // MARK: - Tasks

    var visibleTasks: [TriageTask] {
        guard showFitOnly else { return activeTasks }
        return activeTasks.filter { slotsRequired(for: $0.size) <= slotsAvailable }
    }

    func addTask(title: String, category: String, size: String) {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        let task = TriageTask(
            title: trimmed,
            category: category,
            size: size,
            isComplete: false,
            createdDate: DateHelpers.todayString
        )
        blob.tasks.insert(task, at: 0)
        save()
    }

    func completeTask(_ id: String) {
        guard let index = blob.tasks.firstIndex(where: { $0.id == id }) else { return }
        blob.tasks[index].isComplete.toggle()
        save()
    }

    func deleteTask(_ id: String) {
        blob.tasks.removeAll { $0.id == id }
        save()
    }

    // MARK: - Ideas

    var ideasByStage: [[TriageIdea]] {
        [
            blob.ideas.filter { $0.stage == 0 },
            blob.ideas.filter { $0.stage == 1 },
            blob.ideas.filter { $0.stage == 2 }
        ]
    }

    func addIdea(title: String, note: String) {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        let idea = TriageIdea(
            title: trimmed,
            stage: 0,
            note: note.trimmingCharacters(in: .whitespacesAndNewlines),
            createdDate: DateHelpers.todayString
        )
        blob.ideas.insert(idea, at: 0)
        save()
    }

    func advanceIdea(_ id: String) {
        guard let index = blob.ideas.firstIndex(where: { $0.id == id }) else { return }
        blob.ideas[index].stage = min(2, blob.ideas[index].stage + 1)
        save()
    }

    func deleteIdea(_ id: String) {
        blob.ideas.removeAll { $0.id == id }
        save()
    }

    // MARK: - Wins

    var todaysWins: [TriageWin] {
        blob.wins.filter { DateHelpers.isToday($0.date) }
    }

    func logWin(category: String, note: String) {
        let win = TriageWin(
            category: category,
            note: note.trimmingCharacters(in: .whitespacesAndNewlines),
            date: DateHelpers.todayString,
            timestamp: Int64(Date().timeIntervalSince1970 * 1000)
        )
        blob.wins.insert(win, at: 0)
        save()
    }

    func deleteWin(_ id: String) {
        blob.wins.removeAll { $0.id == id }
        save()
    }

    // MARK: - Helpers

    func slotsRequired(for size: String) -> Int {
        switch size {
        case "short": return 2
        case "medium": return 3
        default: return 1
        }
    }
}
