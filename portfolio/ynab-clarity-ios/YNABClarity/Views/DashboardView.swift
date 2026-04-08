import SwiftData
import SwiftUI

struct DashboardView: View {
    @EnvironmentObject private var appState: AppState
    @Query private var mappings: [CategoryMapping]
    @Query(sort: \IncomeSource.sortOrder) private var sources: [IncomeSource]

    @State private var showSettings = false
    @State private var showFunMoneyHelp = false

    private var balances: [CategoryBalance] { appState.buildBalances(mappings: mappings) }
    private var daysRemaining: Int { MetricsEngine.daysRemainingInMonth() }

    var body: some View {
        NavigationStack {
            ZStack {
                ClarityTheme.bg.ignoresSafeArea()

                if appState.isLoading && appState.monthDetail == nil {
                    ProgressView()
                        .tint(ClarityTheme.accent)
                } else {
                    ScrollView {
                        VStack(spacing: 16) {
                            if let error = appState.loadError {
                                errorBanner(error)
                            }
                            mortgageCard
                            billsCard
                            safeToSpendCard
                            lastRefreshedLabel
                        }
                        .padding(16)
                    }
                    .refreshable {
                        await appState.refresh(categoryMappings: mappings, incomeSources: sources)
                    }
                }
            }
            .navigationTitle("Overview")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button { showSettings = true } label: {
                        Image(systemName: "gearshape.fill")
                            .foregroundStyle(ClarityTheme.muted)
                    }
                }
            }
            .sheet(isPresented: $showSettings) { SettingsSheet() }
            .sheet(isPresented: $showFunMoneyHelp) { FunMoneyHelpView() }
        }
    }

    // MARK: - Mortgage card

    private var mortgageCard: some View {
        let b = balances
        let fraction = MetricsEngine.mortgageCoveredFraction(b)
        let mortgageItems = b.filter { $0.role == .mortgage }
        let allCovered = mortgageItems.allSatisfy { $0.isCovered }
        let shortfall = MetricsEngine.mortgageShortfall(b)

        return VStack(alignment: .leading, spacing: 12) {
            HStack {
                Label("Mortgage", systemImage: "house.fill")
                    .font(ClarityTheme.titleFont)
                    .foregroundStyle(ClarityTheme.mortgage)
                Spacer()
                Text(allCovered ? "Covered" : ClarityTheme.currency(shortfall) + " short")
                    .font(ClarityTheme.headlineFont)
                    .foregroundStyle(allCovered ? ClarityTheme.safe : ClarityTheme.danger)
            }

            ProgressView(value: fraction)
                .tint(ClarityTheme.progressColor(fraction: fraction))

            if !mortgageItems.isEmpty {
                ForEach(mortgageItems, id: \.ynabCategoryID) { item in
                    HStack {
                        Text(item.name)
                            .font(ClarityTheme.captionFont)
                            .foregroundStyle(ClarityTheme.muted)
                        Spacer()
                        Text(item.isCovered
                             ? "Covered"
                             : ClarityTheme.currency(max(0, item.available)) + " / " + ClarityTheme.currency(item.monthlyTarget))
                            .font(ClarityTheme.captionFont)
                            .foregroundStyle(item.isCovered ? ClarityTheme.safe : ClarityTheme.caution)
                    }
                }
            } else {
                Text("No mortgage categories tagged")
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
            }
        }
        .clarityCard()
    }

    // MARK: - Bills card

    private var billsCard: some View {
        let b = balances
        let fraction = MetricsEngine.billsCoverageFraction(b)
        let billItems = b.filter { $0.role == .bill || $0.role == .essential }
        let uncovered = billItems.filter { !$0.isCovered }

        return VStack(alignment: .leading, spacing: 12) {
            HStack {
                Label("Bills & Essentials", systemImage: "list.bullet.rectangle.fill")
                    .font(ClarityTheme.titleFont)
                    .foregroundStyle(ClarityTheme.text)
                Spacer()
                Text(uncovered.isEmpty ? "All Covered" : "\(uncovered.count) Uncovered")
                    .font(ClarityTheme.headlineFont)
                    .foregroundStyle(uncovered.isEmpty ? ClarityTheme.safe : ClarityTheme.danger)
            }

            ProgressView(value: fraction)
                .tint(ClarityTheme.progressColor(fraction: fraction))

            if !uncovered.isEmpty {
                VStack(spacing: 6) {
                    ForEach(uncovered, id: \.ynabCategoryID) { item in
                        HStack {
                            Text(item.name)
                                .font(ClarityTheme.captionFont)
                                .foregroundStyle(ClarityTheme.muted)
                            Spacer()
                            Text(ClarityTheme.currency(max(0, item.available))
                                 + " / " + ClarityTheme.currency(item.monthlyTarget))
                                .font(ClarityTheme.captionFont)
                                .foregroundStyle(ClarityTheme.danger)
                        }
                    }
                }
            }
        }
        .clarityCard()
    }

    // MARK: - Safe to spend card

    private var safeToSpendCard: some View {
        let b = balances
        let total = MetricsEngine.safeToSpend(balances: b)
        let perDay = MetricsEngine.safePerDay(balances: b, daysRemaining: daysRemaining)
        let perWeek = MetricsEngine.safePerWeek(balances: b, daysRemaining: daysRemaining)

        return VStack(alignment: .leading, spacing: 12) {
            HStack {
                Label("Safe to Spend", systemImage: "checkmark.seal.fill")
                    .font(ClarityTheme.titleFont)
                    .foregroundStyle(ClarityTheme.safe)
                Spacer()
                Button {
                    showFunMoneyHelp = true
                } label: {
                    Image(systemName: "info.circle")
                        .foregroundStyle(ClarityTheme.muted)
                }
            }

            HStack(spacing: 10) {
                spendChip(label: "Today", amount: perDay)
                spendChip(label: "This Week", amount: perWeek)
                spendChip(label: "This Month", amount: total)
            }
        }
        .clarityCard()
    }

    private func spendChip(label: String, amount: Double) -> some View {
        VStack(spacing: 4) {
            Text(label)
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
                .lineLimit(1)
                .minimumScaleFactor(0.8)
            Text(ClarityTheme.currency(amount))
                .font(ClarityTheme.titleFont)
                .foregroundStyle(amount > 0 ? ClarityTheme.safe : ClarityTheme.danger)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 10)
        .padding(.horizontal, 6)
        .background(ClarityTheme.bg)
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }

    // MARK: - Last refreshed

    private var lastRefreshedLabel: some View {
        Group {
            if let date = appState.lastRefreshed {
                Text("Updated " + date.formatted(.relative(presentation: .named)))
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
                    .frame(maxWidth: .infinity, alignment: .center)
            }
        }
    }

    // MARK: - Error banner

    private func errorBanner(_ message: String) -> some View {
        HStack(spacing: 10) {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(ClarityTheme.danger)
            Text(message)
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.text)
            Spacer()
        }
        .padding(12)
        .background(ClarityTheme.danger.opacity(0.15))
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(ClarityTheme.danger.opacity(0.4), lineWidth: 1)
        )
    }
}

