import SwiftUI

/// Uppercase section heading with optional divider line above.
/// Port of the web SectionLabel component.
public struct ClaritySectionLabel: View {
    public let text: String
    public let showDivider: Bool

    public init(_ text: String, showDivider: Bool = true) {
        self.text = text
        self.showDivider = showDivider
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            if showDivider {
                Divider()
                    .background(ClarityPalette.border)
            }
            Text(text.uppercased())
                .font(ClarityTypography.caption)
                .foregroundStyle(ClarityPalette.muted)
                .kerning(0.8)
        }
        .accessibilityAddTraits(.isHeader)
    }
}
