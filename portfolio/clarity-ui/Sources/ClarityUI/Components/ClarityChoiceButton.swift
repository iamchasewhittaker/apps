import SwiftUI

/// A selectable chip/button used for picking from a set of options.
/// SwiftUI equivalent of the web's ChoiceButton component.
/// Minimum 44×44pt tap target built in (low-vision requirement).
public struct ClarityChoiceButton: View {
    public let label: String
    public let isSelected: Bool
    public let action: () -> Void

    @ScaledMetric(relativeTo: .body) private var minHeight: CGFloat = ClarityMetrics.minTapTarget

    public init(
        _ label: String,
        isSelected: Bool,
        action: @escaping () -> Void
    ) {
        self.label = label
        self.isSelected = isSelected
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            Text(label)
                .font(ClarityTypography.support)
                .foregroundStyle(isSelected ? ClarityPalette.bg : ClarityPalette.text)
                .padding(.horizontal, 14)
                .frame(minHeight: minHeight)
                .background(isSelected ? ClarityPalette.accent : ClarityPalette.surface)
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(
                            isSelected ? ClarityPalette.accent : ClarityPalette.border,
                            lineWidth: ClarityMetrics.borderWidth
                        )
                )
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(isSelected ? [.isSelected] : [])
        .accessibilityHint(isSelected ? "Selected" : "Tap to select")
    }
}
