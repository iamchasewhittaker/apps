import Foundation

struct YNABBudgetSummary: Decodable, Identifiable {
    let id: String
    let name: String
    let lastModifiedOn: String?
}

struct YNABBudgetsResponse: Decodable {
    struct DataWrapper: Decodable {
        let budgets: [YNABBudgetSummary]
    }
    let data: DataWrapper
}

struct YNABCategoryGroup: Decodable, Identifiable {
    let id: String
    let name: String
    let hidden: Bool
    let categories: [YNABCategory]
}

struct YNABCategory: Decodable, Identifiable {
    let id: String
    let name: String
    let hidden: Bool
    let deleted: Bool
}

struct YNABCategoriesResponse: Decodable {
    struct DataWrapper: Decodable {
        let categoryGroups: [YNABCategoryGroup]
    }
    let data: DataWrapper
}

struct YNABMonthDetail: Decodable {
    let month: String
    let income: Int?
    let toBeBudgeted: Int?
    let categories: [YNABMonthCategory]

    var toBeBudgetedDollars: Double {
        guard let tbb = toBeBudgeted else { return 0 }
        return Double(tbb) / 1000.0
    }
}

struct YNABMonthCategory: Decodable, Identifiable {
    let id: String
    let name: String
    let budgeted: Int
    let activity: Int
    let balance: Int
    let hidden: Bool
    let deleted: Bool
    let goalTarget: Int?
    let goalType: String?
    let goalPercentageComplete: Int?

    var budgetedDollars: Double { Double(budgeted) / 1000.0 }
    var activityDollars: Double { Double(activity) / 1000.0 }
    var balanceDollars: Double { Double(balance) / 1000.0 }
    var goalTargetDollars: Double? {
        guard let gt = goalTarget else { return nil }
        return Double(gt) / 1000.0
    }
}

struct YNABMonthResponse: Decodable {
    struct DataWrapper: Decodable {
        let month: YNABMonthDetail
    }
    let data: DataWrapper
}

struct YNABTransaction: Decodable, Identifiable {
    let id: String
    let date: String
    let amount: Int
    let payeeName: String?
    let memo: String?
    let categoryId: String?
    let categoryName: String?
    let deleted: Bool
    let transferAccountId: String?

    var amountDollars: Double { Double(amount) / 1000.0 }

    var parsedDate: Date? {
        let parts = date.split(separator: "-").compactMap { Int($0) }
        guard parts.count == 3 else { return nil }
        var c = DateComponents()
        c.year = parts[0]
        c.month = parts[1]
        c.day = parts[2]
        return Calendar(identifier: .gregorian).date(from: c)
    }

    var isTransfer: Bool { transferAccountId != nil }
}

struct YNABTransactionsResponse: Decodable {
    struct DataWrapper: Decodable {
        let transactions: [YNABTransaction]
    }
    let data: DataWrapper
}

struct YNABBudgetDetail: Decodable {
    let ageOfMoney: Int?
    let ageOfMoneyCalculationDate: String?
}

struct YNABBudgetDetailResponse: Decodable {
    struct DataWrapper: Decodable {
        let budget: YNABBudgetDetail
    }
    let data: DataWrapper
}
