import XCTest
@testable import Unnamed

final class AppStateTests: XCTestCase {

    // MARK: - Encode/decode round-trip

    func testAppStateRoundTrip() throws {
        var state = AppState()
        var item = Item(text: "Test item")
        item.lane = .regulation
        state.items = [item]
        state.locks = [DailyLock(date: "2025-01-01", lane1: .regulation, lane2: .future)]
        state.checks = [DailyCheck(date: "2025-01-01", produced: true, stayedInLanes: false)]

        let data = try JSONEncoder().encode(state)
        let decoded = try JSONDecoder().decode(AppState.self, from: data)

        XCTAssertEqual(decoded.items.count, 1)
        XCTAssertEqual(decoded.items[0].text, "Test item")
        XCTAssertEqual(decoded.items[0].lane, .regulation)
        XCTAssertEqual(decoded.locks[0].lane1, .regulation)
        XCTAssertEqual(decoded.locks[0].lane2, .future)
        XCTAssertTrue(decoded.checks[0].produced)
        XCTAssertFalse(decoded.checks[0].stayedInLanes)
    }

    // MARK: - DateHelpers

    func testTodayStringFormat() {
        let today = DateHelpers.todayString
        XCTAssertEqual(today.count, 10, "Expected YYYY-MM-DD (10 chars), got '\(today)'")
        XCTAssertEqual(today[today.index(today.startIndex, offsetBy: 4)], "-")
        XCTAssertEqual(today[today.index(today.startIndex, offsetBy: 7)], "-")
        XCTAssertTrue(DateHelpers.isToday(today))
    }

    func testIsTodayFalseForPastDates() {
        XCTAssertFalse(DateHelpers.isToday("2000-01-01"))
        XCTAssertFalse(DateHelpers.isToday(""))
        XCTAssertFalse(DateHelpers.isToday("not-a-date"))
    }

    // MARK: - Lane lock

    func testIsLockedTodayFalseWhenNoLock() {
        let state = AppState()
        let isLocked = state.locks.contains { DateHelpers.isToday($0.date) }
        XCTAssertFalse(isLocked)
    }

    func testIsLockedTodayFalseForPastLock() {
        var state = AppState()
        state.locks = [DailyLock(date: "2000-01-01", lane1: .regulation, lane2: .future)]
        let isLocked = state.locks.contains { DateHelpers.isToday($0.date) }
        XCTAssertFalse(isLocked)
    }

    func testIsLockedTodayTrueWhenTodayLockExists() {
        var state = AppState()
        state.locks = [DailyLock(date: DateHelpers.todayString, lane1: .regulation, lane2: .future)]
        let isLocked = state.locks.contains { DateHelpers.isToday($0.date) }
        XCTAssertTrue(isLocked)
    }

    func testLockIsIrreversible() {
        var state = AppState()
        let first = DailyLock(date: DateHelpers.todayString, lane1: .regulation, lane2: .future)
        state.locks = [first]

        // Simulate the guard in AppStore.lockLanes
        let alreadyLocked = state.locks.contains { DateHelpers.isToday($0.date) }
        if !alreadyLocked {
            state.locks.append(DailyLock(date: DateHelpers.todayString, lane1: .maintenance, lane2: .support))
        }

        XCTAssertEqual(state.locks.count, 1)
        XCTAssertEqual(state.locks[0].lane1, .regulation)
        XCTAssertEqual(state.locks[0].lane2, .future)
    }

    // MARK: - Daily check

    func testHasCheckedTodayFalseInitially() {
        let state = AppState()
        let hasChecked = state.checks.contains { DateHelpers.isToday($0.date) }
        XCTAssertFalse(hasChecked)
    }

    func testHasCheckedTodayTrueAfterLog() {
        var state = AppState()
        state.checks = [DailyCheck(date: DateHelpers.todayString, produced: true, stayedInLanes: true)]
        let hasChecked = state.checks.contains { DateHelpers.isToday($0.date) }
        XCTAssertTrue(hasChecked)
    }

    func testCheckResultPhrases() {
        // Solid day: both yes
        let both = DailyCheck(date: DateHelpers.todayString, produced: true, stayedInLanes: true)
        XCTAssertTrue(both.produced && both.stayedInLanes)

        // Halfway: one yes
        let one = DailyCheck(date: DateHelpers.todayString, produced: true, stayedInLanes: false)
        XCTAssertTrue(one.produced || one.stayedInLanes)
        XCTAssertFalse(one.produced && one.stayedInLanes)

        // Rest day: neither
        let neither = DailyCheck(date: DateHelpers.todayString, produced: false, stayedInLanes: false)
        XCTAssertFalse(neither.produced || neither.stayedInLanes)
    }
}
