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
    @State private var hintBannerTitle: String = ""
    @State private var hintBannerSubtitle: String = ""
    /// When true, tapping the banner pre-fills the add-income sheet from `ynabIncomeHint`.
    @State private var hintTapPrefillsIncome = false
    @State private var isLoadingHint = false
    @State private var incomeHintError: String? = nil
    @State private var hintEmptyMessage: String? = nil

    var body: some View {
        ZStack {
            ClarityTheme.bg.ignoresSafeArea()
            VStack(spacing: 0) {
                if sources.isEmpty {
                    emptyState
                } else {
                    sourceList
                }
                if sources.isEmpty {
                    incomeHintSection
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
            if isLoadingHint {
                ProgressView("Checking YNAB…")
                    .tint(ClarityTheme.accent)
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
                    .padding(.top, 8)
            }
            Spacer()
        }
    }

    @ViewBuilder
    private var incomeHintSection: some View {
        if let err = incomeHintError, !err.isEmpty {
            VStack(alignment: .leading, spacing: 6) {
                Label(err, systemImage: "exclamationmark.triangle.fill")
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.danger)
            }
            .padding(14)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(ClarityTheme.surface)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(RoundedRectangle(cornerRadius: 12).stroke(ClarityTheme.danger.opacity(0.35)))
            .padding(.horizontal, 20)
            .padding(.bottom, 8)
        } else if let msg = hintEmptyMessage, !msg.isEmpty, ynabIncomeHint == nil, !isLoadingHint {
            Text(msg)
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 24)
                .padding(.bottom, 8)
        }

        if let amount = ynabIncomeHint, !hintBannerTitle.isEmpty {
            ynabSuggestionBanner(
                amount: amount,
                title: hintBannerTitle,
                subtitle: hintBannerSubtitle,
                prefillOnTap: hintTapPrefillsIncome
            )
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

    private func ynabSuggestionBanner(
        amount: Double,
        title: String,
        subtitle: String,
        prefillOnTap: Bool
    ) -> some View {
        Group {
            if prefillOnTap {
                Button {
                    activeSheet = IncomeSheetConfig(
                        name: "Monthly Income",
                        amount: "\(Int(amount.rounded()))",
                        frequency: .monthly
                    )
                } label: {
                    bannerLabel(
                        amount: amount,
                        title: title,
                        subtitle: subtitle,
                        showChevron: true,
                        iconName: "wand.and.stars"
                    )
                }
                .buttonStyle(.plain)
            } else {
                bannerLabel(
                    amount: amount,
                    title: title,
                    subtitle: subtitle,
                    showChevron: false,
                    iconName: "info.circle"
                )
            }
        }
        .padding(.horizontal, 20)
        .padding(.bottom, 8)
    }

    private func bannerLabel(
        amount: Double,
        title: String,
        subtitle: String,
        showChevron: Bool,
        iconName: String
    ) -> some View {
        HStack(spacing: 10) {
            Image(systemName: iconName)
                .foregroundStyle(ClarityTheme.accent)
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(ClarityTheme.headlineFont)
                    .foregroundStyle(ClarityTheme.text)
                Text(subtitle)
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
                Text(ClarityTheme.currency(amount))
                    .font(ClarityTheme.bodyFont.weight(.semibold))
                    .foregroundStyle(ClarityTheme.text)
                    .padding(.top, 2)
            }
            Spacer()
            if showChevron {
                Image(systemName: "chevron.right")
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
            }
        }
        .padding(14)
        .background(ClarityTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(ClarityTheme.accent.opacity(0.4)))
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
        await MainActor.run {
            isLoadingHint = true
            incomeHintError = nil
            hintEmptyMessage = nil
            ynabIncomeHint = nil
            hintBannerTitle = ""
            hintBannerSubtitle = ""
            hintTapPrefillsIncome = false
        }

        guard let token = KeychainHelper.readToken(), !appState.activeBudgetID.isEmpty else {
            await MainActor.run {
                incomeHintError = "No budget selected yet. Go back and pick a budget."
                isLoadingHint = false
            }
            return
        }

        let client = YNABClient(token: token)
        let budgetID = appState.activeBudgetID

        do {
            let thisMonth = try await client.fetchMonth(budgetID: budgetID, month: Date())
            let incomeThis = thisMonth.income ?? 0
            if incomeThis > 0 {
                await MainActor.run {
                    ynabIncomeHint = Double(incomeThis) / 1000.0
                    hintBannerTitle = "Income in YNAB (this month)"
                    hintBannerSubtitle = "Tap to pre-fill a monthly income source."
                    hintTapPrefillsIncome = true
                    isLoadingHint = false
                }
                return
            }

            let cal = Calendar.current
            if let prevDate = cal.date(byAdding: .month, value: -1, to: Date()) {
                let prevMonth = try await client.fetchMonth(budgetID: budgetID, month: prevDate)
                let incomePrev = prevMonth.income ?? 0
                if incomePrev > 0 {
                    await MainActor.run {
                        ynabIncomeHint = Double(incomePrev) / 1000.0
                        hintBannerTitle = "Income in YNAB (last month)"
                        hintBannerSubtitle = "This month shows $0 in YNAB’s income total. Tap to use last month’s amount as a starting point."
                        hintTapPrefillsIncome = true
                        isLoadingHint = false
                    }
                    return
                }
            }

            let tbb = thisMonth.toBeBudgeted ?? 0
            if tbb != 0 {
                await MainActor.run {
                    ynabIncomeHint = Double(tbb) / 1000.0
                    hintBannerTitle = "Ready to Assign"
                    hintBannerSubtitle = "Not income — cash waiting to be assigned in YNAB. Add paychecks with “Add Income Source.”"
                    hintTapPrefillsIncome = false
                    isLoadingHint = false
                }
                return
            }

            await MainActor.run {
                hintEmptyMessage =
                    "YNAB shows $0 income for this month and no Ready to Assign. Add income manually, or check your budget in YNAB."
                isLoadingHint = false
            }
        } catch {
            await MainActor.run {
                incomeHintError = error.localizedDescription
                isLoadingHint = false
            }
        }
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
