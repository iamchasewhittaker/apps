import Foundation
import ClarityUI

// MARK: - Top-level blob

/// Complete local-first state for Clarity Time.
/// Stored as JSON in UserDefaults under `TimeConfig.storeKey`.
struct TimeBlob: Codable {
    var sessions: [TimeSession] = []
    /// At most one active timer; persisted so duration math survives relaunch.
    var activeTimer: ActiveTimerState?
    var scriptureDays: [ScriptureDayEntry] = []
}

// MARK: - Time session

enum TimeSessionKind: String, Codable {
    case timer
    case manual
}

struct TimeSession: Codable, Identifiable {
    var id: String = UUID().uuidString
    var title: String
    var category: String
    var kind: TimeSessionKind
    /// Elapsed focus time for this session.
    var durationSeconds: Int
    /// Calendar bucket for reporting (local `yyyy-MM-dd`).
    var date: String
    var timestampMs: Int64
}

// MARK: - Active timer (persisted)

struct ActiveTimerState: Codable {
    var id: String = UUID().uuidString
    var title: String
    var category: String
    var startedAtMs: Int64
    /// Total time spent paused (wall clock), not including an in-flight pause interval until resume.
    var accumulatedPausedMs: Int64
    /// When non-nil, timer is paused; elapsed since this instant is not counted until resume.
    var pauseBeganAtMs: Int64?
}

// MARK: - Scripture day

struct ScriptureDayEntry: Codable, Identifiable {
    /// `yyyy-MM-dd` — also used as stable `id` for SwiftUI lists.
    var date: String
    var completed: Bool = false
    var scriptureReference: String = ""

    var id: String { date }
}

// MARK: - Streak

extension TimeBlob {
    /// Consecutive completed scripture days, ending today if today is completed, else ending yesterday.
    func scriptureStreakCount(referenceNow: Date = .init(), calendar: Calendar = .current) -> Int {
        let completedDates = Set(scriptureDays.filter(\.completed).map(\.date))
        guard !completedDates.isEmpty else { return 0 }

        let today = DateHelpers.dateString(from: referenceNow)
        var anchor = today
        if !completedDates.contains(today) {
            guard let y = Self.addDays(to: today, offset: -1, calendar: calendar) else { return 0 }
            anchor = y
            guard completedDates.contains(anchor) else { return 0 }
        }

        var count = 0
        var d = anchor
        while completedDates.contains(d) {
            count += 1
            guard let prev = Self.addDays(to: d, offset: -1, calendar: calendar) else { break }
            d = prev
        }
        return count
    }

    private static func addDays(to day: String, offset: Int, calendar: Calendar) -> String? {
        guard let base = DateHelpers.date(from: day) else { return nil }
        guard let next = calendar.date(byAdding: .day, value: offset, to: base) else { return nil }
        return DateHelpers.dateString(from: next)
    }
}

// MARK: - Timer elapsed (pure; testable)

enum TimeTimerMath {
    static func elapsedMs(
        state: ActiveTimerState,
        referenceNowMs: Int64
    ) -> Int64 {
        var raw = referenceNowMs - state.startedAtMs - state.accumulatedPausedMs
        if let pauseStart = state.pauseBeganAtMs {
            raw -= referenceNowMs - pauseStart
        }
        return max(0, raw)
    }

    static func elapsedSeconds(
        state: ActiveTimerState,
        referenceNowMs: Int64
    ) -> Int {
        Int(elapsedMs(state: state, referenceNowMs: referenceNowMs) / 1000)
    }
}
