import SwiftUI
import ClarityUI

/// YNAB token, budget, mappings, income, import baseline, and fund category (PATCH).
@MainActor
struct BudgetYNABSettingsView: View {
    @Environment(BudgetStore.self) private var store
    @Binding var isPresented: Bool

    @State private var tokenDraft: String = ""
    @State private var budgets: [YNABBudgetSummary] = []
    @State private var isLoadingBudgets = false
    @State private var isImporting = false
    @State private var isFunding = false
    @State private var fundCategoryID: String = ""
    @State private var fundAssignedDollars: String = ""
    @State private var showFundConfirm = false

    var body: some View {
        NavigationStack {
            List {
                if let err = store.ynabLastError, !err.isEmpty {
                    Section {
                        Text(err)
                            .font(.footnote)
                            .foregroundStyle(Color.red)
                    }
                }

                Section {
                    SecureField("Personal access token", text: $tokenDraft)
                        .textContentType(.password)
                        .autocorrectionDisabled()

                    Button("Save token to Keychain") {
                        let t = tokenDraft.trimmingCharacters(in: .whitespacesAndNewlines)
                        guard !t.isEmpty else { return }
                        _ = BudgetYNABKeychain.saveToken(t)
                        tokenDraft = ""
                        store.clearYNABLastError()
                        Task { await reloadBudgets() }
                    }

                    Button("Verify & load budgets") {
                        Task { await reloadBudgets() }
                    }
                    .disabled(isLoadingBudgets)

                    if BudgetYNABKeychain.hasToken() {
                        Label("Token on device", systemImage: "checkmark.shield.fill")
                            .foregroundStyle(ClarityPalette.muted)
                    }

                    Button("Sign out YNAB", role: .destructive) {
                        store.signOutYNAB()
                        budgets = []
                        fundCategoryID = ""
                    }
                } header: {
                    Text("YNAB API")
                } footer: {
                    Text("Create a token in YNAB → Settings → Developer. Clarity Budget uses its own Keychain entry, separate from YNAB Clarity iOS.")
                }

                Section {
                    if isLoadingBudgets {
                        ProgressView("Loading budgets…")
                    } else if budgets.isEmpty {
                        Text("Save a token, then verify to list budgets.")
                            .foregroundStyle(ClarityPalette.muted)
                    } else {
                        Picker("Budget", selection: budgetSelectionBinding) {
                            Text("— Select —").tag(Optional<String>.none)
                            ForEach(budgets) { b in
                                Text(b.name).tag(Optional(b.id))
                            }
                        }
                    }
                } header: {
                    Text("Budget")
                }

                Section {
                    if store.blob.ynabCategoryMappings.isEmpty {
                        Text("Select a budget to load categories, then assign a role to each category you want included in import.")
                            .foregroundStyle(ClarityPalette.muted)
                    } else {
                        ForEach(store.blob.ynabCategoryMappings) { m in
                            VStack(alignment: .leading, spacing: 6) {
                                Text(m.ynabCategoryName)
                                    .font(.subheadline.weight(.semibold))
                                Text(m.ynabGroupName)
                                    .font(.caption)
                                    .foregroundStyle(ClarityPalette.muted)
                                Picker("Role", selection: roleBinding(for: m.ynabCategoryID)) {
                                    ForEach(CategoryRole.allCases) { role in
                                        Text(role.displayName).tag(role)
                                    }
                                }
                                .pickerStyle(.menu)
                            }
                            .padding(.vertical, 4)
                        }
                    }
                } header: {
                    Text("Category roles")
                }

                Section {
                    ForEach(store.blob.ynabIncomeSources.sorted(by: { $0.sortOrder < $1.sortOrder })) { s in
                        NavigationLink {
                            BudgetYNABIncomeEditorView(sourceID: s.id)
                        } label: {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(s.name)
                                Text(BudgetMoneyFormat.string(fromCents: s.amountCents))
                                    .font(.caption)
                                    .foregroundStyle(ClarityPalette.muted)
                            }
                        }
                    }
                    .onDelete { offsets in
                        let sorted = store.blob.ynabIncomeSources.sorted(by: { $0.sortOrder < $1.sortOrder })
                        for i in offsets {
                            store.deleteYNABIncomeSource(id: sorted[i].id)
                        }
                    }

                    Button("Add income source") {
                        let order = (store.blob.ynabIncomeSources.map(\.sortOrder).max() ?? 0) + 1
                        store.appendYNABIncomeSource(
                            YNABIncomeSource(
                                name: "Paycheck",
                                amountCents: 0,
                                frequency: .biweekly,
                                nextPayDate: Date(),
                                sortOrder: order
                            )
                        )
                    }
                } header: {
                    Text("Income sources")
                } footer: {
                    Text("If you add at least one source, import uses projected pay this month. Otherwise it uses YNAB’s month income total.")
                }

                Section {
                    Button {
                        Task {
                            isImporting = true
                            defer { isImporting = false }
                            await store.importBaselineFromYNAB()
                        }
                    } label: {
                        if isImporting {
                            ProgressView()
                        } else {
                            Text("Refresh & import into Baseline")
                        }
                    }
                    .disabled(!BudgetYNABKeychain.hasToken() || (store.blob.ynabBudgetId ?? "").isEmpty)
                } header: {
                    Text("Import")
                } footer: {
                    Text("Updates Baseline income and needs from mapped roles. Wants spent is not changed.")
                }

                Section {
                    Picker("Category", selection: $fundCategoryID) {
                        Text("— Choose —").tag("")
                        ForEach(store.blob.ynabCategoryMappings.filter { $0.role != .ignore }) { m in
                            Text(m.ynabCategoryName).tag(m.ynabCategoryID)
                        }
                    }
                    TextField("New assigned this month ($)", text: $fundAssignedDollars)
                        .keyboardType(.decimalPad)

                    Button("Assign in YNAB…") {
                        showFundConfirm = true
                    }
                    .disabled(fundCategoryID.isEmpty || isFunding)
                    .confirmationDialog(
                        "Assign this total in YNAB for the current month?",
                        isPresented: $showFundConfirm,
                        titleVisibility: .visible
                    ) {
                        Button("Assign \(fundAssignedDollars.trimmingCharacters(in: .whitespacesAndNewlines)) USD") {
                            Task {
                                isFunding = true
                                defer { isFunding = false }
                                let dollars = parseDollars(fundAssignedDollars)
                                let milli = Int((dollars * 1000.0).rounded())
                                await store.fundYNABCategory(categoryID: fundCategoryID, budgetedMilliunits: milli)
                            }
                        }
                        Button("Cancel", role: .cancel) {}
                    } message: {
                        Text("This overwrites the category’s assigned amount for the current month in YNAB (same as moving money in YNAB).")
                    }
                } header: {
                    Text("Fund category (write)")
                }
            }
            .navigationTitle("YNAB")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { isPresented = false }
                }
            }
            .scrollContentBackground(.hidden)
            .background(ClarityPalette.bg)
        }
        .task {
            await reloadBudgets()
            if let id = store.blob.ynabBudgetId, !id.isEmpty {
                await reloadCategories(budgetID: id)
            }
        }
    }

    private var budgetSelectionBinding: Binding<String?> {
        Binding(
            get: { store.blob.ynabBudgetId },
            set: { newValue in
                store.setYNABBudgetId(newValue)
                if let id = newValue, !id.isEmpty {
                    Task { await reloadCategories(budgetID: id) }
                }
            }
        )
    }

    private func roleBinding(for categoryID: String) -> Binding<CategoryRole> {
        Binding(
            get: {
                store.blob.ynabCategoryMappings.first(where: { $0.ynabCategoryID == categoryID })?.role ?? .ignore
            },
            set: { store.updateYNABCategoryRole(categoryID: categoryID, role: $0) }
        )
    }

    private func reloadBudgets() async {
        store.clearYNABLastError()
        guard let token = BudgetYNABKeychain.readToken(), !token.isEmpty else {
            budgets = []
            return
        }
        isLoadingBudgets = true
        defer { isLoadingBudgets = false }
        do {
            budgets = try await YNABClient(token: token).fetchBudgets()
        } catch YNABClientError.unauthorized {
            BudgetYNABKeychain.deleteToken()
            store.setYNABLastError(YNABClientError.unauthorized.errorDescription)
            budgets = []
        } catch {
            store.setYNABLastError(error.localizedDescription)
        }
    }

    private func reloadCategories(budgetID: String) async {
        store.clearYNABLastError()
        guard let token = BudgetYNABKeychain.readToken(), !token.isEmpty else { return }
        do {
            let groups = try await YNABClient(token: token).fetchCategories(budgetID: budgetID)
            store.mergeYNABCategoryMappings(from: groups)
        } catch {
            store.setYNABLastError(error.localizedDescription)
        }
    }

    private func parseDollars(_ raw: String) -> Double {
        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return 0 }
        let normalized = trimmed.replacingOccurrences(of: ",", with: "")
        return Double(normalized) ?? 0
    }
}

