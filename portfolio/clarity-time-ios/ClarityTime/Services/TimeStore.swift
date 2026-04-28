import Foundation
import Observation
import ClarityUI

/// Main observable store for Clarity Time.
@Observable @MainActor
final class TimeStore {

    private(set) var blob: TimeBlob = .init()

    /// Bumped once per second while a timer is running so SwiftUI refreshes elapsed display.
    private(set) var tickToken: Int = 0

    private var tickTask: Task<Void, Never>?

    init() {}

    // MARK: - Lifecycle

    func load() {
        blob = StorageHelpers.load(TimeBlob.self, key: TimeConfig.storeKey) ?? .init()
        reconcileTicker()
    }

    func save() {
        _ = StorageHelpers.save(blob, key: TimeConfig.storeKey)
    }

    // MARK: - Sessions (read)

    var sessionsNewestFirst: [TimeSession] {
        blob.sessions.sorted { $0.timestampMs > $1.timestampMs }
    }

    var activeTimer: ActiveTimerState? { blob.activeTimer }

    var timerElapsedSeconds: Int {
        guard let s = blob.activeTimer else { return 0 }
        let nowMs = Int64(Date().timeIntervalSince1970 * 1000)
        _ = tickToken
        return TimeTimerMath.elapsedSeconds(state: s, referenceNowMs: nowMs)
    }

    var scriptureStreak: Int {
        blob.scriptureStreakCount()
    }

    func scriptureDay(for date: String) -> ScriptureDayEntry {
        if let existing = blob.scriptureDays.first(where: { $0.date == date }) {
            return existing
        }
        return ScriptureDayEntry(date: date, completed: false, scriptureReference: "")
    }

    // MARK: - Timer

    func startTimer(title: String, category: String) {
        let trimmedTitle = title.trimmingCharacters(in: .whitespacesAndNewlines)
        let nowMs = Int64(Date().timeIntervalSince1970 * 1000)
        blob.activeTimer = ActiveTimerState(
            title: trimmedTitle,
            category: category,
            startedAtMs: nowMs,
            accumulatedPausedMs: 0,
            pauseBeganAtMs: nil
        )
        save()
        reconcileTicker()
    }

    func pauseTimer() {
        guard var s = blob.activeTimer, s.pauseBeganAtMs == nil else { return }
        s.pauseBeganAtMs = Int64(Date().timeIntervalSince1970 * 1000)
        blob.activeTimer = s
        save()
        reconcileTicker()
    }

    func resumeTimer() {
        guard var s = blob.activeTimer, let pauseStart = s.pauseBeganAtMs else { return }
        let nowMs = Int64(Date().timeIntervalSince1970 * 1000)
        s.accumulatedPausedMs += nowMs - pauseStart
        s.pauseBeganAtMs = nil
        blob.activeTimer = s
        save()
        reconcileTicker()
    }

    func stopTimer() {
        guard let s = blob.activeTimer else { return }
        let nowMs = Int64(Date().timeIntervalSince1970 * 1000)
        let seconds = TimeTimerMath.elapsedSeconds(state: s, referenceNowMs: nowMs)
        guard seconds > 0 else {
            blob.activeTimer = nil
            save()
            reconcileTicker()
            return
        }

        let session = TimeSession(
            title: s.title.isEmpty ? "Focus session" : s.title,
            category: s.category,
            kind: .timer,
            durationSeconds: seconds,
            date: DateHelpers.todayString,
            timestampMs: nowMs
        )
        blob.sessions.insert(session, at: 0)
        blob.activeTimer = nil
        save()
        reconcileTicker()
    }

    func discardTimer() {
        blob.activeTimer = nil
        save()
        reconcileTicker()
    }

    // MARK: - Manual session

    func addManualSession(title: String, category: String, durationMinutes: Int, date: String) {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        let mins = max(1, durationMinutes)
        let seconds = mins * 60
        let nowMs = Int64(Date().timeIntervalSince1970 * 1000)
        let day = date.isEmpty ? DateHelpers.todayString : date
        let session = TimeSession(
            title: trimmed.isEmpty ? "Manual session" : trimmed,
            category: category,
            kind: .manual,
            durationSeconds: seconds,
            date: day,
            timestampMs: nowMs
        )
        blob.sessions.insert(session, at: 0)
        save()
    }

    func deleteSession(_ id: String) {
        blob.sessions.removeAll { $0.id == id }
        save()
    }

    // MARK: - Scripture

    func setScriptureCompleted(_ completed: Bool, date: String = DateHelpers.todayString) {
        upsertScripture(date: date) { $0.completed = completed }
    }

    func setScriptureReference(_ reference: String, date: String = DateHelpers.todayString) {
        let trimmed = reference.trimmingCharacters(in: .whitespacesAndNewlines)
        upsertScripture(date: date) { $0.scriptureReference = trimmed }
    }

    private func upsertScripture(date: String, mutate: (inout ScriptureDayEntry) -> Void) {
        if let idx = blob.scriptureDays.firstIndex(where: { $0.date == date }) {
            mutate(&blob.scriptureDays[idx])
        } else {
            var row = ScriptureDayEntry(date: date, completed: false, scriptureReference: "")
            mutate(&row)
            blob.scriptureDays.append(row)
        }
        blob.scriptureDays.sort { $0.date > $1.date }
        save()
    }

    // MARK: - Ticker

    private func reconcileTicker() {
        let shouldRun = blob.activeTimer != nil && blob.activeTimer?.pauseBeganAtMs == nil
        if shouldRun {
            startTickerIfNeeded()
        } else {
            stopTicker()
        }
    }

    private func startTickerIfNeeded() {
        guard tickTask == nil else { return }
        tickTask = Task { @MainActor in
            while !Task.isCancelled {
                try? await Task.sleep(nanoseconds: 1_000_000_000)
                guard !Task.isCancelled else { break }
                tickToken &+= 1
            }
        }
    }

    private func stopTicker() {
        tickTask?.cancel()
        tickTask = nil
    }
}
