import Foundation
import SwiftUI

@MainActor
final class WellnessStore: ObservableObject {
    static let morningSections = ["sleep", "morning_start"]
    static let eveningSections = ["med_checkin", "health_lifestyle", "end_of_day"]

    /// Fired after local persistence (not called from `applyRemoteBlob`).
    var onPersisted: (() -> Void)?

    @Published private(set) var blob: [String: Any]
    @Published var formData: [String: [String: Any]] = [:]
    @Published var sectionIdx: Int = 0
    @Published var checkinMode: CheckinMode
    @Published var meds: [String]

    private let defaults: UserDefaults

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        checkinMode = CheckinMode.fromTime()
        blob = WellnessBlob.emptyBlob()
        meds = WellnessStore.defaultMeds
        loadLocal()
    }

    private static let defaultMeds = ["Sertraline", "Adderall", "Wellbutrin", "Buspar", "Trazodone"]

    var activeSections: [String] {
        checkinMode == .morning ? Self.morningSections : Self.eveningSections
    }

    var savedForCurrentMode: Bool {
        let today = WellnessBlob.jsToDateString()
        if checkinMode == .morning {
            return (blob["savedMorning"] as? String) == today
        }
        return (blob["savedEvening"] as? String) == today
    }

    var entries: [[String: Any]] {
        (blob["entries"] as? [[String: Any]]) ?? []
    }

    func loadLocal() {
        if let data = defaults.data(forKey: WellnessConfig.storeKey),
           let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
            blob = WellnessBlob.normalizeBlob(obj)
        } else {
            blob = WellnessBlob.emptyBlob()
        }
        if let m = defaults.array(forKey: WellnessConfig.medStoreKey) as? [String], !m.isEmpty {
            meds = m
        }
        loadDraftIfToday()
    }

    func persistLocal(notifyCloud: Bool = true) {
        if let data = try? JSONSerialization.data(withJSONObject: blob, options: [.sortedKeys]) {
            defaults.set(data, forKey: WellnessConfig.storeKey)
        }
        defaults.set(meds, forKey: WellnessConfig.medStoreKey)
        if notifyCloud {
            onPersisted?()
        }
    }

    func stampSyncAndPersist() {
        var b = blob
        WellnessBlob.stampSync(&b)
        blob = b
        persistLocal()
        objectWillChange.send()
    }

    func applyRemoteBlob(_ remote: [String: Any]) {
        blob = WellnessBlob.normalizeBlob(remote)
        persistLocal(notifyCloud: false)
        clearStaleDraft()
        objectWillChange.send()
    }

    /// After pull decides remote is newer.
    func replaceBlobIfRemoteNewer(localSyncAt: Int64, remote: [String: Any], remoteUpdated: Date) {
        if WellnessBlob.shouldUseRemote(localSyncAt: localSyncAt, remoteUpdated: remoteUpdated) {
            applyRemoteBlob(remote)
        }
    }

    func saveDraft() {
        let today = WellnessBlob.jsToDateString()
        let payload: [String: Any] = [
            "formData": formData,
            "sectionIdx": sectionIdx,
            "checkinMode": checkinMode.rawValue,
            "date": today,
        ]
        if let data = try? JSONSerialization.data(withJSONObject: payload) {
            defaults.set(data, forKey: WellnessConfig.draftStoreKey)
        }
    }

    func loadDraftIfToday() {
        guard let data = defaults.data(forKey: WellnessConfig.draftStoreKey),
              let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let date = obj["date"] as? String,
              date == WellnessBlob.jsToDateString() else {
            clearDraft()
            return
        }
        if let raw = obj["formData"] as? [String: Any] {
            var out: [String: [String: Any]] = [:]
            for (k, v) in raw {
                if let inner = v as? [String: Any] { out[k] = inner }
            }
            formData = out
        }
        if let idx = obj["sectionIdx"] as? Int { sectionIdx = idx }
        if let m = obj["checkinMode"] as? String, let mode = CheckinMode(rawValue: m) {
            checkinMode = mode
        }
    }

    func clearDraft() {
        defaults.removeObject(forKey: WellnessConfig.draftStoreKey)
    }

    func clearStaleDraft() {
        guard let data = defaults.data(forKey: WellnessConfig.draftStoreKey),
              let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let date = obj["date"] as? String,
              date != WellnessBlob.jsToDateString() else { return }
        clearDraft()
    }

    func setSectionField(section: String, key: String, value: Any?) {
        var sec = formData[section] ?? [:]
        if let v = value {
            sec[key] = v
        } else {
            sec.removeValue(forKey: key)
        }
        formData[section] = sec
        if !savedForCurrentMode {
            saveDraft()
        }
    }

    func saveEntry() {
        blob = WellnessBlob.saveEntry(
            blob: blob,
            formData: formData,
            checkinMode: checkinMode,
            morningSections: Self.morningSections,
            eveningSections: Self.eveningSections
        )
        formData = [:]
        sectionIdx = 0
        clearDraft()
        persistLocal(notifyCloud: true)
        objectWillChange.send()
    }

    func goToNextSection() {
        guard sectionIdx < activeSections.count - 1 else { return }
        sectionIdx += 1
        saveDraft()
    }

    func goToPreviousSection() {
        guard sectionIdx > 0 else { return }
        sectionIdx -= 1
        saveDraft()
    }

    func resetTrackerForm() {
        formData = [:]
        sectionIdx = 0
        clearDraft()
        objectWillChange.send()
    }

    func updateMeds(_ list: [String]) {
        meds = list
        defaults.set(list, forKey: WellnessConfig.medStoreKey)
        objectWillChange.send()
    }

    // MARK: - Phase 2 quick-capture features

    var tasksActive: [[String: Any]] {
        let tasks = blob["tasks"] as? [String: Any] ?? [:]
        return tasks["active"] as? [[String: Any]] ?? []
    }

    var pulseChecks: [[String: Any]] {
        blob["pulseChecks"] as? [[String: Any]] ?? []
    }

    var wins: [[String: Any]] {
        blob["wins"] as? [[String: Any]] ?? []
    }

    var timeSessionsToday: [[String: Any]] {
        let timeData = blob["timeData"] as? [String: Any] ?? [:]
        let sessions = timeData["sessions"] as? [[String: Any]] ?? []
        let today = WellnessBlob.jsToDateString()
        return sessions.filter { ($0["day"] as? String) == today }
    }

    /// Currently-running session (nil if none, or if stored day is no longer today).
    var activeTimeSession: [String: Any]? {
        let td = blob["timeData"] as? [String: Any] ?? [:]
        guard (td["day"] as? String) == WellnessBlob.jsToDateString() else { return nil }
        return td["active"] as? [String: Any]
    }

    /// Start (or swap to) a live session. Closes any in-flight session first.
    func startCategorySession(categoryId: String) {
        let trimmed = categoryId.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        mutateBlob { blob in
            let today = WellnessBlob.jsToDateString()
            var td = blob["timeData"] as? [String: Any] ?? [:]
            // Day rollover: drop yesterday's `sessions` and `active`.
            if (td["day"] as? String) != today {
                td = ["day": today, "sessions": [[String: Any]](), "active": NSNull()]
            }
            var sessions = td["sessions"] as? [[String: Any]] ?? []
            // Close current active (if any) into sessions list.
            if let active = td["active"] as? [String: Any], let start = active["startTime"] as? Double {
                let nowMs = Date().timeIntervalSince1970 * 1000
                var closed = active
                closed["endTime"] = nowMs
                closed["duration"] = nowMs - start
                if closed["day"] == nil { closed["day"] = today }
                sessions.insert(closed, at: 0)
                if sessions.count > 500 { sessions = Array(sessions.prefix(500)) }
            }
            let nowMs = Date().timeIntervalSince1970 * 1000
            let new: [String: Any] = [
                "id": Int(nowMs),
                "catId": trimmed,
                "day": today,
                "startTime": nowMs,
                "tags": [String](),
                "background": NSNull(),
                "note": "",
                "nudged": false,
            ]
            td["active"] = new
            td["sessions"] = sessions
            td["day"] = today
            blob["timeData"] = td
        }
    }

    /// Stop the running session, push it into `sessions`, increment scripture streak if applicable.
    func stopActiveSession() {
        mutateBlob { blob in
            var td = blob["timeData"] as? [String: Any] ?? [:]
            guard let active = td["active"] as? [String: Any], let start = active["startTime"] as? Double else { return }
            let today = WellnessBlob.jsToDateString()
            var sessions = td["sessions"] as? [[String: Any]] ?? []
            let nowMs = Date().timeIntervalSince1970 * 1000
            var closed = active
            closed["endTime"] = nowMs
            closed["duration"] = nowMs - start
            if closed["day"] == nil { closed["day"] = today }
            sessions.insert(closed, at: 0)
            if sessions.count > 500 { sessions = Array(sessions.prefix(500)) }
            td["sessions"] = sessions
            td["active"] = NSNull()
            td["day"] = today
            blob["timeData"] = td

            if (closed["catId"] as? String)?.lowercased() == "scripture" {
                var streak = blob["scriptureStreak"] as? [String: Any] ?? ["count": 0, "lastDate": NSNull()]
                if (streak["lastDate"] as? String) != today {
                    streak["count"] = (streak["count"] as? Int ?? 0) + 1
                    streak["lastDate"] = today
                }
                blob["scriptureStreak"] = streak
            }
        }
    }

    func addTask(title: String) {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        mutateBlob { blob in
            var tasks = blob["tasks"] as? [String: Any] ?? [:]
            var active = tasks["active"] as? [[String: Any]] ?? []
            active.insert([
                "id": UUID().uuidString,
                "title": trimmed,
                "done": false,
                "createdAt": ISO8601DateFormatter.wellness.string(from: Date()),
            ], at: 0)
            if active.count > 100 { active = Array(active.prefix(100)) }
            tasks["active"] = active
            blob["tasks"] = tasks
        }
    }

    func toggleTaskDone(id: String) {
        mutateBlob { blob in
            var tasks = blob["tasks"] as? [String: Any] ?? [:]
            var active = tasks["active"] as? [[String: Any]] ?? []
            for index in active.indices where (active[index]["id"] as? String) == id {
                let done = active[index]["done"] as? Bool ?? false
                active[index]["done"] = !done
                break
            }
            tasks["active"] = active
            blob["tasks"] = tasks
        }
    }

    func addWin(note: String) {
        let trimmed = note.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        mutateBlob { blob in
            var wins = blob["wins"] as? [[String: Any]] ?? []
            wins.insert([
                "id": UUID().uuidString,
                "text": trimmed,
                "date": ISO8601DateFormatter.wellness.string(from: Date()),
            ], at: 0)
            if wins.count > 200 { wins = Array(wins.prefix(200)) }
            blob["wins"] = wins
        }
    }

    func addPulse(mood: String, note: String) {
        let moodValue = mood.trimmingCharacters(in: .whitespacesAndNewlines)
        let noteValue = note.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !moodValue.isEmpty || !noteValue.isEmpty else { return }
        mutateBlob { blob in
            var pulse = blob["pulseChecks"] as? [[String: Any]] ?? []
            pulse.insert([
                "id": UUID().uuidString,
                "mood": moodValue,
                "note": noteValue,
                "date": ISO8601DateFormatter.wellness.string(from: Date()),
            ], at: 0)
            if pulse.count > 200 { pulse = Array(pulse.prefix(200)) }
            blob["pulseChecks"] = pulse
        }
    }

    func addTimeSession(category: String, minutes: Int, note: String) {
        let trimmedCategory = category.trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedNote = note.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmedCategory.isEmpty, minutes > 0 else { return }
        mutateBlob { blob in
            let today = WellnessBlob.jsToDateString()
            let started = Date().addingTimeInterval(TimeInterval(-minutes * 60))
            let ended = Date()

            var timeData = blob["timeData"] as? [String: Any] ?? [:]
            var sessions = timeData["sessions"] as? [[String: Any]] ?? []
            sessions.insert([
                "id": UUID().uuidString,
                "day": today,
                "category": trimmedCategory,
                "minutes": minutes,
                "note": trimmedNote,
                "start": ISO8601DateFormatter.wellness.string(from: started),
                "end": ISO8601DateFormatter.wellness.string(from: ended),
            ], at: 0)
            if sessions.count > 500 { sessions = Array(sessions.prefix(500)) }
            timeData["sessions"] = sessions
            blob["timeData"] = timeData

            if trimmedCategory.lowercased() == "scripture" {
                var streak = blob["scriptureStreak"] as? [String: Any] ?? ["count": 0, "lastDate": NSNull()]
                let lastDate = streak["lastDate"] as? String
                if lastDate != today {
                    let count = streak["count"] as? Int ?? 0
                    streak["count"] = count + 1
                    streak["lastDate"] = today
                }
                blob["scriptureStreak"] = streak
            }
        }
    }

    private func mutateBlob(_ update: (inout [String: Any]) -> Void) {
        var next = blob
        update(&next)
        WellnessBlob.stampSync(&next)
        blob = next
        persistLocal()
        objectWillChange.send()
    }
}
