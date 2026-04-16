import Foundation
import Observation
import ClarityUI

@Observable @MainActor
final class CommandStore {

    /// Fired after each successful local save (for debounced cloud push).
    var onPersisted: (() -> Void)?

    // MARK: - Persisted state

    private(set) var blob: CommandBlob = .init()

    // MARK: - Form state

    var missionMode: MissionMode = .morning
    var showJobActionSheet: Bool = false
    var newJobType: String = CommandConfig.jobActionTypes[0]
    var newJobNote: String = ""
    var selectedMonth: Int = Calendar.current.component(.month, from: .now) - 1
    var selectedYear: Int = Calendar.current.component(.year, from: .now)
    var showClearConfirm: Bool = false

    enum MissionMode: String, CaseIterable {
        case morning = "Morning"
        case evening = "Evening"
    }

    nonisolated init() {}

    // MARK: - Load / Save

    func load() {
        blob = StorageHelpers.load(CommandBlob.self, key: CommandConfig.storeKey) ?? .init()
        // Auto-detect morning vs evening
        missionMode = DateHelpers.isMorning ? .morning : .evening
    }

    func save() {
        blob.syncAt = Int64(Date().timeIntervalSince1970 * 1000)
        StorageHelpers.save(blob, key: CommandConfig.storeKey)
        onPersisted?()
    }

    /// After cloud pull: replace local state if server `updated_at` is newer than local `_syncAt`.
    func applyRemoteBlobIfNewer(localSyncAtMs: Int64, remote: CommandBlob, remoteUpdated: Date) {
        let remoteMs = Int64(remoteUpdated.timeIntervalSince1970 * 1000)
        guard remoteMs > localSyncAtMs else { return }
        blob = remote
        StorageHelpers.save(blob, key: CommandConfig.storeKey)
        missionMode = DateHelpers.isMorning ? .morning : .evening
    }

    // MARK: - Today's log

    var todayLog: DailyLog? {
        blob.dailyLogs.first { DateHelpers.isToday($0.date) }
    }

    func upsertTodayLog(_ patch: (inout DailyLog) -> Void) {
        let todayStr = DateHelpers.todayString
        var log = blob.dailyLogs.first { $0.date == todayStr } ?? DailyLog(date: todayStr)
        patch(&log)
        blob.dailyLogs.removeAll { $0.date == todayStr }
        blob.dailyLogs.insert(log, at: 0)
        blob.dailyLogs.sort { $0.date > $1.date }
        if blob.dailyLogs.count > 180 {
            blob.dailyLogs = Array(blob.dailyLogs.prefix(180))
        }
        save()
    }

    // MARK: - Yesterday's log (for conviction)

    var yesterdayLog: DailyLog? {
        let cal = Calendar.current
        guard let yesterday = cal.date(byAdding: .day, value: -1, to: .now) else { return nil }
        let yStr = DateHelpers.formatDate(yesterday)
        return blob.dailyLogs.first { $0.date == yStr }
    }

    // MARK: - Mission

    func commitMission() {
        upsertTodayLog { $0.committed = true }
    }

    // MARK: - Job actions

    func addJobAction(type: String, note: String) {
        let action = JobAction(type: type, note: note, time: DateHelpers.timeString)
        upsertTodayLog { log in
            log.jobActions.append(action)
            log.areas.jobs = log.jobActions.count
        }
    }

    func removeJobAction(id: Int64) {
        upsertTodayLog { log in
            log.jobActions.removeAll { $0.id == id }
            log.areas.jobs = log.jobActions.count
        }
    }

    // MARK: - Area patching

    func patchAreas(_ update: (inout Areas) -> Void) {
        upsertTodayLog { log in
            update(&log.areas)
        }
    }

    // MARK: - Streak computation

    func overallStreak() -> Int {
        computeStreak { log in
            DayStatus.compute(log: log, targets: blob.targets) == .met
        }
    }

    func areaStreak(_ check: @escaping (DailyLog) -> Bool) -> Int {
        computeStreak(check)
    }

    private func computeStreak(_ isMet: (DailyLog) -> Bool) -> Int {
        let sorted = blob.dailyLogs.sorted { $0.date > $1.date }
        guard !sorted.isEmpty else { return 0 }

        let todayStr = DateHelpers.todayString
        var expected = todayStr

        // Allow yesterday as starting point if today not yet logged
        if sorted[0].date != todayStr {
            let yesterday = DateHelpers.formatDate(
                Calendar.current.date(byAdding: .day, value: -1, to: .now) ?? .now
            )
            guard sorted[0].date == yesterday else { return 0 }
            expected = yesterday
        }

        var streak = 0
        for log in sorted {
            guard log.date == expected else { break }
            guard isMet(log) else { break }
            streak += 1
            if let d = DateHelpers.parseDate(expected),
               let prev = Calendar.current.date(byAdding: .day, value: -1, to: d) {
                expected = DateHelpers.formatDate(prev)
            } else {
                break
            }
        }
        return streak
    }

    // MARK: - Day status

    func dayStatus(_ log: DailyLog?) -> DayStatus {
        DayStatus.compute(log: log, targets: blob.targets)
    }

    // MARK: - Stats

    var daysSinceLayoff: Int? {
        guard !blob.layoffDate.isEmpty,
              let layoff = DateHelpers.parseDate(blob.layoffDate) else { return nil }
        return Calendar.current.dateComponents([.day], from: layoff, to: .now).day
    }

    var perfectDayCount: Int {
        blob.dailyLogs.filter { DayStatus.compute(log: $0, targets: blob.targets) == .met }.count
    }

    var totalJobActions: Int {
        blob.dailyLogs.reduce(0) { $0 + $1.jobActions.count }
    }

    // MARK: - Settings

    func setLayoffDate(_ date: String) {
        blob.layoffDate = date
        save()
    }

    func setTargets(_ targets: Targets) {
        blob.targets = targets
        save()
    }

    func addScripture(_ scripture: Scripture) {
        blob.scriptures.append(scripture)
        save()
    }

    func removeScripture(at index: Int) {
        guard blob.scriptures.indices.contains(index) else { return }
        blob.scriptures.remove(at: index)
        save()
    }

    func addReminder(_ reminder: Reminder) {
        blob.reminders.append(reminder)
        save()
    }

    func removeReminder(at index: Int) {
        guard blob.reminders.indices.contains(index) else { return }
        blob.reminders.remove(at: index)
        save()
    }

    func clearAllLogs() {
        blob.dailyLogs.removeAll()
        save()
    }

    func exportJSON() -> String {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        guard let data = try? encoder.encode(blob),
              let str = String(data: data, encoding: .utf8) else { return "{}" }
        return str
    }
}

// MARK: - DateHelpers extensions

private extension DateHelpers {
    static var timeString: String {
        let fmt = DateFormatter()
        fmt.dateFormat = "HH:mm"
        return fmt.string(from: .now)
    }

    static func formatDate(_ date: Date) -> String {
        let fmt = DateFormatter()
        fmt.dateFormat = "yyyy-MM-dd"
        return fmt.string(from: date)
    }

    static func parseDate(_ str: String) -> Date? {
        let fmt = DateFormatter()
        fmt.dateFormat = "yyyy-MM-dd"
        return fmt.date(from: str)
    }
}
