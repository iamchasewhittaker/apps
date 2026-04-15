import Foundation

// MARK: - CategoryBalance (value type; mirrors YNAB Clarity MetricsEngine)

struct CategoryBalance {
    let ynabCategoryID: String
    let name: String
    let role: CategoryRole
    let monthlyTarget: Double
    let available: Double
    let activityDollars: Double
    let dueDay: Int
}

extension CategoryBalance {
    var shortfall: Double { max(0, monthlyTarget - max(0, available)) }

    var isCovered: Bool {
        if available >= monthlyTarget { return true }
        return monthlyTarget > 0 && activityDollars < 0 && available >= 0
    }

    var coverageFraction: Double {
        guard monthlyTarget > 0 else { return 1.0 }
        if isCovered { return 1.0 }
        return min(1.0, max(0, available) / monthlyTarget)
    }
}

// MARK: - Metrics (pure; Codable DTOs instead of SwiftData)

enum BudgetMetricsEngine {

    static func buildBalances(
        monthCategories: [YNABMonthCategory],
        mappings: [YNABCategoryMapping]
    ) -> [CategoryBalance] {
        let roleByID = Dictionary(uniqueKeysWithValues: mappings.map { ($0.ynabCategoryID, $0) })
        return monthCategories.compactMap { cat in
            guard !cat.hidden, !cat.deleted else { return nil }
            guard let mapping = roleByID[cat.id] else { return nil }
            let role = mapping.role
            guard role != .ignore else { return nil }
            return CategoryBalance(
                ynabCategoryID: cat.id,
                name: cat.name,
                role: role,
                monthlyTarget: cat.goalTargetDollars ?? cat.budgetedDollars,
                available: cat.balanceDollars,
                activityDollars: cat.activityDollars,
                dueDay: mapping.dueDay
            )
        }
    }

    static func totalRequired(_ balances: [CategoryBalance]) -> Double {
        balances
            .filter { $0.role == .mortgage || $0.role == .bill || $0.role == .essential }
            .reduce(0) { $0 + $1.monthlyTarget }
    }

    static func totalFunded(_ balances: [CategoryBalance]) -> Double {
        balances
            .filter { $0.role == .mortgage || $0.role == .bill || $0.role == .essential }
            .reduce(0) { $0 + min($1.available, $1.monthlyTarget) }
    }

    static func currentShortfall(_ balances: [CategoryBalance]) -> Double {
        max(0, totalRequired(balances) - totalFunded(balances))
    }

    static func safeToSpend(balances: [CategoryBalance], toBeBudgeted: Double = 0) -> Double {
        let discretionary = balances
            .filter { $0.role != .mortgage && $0.role != .bill && $0.role != .essential }
            .reduce(0) { $0 + max(0, $1.available) }
        let tbb = max(0, toBeBudgeted)
        return max(0, discretionary + tbb - currentShortfall(balances))
    }

    static func daysRemainingInMonth(from date: Date = Date(), calendar: Calendar = .current) -> Int {
        guard let range = calendar.range(of: .day, in: .month, for: date) else { return 1 }
        let today = calendar.component(.day, from: date)
        return max(1, range.count - today + 1)
    }

    static func expectedIncomeThisMonth(
        sources: [YNABIncomeSource],
        month: Date,
        calendar: Calendar = .current
    ) -> Double {
        sources.reduce(0.0) { total, source in
            let count = source.occurrencesInMonth(month, calendar: calendar).count
            return total + source.amountDollars * Double(count)
        }
    }

    static func underfundedGoals(
        monthCategories: [YNABMonthCategory],
        mappings: [YNABCategoryMapping]
    ) -> [BudgetGoalStatus] {
        let roleByID = Dictionary(uniqueKeysWithValues: mappings.map { ($0.ynabCategoryID, $0) })
        return monthCategories.compactMap { cat -> BudgetGoalStatus? in
            guard !cat.hidden, !cat.deleted else { return nil }
            guard let mapping = roleByID[cat.id], mapping.role != .ignore else { return nil }
            guard let target = cat.goalTargetDollars, target > 0 else { return nil }
            let assigned = cat.budgetedDollars
            let gap = target - assigned
            guard gap > 0.01 else { return nil }
            return BudgetGoalStatus(
                ynabCategoryID: cat.id,
                categoryName: cat.name,
                goalTarget: target,
                assigned: assigned,
                gap: gap
            )
        }
        .sorted { $0.gap > $1.gap }
    }
}

struct BudgetGoalStatus: Identifiable {
    let ynabCategoryID: String
    let categoryName: String
    let goalTarget: Double
    let assigned: Double
    let gap: Double
    var id: String { ynabCategoryID }
}