// MARK: - SettingsSheet

private struct SettingsSheet: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.dismiss) private var dismiss
    @State private var showTokenEntry = false

    var body: some View {
        NavigationStack {
            ZStack {
                ClarityTheme.bg.ignoresSafeArea()
                List {
                    Section("Budget") {
                        LabeledContent("Active Budget",
                                       value: appState.activeBudgetName.isEmpty
                                              ? "Not set"
                                              : appState.activeBudgetName)
                    }

                    Section("Income Tax") {
                        HStack {
                            Text("Estimated Tax Rate")
                            Spacer()
                            Text("\(Int(appState.taxRate * 100))%")
                                .foregroundStyle(ClarityTheme.muted)
                        }
                        Slider(value: $appState.taxRate, in: 0.10...0.50, step: 0.01)
                            .tint(ClarityTheme.accent)
                    }

                    Section {
                        Button("Re-enter YNAB Token") { showTokenEntry = true }
                            .foregroundStyle(ClarityTheme.accent)
                        Button("Reset Setup", role: .destructive) {
                            appState.setupComplete = false
                            dismiss()
                        }
                    }
                }
                .scrollContentBackground(.hidden)
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                        .foregroundStyle(ClarityTheme.accent)
                }
            }
        }
        .preferredColorScheme(.dark)
        .sheet(isPresented: $showTokenEntry) {
            TokenStepView(onNext: { _ in
                showTokenEntry = false
            })
            .preferredColorScheme(.dark)
        }
    }
}

#Preview {
    DashboardView()
        .environmentObject(AppState.preview)
        .modelContainer(for: [CategoryMapping.self, IncomeSource.self], inMemory: true)
}
