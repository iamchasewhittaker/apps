import Foundation

/// Static mock data for SwiftUI previews and unit tests.
/// Uses placeholder IDs — never the real YNAB budget ID.
enum MockData {
    static let budgetID = "preview-budget-id"

    static let monthDetail = YNABMonthDetail(
        month: "2026-04-01",
        income: nil,
        toBeBudgeted: 50_000,
        categories: [
            YNABMonthCategory(id: "cat-mortgage",  name: "Mortgage",    budgeted: 2_150_000, activity: 0,         balance: 1_400_000, hidden: false, deleted: false, goalTarget: 2_150_000, goalType: "MF", goalPercentageComplete: 65),
            YNABMonthCategory(id: "cat-electric",  name: "Electric",    budgeted:   150_000, activity: 0,         balance:   150_000, hidden: false, deleted: false, goalTarget:   150_000, goalType: "MF", goalPercentageComplete: 100),
            YNABMonthCategory(id: "cat-internet",  name: "Internet",    budgeted:    80_000, activity: 0,         balance:         0, hidden: false, deleted: false, goalTarget:    80_000, goalType: "MF", goalPercentageComplete: 0),
            YNABMonthCategory(id: "cat-insurance", name: "Insurance",   budgeted:   210_000, activity: 0,         balance:   210_000, hidden: false, deleted: false, goalTarget:   210_000, goalType: "MF", goalPercentageComplete: 100),
            YNABMonthCategory(id: "cat-groceries", name: "Groceries",   budgeted:   600_000, activity: -200_000,  balance:   400_000, hidden: false, deleted: false, goalTarget:   600_000, goalType: "MF", goalPercentageComplete: 67),
            YNABMonthCategory(id: "cat-gas",       name: "Gas",         budgeted:   150_000, activity:  -50_000,  balance:   100_000, hidden: false, deleted: false, goalTarget:   150_000, goalType: "MF", goalPercentageComplete: 67),
            YNABMonthCategory(id: "cat-dining",    name: "Dining Out",  budgeted:   300_000, activity:  -50_000,  balance:   250_000, hidden: false, deleted: false, goalTarget:   300_000, goalType: "MF", goalPercentageComplete: 83),
            YNABMonthCategory(id: "cat-fun",       name: "Fun Money",   budgeted:   200_000, activity:       0,   balance:   200_000, hidden: false, deleted: false, goalTarget:   200_000, goalType: "MF", goalPercentageComplete: 100),
        ]
    )

    static let mappings: [CategoryMapping] = {
        let m = [
            CategoryMapping(ynabCategoryID: "cat-mortgage",  ynabCategoryName: "Mortgage",   ynabGroupName: "Housing",     role: .mortgage),
            CategoryMapping(ynabCategoryID: "cat-electric",  ynabCategoryName: "Electric",   ynabGroupName: "Bills",       role: .bill),
            CategoryMapping(ynabCategoryID: "cat-internet",  ynabCategoryName: "Internet",   ynabGroupName: "Bills",       role: .bill),
            CategoryMapping(ynabCategoryID: "cat-insurance", ynabCategoryName: "Insurance",  ynabGroupName: "Bills",       role: .bill),
            CategoryMapping(ynabCategoryID: "cat-groceries", ynabCategoryName: "Groceries",  ynabGroupName: "Essentials",  role: .essential),
            CategoryMapping(ynabCategoryID: "cat-gas",       ynabCategoryName: "Gas",        ynabGroupName: "Essentials",  role: .essential),
            CategoryMapping(ynabCategoryID: "cat-dining",    ynabCategoryName: "Dining Out", ynabGroupName: "Flex",        role: .flexible),
            CategoryMapping(ynabCategoryID: "cat-fun",       ynabCategoryName: "Fun Money",  ynabGroupName: "Flex",        role: .flexible),
        ]
        return m
    }()

    static var incomeSources: [IncomeSource] {
        let cal = Calendar.current
        let apr5  = cal.date(from: DateComponents(year: 2026, month: 4, day:  5))!
        let apr1  = cal.date(from: DateComponents(year: 2026, month: 4, day:  1))!
        return [
            IncomeSource(name: "Kassie paycheck",  amountCents: 279_000, frequency: .biweekly, nextPayDate: apr5,  sortOrder: 0),
            IncomeSource(name: "Basement rent",    amountCents: 150_000, frequency: .monthly,  nextPayDate: apr1,  sortOrder: 1),
            IncomeSource(name: "Car loan check",   amountCents:  79_400, frequency: .monthly,  nextPayDate: apr1,  sortOrder: 2),
        ]
    }

    static var previewBalances: [CategoryBalance] {
        MetricsEngine.buildBalances(monthCategories: monthDetail.categories, mappings: mappings)
    }
}
