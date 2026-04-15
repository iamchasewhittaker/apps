import SwiftUI
import ClarityUI

struct StatusBadge: View {
    let status: DayStatus

    private var color: Color {
        switch status {
        case .met: ClarityPalette.safe
        case .partial: ClarityPalette.caution
        case .missed: ClarityPalette.danger
        }
    }

    private var label: String {
        switch status {
        case .met: "Met"
        case .partial: "Partial"
        case .missed: "Missed"
        }
    }

    var body: some View {
        Text(label)
            .font(ClarityTypography.caption)
            .foregroundStyle(color)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.15))
            .clipShape(Capsule())
            .accessibilityLabel("Status: \(label)")
    }
}
