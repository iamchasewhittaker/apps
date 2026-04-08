import SwiftUI

struct BudgetStepView: View {
    let token: String
    var onNext: (String, String, [YNABCategoryGroup]) -> Void

    @State private var budgets: [YNABBudgetSummary] = []
    @State private var selectedID: String? = nil
    @State private var isLoading = true
    @State private var isLoadingCategories = false
    @State private var errorMessage: String? = nil

    var body: some View {
        ZStack {
            ClarityTheme.bg.ignoresSafeArea()
            if isLoading {
                ProgressView("Loading budgets…")
                    .tint(ClarityTheme.accent)
                    .foregroundStyle(ClarityTheme.muted)
            } else if let error = errorMessage {
                errorView(error)
            } else {
                budgetList
            }
        }
        .task { await loadBudgets() }
    }

    private var budgetList: some View {
        VStack(spacing: 0) {
            List(budgets) { budget in
                Button {
                    selectedID = budget.id
                } label: {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(budget.name)
                                .font(ClarityTheme.headlineFont)
                                .foregroundStyle(ClarityTheme.text)
                            if let modified = budget.lastModifiedOn {
                                Text("Last modified: \(String(modified.prefix(10)))")
                                    .font(ClarityTheme.captionFont)
                                    .foregroundStyle(ClarityTheme.muted)
                            }
                        }
                        Spacer()
                        if selectedID == budget.id {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundStyle(ClarityTheme.accent)
                        }
                    }
                    .contentShape(Rectangle())
                }
                .buttonStyle(.plain)
                .listRowBackground(ClarityTheme.surface)
            }
            .scrollContentBackground(.hidden)

            Button {
                guard let id = selectedID else { return }
                Task { await loadCategoriesAndAdvance(budgetID: id) }
            } label: {
                HStack {
                    if isLoadingCategories {
                        ProgressView()
                            .progressViewStyle(.circular)
                            .tint(ClarityTheme.bg)
                    } else {
                        Text("Use This Budget")
                            .font(ClarityTheme.headlineFont)
                    }
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(selectedID == nil ? ClarityTheme.muted : ClarityTheme.accent)
                .foregroundStyle(ClarityTheme.text)
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
            .disabled(selectedID == nil || isLoadingCategories)
            .padding(20)
        }
    }

    private func errorView(_ message: String) -> some View {
        VStack(spacing: 16) {
            Text(message)
                .font(ClarityTheme.bodyFont)
                .foregroundStyle(ClarityTheme.danger)
                .multilineTextAlignment(.center)
            Button("Retry") { Task { await loadBudgets() } }
                .foregroundStyle(ClarityTheme.accent)
        }
        .padding(20)
    }

    private func loadBudgets() async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }
        let client = YNABClient(token: token)
        do {
            budgets = try await client.fetchBudgets()
        } catch {
            errorMessage = error.localizedDescription
        }
    }

    private func loadCategoriesAndAdvance(budgetID: String) async {
        isLoadingCategories = true
        defer { isLoadingCategories = false }
        let client = YNABClient(token: token)
        let groups = (try? await client.fetchCategories(budgetID: budgetID)) ?? []
        let budgetName = budgets.first { $0.id == budgetID }?.name ?? ""
        onNext(budgetID, budgetName, groups)
    }
}
