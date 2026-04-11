import XCTest
@testable import YNABClarity

final class MetricsEngineTests: XCTestCase {

    private var balances: [CategoryBalance] {
        MetricsEngine.buildBalances(
            monthCategories: MockData.monthDetail.categories,
            mappings: MockData.mappings
        )
    }

    // MARK: - buildBalances

    func testBuildBalances_excludesIgnoredAndMissingMappings() {
        // MockData has 8 categories, all mapped. No ignored.
        XCTAssertEqual(balances.count, 8)
    }

    func testBuildBalances_milliunitsConvertedCorrectly() {
        let mortgage = balances.first { $0.role == .mortgage }
        XCTAssertNotNil(mortgage)
        // budgeted: 2_150_000 milliunits = $2,150.00
        XCTAssertEqual(mortgage?.monthlyTarget ?? 0, 2150.0, accuracy: 0.01)
        // balance: 1_400_000 milliunits = $1,400.00
        XCTAssertEqual(mortgage?.available ?? 0, 1400.0, accuracy: 0.01)
    }

    // MARK: - totalRequired

    func testTotalRequired_sumsMortgageBillEssential() {
        let required = MetricsEngine.totalRequired(balances)
        // Mortgage: 2150 + Electric: 150 + Internet: 80 + Insurance: 210 + Groceries: 600 + Gas: 150 = 3340
        XCTAssertEqual(required, 3340.0, accuracy: 0.01)
    }

    // MARK: - totalFunded

    func testTotalFunded_capsAtMonthlyTarget() {
        let funded = MetricsEngine.totalFunded(balances)
        // Mortgage: min(1400, 2150) = 1400
        // Electric: min(150, 150) = 150
        // Internet: min(0, 80) = 0
        // Insurance: min(210, 210) = 210
        // Groceries: min(400, 600) = 400
        // Gas: min(100, 150) = 100
        // Total = 2260
        XCTAssertEqual(funded, 2260.0, accuracy: 0.01)
    }

    // MARK: - currentShortfall

    func testCurrentShortfall() {
        let shortfall = MetricsEngine.currentShortfall(balances)
        // 3340 - 2260 = 1080
        XCTAssertEqual(shortfall, 1080.0, accuracy: 0.01)
    }

    // MARK: - mortgageShortfall

    func testMortgageShortfall() {
        let shortfall = MetricsEngine.mortgageShortfall(balances)
        // 2150 - 1400 = 750
        XCTAssertEqual(shortfall, 750.0, accuracy: 0.01)
    }

    func testMortgageCoveredFraction() {
        let fraction = MetricsEngine.mortgageCoveredFraction(balances)
        // 1400 / 2150 ≈ 0.651
        XCTAssertEqual(fraction, 1400.0 / 2150.0, accuracy: 0.001)
    }

    // MARK: - safeToSpend

    func testSafeToSpend_reducedByShortfall() {
        let safe = MetricsEngine.safeToSpend(balances: balances)
        // Flexible: dining 250 + fun 200 = 450
        // Shortfall: 1080
        // max(0, 450 - 1080) = 0
        XCTAssertEqual(safe, 0.0, accuracy: 0.01)
    }

    func testSafeToSpend_withFullyFundedRequired() {
        // Build a scenario where all required categories are funded
        let fullyFunded: [YNABMonthCategory] = [
            YNABMonthCategory(id: "m", name: "Mortgage", budgeted: 2_000_000, activity: 0, balance: 2_000_000, hidden: false, deleted: false, goalTarget: 2_000_000, goalType: nil, goalPercentageComplete: nil),
            YNABMonthCategory(id: "f", name: "Fun",      budgeted:   300_000, activity: 0, balance:   300_000, hidden: false, deleted: false, goalTarget:   300_000, goalType: nil, goalPercentageComplete: nil),
        ]
        let localMappings = [
            CategoryMapping(ynabCategoryID: "m", ynabCategoryName: "Mortgage", role: .mortgage),
            CategoryMapping(ynabCategoryID: "f", ynabCategoryName: "Fun",      role: .flexible),
        ]
        let b = MetricsEngine.buildBalances(monthCategories: fullyFunded, mappings: localMappings)
        let safe = MetricsEngine.safeToSpend(balances: b)
        // All required funded, flexible = $300, shortfall = 0 → safe = $300
        XCTAssertEqual(safe, 300.0, accuracy: 0.01)
    }

