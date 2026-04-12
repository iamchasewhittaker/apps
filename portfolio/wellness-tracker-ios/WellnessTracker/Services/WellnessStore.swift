import Foundation
import SwiftUI

@MainActor
final class WellnessStore: ObservableObject {
    static let morningSections = ["sleep", "morning_start"]
    static let eveningSections = ["med_checkin", "health_lifestyle", "end_of_day"]

    @Published private(set) var blob: [String: Any]
    @Published var formData: [String: [String: Any]] = [:]
    @Published var sectionIdx: Int = 0
    @Published var checkinMode: CheckinMode
    @Published var meds: [String]

    private let defaults = UserDefaults.standard

    init() {
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

    func persistLocal() {
        if let data = try? JSONSerialization.data(withJSONObject: blob, options: [.sortedKeys]) {
            defaults.set(data, forKey: WellnessConfig.storeKey)
        }
        defaults.set(meds, forKey: WellnessConfig.medStoreKey)
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
        persistLocal()
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
        persistLocal()
        objectWillChange.send()
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
}
