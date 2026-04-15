import Foundation
import Observation
import ClarityUI

/// Main observable store for Clarity Budget.
@Observable @MainActor
final class BudgetStore {

    private(set) var blob: BudgetBlob = BudgetBlobFactory.defaultBlob()

    /// Last YNAB-related user-facing error (Settings clears on success paths).
    private(set) var ynabLastError: String?

    nonisolated init() {}

    // MARK: - Lifecycle

    func load() {
        blob = StorageHelpers.load(BudgetBlob.self, key: BudgetConfig.storeKey) ?? BudgetBlobFactory.defaultBlob()
        if let id = blob.ynabBudgetId {
            UserDefaults.standard.set(id, forKey: BudgetConfig.ynabBudgetIdUserDefaultsKey)
        }
        ynabLastError = nil
    }

    func save() {
        _ = StorageHelpers.save(blob, key: BudgetConfig.storeKey)
        if let id = blob.ynabBudgetId {
            UserDefaults.standard.set(id, forKey: BudgetConfig.ynabBudgetIdUserDefaultsKey)
        } else {
            UserDefaults.standard.removeObject(forKey: BudgetConfig.ynabBudgetIdUserDefaultsKey)
        }
    }

    // MARK: - Scenario access

    func scenario(_ kind: BudgetScenarioKind) -> BudgetScenario {
        switch kind {
        case .baseline: blob.baseline
        case .stretch: blob.stretch
        }
    }

    func replaceBaseline(_ scenario: BudgetScenario) {
        blob.baseline = scenario
        save()
    }

    func replaceStretch(_ scenario: BudgetScenario) {
        blob.stretch = scenario
        save()
    }

    // MARK: - Wants

    func addWantsSpend(cents: Int, to kind: BudgetScenarioKind) {
        let delta = max(-1_000_000_00, min(cents, 1_000_000_00))
        switch kind {
        case .baseline:
            blob.baseline.wantsSpentCents = max(0, blob.baseline.wantsSpentCents + delta)
        case .stretch:
            blob.stretch.wantsSpentCents = max(0, blob.stretch.wantsSpentCents + delta)
        }
        save()
    }

    func resetWantsSpent(for kind: BudgetScenarioKind) {
        switch kind {
        case .baseline: blob.baseline.wantsSpentCents = 0
        case .stretch: blob.stretch.wantsSpentCents = 0
        }
        save()
    }

    // MARK: - YNAB blob fields

    func setYNABBudgetId(_ id: String?) {
        blob.ynabBudgetId = id
        save()
    }

    func replaceYNABCategoryMappings(_ mappings: [YNABCategoryMapping]) {
        blob.ynabCategoryMappings = mappings
        save()
    }

    func replaceYNABIncomeSources(_ sources: [YNABIncomeSource]) {
        blob.ynabIncomeSources = sources
        save()
    }

    func updateYNABCategoryRole(categoryID: String, role: CategoryRole) {
        guard let i = blob.ynabCategoryMappings.firstIndex(where: { $0.ynabCategoryID == categoryID }) else { return }
        blob.ynabCategoryMappings[i].role = role
        save()
    }

    func appendYNABIncomeSource(_ source: YNABIncomeSource) {
        blob.ynabIncomeSources.append(source)
        blob.ynabIncomeSources.sort { $0.sortOrder < $1.sortOrder }
        save()
    }

    func replaceYNABIncomeSource(_ source: YNABIncomeSource) {
        guard let i = blob.ynabIncomeSources.firstIndex(where: { $0.id == source.id }) else { return }
        blob.ynabIncomeSources[i] = source
        save()
    }

    func deleteYNABIncomeSource(id: UUID) {
        blob.ynabIncomeSources.removeAll { $0.id == id }
        save()
    }

