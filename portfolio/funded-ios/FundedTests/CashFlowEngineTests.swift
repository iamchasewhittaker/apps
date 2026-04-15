import XCTest
@testable import Funded

final class CashFlowEngineTests: XCTestCase {

    private var calendar: Calendar = {
        var cal = Calendar(identifier: .gregorian)
        cal.timeZone = TimeZone(identifier: "America/Denver")!
        return cal
    }()

    private var april2026: Date {
        calendar.date(from: DateComponents(year: 2026, month: 4, day: 1))!
    }

    private var balances: [CategoryBalance] {
        MetricsEngine.buildBalances(
            monthCategories: MockData.monthDetail.categories,
            mappings: MockData.mappings
        )
    }

    // MARK: - Timeline generation

    func testTimeline_containsPaycheckEvents() {
        let timeline = CashFlowEngine.buildTimeline(
            sources: MockData.incomeSources,
            balances: balances,
            month: april2026,
            calendar: calendar
        )
        let paychecks = timeline.filter { $0.kind == .paycheck }
        // Kassie biweekly: 2 paychecks (Apr 5, Apr 19); Basement rent: 1; Car loan: 1 → 4 total
        XCTAssertGreaterThanOrEqual(paychecks.count, 3)
    }

    func testTimeline_containsBillEvents() {
        let timeline = CashFlowEngine.buildTimeline(
            sources: MockData.incomeSources,
            balances: balances,
            month: april2026,
            calendar: calendar
        )
        let bills = timeline.filter { $0.kind == .bill }
        XCTAssertGreaterThan(bills.count, 0)
    }

    func testTimeline_sortedChronologically() {
        let timeline = CashFlowEngine.buildTimeline(
            sources: MockData.incomeSources,
            balances: balances,
            month: april2026,
            calendar: calendar
        )
        let dates = timeline.map(\.date)
        XCTAssertEqual(dates, dates.sorted())
    }

    func testTimeline_cumulativeIncomeNeverDecreases() {
        let timeline = CashFlowEngine.buildTimeline(
            sources: MockData.incomeSources,
            balances: balances,
            month: april2026,
            calendar: calendar
        )
        var prev = 0.0
        for event in timeline {
            XCTAssertGreaterThanOrEqual(event.cumulativeIncome, prev - 0.01)
            prev = event.cumulativeIncome
        }
    }

    // MARK: - IncomeSource.occurrencesInMonth

    func testBiweeklyOccurrences_april() {
        // Kassie paycheck anchored on Apr 5; biweekly should give Apr 5 and Apr 19
        let april5 = calendar.date(from: DateComponents(year: 2026, month: 4, day: 5))!
        let source = IncomeSource(name: "Test", amountCents: 100_000, frequency: .biweekly, nextPayDate: april5)
        let dates = source.occurrencesInMonth(april2026, calendar: calendar)
        XCTAssertEqual(dates.count, 2)
        let days = dates.map { calendar.component(.day, from: $0) }.sorted()
        XCTAssertEqual(days, [5, 19])
    }

    func testMonthlyOccurrences_onlyOnce() {
        let apr1 = calendar.date(from: DateComponents(year: 2026, month: 4, day: 1))!
        let source = IncomeSource(name: "Rent", amountCents: 150_000, frequency: .monthly, nextPayDate: apr1)
        let dates = source.occurrencesInMonth(april2026, calendar: calendar)
        XCTAssertEqual(dates.count, 1)
        XCTAssertEqual(calendar.component(.day, from: dates[0]), 1)
    }

    func testMonthlyOccurrences_clampsDayToMonthLength() {
        // Feb has 28 days in 2026; a source anchored on the 31st should clamp to 28
        let jan31 = calendar.date(from: DateComponents(year: 2026, month: 1, day: 31))!
        let source = IncomeSource(name: "Test", amountCents: 100, frequency: .monthly, nextPayDate: jan31)
        let feb2026 = calendar.date(from: DateComponents(year: 2026, month: 2, day: 1))!
        let dates = source.occurrencesInMonth(feb2026, calendar: calendar)
        XCTAssertEqual(dates.count, 1)
        XCTAssertEqual(calendar.component(.day, from: dates[0]), 28)
    }
}
