import Foundation
import Observation

private let storeKey = "unnamed_ios_v1"

@Observable @MainActor
final class AppStore {
    private(set) var state: AppState = AppState()

    nonisolated init() {}

    func load() {
        state = StorageHelpers.load(AppState.self, key: storeKey) ?? AppState()
    }

    private func save() {
        StorageHelpers.save(state, key: storeKey)
    }

    // MARK: - Capture

    func addItem(text: String) {
        let trimmed = text.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        state.items.append(Item(text: trimmed))
        save()
    }

    // MARK: - Sort

    var inboxItems: [Item] {
        state.items.filter { $0.lane == .inbox && $0.status == .active }
    }

    func assignItem(_ item: Item, to lane: Lane) {
        guard lane != .inbox else { return }
        updateItem(item.id) { $0.lane = lane }
        save()
    }

    func skipItem(_ item: Item) {
        guard let idx = state.items.firstIndex(where: { $0.id == item.id }) else { return }
        let moved = state.items.remove(at: idx)
        state.items.append(moved)
        save()
    }

    // MARK: - Today

    var todayLock: DailyLock? {
        state.locks.first { DateHelpers.isToday($0.date) }
    }

    var isLockedToday: Bool {
        todayLock != nil
    }

    func lockLanes(_ lane1: Lane, _ lane2: Lane) {
        guard !isLockedToday else { return }
        state.locks.append(DailyLock(date: DateHelpers.todayString, lane1: lane1, lane2: lane2))
        save()
    }

    var activeItems: [Item] {
        guard let lock = todayLock else { return [] }
        return state.items.filter {
            ($0.lane == lock.lane1 || $0.lane == lock.lane2) && $0.status == .active
        }
    }

    func markDone(_ item: Item) {
        updateItem(item.id) {
            $0.status = .done
            $0.completedAt = Date()
        }
        save()
    }

    func skipActiveItem(_ item: Item) {
        guard let idx = state.items.firstIndex(where: { $0.id == item.id }) else { return }
        let moved = state.items.remove(at: idx)
        state.items.append(moved)
        save()
    }

    // MARK: - Check

    var todayCheck: DailyCheck? {
        state.checks.first { DateHelpers.isToday($0.date) }
    }

    var hasCheckedToday: Bool {
        todayCheck != nil
    }

    func logCheck(produced: Bool, stayedInLanes: Bool) {
        guard !hasCheckedToday else { return }
        state.checks.append(DailyCheck(date: DateHelpers.todayString, produced: produced, stayedInLanes: stayedInLanes))
        save()
    }

    // MARK: - Private

    private func updateItem(_ id: UUID, update: (inout Item) -> Void) {
        guard let idx = state.items.firstIndex(where: { $0.id == id }) else { return }
        update(&state.items[idx])
    }
}
