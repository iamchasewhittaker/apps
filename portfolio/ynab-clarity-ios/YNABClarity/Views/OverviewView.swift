import SwiftData
import SwiftUI

/// Safe to Spend, spending summary, and sync health — first tab “Overview”.
struct OverviewView: View {
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
                                message: "Give every dollar a job. Safe to Spend is what's left after all your obligations are covered.",
                                storageKey: "chase_ynab_clarity_ios_tip_dismissed_overview"
                            )
                            safeToSpendCard
                            spendingSummaryCard
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
            .sheet(isPresented: $showSettings) { SettingsSheetView() }
            .sheet(isPresented: $showFunMoneyHelp) { FunMoneyHelpView() }
        }
    }

    // MARK: - Spending summary

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

    // MARK: - Safe to spend

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

#Preview {
    OverviewView()
        .environmentObject(AppState.preview)
        .modelContainer(for: [CategoryMapping.self, IncomeSource.self], inMemory: true)
}
