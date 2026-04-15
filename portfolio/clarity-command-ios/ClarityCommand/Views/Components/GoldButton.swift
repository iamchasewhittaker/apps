import SwiftUI
import ClarityUI

struct GoldButton: View {
    let title: String
    let action: () -> Void
    var disabled: Bool = false

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(ClarityTypography.headline)
                .foregroundStyle(ClarityPalette.bg)
                .frame(maxWidth: .infinity)
                .frame(minHeight: ClarityMetrics.minTapTarget)
                .background(disabled ? CommandPalette.accent.opacity(0.4) : CommandPalette.accent)
                .clipShape(RoundedRectangle(cornerRadius: 10))
        }
        .disabled(disabled)
        .accessibilityLabel(title)
    }
}
