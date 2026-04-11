import Foundation

// MARK: - CategoryBalance
// Intermediate value type — bridges YNAB raw data + user's CategoryMapping rules.

struct CategoryBalance {
    let ynabCategoryID: String
    let name: String
    let role: CategoryRole
    /// Monthly target (dollars) — from YNAB goal target, falling back to budgeted/assigned.
    let monthlyTarget: Double
    /// Available balance (dollars) — from YNAB "balance" field.
    let available: Double
    /// Spending activity (dollars, negative = outflow) — from YNAB "activity" field.
    let activityDollars: Double
    /// Day of month the bill is due (0 = not set).
    let dueDay: Int
}

extension CategoryBalance {
    var shortfall: Double { max(0, monthlyTarget - max(0, available)) }

    /// A bill is covered if it still has positive balance (not yet paid), OR if it was
    /// budgeted and a payment has already gone out without going negative (paid this month).
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

// MARK: - MetricsEngine
// All functions are pure (no side effects, no SwiftUI imports).
// Input: arrays of value types. Output: plain Double / Int / Bool.

enum MetricsEngine {

    // MARK: Build from raw YNAB data

    /// Merges YNAB month categories with the user's role mappings.
    /// Filters hidden, deleted, and ignored categories.
    static func buildBalances(
        monthCategories: [YNABMonthCategory],
        mappings: [CategoryMapping]
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

    // MARK: Required obligations

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

    // MARK: Mortgage

    static func mortgageShortfall(_ balances: [CategoryBalance]) -> Double {
        let m = balances.filter { $0.role == .mortgage }
        let target    = m.reduce(0) { $0 + $1.monthlyTarget }
        let available = m.reduce(0) { $0 + $1.available }
        return max(0, target - available)
    }

    static func mortgageCoveredFraction(_ balances: [CategoryBalance]) -> Double {
        let m = balances.filter { $0.role == .mortgage }
        let target = m.reduce(0) { $0 + $1.monthlyTarget }
        guard target > 0 else { return 1.0 }
        let funded = m.reduce(0) { $0 + min($1.available, $1.monthlyTarget) }
        return min(1.0, funded / target)
    }

    // MARK: Bills (non-mortgage required)

    static func billsCoverageFraction(_ balances: [CategoryBalance]) -> Double {
        let b = balances.filter { $0.role == .bill || $0.role == .essential }
        let target = b.reduce(0) { $0 + $1.monthlyTarget }
        guard target > 0 else { return 1.0 }
        let funded = b.reduce(0) { $0 + min($1.available, $1.monthlyTarget) }
        return min(1.0, funded / target)
    }

    // MARK: Safe to spend

    static func safeToSpend(balances: [CategoryBalance]) -> Double {
        let flexAvailable = balances
            .filter { $0.role == .flexible }
            .reduce(0) { $0 + max(0, $1.available) }
        return max(0, flexAvailable - currentShortfall(balances))
    }

    static func safePerDay(balances: [CategoryBalance], daysRemaining: Int) -> Double {
        guard daysRemaining > 0 else { return 0 }
        return safeToSpend(balances: balances) / Double(daysRemaining)
    }

    static func safePerWeek(balances: [CategoryBalance], daysRemaining: Int) -> Double {
        safePerDay(balances: balances, daysRemaining: daysRemaining) * 7
    }

    // MARK: Income

    static func expectedIncomeThisMonth(
        sources: [IncomeSource],
        month: Date,
        calendar: Calendar = .current
    ) -> Double {
        sources.reduce(0.0) { total, source in
            let count = source.occurrencesInMonth(month, calendar: calendar).count
            return total + source.amountDollars * Double(count)
        }
    }

    static func incomeGap(
        balances: [CategoryBalance],
        sources: [IncomeSource],
        month: Date
    ) -> Double {
        max(0, totalRequired(balances) - expectedIncomeThisMonth(sources: sources, month: month))
    }

    // MARK: Salary target

    /// Gross annual salary needed to net `netMonthlyNeeded` per month after tax.
    static func grossAnnualNeeded(netMonthlyNeeded: Double, taxRate: Double) -> Double {
        guard taxRate >= 0, taxRate < 1.0 else { return netMonthlyNeeded * 12 }
        return (netMonthlyNeeded * 12) / (1 - taxRate)
    }

    // MARK: Time helpers

    static func daysRemainingInMonth(from date: Date = Date(), calendar: Calendar = .current) -> Int {
        guard let range = calendar.range(of: .day, in: .month, for: date) else { return 1 }
        let today = calendar.component(.day, from: date)
        return max(1, range.count - today + 1)
    }

    // MARK: Underfunded goals

    static func underfundedGoals(
        monthCategories: [YNABMonthCategory],
        mappings: [CategoryMapping]
    ) -> [GoalStatus] {
        let roleByID = Dictionary(uniqueKeysWithValues: mappings.map { ($0.ynabCategoryID, $0) })
        return monthCategories.compactMap { cat -> GoalStatus? in
            guard !cat.hidden, !cat.deleted else { return nil }
            guard let mapping = roleByID[cat.id], mapping.role != .ignore else { return nil }
            guard let target = cat.goalTargetDollars, target > 0 else { return nil }
            let assigned = cat.budgetedDollars
            let gap = target - assigned
            guard gap > 0.01 else { return nil }
            return GoalStatus(
                categoryName: cat.name,
                goalTarget: target,
                assigned: assigned,
                gap: gap
            )
        }
        .sorted { $0.gap > $1.gap }
    }
}

// MARK: - GoalStatus

struct GoalStatus: Identifiable {
    let id = UUID()
    let categoryName: String
    let goalTarget: Double
    let assigned: Double
    let gap: Double
}
