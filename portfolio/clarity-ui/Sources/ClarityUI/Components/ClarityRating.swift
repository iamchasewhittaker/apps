import SwiftUI

/// 1–10 numeric rating picker.
/// SwiftUI equivalent of the web Rating component.
/// VoiceOver: announces current value and range.
public struct ClarityRating: View {
    public let label: String
    @Binding public var value: Int
    public let range: ClosedRange<Int>

    @ScaledMetric(relativeTo: .body) private var buttonSize: CGFloat = 36

    public init(
        label: String,
        value: Binding<Int>,
        range: ClosedRange<Int> = 1...10
    ) {
        self.label = label
        self._value = value
        self.range = range
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(ClarityTypography.caption)
                .foregroundStyle(ClarityPalette.muted)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 6) {
                    ForEach(range, id: \.self) { n in
                        Button {
                            value = n
                        } label: {
                            Text("\(n)")
                                .font(ClarityTypography.support)
                                .foregroundStyle(value == n ? ClarityPalette.bg : ClarityPalette.text)
                                .frame(width: buttonSize, height: buttonSize)
                                .background(value == n ? ClarityPalette.accent : ClarityPalette.surface)
                                .clipShape(Circle())
                                .overlay(Circle().stroke(
                                    value == n ? ClarityPalette.accent : ClarityPalette.border,
                                    lineWidth: ClarityMetrics.borderWidth
                                ))
                        }
                        .buttonStyle(.plain)
                        .accessibilityLabel("\(n)")
                        .accessibilityAddTraits(value == n ? [.isSelected] : [])
                    }
                }
                .padding(.vertical, 2)
            }
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel("\(label), \(value) out of \(range.upperBound)")
        .accessibilityValue("\(value)")
        .accessibilityAdjustableAction { direction in
            switch direction {
            case .increment: if value < range.upperBound { value += 1 }
            case .decrement: if value > range.lowerBound { value -= 1 }
            @unknown default: break
            }
        }
    }
}
