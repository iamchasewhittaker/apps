import SwiftUI

struct FinancesView: View {
    var tasks: [ChecklistTaskItem]
    var ledger: [ProfitLedgerEntry]
    var readableFonts: Bool

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 14) {
                    financeBlock("Today’s profit", "$\(ParkFinance.profitToday(entries: ledger))")
                    financeBlock("Weekly profit", "$\(ParkFinance.profitThisWeek(entries: ledger))")

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Top earning attractions")
                            .font(ParkTheme.titleFont(readable: readableFonts))
                            .foregroundStyle(ParkTheme.ink)
                        let top = ParkFinance.topEarners(entries: ledger, tasks: tasks, limit: 8)
                        if top.isEmpty {
                            Text("Close attractions to see earnings here.")
                                .font(ParkTheme.bodyFont(readable: readableFonts))
                                .foregroundStyle(ParkTheme.ink.opacity(0.75))
                        } else {
                            ForEach(Array(top.enumerated()), id: \.offset) { _, row in
                                HStack {
                                    Text(row.title)
                                        .font(ParkTheme.bodyFont(readable: readableFonts))
                                        .foregroundStyle(ParkTheme.ink)
                                    Spacer()
                                    Text("$\(row.amount)")
                                        .font(ParkTheme.bodyFont(readable: readableFonts).weight(.bold))
                                        .foregroundStyle(ParkTheme.gold)
                                        .monospacedDigit()
                                }
                            }
                        }
                    }
                    .parkPanel(readable: readableFonts)

                }
                .padding(14)
            }
            .background(ParkTheme.parkBackground.ignoresSafeArea())
            .navigationTitle("Finances")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(ParkTheme.woodLight.opacity(0.95), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.light, for: .navigationBar)
        }
    }

    private func financeBlock(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(ParkTheme.titleFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
            Text(value)
                .font(ParkTheme.displayFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.gold)
                .monospacedDigit()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .parkPanel(readable: readableFonts)
    }
}
