import Foundation
import Observation
import ClarityUI

/// Main observable store for Clarity Budget.
@MainActor
@Observable
final class BudgetStore {

    private(set) var blob: BudgetBlob

    /// YNAB safe-to-spend snapshot, last error, and fetch time in **one** struct (see `BudgetYNABDashboardCache`).
    private(set) var ynabDashboardCache: BudgetYNABDashboardCache

    private(set) var isRefreshingYNABSnapshot: Bool

    /// Assign all stored state in `init` so Swift 6 does not initialize `@Observable` backing in a nonisolated context (see `LEARNINGS.md`).
    init() {
        blob = BudgetBlobFactory.defaultBlob()
        ynabDashboardCache = .empty
        isRefreshingYNABSnapshot = false
    }

    private func mutateYNABDashboardCache(_ body: (inout BudgetYNABDashboardCache) -> Void) {
        var c = ynabDashboardCache
        body(&c)
        ynabDashboardCache = c
    }

    // MARK: - Lifecycle

    func load() {
        blob = StorageHelpers.load(BudgetBlob.self, key: BudgetConfig.storeKey) ?? BudgetBlobFactory.defaultBlob()
        if let id = blob.ynabBudgetId {
            UserDefaults.standard.set(id, forKey: BudgetConfig.ynabBudgetIdUserDefaultsKey)
        }
        mutateYNABDashboardCache { $0.lastError = nil }
    }

    func save() {
        blob.syncAtMilliseconds = Int64(Date().timeIntervalSince1970 * 1000.0)
        persistBlobToDisk()
        Task { await BudgetSupabaseSync.pushBlob(blob) }
    }

    private func persistBlobToDisk() {
        _ = StorageHelpers.save(blob, key: BudgetConfig.storeKey)
        if let id = blob.ynabBudgetId {
            UserDefaults.standard.set(id, forKey: BudgetConfig.ynabBudgetIdUserDefaultsKey)
        } else {
            UserDefaults.standard.removeObject(forKey: BudgetConfig.ynabBudgetIdUserDefaultsKey)
        }
    }