    // MARK: - incomeGap

    func testIncomeGap() {
        let month = Calendar.current.date(from: DateComponents(year: 2026, month: 4))!
        let gap = MetricsEngine.incomeGap(balances: balances, sources: MockData.incomeSources, month: month)
        let required = MetricsEngine.totalRequired(balances)
        let income   = MetricsEngine.expectedIncomeThisMonth(sources: MockData.incomeSources, month: month)
        let expected = max(0, required - income)
        XCTAssertEqual(gap, expected, accuracy: 0.01)
    }

    // MARK: - grossAnnualNeeded

    func testGrossAnnualNeeded_at28Percent() {
        let gross = MetricsEngine.grossAnnualNeeded(netMonthlyNeeded: 6000, taxRate: 0.28)
        // (6000 * 12) / 0.72 = 100,000
        XCTAssertEqual(gross, 100_000.0, accuracy: 0.01)
    }

    func testGrossAnnualNeeded_zeroTax() {
        let gross = MetricsEngine.grossAnnualNeeded(netMonthlyNeeded: 5000, taxRate: 0.0)
        XCTAssertEqual(gross, 60_000.0, accuracy: 0.01)
    }

    func testGrossAnnualNeeded_taxRateAtOrAbove1_returnsMonthlyTimes12() {
        let gross = MetricsEngine.grossAnnualNeeded(netMonthlyNeeded: 5000, taxRate: 1.0)
        XCTAssertEqual(gross, 60_000.0, accuracy: 0.01)
    }

    // MARK: - goalTarget preference

    func testBuildBalances_usesGoalTargetWhenPresent() {
        let cats = [
            YNABMonthCategory(id: "x", name: "Test", budgeted: 0, activity: 0, balance: 0, hidden: false, deleted: false, goalTarget: 500_000, goalType: "MF", goalPercentageComplete: 0),
        ]
        let maps = [CategoryMapping(ynabCategoryID: "x", ynabCategoryName: "Test", role: .bill)]
        let b = MetricsEngine.buildBalances(monthCategories: cats, mappings: maps)
        XCTAssertEqual(b.first?.monthlyTarget ?? 0, 500.0, accuracy: 0.01)
    }

    func testBuildBalances_fallsToBudgetedWhenNoGoal() {
        let cats = [
            YNABMonthCategory(id: "x", name: "Test", budgeted: 200_000, activity: 0, balance: 100_000, hidden: false, deleted: false, goalTarget: nil, goalType: nil, goalPercentageComplete: nil),
        ]
        let maps = [CategoryMapping(ynabCategoryID: "x", ynabCategoryName: "Test", role: .bill)]
        let b = MetricsEngine.buildBalances(monthCategories: cats, mappings: maps)
        XCTAssertEqual(b.first?.monthlyTarget ?? 0, 200.0, accuracy: 0.01)
    }

    // MARK: - daysRemainingInMonth

    func testDaysRemainingInMonth_firstOfMonth() {
        var cal = Calendar.current
        cal.timeZone = TimeZone(identifier: "America/Denver")!
        let firstOfApril = cal.date(from: DateComponents(year: 2026, month: 4, day: 1))!
        let days = MetricsEngine.daysRemainingInMonth(from: firstOfApril, calendar: cal)
        XCTAssertEqual(days, 30)
    }

    func testDaysRemainingInMonth_lastOfMonth() {
        var cal = Calendar.current
        cal.timeZone = TimeZone(identifier: "America/Denver")!
        let lastOfApril = cal.date(from: DateComponents(year: 2026, month: 4, day: 30))!
        let days = MetricsEngine.daysRemainingInMonth(from: lastOfApril, calendar: cal)
        XCTAssertEqual(days, 1)
    }
}
