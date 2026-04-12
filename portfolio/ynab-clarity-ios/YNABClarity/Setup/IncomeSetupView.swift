import SwiftData
import SwiftUI

private struct IncomeSheetConfig: Identifiable {
    let id = UUID()
    var name: String
    var amount: String
    var frequency: IncomeFrequency
}

struct IncomeSetupView: View {
    var onNext: () -> Void

    @Environment(\.modelContext) private var modelContext
    @EnvironmentObject private var appState: AppState
    @Query(sort: \IncomeSource.sortOrder) private var sources: [IncomeSource]

    @State private var activeSheet: IncomeSheetConfig? = nil
    @State private var ynabIncomeHint: Double? = nil

    var body: some View {
        ZStack {
            ClarityTheme.bg.ignoresSafeArea()
            VStack(spacing: 0) {
                if sources.isEmpty {
                    emptyState
                } else {
                    sourceList
                }
                if let hint = ynabIncomeHint, sources.isEmpty {
                    ynabSuggestionBanner(amount: hint)
                }
                buttons
            }
        }
        .task { await fetchIncomeHint() }
        .sheet(item: $activeSheet) { config in
            IncomeSourceFormView(
                prefilledName: config.name,
                prefilledAmount: config.amount,
                prefilledFrequency: config.frequency
            ) { source in
                source.sortOrder = sources.count
                modelContext.insert(source)
                try? modelContext.save()
            }
        }
    }

    private var emptyState: some View {
        VStack(spacing: 12) {
            Spacer()
            Image(systemName: "dollarsign.circle")
                .font(.system(size: 48))
                .foregroundStyle(ClarityTheme.muted)
            Text("No income sources yet")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.text)
            Text("Add your paychecks, rent, and any other regular income so the app can forecast coverage.")
                .font(ClarityTheme.bodyFont)
                .foregroundStyle(ClarityTheme.muted)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
            Spacer()
        }
    }

    private var sourceList: some View {
        List {
            ForEach(sources) { source in
                incomeRow(source)
            }
            .onDelete { indices in
                for i in indices { modelContext.delete(sources[i]) }
                try? modelContext.save()
            }
        }
        .scrollContentBackground(.hidden)
        .listStyle(.insetGrouped)
    }

    private func incomeRow(_ source: IncomeSource) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(source.name)
                    .font(ClarityTheme.headlineFont)
                    .foregroundStyle(ClarityTheme.text)
                Text("\(ClarityTheme.currency(source.amountDollars)) · \(source.frequency.displayName)")
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
            }
            Spacer()
            Image(systemName: "arrow.down.circle.fill")
                .foregroundStyle(ClarityTheme.safe)
        }
        .listRowBackground(ClarityTheme.surface)
    }

    private func ynabSuggestionBanner(amount: Double) -> some View {
        Button {
            activeSheet = IncomeSheetConfig(
                name: "Monthly Income",
                amount: "\(Int(amount))",
                frequency: .monthly
            )
        } label: {
            HStack(spacing: 10) {
                Image(systemName: "wand.and.stars")
                    .foregroundStyle(ClarityTheme.accent)
                VStack(alignment: .leading, spacing: 2) {
                    Text("YNAB shows \(ClarityTheme.currency(amount)) income this month")
                        .font(ClarityTheme.headlineFont)
                        .foregroundStyle(ClarityTheme.text)
                    Text("Tap to pre-fill as a monthly source")
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
            }
            .padding(14)
            .background(ClarityTheme.surface)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(ClarityTheme.accent.opacity(0.4)))
        }
        .buttonStyle(.plain)
        .padding(.horizontal, 20)
        .padding(.bottom, 8)
    }

    private var buttons: some View {
        VStack(spacing: 12) {
            Button {
                activeSheet = IncomeSheetConfig(name: "", amount: "", frequency: .biweekly)
            } label: {
                Label("Add Income Source", systemImage: "plus")
                    .font(ClarityTheme.headlineFont)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(ClarityTheme.surface)
                    .foregroundStyle(ClarityTheme.accent)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(ClarityTheme.accent, lineWidth: 1))
            }

            Button {
                onNext()
            } label: {
                Text(sources.isEmpty ? "Skip for Now" : "Done")
                    .font(ClarityTheme.headlineFont)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(ClarityTheme.accent)
                    .foregroundStyle(ClarityTheme.text)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            }
        }
        .padding(20)
    }

    // MARK: - Income hint from YNAB

    private func fetchIncomeHint() async {
        guard let token = KeychainHelper.readToken(), !appState.activeBudgetID.isEmpty else { return }
        let client = YNABClient(token: token)
        guard let monthDetail = try? await client.fetchMonth(budgetID: appState.activeBudgetID, month: Date()),
              let incomeMilliunits = monthDetail.income,
              incomeMilliunits > 0 else { return }
        ynabIncomeHint = Double(incomeMilliunits) / 1000.0
    }
}