    /// Merges freshly fetched YNAB categories with existing role assignments.
    func mergeYNABCategoryMappings(from groups: [YNABCategoryGroup]) {
        let existing = Dictionary(uniqueKeysWithValues: blob.ynabCategoryMappings.map { ($0.ynabCategoryID, $0) })
        var next: [YNABCategoryMapping] = []
        for g in groups where !g.hidden {
            for c in g.categories where !c.hidden && !c.deleted {
                if let prior = existing[c.id] {
                    var m = prior
                    m.ynabCategoryName = c.name
                    m.ynabGroupName = g.name
                    next.append(m)
                } else {
                    next.append(
                        YNABCategoryMapping(
                            ynabCategoryID: c.id,
                            ynabCategoryName: c.name,
                            ynabGroupName: g.name,
                            role: .ignore,
                            dueDay: 0
                        )
                    )
                }
            }
        }
        next.sort {
            let g = $0.ynabGroupName.localizedCaseInsensitiveCompare($1.ynabGroupName)
            if g != .orderedSame { return g == .orderedAscending }
            return $0.ynabCategoryName.localizedCaseInsensitiveCompare($1.ynabCategoryName) == .orderedAscending
        }
        blob.ynabCategoryMappings = next
        save()
    }

    func clearYNABLastError() {
        ynabLastError = nil
    }

    func setYNABLastError(_ message: String?) {
        ynabLastError = message
    }

    func signOutYNAB() {
        BudgetYNABKeychain.deleteToken()
        blob.ynabBudgetId = nil
        blob.ynabCategoryMappings = []
        blob.ynabIncomeSources = []
        UserDefaults.standard.removeObject(forKey: BudgetConfig.ynabBudgetIdUserDefaultsKey)
        ynabLastError = nil
        save()
    }

    /// Fetches current month from YNAB and overwrites **Baseline** money fields (keeps `wantsSpentCents`).
    func importBaselineFromYNAB() async {
        ynabLastError = nil
        guard let token = BudgetYNABKeychain.readToken(), !token.isEmpty else {
            ynabLastError = "Add a YNAB token in Settings first."
            return
        }
        guard let budgetId = blob.ynabBudgetId, !budgetId.isEmpty else {
            ynabLastError = "Select a YNAB budget first."
            return
        }
        let client = YNABClient(token: token)
        do {
            let month = try await client.fetchMonth(budgetID: budgetId, month: Date())
            let imp = YNABScenarioImport.baselineImport(
                month: month,
                mappings: blob.ynabCategoryMappings,
                incomeSources: blob.ynabIncomeSources,
                referenceMonth: Date(),
                calendar: .current
            )
            var b = blob.baseline
            b.monthlyIncomeCents = imp.monthlyIncomeCents
            b.fixedNeedsCents = imp.fixedNeedsCents
            b.flexibleNeedsEstimateCents = imp.flexibleNeedsEstimateCents
            b.wantsBudgetCents = imp.wantsBudgetCents
            blob.baseline = b
            save()
        } catch YNABClientError.unauthorized {
            BudgetYNABKeychain.deleteToken()
            ynabLastError = YNABClientError.unauthorized.errorDescription
        } catch {
            ynabLastError = error.localizedDescription
        }
    }

    /// After user confirms: set category assigned amount for current month (milliunits).
    func fundYNABCategory(categoryID: String, budgetedMilliunits: Int) async {
        ynabLastError = nil
        guard let token = BudgetYNABKeychain.readToken(), !token.isEmpty else {
            ynabLastError = "No YNAB token."
            return
        }
        guard let budgetId = blob.ynabBudgetId, !budgetId.isEmpty else {
            ynabLastError = "No budget selected."
            return
        }
        let client = YNABClient(token: token)
        do {
            try await client.updateCategoryBudgeted(
                budgetID: budgetId,
                month: Date(),
                categoryID: categoryID,
                budgetedMilliunits: budgetedMilliunits
            )
            await importBaselineFromYNAB()
        } catch YNABClientError.unauthorized {
            BudgetYNABKeychain.deleteToken()
            ynabLastError = YNABClientError.unauthorized.errorDescription
        } catch {
            ynabLastError = error.localizedDescription
        }
    }
}
