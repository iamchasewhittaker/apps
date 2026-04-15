import SwiftUI

struct HowItWorksView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ZStack {
                ClarityTheme.bg.ignoresSafeArea()
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        section(
                            icon: "square.grid.2x2.fill",
                            color: ClarityTheme.accent,
                            title: "Overview",
                            body: "Safe to Spend and spending pace (yesterday / this week / this month). Pull to refresh to sync with YNAB."
                        )
                        section(
                            icon: "dollarsign.circle.fill",
                            color: ClarityTheme.caution,
                            title: "Assign",
                            body: "Ready to Assign from YNAB and how fully your mapped obligations are funded. Use YNAB to assign dollars; use Bills to fund category shortfalls."
                        )
                        section(
                            icon: "list.bullet.rectangle",
                            color: ClarityTheme.safe,
                            title: "Bills",
                            body: "Categorization review for uncategorized spending, plus bill funding by status (needs attention, partial, covered). Each row uses your category roles and goal targets."
                        )
                        section(
                            icon: "arrow.triangle.2.circlepath",
                            color: ClarityTheme.danger,
                            title: "Adjust",
                            body: "Expected income vs required expenses, income gap or surplus, funding gaps on goals (tap a gap to assign in YNAB), and salary target after your tax rate in Settings."
                        )
                        section(
                            icon: "hourglass",
                            color: ClarityTheme.muted,
                            title: "Age Money",
                            body: "YNAB age of money and guidance on building a buffer. Supporting context shows how paychecks stack against obligations over the month."
                        )

                        Divider().background(ClarityTheme.border)

                        VStack(alignment: .leading, spacing: 8) {
                            Text("Seeing $0 everywhere?")
                                .font(ClarityTheme.headlineFont)
                                .foregroundStyle(ClarityTheme.text)
                            Text("Make sure your YNAB categories have monthly goals set. This app reads goal targets to determine required amounts. If a category has no goal, it falls back to whatever you've assigned this month — which may be $0 early in the month.")
                                .font(ClarityTheme.supportingFont)
                                .foregroundStyle(ClarityTheme.muted)
                        }

                        VStack(alignment: .leading, spacing: 8) {
                            Text("How roles work")
                                .font(ClarityTheme.headlineFont)
                                .foregroundStyle(ClarityTheme.text)
                            roleRow(role: "Mortgage / Housing", description: "Counted toward required expenses. Shown on the mortgage card.")
                            roleRow(role: "Fixed Bill", description: "Counted toward required expenses. Things like electric, internet, insurance.")
                            roleRow(role: "Essential Variable", description: "Counted toward required expenses. Groceries, gas, healthcare.")
                            roleRow(role: "Flexible Spending", description: "Not required — this is your safe-to-spend pool. Dining, fun money, etc.")
                            roleRow(role: "Ignore", description: "Excluded from all calculations. Savings goals, investments, buffers.")
                        }
                    }
                    .padding(20)
                }
            }
            .navigationTitle("How It Works")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                        .foregroundStyle(ClarityTheme.accent)
                }
            }
        }
    }

    private func section(icon: String, color: Color, title: String, body: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Label(title, systemImage: icon)
                .font(ClarityTheme.headlineFont)
                .foregroundStyle(color)
            Text(body)
                .font(ClarityTheme.supportingFont)
                .foregroundStyle(ClarityTheme.muted)
        }
    }

    private func roleRow(role: String, description: String) -> some View {
        HStack(alignment: .top, spacing: 8) {
            Text("•")
                .foregroundStyle(ClarityTheme.accent)
            VStack(alignment: .leading, spacing: 2) {
                Text(role)
                    .font(ClarityTheme.bodyFont.weight(.semibold))
                    .foregroundStyle(ClarityTheme.text)
                Text(description)
                    .font(ClarityTheme.supportingFont)
                    .foregroundStyle(ClarityTheme.muted)
            }
        }
    }
}
