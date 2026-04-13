import Foundation
import ClarityUI

// MARK: - Session entry

/// One logged growth session (parity with Wellness `growthLogs` entries).
struct GrowthSessionEntry: Codable, Identifiable, Equatable {
    var id: String
    var area: String
    var mins: Int
    var note: String
    var milestones: [String]
    var backgrounds: [String]
    /// Local calendar bucket `yyyy-MM-dd`.
    var date: String
    var timestampMs: Int64
}

// MARK: - Root blob

/// Local-first state for Clarity Growth. Stored under `GrowthConfig.storeKey`.
struct GrowthBlob: Codable, Equatable {
    var sessions: [GrowthSessionEntry] = []
}

// MARK: - Aggregates & streak (pure; testable)

extension GrowthBlob {
    func totalMinutes(areaId: String?) -> Int {
        sessions
            .filter { areaId == nil || $0.area == areaId }
            .reduce(0) { $0 + $1.mins }
    }

    func sessionCount(areaId: String?) -> Int {
        sessions.filter { areaId == nil || $0.area == areaId }.count
    }

    func hasLoggedToday(areaId: String, today: String) -> Bool {
        sessions.contains { $0.area == areaId && $0.date == today }
    }

    /// Matches Wellness `GrowthTab.jsx` `gStreak`: unique days with logs for `areaId`, newest first, anchored from `today`.
    func streakCount(for areaId: String, today: String, calendar: Calendar = .current) -> Int {
        let days = Array(Set(sessions.filter { $0.area == areaId }.map(\.date))).sorted(by: >)
        guard !days.isEmpty else { return 0 }

        var streak = 0
        var cur = today

        for d in days {
            guard let prev = Self.previousDayString(from: cur, calendar: calendar) else { break }
            if d == cur {
                streak += 1
                cur = prev
            } else if d == prev {
                streak += 1
                cur = prev
            } else {
                break
            }
        }
        return streak
    }

    private static func previousDayString(from day: String, calendar: Calendar) -> String? {
        guard let base = DateHelpers.date(from: day) else { return nil }
        guard let prev = calendar.date(byAdding: .day, value: -1, to: base) else { return nil }
        return DateHelpers.dateString(from: prev)
    }

    /// Last seven local calendar days ending at `reference`, oldest first (for a simple week bar).
    func minutesByDayLastSeven(reference: Date = .init(), calendar: Calendar = .current) -> [(day: String, minutes: Int)] {
        var days: [String] = []
        for offset in (0..<7).reversed() {
            guard let d = calendar.date(byAdding: .day, value: -offset, to: calendar.startOfDay(for: reference)) else { continue }
            days.append(DateHelpers.dateString(from: d))
        }
        return days.map { day in
            let m = sessions.filter { $0.date == day }.reduce(0) { $0 + $1.mins }
            return (day, m)
        }
    }
}
