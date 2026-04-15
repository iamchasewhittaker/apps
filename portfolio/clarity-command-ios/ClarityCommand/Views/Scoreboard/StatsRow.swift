import SwiftUI
import ClarityUI

struct StatsRow: View {
    @Environment(CommandStore.self) private var store

    var body: some View {
        let logCount = store.blob.dailyLogs.count
        let perfectPct = logCount > 0 ? Int(Double(store.perfectDayCount) / Double(logCount) * 100) : 0

        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
            statCard(
                label: "Days Since Layoff",
                value: store.daysSinceLayoff.map { "\($0)" } ?? "\u{2014}",
                color: ClarityPalette.danger
            )
            statCard(
                label: "Current Streak",
                value: "\(store.overallStreak())",
                color: store.overallStreak() > 0 ? ClarityPalette.safe : ClarityPalette.muted
            )
            statCard(
                label: "Perfect Days",
                value: "\(store.perfectDayCount) (\(perfectPct)%)",
                color: CommandPalette.accent
            )
            statCard(
                label: "Total Job Actions",
                value: "\(store.totalJobActions)",
                color: ClarityPalette.accent
            )
        }
    }

    private func statCard(label: String, value: String, color: Color) -> some View {
        VStack(spacing: 4) {
            Text(value)
                .font(ClarityTypography.title)
                .foregroundStyle(color)
            Text(label)
                .font(ClarityTypography.caption)
                .foregroundStyle(ClarityPalette.muted)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding(12)
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(label): \(value)")
    }
}
