import SwiftUI

/// Themed progress bar with color-coded fill (safe/caution/danger).
/// VoiceOver: announces label, value, and percentage.
public struct ClarityProgressBar: View {
    public let label: String
    public let value: Double   // 0...1 (will be clamped)
    public let height: CGFloat

    public init(label: String, value: Double, height: CGFloat = 8) {
        self.label = label
        self.value = value
        self.height = height
    }

    private var clamped: Double { ClarityPalette.clampedFraction(value) }
    private var fillColor: Color { ClarityPalette.progressColor(fraction: clamped) }
    private var pctText: String { "\(Int(clamped * 100))%" }

    public var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            if !label.isEmpty {
                HStack {
                    Text(label)
                        .font(ClarityTypography.caption)
                        .foregroundStyle(ClarityPalette.muted)
                    Spacer()
                    Text(pctText)
                        .font(ClarityTypography.caption)
                        .foregroundStyle(fillColor)
                }
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    Capsule()
                        .fill(ClarityPalette.surface)
                        .frame(height: height)
                    Capsule()
                        .fill(fillColor)
                        .frame(width: geo.size.width * clamped, height: height)
                }
            }
            .frame(height: height)
        }
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(label.isEmpty ? "Progress" : label)
        .accessibilityValue(pctText)
    }
}
