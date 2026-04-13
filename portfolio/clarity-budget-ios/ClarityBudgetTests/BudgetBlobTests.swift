import XCTest
@testable import ClarityBudget

final class BudgetBlobTests: XCTestCase {

    func testBlobEncodeDecodeRoundTrip() throws {
        let blob = BudgetBlob(
            baseline: BudgetScenario(
                id: "baseline",
                label: "Baseline",
                monthlyIncomeCents: 4_200_00,
                fixedNeedsCents: 2_000_00,
                flexibleNeedsEstimateCents: 600_00,
                wantsBudgetCents: 300_00,
                wantsSpentCents: 45_50
            ),
            stretch: BudgetScenario(
                id: "stretch",
                label: "Stretch",
                monthlyIncomeCents: 4_200_00,
                fixedNeedsCents: 1_900_00,
                flexibleNeedsEstimateCents: 550_00,
                wantsBudgetCents: 400_00,
                wantsSpentCents: 0
            )
        )

        let data = try JSONEncoder().encode(blob)
        let decoded = try JSONDecoder().decode(BudgetBlob.self, from: data)

        XCTAssertEqual(decoded.baseline.wantsSpentCents, 45_50)
        XCTAssertEqual(decoded.stretch.fixedNeedsCents, 1_900_00)
    }

    func testAfterNeedsAndSurplusMath() {
        let s = BudgetScenario(
            id: "t",
            label: "T",
            monthlyIncomeCents: 10_000_00,
            fixedNeedsCents: 6_000_00,
            flexibleNeedsEstimateCents: 1_000_00,
            wantsBudgetCents: 500_00,
            wantsSpentCents: 200_00
        )
        XCTAssertEqual(s.afterNeedsCents, 3_000_00)
        XCTAssertEqual(s.wantsRemainingVersusBudgetCents, 300_00)
        XCTAssertEqual(s.surplusAfterNeedsAndWantsCents, 2_800_00)
    }

    func testMoneyFormatNonEmpty() {
        let s = BudgetMoneyFormat.string(fromCents: 100)
        XCTAssertFalse(s.isEmpty)
    }
}
