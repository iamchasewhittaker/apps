import SwiftUI
import ClarityUI

struct CounterBanner: View {
    let daysSinceLayoff: Int?
    let streak: Int

    var body: some View {
        HStack(spacing: 12) {
            counterCard(
                label: "Days Since Layoff",
                value: daysSinceLayoff.map { "\($0)" } ?? "\u{2014}",
                color: ClarityPalette.danger
            )
            counterCard(
                label: "Day Streak",
                value: "\(streak)",
                color: streak > 0 ? ClarityPalette.safe : ClarityPalette.muted
            )
        }
    }

    private func counterCard(label: String, value: String, color: Color) -> some View {
        VStack(spacing: 4) {
            Text(value)
                .font(ClarityTypography.title)
                .foregroundStyle(color)
            Text(label)
                .font(ClarityTypography.caption)
                .foregroundStyle(ClarityPalette.muted)
        }
        .frame(maxWidth: .infinity)
        .padding(12)
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(label): \(value)")
    }
}
