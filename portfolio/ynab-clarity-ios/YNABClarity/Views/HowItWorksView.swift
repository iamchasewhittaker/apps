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
                            icon: "checkmark.seal.fill",
                            color: ClarityTheme.safe,
                            title: "Are my bills covered?",
                            body: "The Overview tab shows your mortgage and bills coverage at a glance. Each category is checked against its YNAB goal target — if you've assigned enough to meet the goal, it's marked Covered. The Bills tab groups everything by status so you can focus on what still needs funding."
                        )
                        section(
                            icon: "dollarsign.circle.fill",
                            color: ClarityTheme.caution,
                            title: "How much can I safely spend?",
                            body: "Safe to Spend takes your flexible category balances (dining, fun money, etc.) and subtracts any shortfall from required bills. The result is what's truly available — split into daily, weekly, and monthly views so you can pace your spending."
                        )
                        section(
                            icon: "arrow.up.arrow.down.circle.fill",
                            color: ClarityTheme.danger,
                            title: "Do I earn enough?",
                            body: "The Income tab compares your expected paychecks against total required expenses. If there's a gap, it tells you how much short you are. The Salary Target shows the gross annual income you'd need to cover all obligations after taxes."
                        )
                        section(
                            icon: "arrow.left.arrow.right.circle.fill",
                            color: ClarityTheme.accent,
                            title: "When does money arrive vs. leave?",
                            body: "Cash Flow builds a chronological timeline of paychecks and bill due dates. A \"Today\" marker shows where you are in the month. The mortgage-covered marker tells you which paycheck fully funds your housing. Set due days in category setup for accurate timing."
                        )

                        Divider().background(ClarityTheme.border)

                        VStack(alignment: .leading, spacing: 8) {
                            Text("Seeing $0 everywhere?")
                                .font(ClarityTheme.headlineFont)
                                .foregroundStyle(ClarityTheme.text)
                            Text("Make sure your YNAB categories have monthly goals set. This app reads goal targets to determine required amounts. If a category has no goal, it falls back to whatever you've assigned this month — which may be $0 early in the month.")
                                .font(ClarityTheme.bodyFont)
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
        .preferredColorScheme(.dark)
    }

    private func section(icon: String, color: Color, title: String, body: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Label(title, systemImage: icon)
                .font(ClarityTheme.headlineFont)
                .foregroundStyle(color)
            Text(body)
                .font(ClarityTheme.bodyFont)
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
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.muted)
            }
        }
    }
}
