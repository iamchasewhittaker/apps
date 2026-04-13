import XCTest
@testable import ClarityUI

final class DateHelpersTests: XCTestCase {

    func testTodayStringFormat() {
        let today = DateHelpers.todayString
        // Must match yyyy-MM-dd
        XCTAssertTrue(today.count == 10)
        XCTAssertEqual(today.split(separator: "-").count, 3)
    }

    func testIsToday() {
        XCTAssertTrue(DateHelpers.isToday(DateHelpers.todayString))
        XCTAssertFalse(DateHelpers.isToday("2000-01-01"))
    }

    func testRoundTrip() {
        let today = DateHelpers.todayString
        let date = DateHelpers.date(from: today)
        XCTAssertNotNil(date)
        let back = DateHelpers.dateString(from: date!)
        XCTAssertEqual(back, today)
    }

    func testIsStale() {
        XCTAssertTrue(DateHelpers.isStale("2000-01-01", hours: 24))
        XCTAssertFalse(DateHelpers.isStale(DateHelpers.todayString, hours: 24))
    }

    func testJsTimestamp() {
        let ms: Int64 = 1_700_000_000_000
        let date = DateHelpers.date(fromJsTimestamp: ms)
        XCTAssertEqual(date.timeIntervalSince1970, 1_700_000_000.0, accuracy: 0.001)
    }
}
