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
                } else {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 0) {
                            TipBanner(
                                message: "Rule 4: Age your money. Higher age means you’re spending from older income — the antidote to living paycheck-to-paycheck.",
                                storageKey: "chase_ynab_clarity_ios_tip_dismissed_cashflow"
                            )
                            .padding(.horizontal, 16)
                            .padding(.top, 16)

                            ageOfMoneyCard
                                .padding(.horizontal, 16)
                                .padding(.top, 16)

                            ageMilestonesCard
                                .padding(.horizontal, 16)
                                .padding(.top, 16)

                            ageMoneyActionsCard
                                .padding(.horizontal, 16)
                                .padding(.top, 16)

                            if !timeline.isEmpty {
                                supportingSectionHeader
                                    .padding(.horizontal, 16)
                                    .padding(.top, 24)
                                    .padding(.bottom, 8)

                                summaryCard
                                    .padding(.horizontal, 16)
                                    .padding(.bottom, 8)

                                ForEach(timeline) { event in
                                    eventRow(event)
                                        .padding(.horizontal, 16)
                                }
                            } else {
                                timelineEmptyHint
                                    .padding(.horizontal, 16)
                                    .padding(.top, 24)
                            }

                            Spacer(minLength: 24)
                        }
                    }
                    .refreshable {
                        await appState.refresh(categoryMappings: mappings, incomeSources: sources)
                    }
                }
            }
            .navigationTitle("Age Money")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    // MARK: - Age of money card

    private var ageOfMoneyCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Age of Money", systemImage: "hourglass")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.text)

            if let age = appState.ageOfMoney {
                let (label, color) = ageLabel(days: age)
                HStack(alignment: .firstTextBaseline, spacing: 6) {
                    Text("\(age)")
                        .font(ClarityTheme.displayFont)
                        .foregroundStyle(color)
                    Text("days")
                        .font(ClarityTheme.titleFont)
                        .foregroundStyle(ClarityTheme.muted)
                }
                Text(label)
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(color)
                Text(nextMilestoneMessage(currentDays: age))
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
            } else {
                Text("YNAB will show age of money once it has enough history. Keep assigning and reconciling — the metric appears automatically.")
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
            }
        }
        .clarityCard()
    }

    private func nextMilestoneMessage(currentDays: Int) -> String {
        let thresholds = [10, 20, 30, 60]
        guard let next = thresholds.first(where: { $0 > currentDays }) else {
            return "You’re past common milestones — keep steady habits to maintain a high age."
        }
        let remaining = next - currentDays
        return "Next milestone: \(next) days (\(remaining) day\(remaining == 1 ? "" : "s") to go). Each step means you’re separating spending from this week’s paycheck."
    }

    private func ageLabel(days: Int) -> (String, Color) {
        switch days {
        case ..<10:  return ("Paycheck to paycheck", ClarityTheme.danger)
        case 10..<20: return ("Building a buffer", ClarityTheme.caution)
        case 20..<30: return ("Getting ahead", ClarityTheme.safe)
        default:      return ("Money is aging well", ClarityTheme.accent)
        }
    }

    // MARK: - Milestones

    private var ageMilestonesCard: some View {
        let age = appState.ageOfMoney ?? 0
        let rows: [(days: Int, blurb: String)] = [
            (10, "Spending is less tied to the last deposit."),
            (20, "A cushion is forming before bills hit."),
            (30, "Often described as “one month ahead” territory."),
            (60, "Strong separation from paycheck timing.")
        ]

        return VStack(alignment: .leading, spacing: 12) {
            Label("Milestones", systemImage: "flag.checkered")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.text)

            if appState.ageOfMoney == nil {
                Text("Milestones unlock once YNAB reports your age of money.")
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
            } else {
                VStack(alignment: .leading, spacing: 10) {
                    ForEach(rows, id: \.days) { row in
                        HStack(alignment: .top, spacing: 10) {
                            Image(systemName: age >= row.days ? "checkmark.circle.fill" : "circle")
                                .foregroundStyle(age >= row.days ? ClarityTheme.safe : ClarityTheme.muted)
                            VStack(alignment: .leading, spacing: 2) {
                                Text("\(row.days)+ days")
                                    .font(ClarityTheme.bodyFont.weight(.semibold))
                                    .foregroundStyle(ClarityTheme.text)
                                Text(row.blurb)
                                    .font(ClarityTheme.captionFont)
                                    .foregroundStyle(ClarityTheme.muted)
                            }
                        }
                    }
                }
            }
        }
        .clarityCard()
    }

    // MARK: - Actions (coaching)

    private var ageMoneyActionsCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Label("Ways to raise it", systemImage: "lightbulb.fill")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.accent)

            VStack(alignment: .leading, spacing: 8) {
                actionLine("Assign every inflow in YNAB before spending discretionary money.")
                actionLine("Build a one-month buffer in checking so bills don’t force instant spending.")
                actionLine("Roll with the punches without undoing assigned essentials — keeps aging honest.")
                actionLine("Use Overview → Safe to Spend to pace flex spending as age climbs.")
            }
        }
        .clarityCard()
    }

    private func actionLine(_ text: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Text("•")
                .foregroundStyle(ClarityTheme.accent)
            Text(text)
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
        }
    }

    private var supportingSectionHeader: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Supporting context")
                .font(ClarityTheme.headlineFont)
                .foregroundStyle(ClarityTheme.text)
            Text("Paychecks vs obligations this month — helpful timing, separate from the age-of-money score.")
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
        }
    }

    private var timelineEmptyHint: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("No paycheck / bill timeline yet")
                .font(ClarityTheme.headlineFont)
                .foregroundStyle(ClarityTheme.muted)
            Text("Add income sources in Setup and map bill categories with due days to see when money lands vs when bills go out.")
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(14)
        .background(ClarityTheme.surface.opacity(0.6))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(ClarityTheme.border.opacity(0.5), lineWidth: 1)
        )
    }

    // MARK: - Summary card (supporting)

    private var summaryCard: some View {
        let totalIncome = timeline
            .filter { $0.kind == .paycheck }
            .reduce(0) { $0 + $1.amount }
        let required = MetricsEngine.totalRequired(balances)
        let fraction = required > 0 ? min(1.0, max(0, totalIncome / required)) : 1.0

        return VStack(alignment: .leading, spacing: 12) {
            Text("This month (cash timing)")
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
}

#Preview {
    CashFlowView()
        .environmentObject(AppState.preview)
        .modelContainer(for: [CategoryMapping.self, IncomeSource.self], inMemory: true)
}
