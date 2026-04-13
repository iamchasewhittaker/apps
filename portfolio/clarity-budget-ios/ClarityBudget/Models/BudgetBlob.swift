import Foundation

// MARK: - Scenario kind (dual scenarios)

/// Which of the two persisted scenarios the user is focusing on (e.g. for wants logging).
enum BudgetScenarioKind: String, Codable, CaseIterable, Identifiable {
    case baseline
    case stretch

    var id: String { rawValue }

    var displayLabel: String {
        switch self {
        case .baseline: "Baseline"
        case .stretch: "Stretch"
        }
    }
}

// MARK: - Single scenario row

/// One budget scenario: income, needs, planned wants cap, and tracked wants spend (all in **cents**).
struct BudgetScenario: Codable, Identifiable, Equatable {
    var id: String
    var label: String
    var monthlyIncomeCents: Int
    /// Rent, debt minimums, subscriptions — committed each month.
    var fixedNeedsCents: Int
    /// Groceries, fuel, variable-but-required estimate.
    var flexibleNeedsEstimateCents: Int
    /// Planned cap for discretionary “wants” this period.
    var wantsBudgetCents: Int
    /// Logged spend toward wants (v0.1: single running total per scenario).
    var wantsSpentCents: Int
}

// MARK: - Root blob

/// Local-first state for Clarity Budget. Stored under `BudgetConfig.storeKey`.
struct BudgetBlob: Codable, Equatable {
    /// Conservative / default plan (e.g. baseline month).
    var baseline: BudgetScenario
    /// Aspirational or tighter plan for comparison.
    var stretch: BudgetScenario
}

// MARK: - Math (pure; testable)

extension BudgetScenario {
    /// Income after fixed + flexible needs.
    var afterNeedsCents: Int {
        monthlyIncomeCents - fixedNeedsCents - flexibleNeedsEstimateCents
    }

    /// Planned wants allowance minus what has been logged.
    var wantsRemainingVersusBudgetCents: Int {
        wantsBudgetCents - wantsSpentCents
    }

    /// Cash left after needs **and** actual wants spend (not capped by wants budget).
    var surplusAfterNeedsAndWantsCents: Int {
        afterNeedsCents - wantsSpentCents
    }
}

// MARK: - Display

enum BudgetMoneyFormat {
    private static let formatter: NumberFormatter = {
        let f = NumberFormatter()
        f.numberStyle = .currency
        f.currencyCode = "USD"
        f.maximumFractionDigits = 2
        f.minimumFractionDigits = 2
        return f
    }()

    static func string(fromCents cents: Int) -> String {
        let number = NSDecimalNumber(value: Double(cents) / 100.0)
        return formatter.string(from: number) ?? "$0.00"
    }
}

enum BudgetBlobFactory {
    static func defaultBlob() -> BudgetBlob {
        BudgetBlob(
            baseline: BudgetScenario(
                id: "baseline",
                label: "Baseline",
                monthlyIncomeCents: 5_000_00,
                fixedNeedsCents: 2_800_00,
                flexibleNeedsEstimateCents: 900_00,
                wantsBudgetCents: 400_00,
                wantsSpentCents: 0
            ),
            stretch: BudgetScenario(
                id: "stretch",
                label: "Stretch",
                monthlyIncomeCents: 5_000_00,
                fixedNeedsCents: 2_600_00,
                flexibleNeedsEstimateCents: 850_00,
                wantsBudgetCents: 550_00,
                wantsSpentCents: 0
            )
        )
    }
}
