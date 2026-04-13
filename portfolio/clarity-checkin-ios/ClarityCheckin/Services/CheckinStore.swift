import Foundation
import Observation
import ClarityUI

/// Main observable store for Clarity Check-in.
/// All views receive this via @Environment(checkStore).
@Observable @MainActor
final class CheckinStore {

    // MARK: - Persisted state

    private(set) var blob: CheckinBlob = .init()
    private(set) var meds: [String] = CheckinConfig.defaultMeds

    // MARK: - Draft / form state

    var draft: DraftBlob = .init()
    var isShowingPulseCheck: Bool = false
    var isShowingMedsEditor: Bool = false

    // MARK: - Lifecycle

    nonisolated init() {}

    func load() {
        blob = StorageHelpers.load(CheckinBlob.self, key: CheckinConfig.storeKey) ?? .init()
        meds = StorageHelpers.load([String].self, key: CheckinConfig.medsKey) ?? CheckinConfig.defaultMeds
        loadDraft()
    }

    // MARK: - Save

    func save() {
        StorageHelpers.save(blob, key: CheckinConfig.storeKey)
    }

    func saveMeds() {
        StorageHelpers.save(meds, key: CheckinConfig.medsKey)
    }

    // MARK: - Draft

    /// Saves the current draft to UserDefaults. Called on every field change.
    func saveDraft() {
        StorageHelpers.save(draft, key: CheckinConfig.draftKey)
    }

    /// Loads draft and discards it if it's from a previous day.
    private func loadDraft() {
        guard let saved = StorageHelpers.load(DraftBlob.self, key: CheckinConfig.draftKey) else {
            resetDraft()
            return
        }
        if DateHelpers.isToday(saved.date) {
            draft = saved
        } else {
            // Stale — discard
            StorageHelpers.remove(key: CheckinConfig.draftKey)
            resetDraft()
        }
    }

    func resetDraft() {
        draft = DraftBlob(
            date: DateHelpers.todayString,
            isMorning: DateHelpers.isMorning,
            currentSection: 0
        )
        saveDraft()
    }

    // MARK: - Entry management (same-day merge)

    /// Saves the current morning draft into the entry for today. Merges with any existing evening.
    func commitMorning() {
        let today = DateHelpers.todayString
        var entry = blob.entries.first(where: { $0.date == today }) ?? CheckinEntry(date: today)
        var morning = draft.morning
        morning.savedAt = ISO8601DateFormatter().string(from: .now)
        entry.morning = morning
        upsertEntry(entry)
        blob.savedMorning = today
        save()
        resetDraft()
    }

    /// Saves the current evening draft into the entry for today. Merges with any existing morning.
    func commitEvening() {
        let today = DateHelpers.todayString
        var entry = blob.entries.first(where: { $0.date == today }) ?? CheckinEntry(date: today)
        var evening = draft.evening
        evening.savedAt = ISO8601DateFormatter().string(from: .now)
        entry.evening = evening
        upsertEntry(entry)
        blob.savedEvening = today
        save()
        resetDraft()
    }

    private func upsertEntry(_ entry: CheckinEntry) {
        if let i = blob.entries.firstIndex(where: { $0.date == entry.date }) {
            blob.entries[i] = entry
        } else {
            blob.entries.insert(entry, at: 0)
        }
    }

    // MARK: - Today's entry

    var todaysEntry: CheckinEntry? {
        blob.entries.first(where: { DateHelpers.isToday($0.date) })
    }

    var hasMorningToday: Bool {
        blob.savedMorning == DateHelpers.todayString
    }

    var hasEveningToday: Bool {
        blob.savedEvening == DateHelpers.todayString
    }

    // MARK: - Pulse checks

    func logPulse(mood: Int, note: String) {
        let pulse = PulseCheck(
            mood: mood,
            note: note,
            date: DateHelpers.todayString,
            timestamp: Int64(Date().timeIntervalSince1970 * 1000)
        )
        blob.pulseChecks.insert(pulse, at: 0)
        save()
    }

    func deletePulse(_ pulse: PulseCheck) {
        blob.pulseChecks.removeAll { $0.id == pulse.id }
        save()
    }

    // MARK: - Meds management

    func addMed(_ name: String) {
        let trimmed = name.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty, !meds.contains(trimmed) else { return }
        meds.append(trimmed)
        saveMeds()
    }

    func removeMed(_ name: String) {
        meds.removeAll { $0 == name }
        saveMeds()
    }
}
