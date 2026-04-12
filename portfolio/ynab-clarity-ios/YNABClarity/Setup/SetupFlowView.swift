import SwiftData
import SwiftUI

// MARK: - SetupStep

private enum SetupStep {
    case tokenEntry
    case budgetPicker
    case categoryClassify
    case incomeSetup
}

// MARK: - SetupFlowView

struct SetupFlowView: View {
    var onComplete: () -> Void

    @Environment(\.modelContext) private var modelContext
    @EnvironmentObject private var appState: AppState

    @State private var step: SetupStep = .tokenEntry
    @State private var verifiedToken: String = ""
    @State private var fetchedGroups: [YNABCategoryGroup] = []

    var body: some View {
        NavigationStack {
            ZStack {
                ClarityTheme.bg.ignoresSafeArea()
                stepView
            }
            .navigationTitle(navigationTitle)
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(ClarityTheme.surface, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
        .preferredColorScheme(.dark)
    }

    @ViewBuilder
    private var stepView: some View {
        switch step {
        case .tokenEntry:
            TokenStepView { token in
                verifiedToken = token
                step = .budgetPicker
            }
        case .budgetPicker:
            BudgetStepView(token: verifiedToken) { budgetID, budgetName, groups in
                appState.activeBudgetID = budgetID
                appState.activeBudgetName = budgetName
                fetchedGroups = groups
                step = .categoryClassify
            }
        case .categoryClassify:
            CategorySetupView(groups: fetchedGroups) {
                step = .incomeSetup
            }
        case .incomeSetup:
            IncomeSetupView {
                onComplete()
            }
        }
    }

    private var navigationTitle: String {
        switch step {
        case .tokenEntry:       return "Connect YNAB"
        case .budgetPicker:     return "Select Budget"
        case .categoryClassify: return "Classify Categories"
        case .incomeSetup:      return "Income Sources"
        }
    }
}
