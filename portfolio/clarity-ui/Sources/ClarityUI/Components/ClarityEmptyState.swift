import SwiftUI

/// Standard empty-state card shown when a list has no data.
/// Every list view in the Clarity family must display this when empty.
public struct ClarityEmptyState: View {
    public let icon: String      // SF Symbol name
    public let title: String
    public let message: String
    public let actionLabel: String?
    public let action: (() -> Void)?

    public init(
        icon: String = "tray",
        title: String,
        message: String,
        actionLabel: String? = nil,
        action: (() -> Void)? = nil
    ) {
        self.icon = icon
        self.title = title
        self.message = message
        self.actionLabel = actionLabel
        self.action = action
    }

    public var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 36))
                .foregroundStyle(ClarityPalette.muted)
                .accessibilityHidden(true)

            Text(title)
                .font(ClarityTypography.headline)
                .foregroundStyle(ClarityPalette.text)

            Text(message)
                .font(ClarityTypography.support)
                .foregroundStyle(ClarityPalette.muted)
                .multilineTextAlignment(.center)

            if let actionLabel, let action {
                Button(action: action) {
                    Text(actionLabel)
                        .font(ClarityTypography.support)
                        .foregroundStyle(ClarityPalette.accent)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .frame(minWidth: ClarityMetrics.minTapTarget,
                               minHeight: ClarityMetrics.minTapTarget)
                        .background(ClarityPalette.surface)
                        .clipShape(RoundedRectangle(cornerRadius: 10))
                        .overlay(RoundedRectangle(cornerRadius: 10)
                            .stroke(ClarityPalette.accent, lineWidth: ClarityMetrics.borderWidth))
                }
                .buttonStyle(.plain)
            }
        }
        .padding(ClarityMetrics.cardPadding * 1.5)
        .frame(maxWidth: .infinity)
        .clarityCard()
        .accessibilityElement(children: .combine)
    }
}
