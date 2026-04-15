import XCTest
@testable import ClarityBudget

final class YNABScenarioImportTests: XCTestCase {

    func testBaselineImportUsesIncomeSourcesWhenPresent() throws {
        let cal = Calendar(identifier: .gregorian)
        var comps = DateComponents()
        comps.year = 2026
        comps.month = 4
        comps.day = 10
        let ref = try XCTUnwrap(cal.date(from: comps))

        let month = try decodeMonthJSON("""
        {
          "month": "2026-04-01",
          "income": 5000000,
          "to_be_budgeted": 0,
          "categories": [
            {"id":"m1","name":"Mortgage","budgeted":2000000,"activity":0,"balance":2000000,"hidden":false,"deleted":false,"goal_target":2000000,"goal_type":"MF","goal_percentage_complete":null},
            {"id":"b1","name":"Electric","budgeted":150000,"activity":0,"balance":150000,"hidden":false,"deleted":false,"goal_target":150000,"goal_type":"MF","goal_percentage_complete":null},
            {"id":"e1","name":"Groceries","budgeted":400000,"activity":0,"balance":400000,"hidden":false,"deleted":false,"goal_target":400000,"goal_type":"MF","goal_percentage_complete":null},
            {"id":"f1","name":"Fun","budgeted":100000,"activity":0,"balance":100000,"hidden":false,"deleted":false,"goal_target":100000,"goal_type":"MF","goal_percentage_complete":null}
          ]
        }
        """)

        let mappings: [YNABCategoryMapping] = [
            YNABCategoryMapping(ynabCategoryID: "m1", ynabCategoryName: "Mortgage", ynabGroupName: "H", role: .mortgage),
            YNABCategoryMapping(ynabCategoryID: "b1", ynabCategoryName: "Electric", ynabGroupName: "B", role: .bill),
            YNABCategoryMapping(ynabCategoryID: "e1", ynabCategoryName: "Groceries", ynabGroupName: "E", role: .essential),
            YNABCategoryMapping(ynabCategoryID: "f1", ynabCategoryName: "Fun", ynabGroupName: "F", role: .flexible),
        ]

        var payComps = DateComponents()
        payComps.year = 2026
        payComps.month = 4
        payComps.day = 1
        let pay1 = try XCTUnwrap(cal.date(from: payComps))
        payComps.day = 15
        let pay2 = try XCTUnwrap(cal.date(from: payComps))

        let sources: [YNABIncomeSource] = [
            YNABIncomeSource(
                name: "Job",
                amountCents: 2_500_00,
                frequency: .semimonthly,
                nextPayDate: pay1,
                secondPayDay: 15,
                sortOrder: 0
            )
        ]

        let r = YNABScenarioImport.baselineImport(
            month: month,
            mappings: mappings,
            incomeSources: sources,
            referenceMonth: ref,
            calendar: cal
        )

        XCTAssertEqual(r.monthlyIncomeCents, 5_000_00)
        XCTAssertEqual(r.fixedNeedsCents, 2_150_00)
        XCTAssertEqual(r.flexibleNeedsEstimateCents, 400_00)
        XCTAssertEqual(r.wantsBudgetCents, 100_00)
    }

    func testBaselineImportFallsBackToMonthIncome() throws {
        let month = try decodeMonthJSON("""
        {
          "month": "2026-04-01",
          "income": 4800000,
          "to_be_budgeted": 0,
          "categories": []
        }
        """)

        let r = YNABScenarioImport.baselineImport(
            month: month,
            mappings: [],
            incomeSources: [],
            referenceMonth: Date(),
            calendar: .current
        )
        XCTAssertEqual(r.monthlyIncomeCents, 4_800_00)
    }

    private func decodeMonthJSON(_ json: String) throws -> YNABMonthDetail {
        let data = Data(json.utf8)
        let dec = JSONDecoder()
        dec.keyDecodingStrategy = .convertFromSnakeCase
        return try dec.decode(YNABMonthDetail.self, from: data)
    }
}