    /// Applies a server blob after `pull` without bumping sync time past the server’s `updated_at`.
    func replaceBlobFromRemote(_ remote: BudgetBlob, updatedAtMillis: Int64) {
        blob = remote
        blob.syncAtMilliseconds = updatedAtMillis
        persistBlobToDisk()
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

    func updateYNABCategoryDueDay(categoryID: String, dueDay: Int) {
        guard let i = blob.ynabCategoryMappings.firstIndex(where: { $0.ynabCategoryID == categoryID }) else { return }
        let clamped = max(0, min(31, dueDay))
        blob.ynabCategoryMappings[i].dueDay = clamped
        save()
    }

    /// When enabled, group id is stored and suggestions apply immediately; when disabled, id is removed (roles unchanged).
    func setYNABGroupAutoSuggest(groupId: String, isEnabled: Bool) {
        var ids = Set(blob.ynabAutoSuggestGroupIds)
        if isEnabled {
            ids.insert(groupId)
            for idx in blob.ynabCategoryMappings.indices where blob.ynabCategoryMappings[idx].ynabGroupId == groupId {
                let m = blob.ynabCategoryMappings[idx]
                blob.ynabCategoryMappings[idx].role = CategoryRole.suggest(
                    categoryName: m.ynabCategoryName,
                    groupName: m.ynabGroupName
                )
            }
        } else {
            ids.remove(groupId)
        }
        blob.ynabAutoSuggestGroupIds = ids.sorted()
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
        let hiddenGroupNames: Set<String> = [
            "internal master category",
            "credit card payments"
        ]
        let autoIds = Set(blob.ynabAutoSuggestGroupIds)
        let existing = Dictionary(uniqueKeysWithValues: blob.ynabCategoryMappings.map { ($0.ynabCategoryID, $0) })
        var next: [YNABCategoryMapping] = []
        for g in groups where !g.hidden && !hiddenGroupNames.contains(g.name.trimmingCharacters(in: .whitespacesAndNewlines).lowercased()) {
            for c in g.categories where !c.hidden && !c.deleted {
                if let prior = existing[c.id] {
                    var m = prior
                    m.ynabCategoryName = c.name
                    m.ynabGroupName = g.name
                    m.ynabGroupId = g.id
                    if autoIds.contains(g.id) {
                        m.role = CategoryRole.suggest(categoryName: c.name, groupName: g.name)
                    }
                    next.append(m)
                } else {
                    let role = CategoryRole.suggest(categoryName: c.name, groupName: g.name)
                    next.append(
                        YNABCategoryMapping(
                            ynabCategoryID: c.id,
                            ynabCategoryName: c.name,
                            ynabGroupName: g.name,
                            ynabGroupId: g.id,
                            role: role,
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
        mutateYNABDashboardCache { $0.lastError = nil }
    }

    func setYNABLastError(_ message: String?) {
        mutateYNABDashboardCache { $0.lastError = message }
    }

    func signOutYNAB() {
        BudgetYNABKeychain.deleteToken()
        blob.ynabBudgetId = nil
        blob.ynabCategoryMappings = []
        blob.ynabAutoSuggestGroupIds = []
        blob.ynabIncomeSources = []
        UserDefaults.standard.removeObject(forKey: BudgetConfig.ynabBudgetIdUserDefaultsKey)
        ynabDashboardCache = .empty
        save()
    }

    /// Fetches the current month from YNAB and updates dashboard safe-to-spend metrics.
    func refreshYNABSnapshot() async {
        mutateYNABDashboardCache { $0.lastError = nil }
        guard let token = BudgetYNABKeychain.readToken(), !token.isEmpty else {
            mutateYNABDashboardCache {
                $0.snapshot = nil
                $0.fetchedAt = nil
            }
            return
        }
        guard let budgetId = blob.ynabBudgetId, !budgetId.isEmpty else {
            mutateYNABDashboardCache {
                $0.snapshot = nil
                $0.fetchedAt = nil
            }
            return
        }
        isRefreshingYNABSnapshot = true
        defer { isRefreshingYNABSnapshot = false }
        let client = YNABClient(token: token)
        do {
            let month = try await client.fetchMonth(budgetID: budgetId, month: Date())
            let balances = BudgetMetricsEngine.buildBalances(
                monthCategories: month.categories,
                mappings: blob.ynabCategoryMappings
            )
            let tbb = month.toBeBudgetedDollars
            let daysLeft = BudgetMetricsEngine.daysRemainingInMonth(from: Date())
            let sts = BudgetMetricsEngine.safeToSpend(balances: balances, toBeBudgeted: tbb)
            let perDay = BudgetMetricsEngine.safePerDay(
                balances: balances,
                daysRemaining: daysLeft,
                toBeBudgeted: tbb
            )
            let perWeek = BudgetMetricsEngine.safePerWeek(
                balances: balances,
                daysRemaining: daysLeft,
                toBeBudgeted: tbb
            )
            let shortfall = BudgetMetricsEngine.currentShortfall(balances)
            mutateYNABDashboardCache {
                $0.snapshot = YNABDashboardSnapshot(
                    safeMonthly: sts,
                    safeToday: perDay,
                    safeWeek: perWeek,
                    obligationsShortfall: shortfall
                )
                $0.fetchedAt = Date()
                $0.lastError = nil
            }
        } catch YNABClientError.unauthorized {
            BudgetYNABKeychain.deleteToken()
            mutateYNABDashboardCache {
                $0.snapshot = nil
                $0.fetchedAt = nil
                $0.lastError = YNABClientError.unauthorized.errorDescription
            }
        } catch {
            mutateYNABDashboardCache { $0.lastError = error.localizedDescription }
        }
    }

    /// Fetches current month from YNAB and overwrites **Baseline** money fields (keeps `wantsSpentCents`).
    func importBaselineFromYNAB() async {
        mutateYNABDashboardCache { $0.lastError = nil }
        guard let token = BudgetYNABKeychain.readToken(), !token.isEmpty else {
            mutateYNABDashboardCache { $0.lastError = "Add a YNAB token in Settings first." }
            return
        }
        guard let budgetId = blob.ynabBudgetId, !budgetId.isEmpty else {
            mutateYNABDashboardCache { $0.lastError = "Select a YNAB budget first." }
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
            await refreshYNABSnapshot()
        } catch YNABClientError.unauthorized {
            BudgetYNABKeychain.deleteToken()
            mutateYNABDashboardCache { $0.lastError = YNABClientError.unauthorized.errorDescription }
        } catch {
            mutateYNABDashboardCache { $0.lastError = error.localizedDescription }
        }
    }

    /// After user confirms: set category assigned amount for current month (milliunits).
    func fundYNABCategory(categoryID: String, budgetedMilliunits: Int) async {
        mutateYNABDashboardCache { $0.lastError = nil }
        guard let token = BudgetYNABKeychain.readToken(), !token.isEmpty else {
            mutateYNABDashboardCache { $0.lastError = "No YNAB token." }
            return
        }
        guard let budgetId = blob.ynabBudgetId, !budgetId.isEmpty else {
            mutateYNABDashboardCache { $0.lastError = "No budget selected." }
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
            mutateYNABDashboardCache { $0.lastError = YNABClientError.unauthorized.errorDescription }
        } catch {
            mutateYNABDashboardCache { $0.lastError = error.localizedDescription }
        }
    }
}
