import XCTest
@testable import ClarityTime
import ClarityUI

final class TimeBlobTests: XCTestCase {

    func testBlobEncodeDecodeRoundTrip() throws {
        let blob = TimeBlob(
            sessions: [
                TimeSession(
                    title: "Deep work",
                    category: "deep",
                    kind: .timer,
                    durationSeconds: 1800,
                    date: "2026-04-12",
                    timestampMs: 1712899200000
                )
            ],
            activeTimer: ActiveTimerState(
                title: "Reading",
                category: "spiritual",
                startedAtMs: 1000,
                accumulatedPausedMs: 100,
                pauseBeganAtMs: nil
            ),
            scriptureDays: [
                ScriptureDayEntry(date: "2026-04-12", completed: true, scriptureReference: "Ps 23")
            ]
        )

        let data = try JSONEncoder().encode(blob)
        let decoded = try JSONDecoder().decode(TimeBlob.self, from: data)

        XCTAssertEqual(decoded.sessions.count, 1)
        XCTAssertEqual(decoded.sessions.first?.kind, .timer)
        XCTAssertNotNil(decoded.activeTimer)
        XCTAssertEqual(decoded.scriptureDays.first?.completed, true)
    }

    func testScriptureStreakEndsTodayWhenCompleted() {
        let cal = Calendar(identifier: .gregorian)
        var comps = DateComponents()
        comps.year = 2026
        comps.month = 4
        comps.day = 12
        let ref = cal.date(from: comps)!
        let day0 = DateHelpers.dateString(from: ref)
        guard let d1 = cal.date(byAdding: .day, value: -1, to: ref),
              let d2 = cal.date(byAdding: .day, value: -2, to: ref) else {
            XCTFail("dates")
            return
        }
        let day1 = DateHelpers.dateString(from: d1)
        let day2 = DateHelpers.dateString(from: d2)

        let blob = TimeBlob(
            sessions: [],
            activeTimer: nil,
            scriptureDays: [
                ScriptureDayEntry(date: day0, completed: true, scriptureReference: ""),
                ScriptureDayEntry(date: day1, completed: true, scriptureReference: ""),
                ScriptureDayEntry(date: day2, completed: true, scriptureReference: "")
            ]
        )
        XCTAssertEqual(blob.scriptureStreakCount(referenceNow: ref, calendar: cal), 3)
    }

    func testScriptureStreakSkipsIncompleteToday() {
        let cal = Calendar(identifier: .gregorian)
        var comps = DateComponents()
        comps.year = 2026
        comps.month = 4
        comps.day = 12
        let ref = cal.date(from: comps)!
        let today = DateHelpers.dateString(from: ref)
        guard let y = cal.date(byAdding: .day, value: -1, to: ref) else {
            XCTFail("yesterday")
            return
        }
        let yStr = DateHelpers.dateString(from: y)

        let blob = TimeBlob(
            sessions: [],
            activeTimer: nil,
            scriptureDays: [
                ScriptureDayEntry(date: today, completed: false, scriptureReference: ""),
                ScriptureDayEntry(date: yStr, completed: true, scriptureReference: "")
            ]
        )
        XCTAssertEqual(blob.scriptureStreakCount(referenceNow: ref, calendar: cal), 1)
    }

    func testTimerElapsedMathPaused() {
        let state = ActiveTimerState(
            title: "",
            category: "deep",
            startedAtMs: 0,
            accumulatedPausedMs: 0,
            pauseBeganAtMs: 5000
        )
        let elapsed = TimeTimerMath.elapsedMs(state: state, referenceNowMs: 8000)
        XCTAssertEqual(elapsed, 5000)
    }

    func testTimerElapsedMathRunning() {
        let state = ActiveTimerState(
            title: "",
            category: "deep",
            startedAtMs: 1000,
            accumulatedPausedMs: 200,
            pauseBeganAtMs: nil
        )
        let elapsed = TimeTimerMath.elapsedMs(state: state, referenceNowMs: 5000)
        XCTAssertEqual(elapsed, 3800)
    }
}
