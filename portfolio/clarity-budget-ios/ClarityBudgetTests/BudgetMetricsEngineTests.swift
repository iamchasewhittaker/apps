import XCTest
@testable import ClarityBudget

final class BudgetMetricsEngineTests: XCTestCase {

    func testSafePerDayDividesByDaysRemaining() {
        let balances: [CategoryBalance] = [
            CategoryBalance(
                ynabCategoryID: "a",
                name: "Flex",
                role: .flexible,
                monthlyTarget: 0,
                available: 300,
                activityDollars: 0,
                dueDay: 0
            )
        ]
        let sts = BudgetMetricsEngine.safeToSpend(balances: balances, toBeBudgeted: 0)
        XCTAssertEqual(sts, 300, accuracy: 0.001)
        let perDay = BudgetMetricsEngine.safePerDay(balances: balances, daysRemaining: 10, toBeBudgeted: 0)
        XCTAssertEqual(perDay, 30, accuracy: 0.001)
    }

    func testSafePerWeekIsSevenTimesPerDay() {
        let balances: [CategoryBalance] = [
            CategoryBalance(
                ynabCategoryID: "a",
                name: "Flex",
                role: .flexible,
                monthlyTarget: 0,
                available: 70,
                activityDollars: 0,
                dueDay: 0
            )
        ]
        let week = BudgetMetricsEngine.safePerWeek(balances: balances, daysRemaining: 7, toBeBudgeted: 0)
        XCTAssertEqual(week, 70, accuracy: 0.001)
    }

    func testSafePerDayZeroWhenNoDaysLeft() {
        let balances: [CategoryBalance] = [
            CategoryBalance(
                ynabCategoryID: "a",
                name: "Flex",
                role: .flexible,
                monthlyTarget: 0,
                available: 100,
                activityDollars: 0,
                dueDay: 0
            )
        ]
        XCTAssertEqual(
            BudgetMetricsEngine.safePerDay(balances: balances, daysRemaining: 0, toBeBudgeted: 0),
            0,
            accuracy: 0.001
        )
    }

    func testShortfallReducesSafeToSpendAndPerDay() {
        let balances: [CategoryBalance] = [
            CategoryBalance(
                ynabCategoryID: "bill1",
                name: "Rent",
                role: .bill,
                monthlyTarget: 100,
                available: 40,
                activityDollars: 0,
                dueDay: 1
            ),
            CategoryBalance(
                ynabCategoryID: "fun",
                name: "Fun",
                role: .flexible,
                monthlyTarget: 0,
                available: 200,
                activityDollars: 0,
                dueDay: 0
            )
        ]
        let sts = BudgetMetricsEngine.safeToSpend(balances: balances, toBeBudgeted: 0)
        XCTAssertEqual(sts, 140, accuracy: 0.001)
        let perDay = BudgetMetricsEngine.safePerDay(balances: balances, daysRemaining: 7, toBeBudgeted: 0)
        XCTAssertEqual(perDay, 20, accuracy: 0.001)
    }
}
