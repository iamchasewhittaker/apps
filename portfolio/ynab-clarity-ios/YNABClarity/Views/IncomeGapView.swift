import SwiftData
import SwiftUI

struct IncomeGapView: View {
    @EnvironmentObject private var appState: AppState
    @Query private var mappings: [CategoryMapping]
    @Query(sort: \IncomeSource.sortOrder) private var sources: [IncomeSource]

    private var balances: [CategoryBalance] { appState.buildBalances(mappings: mappings) }
    private var currentMonth: Date { Date() }

    private var totalRequired: Double   { MetricsEngine.totalRequired(balances) }
    private var expectedIncome: Double  { MetricsEngine.expectedIncomeThisMonth(sources: sources, month: currentMonth) }
    private var gap: Double             { MetricsEngine.incomeGap(balances: balances, sources: sources, month: currentMonth) }
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
                            incomeVsRequiredCard
                            gapCard
                            salaryTargetCard
                            if !sources.isEmpty { incomeSourcesCard }
                        }
                        .padding(16)
                    }
                    .refreshable {
                        await appState.refresh(categoryMappings: mappings, incomeSources: sources)
                    }
                }
            }
            .navigationTitle("Salary")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    // MARK: - Income vs Required

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

            let fraction = totalRequired > 0 ? min(1.0, expectedIncome / totalRequired) : 1.0
            ProgressView(value: fraction)
                .tint(ClarityTheme.progressColor(fraction: fraction))
        }
        .clarityCard()
    }

    // MARK: - Gap card

    private var gapCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Label(
                    "Income Gap",
                    systemImage: gap > 0 ? "exclamationmark.triangle.fill" : "checkmark.seal.fill"
                )
                .font(ClarityTheme.titleFont)
                .foregroundStyle(gap > 0 ? ClarityTheme.danger : ClarityTheme.safe)
                Spacer()
                Text(gap > 0 ? ClarityTheme.currency(gap) + " short" : "Covered")
                    .font(ClarityTheme.headlineFont)
                    .foregroundStyle(gap > 0 ? ClarityTheme.danger : ClarityTheme.safe)
            }

            Text(gap > 0
                 ? "Income falls short of required expenses by \(ClarityTheme.currency(gap)) this month."
                 : "Expected income covers all required expenses this month.")
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
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

            HStack(spacing: 6) {
                Image(systemName: "percent")
                    .font(.caption)
                    .foregroundStyle(ClarityTheme.muted)
                Text("Tax rate: \(Int(appState.taxRate * 100))% — adjust in Settings")
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
            }
        }
        .clarityCard()
    }

    // MARK: - Income sources card

    private var incomeSourcesCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Income Sources")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.text)

            VStack(spacing: 12) {
                ForEach(sources) { source in
                    let count = source.occurrencesInMonth(currentMonth).count
                    let monthlyTotal = source.amountDollars * Double(count)

                    VStack(spacing: 0) {
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
                        if source.id != sources.last?.id {
                            Divider()
                                .background(ClarityTheme.border)
                                .padding(.top, 12)
                        }
                    }
                }
            }
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
