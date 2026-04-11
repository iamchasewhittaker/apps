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
                            if appState.isDataStale {
                                staleSyncBanner
                            }
                            TipBanner(
                                message: "Your spendable money after all bills are accounted for. Pull down to refresh from YNAB.",
                                storageKey: "chase_ynab_clarity_ios_tip_dismissed_overview"
                            )
                            safeToSpendCard
                            budgetHealthRow
                            billsAndEssentialsCard
                            spendingSummaryCard
                            underfundedGoalsCard
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

    // MARK: - Budget health row

    private var budgetHealthRow: some View {
        let b = balances
        let required = MetricsEngine.totalRequired(b)
        let funded = MetricsEngine.totalFunded(b)
        let shortfall = MetricsEngine.currentShortfall(b)

        return HStack(spacing: 0) {
            budgetHealthMetric(label: "Required", value: ClarityTheme.currency(required), color: ClarityTheme.text)
            Rectangle().fill(ClarityTheme.border).frame(width: 1, height: 36)
            budgetHealthMetric(label: "Funded", value: ClarityTheme.currency(funded), color: ClarityTheme.safe)
            Rectangle().fill(ClarityTheme.border).frame(width: 1, height: 36)
            budgetHealthMetric(
                label: "Shortfall",
                value: shortfall > 0 ? ClarityTheme.currency(shortfall) : "None",
                color: shortfall > 0 ? ClarityTheme.danger : ClarityTheme.safe
            )
        }
        .clarityCard()
    }

    private func budgetHealthMetric(label: String, value: String, color: Color) -> some View {
        VStack(spacing: 3) {
            Text(label)
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
            Text(value)
                .font(ClarityTheme.headlineFont)
                .foregroundStyle(color)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
        }
        .frame(maxWidth: .infinity)
    }

    // MARK: - Bills & essentials (includes mortgage)

    private var billsAndEssentialsCard: some View {
        let b = balances
        let fraction = MetricsEngine.obligationsCoverageFraction(b)
        let requiredItems = b.filter { $0.role == .mortgage || $0.role == .bill || $0.role == .essential }
        let uncovered = requiredItems.filter { !$0.isCovered }
        let shortAll = MetricsEngine.currentShortfall(b)

        return VStack(alignment: .leading, spacing: 12) {
            HStack {
                Label("Bills & Essentials", systemImage: "list.bullet.rectangle.fill")
                    .font(ClarityTheme.titleFont)
                    .foregroundStyle(ClarityTheme.text)
                Spacer()
                Text(uncovered.isEmpty ? "All Covered" : ClarityTheme.currency(shortAll) + " short")
                    .font(ClarityTheme.headlineFont)
                    .foregroundStyle(uncovered.isEmpty ? ClarityTheme.safe : ClarityTheme.danger)
            }

            ProgressView(value: fraction)
                .tint(ClarityTheme.progressColor(fraction: fraction))

            if requiredItems.isEmpty {
                Text("No mortgage, bills, or essentials tagged in setup.")
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
            } else if !uncovered.isEmpty {
                VStack(spacing: 6) {
                    ForEach(uncovered, id: \.ynabCategoryID) { item in
                        HStack {
                            Text(item.name)
                                .font(ClarityTheme.captionFont)
                                .foregroundStyle(item.role == .mortgage ? ClarityTheme.mortgage : ClarityTheme.muted)
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

    // MARK: - Spending summary (transactions)

    private var spendingSummaryCard: some View {
        let tx = appState.transactions
        let yesterday = MetricsEngine.spendingYesterday(transactions: tx)
        let week = MetricsEngine.spendingThisWeek(transactions: tx)
        let month = MetricsEngine.spendingThisMonth(transactions: tx)

        return VStack(alignment: .leading, spacing: 12) {
            Label("Spending", systemImage: "cart.fill")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.text)

            Text("Outflows from your budget (excludes transfers).")
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)

            HStack(spacing: 10) {
                spendingAmountChip(label: "Yesterday", amount: yesterday)
                spendingAmountChip(label: "This Week", amount: week)
                spendingAmountChip(label: "This Month", amount: month)
            }
        }
        .clarityCard()
    }

    private func spendingAmountChip(label: String, amount: Double) -> some View {
        VStack(spacing: 4) {
            Text(label)
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
                .lineLimit(1)
                .minimumScaleFactor(0.8)
            Text(ClarityTheme.currency(amount))
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.text)
                .lineLimit(1)
                .minimumScaleFactor(0.7)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 10)
        .padding(.horizontal, 6)
        .background(ClarityTheme.bg)
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }

    // MARK: - Safe to spend card

    private var safeToSpendCard: some View {
        let b = balances
        let tbb = appState.monthDetail?.toBeBudgetedDollars ?? 0
        let total = MetricsEngine.safeToSpend(balances: b, toBeBudgeted: tbb)
        let perDay = MetricsEngine.safePerDay(balances: b, daysRemaining: daysRemaining, toBeBudgeted: tbb)
        let perWeek = MetricsEngine.safePerWeek(balances: b, daysRemaining: daysRemaining, toBeBudgeted: tbb)

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

    // MARK: - Underfunded goals card

    private var underfundedGoalsCard: some View {
        let goals: [GoalStatus] = {
            guard let month = appState.monthDetail else { return [] }
            return MetricsEngine.underfundedGoals(monthCategories: month.categories, mappings: mappings)
        }()

        return Group {
            if goals.isEmpty {
                VStack(alignment: .leading, spacing: 10) {
                    Label("Goals", systemImage: "target")
                        .font(ClarityTheme.titleFont)
                        .foregroundStyle(ClarityTheme.safe)
                    Text("All category goals are fully funded this month.")
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                }
                .clarityCard()
            } else {
                VStack(alignment: .leading, spacing: 12) {
                    HStack {
                        Label("Underfunded Goals", systemImage: "target")
                            .font(ClarityTheme.titleFont)
                            .foregroundStyle(ClarityTheme.caution)
                        Spacer()
                        Text("\(goals.count) underfunded")
                            .font(ClarityTheme.captionFont)
                            .foregroundStyle(ClarityTheme.caution)
                    }

                    VStack(spacing: 8) {
                        ForEach(goals) { goal in
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(goal.categoryName)
                                        .font(ClarityTheme.bodyFont)
                                        .foregroundStyle(ClarityTheme.text)
                                    Text("Goal: " + ClarityTheme.currency(goal.goalTarget) + " · Assigned: " + ClarityTheme.currency(goal.assigned))
                                        .font(ClarityTheme.captionFont)
                                        .foregroundStyle(ClarityTheme.muted)
                                }
                                Spacer()
                                Text(ClarityTheme.currency(goal.gap) + " needed")
                                    .font(ClarityTheme.captionFont.weight(.semibold))
                                    .foregroundStyle(ClarityTheme.caution)
                            }
                        }
                    }
                }
                .clarityCard()
            }
        }
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

    // MARK: - Stale sync banner

    private var staleSyncBanner: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: "clock.fill")
                .foregroundStyle(ClarityTheme.caution)
            Text("You haven't refreshed in over 24 hours. Pull down to sync with YNAB — reconcile accounts in YNAB regularly so balances stay accurate.")
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.text)
        }
        .padding(12)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(ClarityTheme.caution.opacity(0.12))
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(ClarityTheme.caution.opacity(0.35), lineWidth: 1)
        )
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
    @State private var showHowItWorks = false

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
                        Button("How It Works") { showHowItWorks = true }
                            .foregroundStyle(ClarityTheme.accent)
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
        .sheet(isPresented: $showHowItWorks) {
            HowItWorksView()
        }
    }
}

#Preview {
    DashboardView()
        .environmentObject(AppState.preview)
        .modelContainer(for: [CategoryMapping.self, IncomeSource.self], inMemory: true)
}
