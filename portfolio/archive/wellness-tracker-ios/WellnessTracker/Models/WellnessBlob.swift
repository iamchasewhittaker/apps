import Foundation

/// Default shape + helpers for the native check-in blob (structural compatibility with the original wellness schema; not coupled to the web codebase).
enum WellnessBlob {
    static func emptyBlob() -> [String: Any] {
        [
            "entries": [Any](),
            "budget": [String: Any](),
            "tasks": [String: Any](),
            "ideas": [String: Any](),
            "growthLogs": [Any](),
            "wins": [Any](),
            "savedMorning": NSNull(),
            "savedEvening": NSNull(),
            "pulseChecks": [Any](),
            "timeData": [String: Any](),
            "scriptureStreak": ["count": 0, "lastDate": NSNull()],
            "_syncAt": 0,
        ]
    }

    /// Ensure every top-level key exists before sync (complete payload for `user_data.data`).
    static func normalizeBlob(_ raw: [String: Any]) -> [String: Any] {
        var e = emptyBlob()
        for (k, v) in raw { e[k] = v }
        return e
    }

    /// Pull: if `remoteUpdated` is newer than local `_syncAt`, use remote data payload.
    static func shouldUseRemote(localSyncAt: Int64, remoteUpdated: Date) -> Bool {
        remoteUpdated.timeIntervalSince1970 * 1000 > Double(localSyncAt)
    }

    static func localSyncAtMs(_ blob: [String: Any]) -> Int64 {
        if let n = blob["_syncAt"] as? Int64 { return n }
        if let i = blob["_syncAt"] as? Int { return Int64(i) }
        if let d = blob["_syncAt"] as? Double { return Int64(d) }
        return 0
    }

    static func stampSync(_ blob: inout [String: Any]) {
        blob["_syncAt"] = Int64(Date().timeIntervalSince1970 * 1000)
    }
}

extension WellnessBlob {
    /// Same as JS `new Date().toDateString()` in en_US POSIX.
    static func jsToDateString(_ date: Date = Date()) -> String {
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = TimeZone.current
        f.dateFormat = "EEE MMM dd yyyy"
        return f.string(from: date)
    }

    /// Merge today’s sections into `entries[]` (morning + evening same-day semantics).
    static func saveEntry(
        blob: [String: Any],
        formData: [String: [String: Any]],
        checkinMode: CheckinMode,
        morningSections: [String],
        eveningSections: [String]
    ) -> [String: Any] {
        var b = blob
        let today = jsToDateString()
        let active = checkinMode == .morning ? morningSections : eveningSections
        let isMorning = checkinMode == .morning

        var entries = (b["entries"] as? [[String: Any]]) ?? []
        let existingIdx = entries.firstIndex { entry in
            guard let parsed = parseEntryDate(entry) else { return false }
            return WellnessBlob.jsToDateString(parsed) == today
        }

        let existing: [String: Any] = existingIdx.map { entries[$0] } ?? [:]

        var newSections: [String: Any] = [:]
        for s in active {
            newSections[s] = formData[s] ?? [:]
        }

        var merged: [String: Any] = existing
        for (k, v) in newSections {
            merged[k] = v
        }

        if merged["date"] == nil {
            merged["date"] = ISO8601DateFormatter.wellness.string(from: Date())
        }

        let existingSide = existing["sideEffects"] as? [String: Any] ?? [:]
        let formSide = formData["side_effects"] ?? [:]
        merged["sideEffects"] = isMorning ? existingSide : (formSide.isEmpty ? existingSide : formSide)

        let existingEod = (existing["endOfDay"] as? [String: Any]) ?? (existing["end_of_day"] as? [String: Any]) ?? [:]
        let formEod = formData["end_of_day"] ?? [:]
        merged["endOfDay"] = isMorning ? (existingEod.isEmpty ? [:] : existingEod) : (formEod.isEmpty ? existingEod : formEod)

        merged["morningDone"] = isMorning ? true : (existing["morningDone"] as? Bool ?? false)
        merged["eveningDone"] = !isMorning ? true : (existing["eveningDone"] as? Bool ?? false)

        if let idx = existingIdx {
            entries[idx] = merged
        } else {
            entries.insert(merged, at: 0)
            if entries.count > 90 { entries = Array(entries.prefix(90)) }
        }

        b["entries"] = entries
        if isMorning {
            b["savedMorning"] = today
        } else {
            b["savedEvening"] = today
        }
        stampSync(&b)
        return b
    }
}

enum CheckinMode: String, CaseIterable {
    case morning
    case evening

    static func fromTime(date: Date = Date()) -> CheckinMode {
        let h = Calendar.current.component(.hour, from: date)
        return h >= 20 ? .evening : .morning
    }
}

extension ISO8601DateFormatter {
    static let wellness: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()
}

private func parseEntryDate(_ entry: [String: Any]) -> Date? {
    guard let s = entry["date"] as? String else { return nil }
    if let d = ISO8601DateFormatter.wellness.date(from: s) { return d }
    let f = ISO8601DateFormatter()
    f.formatOptions = [.withInternetDateTime]
    return f.date(from: s)
}