// MARK: - Income editor (nested navigation)

@MainActor
private struct BudgetYNABIncomeEditorView: View {
    @Environment(BudgetStore.self) private var store
    let sourceID: UUID

    @State private var name: String = ""
    @State private var amountDollars: String = ""
    @State private var frequency: IncomeFrequency = .monthly
    @State private var nextPayDate: Date = Date()
    @State private var secondPayDay: String = "20"
    @State private var sortOrder: String = "0"

    private var source: YNABIncomeSource? {
        store.blob.ynabIncomeSources.first { $0.id == sourceID }
    }

    var body: some View {
        Form {
            if source == nil {
                Text("Source was removed.")
            } else {
                TextField("Name", text: $name)
                    .onChange(of: name) { _, _ in push() }
                TextField("Amount ($)", text: $amountDollars)
                    .keyboardType(.decimalPad)
                    .onChange(of: amountDollars) { _, _ in push() }
                Picker("Frequency", selection: $frequency) {
                    ForEach(IncomeFrequency.allCases) { f in
                        Text(f.displayName).tag(f)
                    }
                }
                .onChange(of: frequency) { _, _ in push() }
                DatePicker("Next pay date", selection: $nextPayDate, displayedComponents: .date)
                    .onChange(of: nextPayDate) { _, _ in push() }
                if frequency == .semimonthly {
                    TextField("Second pay day (1–31)", text: $secondPayDay)
                        .keyboardType(.numberPad)
                        .onChange(of: secondPayDay) { _, _ in push() }
                }
                TextField("Sort order", text: $sortOrder)
                    .keyboardType(.numberPad)
                    .onChange(of: sortOrder) { _, _ in push() }
            }
        }
        .scrollContentBackground(.hidden)
        .background(ClarityPalette.bg)
        .navigationTitle("Income")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear { syncFromSource() }
    }

    private func syncFromSource() {
        guard let s = source else { return }
        name = s.name
        amountDollars = dollarsString(fromCents: s.amountCents)
        frequency = s.frequency
        nextPayDate = s.nextPayDate
        secondPayDay = String(s.secondPayDay)
        sortOrder = String(s.sortOrder)
    }

    private func push() {
        guard var s = source else { return }
        s.name = name.trimmingCharacters(in: .whitespacesAndNewlines)
        s.amountCents = parseDollarsToCents(amountDollars)
        s.frequency = frequency
        s.nextPayDate = nextPayDate
        s.secondPayDay = min(31, max(1, Int(secondPayDay) ?? 20))
        s.sortOrder = Int(sortOrder) ?? 0
        store.replaceYNABIncomeSource(s)
    }

    private func dollarsString(fromCents cents: Int) -> String {
        let v = Double(cents) / 100.0
        if v == floor(v) { return String(format: "%.0f", v) }
        return String(format: "%.2f", v)
    }

    private func parseDollarsToCents(_ raw: String) -> Int {
        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return 0 }
        let normalized = trimmed.replacingOccurrences(of: ",", with: "")
        guard let d = Double(normalized) else { return 0 }
        return Int((d * 100.0).rounded())
    }
}
