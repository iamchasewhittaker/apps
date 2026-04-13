import SwiftUI
import ClarityUI

struct CapacityBadge: View {
    let slotsUsed: Int
    let slotsAvailable: Int

    var body: some View {
        HStack(spacing: 8) {
            Label("\(slotsUsed) used", systemImage: "bolt.fill")
                .font(ClarityTypography.caption)
                .foregroundStyle(ClarityPalette.text)
            Spacer()
            Label("\(slotsAvailable) left", systemImage: "battery.75")
                .font(ClarityTypography.caption)
                .foregroundStyle(slotsAvailable > 0 ? ClarityPalette.safe : ClarityPalette.caution)
        }
        .padding(.vertical, 6)
        .padding(.horizontal, 10)
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(
            RoundedRectangle(cornerRadius: 8)
                .stroke(ClarityPalette.border, lineWidth: ClarityMetrics.borderWidth)
        )
        .accessibilityLabel("Capacity: \(slotsUsed) used, \(slotsAvailable) remaining")
    }
}
