import Foundation
import SwiftUI

@MainActor
final class AppState: ObservableObject {

    // MARK: - YNAB data cache (in-memory only; refreshed on launch + pull-to-refresh)

    @Published private(set) var monthDetail: YNABMonthDetail? = nil
    @Published private(set) var transactions: [YNABTransaction] = []
    @Published private(set) var ageOfMoney: Int? = nil
    @Published private(set) var isLoading = false
    @Published private(set) var loadError: String? = nil

    // MARK: - Persisted preferences (non-sensitive; AppStorage is fine for these)

    @AppStorage("chase_ynab_clarity_ios_budget_id")       var activeBudgetID: String = ""
    @AppStorage("chase_ynab_clarity_ios_budget_name")     var activeBudgetName: String = ""
    @AppStorage("chase_ynab_clarity_ios_setup_done")      var setupComplete: Bool = false
    @AppStorage("chase_ynab_clarity_ios_tax_rate")        var taxRate: Double = 0.28
    @AppStorage("chase_ynab_clarity_ios_annual_salary")   var annualSalary: Double = 0
    /// Last successful YNAB sync (persisted for stale-data banner across launches).
    @AppStorage("chase_ynab_clarity_ios_last_refreshed_epoch") var lastRefreshedEpoch: Double = 0

    var lastRefreshed: Date? {
        lastRefreshedEpoch > 0 ? Date(timeIntervalSince1970: lastRefreshedEpoch) : nil
    }

    /// True when no successful refresh yet, or last refresh was more than 24 hours ago.
    var isDataStale: Bool {
        guard let d = lastRefreshed else { return true }
        return Date().timeIntervalSince(d) > 86400
    }

    // MARK: - Refresh

    func refresh(categoryMappings: [CategoryMapping], incomeSources: [IncomeSource]) async {
        guard setupComplete, !activeBudgetID.isEmpty else { return }
        // Token is read from Keychain here — never stored as a property on AppState.
        guard let token = KeychainHelper.readToken() else {
            loadError = "No YNAB token found. Open Settings to re-enter your token."
            return
        }

        isLoading = true
        loadError = nil
        defer { isLoading = false }

        let client = YNABClient(token: token)
        let calendar = Calendar.current
        let monthComps = calendar.dateComponents([.year, .month], from: Date())
        let startOfMonth = calendar.date(from: DateComponents(year: monthComps.year, month: monthComps.month, day: 1)) ?? Date()

        do {
            async let monthTask = client.fetchMonth(budgetID: activeBudgetID, month: Date())
            async let txTask = client.fetchTransactions(budgetID: activeBudgetID, sinceDate: startOfMonth)
            async let budgetTask = client.fetchBudgetDetail(budgetID: activeBudgetID)
            let (month, tx, budget) = try await (monthTask, txTask, budgetTask)
            self.monthDetail = month
            self.transactions = tx
            self.ageOfMoney = budget.ageOfMoney
            self.lastRefreshedEpoch = Date().timeIntervalSince1970
        } catch YNABClientError.unauthorized {
            // Token is invalid — clear it so the user is prompted to re-enter.
            KeychainHelper.deleteToken()
            loadError = "Token invalid or expired — open Settings to re-enter."
        } catch {
            loadError = error.localizedDescription
            self.transactions = []
        }
    }

    // MARK: - Fund a category (write to YNAB)

    func fundCategory(
        categoryID: String,
        budgetedMilliunits: Int,
        categoryMappings: [CategoryMapping],
        incomeSources: [IncomeSource]
    ) async throws {
        guard let token = KeychainHelper.readToken(), !activeBudgetID.isEmpty else {
            throw YNABClientError.unauthorized
        }
        let client = YNABClient(token: token)
        try await client.updateCategoryBudgeted(
            budgetID: activeBudgetID,
            month: Date(),
            categoryID: categoryID,
            budgetedMilliunits: budgetedMilliunits
        )
        await refresh(categoryMappings: categoryMappings, incomeSources: incomeSources)
    }

    // MARK: - Assign a category to a transaction (write to YNAB)

    func updateTransactionCategory(
        transactionID: String,
        categoryID: String,
        categoryMappings: [CategoryMapping],
        incomeSources: [IncomeSource]
    ) async throws {
        guard let token = KeychainHelper.readToken(), !activeBudgetID.isEmpty else {
            throw YNABClientError.unauthorized
        }
        let client = YNABClient(token: token)
        try await client.updateTransactionCategory(
            budgetID: activeBudgetID,
            transactionID: transactionID,
            categoryID: categoryID
        )
        await refresh(categoryMappings: categoryMappings, incomeSources: incomeSources)
    }

    // MARK: - Category groups (for setup — not cached between launches)

    func fetchCategoryGroups() async -> [YNABCategoryGroup] {
        guard let token = KeychainHelper.readToken(), !activeBudgetID.isEmpty else { return [] }
        let client = YNABClient(token: token)
        return (try? await client.fetchCategories(budgetID: activeBudgetID)) ?? []
    }

    // MARK: - Computed metrics (convenience wrappers used by views)

    func buildBalances(mappings: [CategoryMapping]) -> [CategoryBalance] {
        guard let month = monthDetail else { return [] }
        return MetricsEngine.buildBalances(monthCategories: month.categories, mappings: mappings)
    }

    // MARK: - Preview helper

    static var preview: AppState {
        let s = AppState()
        s.monthDetail = MockData.monthDetail
        s.transactions = []
        s.activeBudgetID = MockData.budgetID
        s.setupComplete = true
        s.lastRefreshedEpoch = Date().timeIntervalSince1970
        return s
    }
}