// MARK: - IncomeSourceFormView

private struct IncomeSourceFormView: View {
    var onSave: (IncomeSource) -> Void
    var prefilledName: String = ""
    var prefilledAmount: String = ""
    var prefilledFrequency: IncomeFrequency = .biweekly

    @Environment(\.dismiss) private var dismiss
    @State private var name: String
    @State private var amountText: String
    @State private var frequency: IncomeFrequency
    @State private var nextPayDate: Date = Date()
    @State private var secondPayDay: Int = 20

    init(
        prefilledName: String = "",
        prefilledAmount: String = "",
        prefilledFrequency: IncomeFrequency = .biweekly,
        onSave: @escaping (IncomeSource) -> Void
    ) {
        self.onSave = onSave
        self.prefilledName = prefilledName
        self.prefilledAmount = prefilledAmount
        self.prefilledFrequency = prefilledFrequency
        _name = State(initialValue: prefilledName)
        _amountText = State(initialValue: prefilledAmount)
        _frequency = State(initialValue: prefilledFrequency)
    }

    private var isValid: Bool {
        !name.trimmingCharacters(in: .whitespaces).isEmpty &&
        parsedAmount != nil
    }

    private var parsedAmount: Int? {
        guard let d = Double(amountText.replacingOccurrences(of: "$", with: "").replacingOccurrences(of: ",", with: "")),
              d > 0 else { return nil }
        return Int((d * 100).rounded())
    }

    var body: some View {
        NavigationStack {
            ZStack {
                ClarityTheme.bg.ignoresSafeArea()
                Form {
                    Section {
                        TextField("Name (e.g. Kassie paycheck)", text: $name)
                            .foregroundStyle(ClarityTheme.text)
                        TextField("Amount (e.g. 2790)", text: $amountText)
                            .keyboardType(.decimalPad)
                            .foregroundStyle(ClarityTheme.text)
                    } header: {
                        Text("Details").foregroundStyle(ClarityTheme.muted)
                    }
                    .listRowBackground(ClarityTheme.surface)

                    Section {
                        Picker("Frequency", selection: $frequency) {
                            ForEach(IncomeFrequency.allCases) { f in
                                Text(f.displayName).tag(f)
                            }
                        }
                        .foregroundStyle(ClarityTheme.text)

                        DatePicker(
                            frequency == .semimonthly ? "1st pay date" : "Next pay date",
                            selection: $nextPayDate,
                            displayedComponents: .date
                        )
                        .foregroundStyle(ClarityTheme.text)

                        if frequency == .semimonthly {
                            Stepper("2nd pay date: Day \(secondPayDay)", value: $secondPayDay, in: 1...31)
                                .foregroundStyle(ClarityTheme.text)
                        }
                    } header: {
                        Text("Schedule").foregroundStyle(ClarityTheme.muted)
                    }
                    .listRowBackground(ClarityTheme.surface)
                }
                .scrollContentBackground(.hidden)
            }
            .navigationTitle("Add Income Source")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(ClarityTheme.surface, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }.foregroundStyle(ClarityTheme.muted)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        guard let cents = parsedAmount else { return }
                        let source = IncomeSource(
                            name: name.trimmingCharacters(in: .whitespaces),
                            amountCents: cents,
                            frequency: frequency,
                            nextPayDate: nextPayDate,
                            secondPayDay: secondPayDay
                        )
                        onSave(source)
                        dismiss()
                    }
                    .disabled(!isValid)
                    .foregroundStyle(isValid ? ClarityTheme.accent : ClarityTheme.muted)
                }
            }
        }
    }
}
