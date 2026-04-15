import Foundation

/// Maps YNAB month + role mappings → Baseline `BudgetScenario` money fields (cents).
enum YNABScenarioImport {

    struct Result {
        var monthlyIncomeCents: Int
        var fixedNeedsCents: Int
        var flexibleNeedsEstimateCents: Int
        var wantsBudgetCents: Int
    }

    /// Computes Baseline scenario cents. Does **not** change `wantsSpentCents` (caller preserves existing).
    static func baselineImport(
        month: YNABMonthDetail,
        mappings: [YNABCategoryMapping],
        incomeSources: [YNABIncomeSource],
        referenceMonth: Date = Date(),
        calendar: Calendar = .current
    ) -> Result {
        let balances = BudgetMetricsEngine.buildBalances(monthCategories: month.categories, mappings: mappings)

        let incomeDollars: Double
        if !incomeSources.isEmpty {
            incomeDollars = BudgetMetricsEngine.expectedIncomeThisMonth(
                sources: incomeSources,
                month: referenceMonth,
                calendar: calendar
            )
        } else if let inc = month.income {
            incomeDollars = Double(inc) / 1000.0
        } else {
            incomeDollars = 0
        }

        let fixed = balances
            .filter { $0.role == .mortgage || $0.role == .bill }
            .reduce(0.0) { $0 + $1.monthlyTarget }
        let flex = balances
            .filter { $0.role == .essential }
            .reduce(0.0) { $0 + $1.monthlyTarget }
        let wants = balances
            .filter { $0.role == .flexible }
            .reduce(0.0) { $0 + $1.monthlyTarget }

        return Result(
            monthlyIncomeCents: dollarsToCentsRounded(incomeDollars),
            fixedNeedsCents: dollarsToCentsRounded(fixed),
            flexibleNeedsEstimateCents: dollarsToCentsRounded(flex),
            wantsBudgetCents: dollarsToCentsRounded(wants)
        )
    }

    private static func dollarsToCentsRounded(_ d: Double) -> Int {
        Int((d * 100.0).rounded())
    }
}
