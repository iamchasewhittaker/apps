import SwiftData
import SwiftUI

struct IncomeGapView: View {
    @EnvironmentObject private var appState: AppState
    @Query private var mappings: [CategoryMapping]
    @Query(sort: \IncomeSource.sortOrder) private var sources: [IncomeSource]

    @State private var showIncomeSources = false

    private var balances: [CategoryBalance] { appState.buildBalances(mappings: mappings) }
    private var currentMonth: Date { Date() }

    private var totalRequired: Double   { MetricsEngine.totalRequired(balances) }
    private var expectedIncome: Double  { MetricsEngine.expectedIncomeThisMonth(sources: sources, month: currentMonth) }
    private var gap: Double             { MetricsEngine.incomeGap(balances: balances, sources: sources, month: currentMonth) }
    private var surplus: Double         { max(0, expectedIncome - totalRequired) }
    private var grossNeeded: Double     { MetricsEngine.grossAnnualNeeded(netMonthlyNeeded: totalRequired, taxRate: appState.taxRate) }

    var body: some View {
        NavigationStack {
            ZStack {
                ClarityTheme.bg.ignoresSafeArea()

                if appState.isLoading && appState.monthDetail == nil {
                    ProgressView().tint(ClarityTheme.accent)
                } else {
                    ScrollView {
                        VStack(spacing: 16) {
                            TipBanner(
                                message: "Required expenses come from your YNAB goal targets. Income sources are configured during setup.",
                                storageKey: "chase_ynab_clarity_ios_tip_dismissed_income"
                            )
                            incomeVsRequiredCard
                            gapOrSurplusCard
                            salaryTargetCard
                        }
                        .padding(16)
                    }
                    .refreshable {
                        await appState.refresh(categoryMappings: mappings, incomeSources: sources)
                    }
                }
            }
            .navigationTitle("Income")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    // MARK: - Income vs Required (with expandable sources)

    private var incomeVsRequiredCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("This Month")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.text)

            HStack(spacing: 0) {
                metricBlock(label: "Expected Income",  value: ClarityTheme.currency(expectedIncome), color: ClarityTheme.safe)
                Rectangle()
                    .fill(ClarityTheme.border)
                    .frame(width: 1, height: 44)
                metricBlock(label: "Required Expenses", value: ClarityTheme.currency(totalRequired), color: ClarityTheme.caution)
            }

            let fraction = totalRequired > 0 ? min(1.0, max(0, expectedIncome / totalRequired)) : 1.0
            ProgressView(value: ClarityTheme.clampedProgressFraction(fraction))
                .tint(ClarityTheme.progressColor(fraction: fraction))

            if !sources.isEmpty {
                Button {
                    withAnimation(.easeInOut(duration: 0.25)) { showIncomeSources.toggle() }
                } label: {
                    HStack {
                        Text("\(sources.count) income source\(sources.count == 1 ? "" : "s")")
                            .font(ClarityTheme.captionFont)
                            .foregroundStyle(ClarityTheme.accent)
                        Image(systemName: showIncomeSources ? "chevron.up" : "chevron.down")
                            .font(.caption2)
                            .foregroundStyle(ClarityTheme.accent)
                        Spacer()
                    }
                }
                .buttonStyle(.plain)

                if showIncomeSources {
                    VStack(spacing: 10) {
                        ForEach(sources) { source in
                            let count = source.occurrencesInMonth(currentMonth).count
                            let monthlyTotal = source.amountDollars * Double(count)
                            HStack {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(source.name)
                                        .font(ClarityTheme.bodyFont)
                                        .foregroundStyle(ClarityTheme.text)
                                    Text("\(source.frequency.displayName) · \(count)× this month")
                                        .font(ClarityTheme.captionFont)
                                        .foregroundStyle(ClarityTheme.muted)
                                }
                                Spacer()
                                VStack(alignment: .trailing, spacing: 2) {
                                    Text(ClarityTheme.currency(monthlyTotal))
                                        .font(ClarityTheme.headlineFont)
                                        .foregroundStyle(ClarityTheme.safe)
                                    Text(ClarityTheme.currency(source.amountDollars) + "/check")
                                        .font(ClarityTheme.captionFont)
                                        .foregroundStyle(ClarityTheme.muted)
                                }
                            }
                        }
                    }
                    .padding(.top, 4)
                }
            }
        }
        .clarityCard()
    }

    // MARK: - Gap or surplus card

    private var gapOrSurplusCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            if gap > 0 {
                HStack {
                    Label("Income Gap", systemImage: "exclamationmark.triangle.fill")
                        .font(ClarityTheme.titleFont)
                        .foregroundStyle(ClarityTheme.danger)
                    Spacer()
                    Text(ClarityTheme.currency(gap) + " short")
                        .font(ClarityTheme.headlineFont)
                        .foregroundStyle(ClarityTheme.danger)
                }
                Text("Income falls short of required expenses by \(ClarityTheme.currency(gap)) this month.")
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
            } else {
                HStack {
                    Label("Monthly Surplus", systemImage: "checkmark.seal.fill")
                        .font(ClarityTheme.titleFont)
                        .foregroundStyle(ClarityTheme.safe)
                    Spacer()
                    Text("+" + ClarityTheme.currency(surplus))
                        .font(ClarityTheme.headlineFont)
                        .foregroundStyle(ClarityTheme.safe)
                }
                Text("Expected income covers all required expenses with \(ClarityTheme.currency(surplus)) remaining.")
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
            }
        }
        .clarityCard()
    }

    // MARK: - Salary target card

    private var salaryTargetCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Salary Target")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.text)

            HStack(alignment: .bottom) {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Gross Annual Needed")
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                    Text(ClarityTheme.currency(grossNeeded))
                        .font(ClarityTheme.displayFont)
                        .foregroundStyle(ClarityTheme.text)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 4) {
                    Text("Net Monthly")
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                    Text(ClarityTheme.currency(totalRequired))
                        .font(ClarityTheme.titleFont)
                        .foregroundStyle(ClarityTheme.muted)
                }
            }

            Text("Based on \(ClarityTheme.currency(totalRequired))/mo in required expenses and a \(Int(appState.taxRate * 100))% tax rate. Adjust the rate in Settings.")
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
        }
        .clarityCard()
    }

    // MARK: - Helpers

    private func metricBlock(label: String, value: String, color: Color) -> some View {
        VStack(spacing: 4) {
            Text(label)
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
                .multilineTextAlignment(.center)
            Text(value)
                .font(ClarityTheme.titleFont)
                .foregroundStyle(color)
        }
        .frame(maxWidth: .infinity)
    }
}

#Preview {
    IncomeGapView()
        .environmentObject(AppState.preview)
        .modelContainer(for: [CategoryMapping.self, IncomeSource.self], inMemory: true)
}
