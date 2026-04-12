import SwiftData
import SwiftUI

struct CashFlowView: View {
    @EnvironmentObject private var appState: AppState
    @Query private var mappings: [CategoryMapping]
    @Query(sort: \IncomeSource.sortOrder) private var sources: [IncomeSource]

    private var balances: [CategoryBalance] {
        appState.buildBalances(mappings: mappings)
    }
    private var timeline: [CashFlowEvent] {
        CashFlowEngine.buildTimeline(sources: sources, balances: balances, month: Date())
    }

    private let shortDateFormat: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "MMM d"
        return f
    }()

    var body: some View {
        NavigationStack {
            ZStack {
                ClarityTheme.bg.ignoresSafeArea()

                if appState.isLoading && appState.monthDetail == nil {
                    ProgressView().tint(ClarityTheme.accent)
                } else if timeline.isEmpty {
                    emptyState
                } else {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 0) {
                            TipBanner(
                                message: "Shows when paychecks arrive relative to when bills are due.",
                                storageKey: "chase_ynab_clarity_ios_tip_dismissed_cashflow"
                            )
                            .padding(.horizontal, 16)
                            .padding(.top, 16)

                            summaryCard
                                .padding(.horizontal, 16)
                                .padding(.top, 16)
                                .padding(.bottom, 16)

                            ForEach(timeline) { event in
                                eventRow(event)
                                    .padding(.horizontal, 16)
                            }

                            Spacer(minLength: 24)
                        }
                    }
                    .refreshable {
                        await appState.refresh(categoryMappings: mappings, incomeSources: sources)
                    }
                }
            }
            .navigationTitle("Cash Flow")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    // MARK: - Summary card

    private var summaryCard: some View {
        let totalIncome = timeline
            .filter { $0.kind == .paycheck }
            .reduce(0) { $0 + $1.amount }
        let required = MetricsEngine.totalRequired(balances)
        let fraction = required > 0 ? min(1.0, max(0, totalIncome / required)) : 1.0

        return VStack(alignment: .leading, spacing: 12) {
            Text("This Month")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.text)

            HStack(spacing: 0) {
                VStack(spacing: 4) {
                    Text("Total Paychecks")
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                    Text(ClarityTheme.currency(totalIncome))
                        .font(ClarityTheme.titleFont)
                        .foregroundStyle(ClarityTheme.safe)
                }
                .frame(maxWidth: .infinity)

                Rectangle()
                    .fill(ClarityTheme.border)
                    .frame(width: 1, height: 40)

                VStack(spacing: 4) {
                    Text("Required")
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                    Text(ClarityTheme.currency(required))
                        .font(ClarityTheme.titleFont)
                        .foregroundStyle(ClarityTheme.caution)
                }
                .frame(maxWidth: .infinity)
            }

            ProgressView(value: ClarityTheme.clampedProgressFraction(fraction))
                .tint(ClarityTheme.progressColor(fraction: fraction))
        }
        .clarityCard()
    }

    // MARK: - Event row dispatcher

    @ViewBuilder
    private func eventRow(_ event: CashFlowEvent) -> some View {
        switch event.kind {
        case .todayMarker:
            todayMarkerRow
        case .mortgageCoveredMarker:
            mortgageMarkerRow(event)
        case .paycheck:
            timelineRow(
                date: shortDateFormat.string(from: event.date),
                icon: "banknote.fill",
                iconColor: ClarityTheme.safe,
                label: event.label,
                amount: "+" + ClarityTheme.currency(event.amount),
                amountColor: ClarityTheme.safe,
                subtitle: ClarityTheme.currency(event.cumulativeIncome) + " received so far"
            )
        case .bill:
            let statusText = event.isCovered
                ? "Covered"
                : (event.shortfall > 0 ? ClarityTheme.currency(event.shortfall) + " short" : nil)
            timelineRow(
                date: shortDateFormat.string(from: event.date),
                icon: "arrow.up.circle.fill",
                iconColor: event.isCovered ? ClarityTheme.safe : ClarityTheme.caution,
                label: event.label,
                amount: event.amount > 0 ? ClarityTheme.currency(event.amount) : "",
                amountColor: ClarityTheme.muted,
                subtitle: statusText
            )
        }
    }

    // MARK: - Generic timeline row

    private func timelineRow(
        date: String,
        icon: String,
        iconColor: Color,
        label: String,
        amount: String,
        amountColor: Color,
        subtitle: String?
    ) -> some View {
        HStack(alignment: .top, spacing: 12) {
            Text(date)
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
                .frame(width: 46, alignment: .leading)

            Image(systemName: icon)
                .foregroundStyle(iconColor)
                .frame(width: 20)

            VStack(alignment: .leading, spacing: 2) {
                Text(label)
                    .font(ClarityTheme.bodyFont)
                    .foregroundStyle(ClarityTheme.text)
                if let sub = subtitle {
                    Text(sub)
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                }
            }

            Spacer()

            if !amount.isEmpty {
                Text(amount)
                    .font(ClarityTheme.headlineFont)
                    .foregroundStyle(amountColor)
            }
        }
        .padding(.vertical, 10)
        .overlay(alignment: .bottom) {
            Rectangle()
                .fill(ClarityTheme.border.opacity(0.4))
                .frame(height: 1)
                .padding(.leading, 78)
        }
    }

    // MARK: - Today marker

    private var todayMarkerRow: some View {
        HStack(spacing: 8) {
            Rectangle()
                .fill(ClarityTheme.accent)
                .frame(height: 2)
            Text("Today")
                .font(ClarityTheme.captionFont.weight(.semibold))
                .foregroundStyle(ClarityTheme.accent)
            Rectangle()
                .fill(ClarityTheme.accent)
                .frame(height: 2)
        }
        .padding(.vertical, 8)
    }

    // MARK: - Mortgage covered marker

    private func mortgageMarkerRow(_ event: CashFlowEvent) -> some View {
        HStack(spacing: 8) {
            Image(systemName: "checkmark.seal.fill")
                .foregroundStyle(ClarityTheme.mortgage)
            Text(event.label)
                .font(ClarityTheme.captionFont.weight(.semibold))
                .foregroundStyle(ClarityTheme.mortgage)
            Spacer()
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 12)
        .background(ClarityTheme.mortgage.opacity(0.12))
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(ClarityTheme.mortgage.opacity(0.25), lineWidth: 1)
        )
        .padding(.vertical, 6)
    }

    // MARK: - Empty state

    private var emptyState: some View {
        VStack(spacing: 14) {
            Image(systemName: "arrow.left.arrow.right.circle")
                .font(.system(size: 44))
                .foregroundStyle(ClarityTheme.muted)
            Text("No timeline yet")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.muted)
            Text("Add income sources in Setup and categorize your bills to see the cash flow timeline.")
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
        }
    }
}

#Preview {
    CashFlowView()
        .environmentObject(AppState.preview)
        .modelContainer(for: [CategoryMapping.self, IncomeSource.self], inMemory: true)
}
