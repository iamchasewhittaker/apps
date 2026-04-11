import Foundation
import SwiftUI

@MainActor
final class AppState: ObservableObject {

    // MARK: - YNAB data cache (in-memory only; refreshed on launch + pull-to-refresh)

    @Published private(set) var monthDetail: YNABMonthDetail? = nil
    @Published private(set) var isLoading = false
    @Published private(set) var loadError: String? = nil
    @Published private(set) var lastRefreshed: Date? = nil

    // MARK: - Persisted preferences (non-sensitive; AppStorage is fine for these)

    @AppStorage("chase_ynab_clarity_ios_budget_id")       var activeBudgetID: String = ""
    @AppStorage("chase_ynab_clarity_ios_budget_name")     var activeBudgetName: String = ""
    @AppStorage("chase_ynab_clarity_ios_setup_done")      var setupComplete: Bool = false
    @AppStorage("chase_ynab_clarity_ios_tax_rate")        var taxRate: Double = 0.28
    @AppStorage("chase_ynab_clarity_ios_annual_salary")   var annualSalary: Double = 0

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
        do {
            let month = try await client.fetchMonth(budgetID: activeBudgetID, month: Date())
            self.monthDetail = month
            self.lastRefreshed = Date()
        } catch YNABClientError.unauthorized {
            // Token is invalid — clear it so the user is prompted to re-enter.
            KeychainHelper.deleteToken()
            loadError = "Token invalid or expired — open Settings to re-enter."
        } catch {
            loadError = error.localizedDescription
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
        s.activeBudgetID = MockData.budgetID
        s.setupComplete = true
        return s
    }
}
