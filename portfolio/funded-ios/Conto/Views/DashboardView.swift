import SwiftData
import SwiftUI

/// Rule 1 — Assign: Ready to Assign and obligation funding at a glance.
struct DashboardView: View {
    @EnvironmentObject private var appState: AppState
    @Query private var mappings: [CategoryMapping]
    @Query(sort: \IncomeSource.sortOrder) private var sources: [IncomeSource]

    @State private var showSettings = false

    private var balances: [CategoryBalance] { appState.buildBalances(mappings: mappings) }

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
                            TipBanner(
                                message: "Rule 1: Give every dollar a job. Assign Ready to Assign in YNAB, then use Bills here to fund categories that need it.",
                                storageKey: "chase_ynab_clarity_ios_tip_dismissed_assign"
                            )
                            readyToAssignCard
                            obligationsProgressCard
                            assignHintCard
                        }
                        .padding(16)
                    }
                    .refreshable {
                        await appState.refresh(categoryMappings: mappings, incomeSources: sources)
                    }
                }
            }
            .navigationTitle("Assign")
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
        }
    }

    // MARK: - Ready to Assign

    private var readyToAssignCard: some View {
        let tbb = appState.monthDetail?.toBeBudgetedDollars ?? 0
        let color: Color = tbb > 0 ? ClarityTheme.caution : (tbb < 0 ? ClarityTheme.danger : ClarityTheme.safe)

        return VStack(alignment: .leading, spacing: 12) {
            Label("Ready to Assign", systemImage: "dollarsign.circle.fill")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.text)

            Text(ClarityTheme.currency(tbb))
                .font(ClarityTheme.displayFont)
                .foregroundStyle(color)

            Text(
                tbb > 0
                    ? "Money waiting for a category in YNAB — open YNAB and assign it to match your plan."
                    : tbb < 0
                        ? "You’ve assigned more than you have (overspent Ready to Assign). Reconcile in YNAB."
                        : "Every dollar is assigned for this month."
            )
            .font(ClarityTheme.supportingFont)
            .foregroundStyle(ClarityTheme.muted)
        }
        .clarityCard()
    }

    // MARK: - Obligations progress

    private var obligationsProgressCard: some View {
        let b = balances
        let required = MetricsEngine.totalRequired(b)
        let funded = MetricsEngine.totalFunded(b)
        let fraction = required > 0 ? min(1.0, max(0, funded / required)) : 1.0

        return VStack(alignment: .leading, spacing: 12) {
            Label("Obligations funded", systemImage: "chart.bar.fill")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.text)

            HStack(spacing: 0) {
                VStack(spacing: 4) {
                    Text("Required")
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                    Text(ClarityTheme.currency(required))
                        .font(ClarityTheme.headlineFont)
                        .foregroundStyle(ClarityTheme.text)
                }
                .frame(maxWidth: .infinity)

                Rectangle()
                    .fill(ClarityTheme.border)
                    .frame(width: 1, height: 36)

                VStack(spacing: 4) {
                    Text("Funded")
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                    Text(ClarityTheme.currency(funded))
                        .font(ClarityTheme.headlineFont)
                        .foregroundStyle(ClarityTheme.safe)
                }
                .frame(maxWidth: .infinity)
            }

            ProgressView(value: ClarityTheme.clampedProgressFraction(fraction))
                .tint(ClarityTheme.progressColor(fraction: fraction))

            Text("Mortgage, bills, and essentials you mapped in Setup.")
                .font(ClarityTheme.supportingFont)
                .foregroundStyle(ClarityTheme.muted)
        }
        .clarityCard()
    }

    private var assignHintCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label("Next steps", systemImage: "arrow.right.circle.fill")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.accent)
            Text("Use the Bills tab to fund shortfalls and fix uncategorized spending. Overview shows Safe to Spend after obligations.")
                .font(ClarityTheme.supportingFont)
                .foregroundStyle(ClarityTheme.muted)
        }
        .clarityCard()
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
    DashboardView()
        .environmentObject(AppState.preview)
        .modelContainer(for: [CategoryMapping.self, IncomeSource.self], inMemory: true)
}
