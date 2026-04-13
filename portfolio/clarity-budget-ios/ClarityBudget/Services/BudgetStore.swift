import Foundation
import Observation
import ClarityUI

/// Main observable store for Clarity Budget.
@Observable @MainActor
final class BudgetStore {

    private(set) var blob: BudgetBlob = BudgetBlobFactory.defaultBlob()

    nonisolated init() {}

    // MARK: - Lifecycle

    func load() {
        blob = StorageHelpers.load(BudgetBlob.self, key: BudgetConfig.storeKey) ?? BudgetBlobFactory.defaultBlob()
    }

    func save() {
        _ = StorageHelpers.save(blob, key: BudgetConfig.storeKey)
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

    /// Add to wants spend for the given scenario (clamped so spent ≥ 0).
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
}
