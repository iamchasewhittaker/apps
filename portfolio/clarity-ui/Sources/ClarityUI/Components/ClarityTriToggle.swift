import SwiftUI

/// Three-way toggle: Yes / Mild / No (or any 3 custom labels).
/// Port of the web TriToggle component. Used in check-in health/lifestyle section.
public struct ClarityTriToggle: View {
    public let label: String
    @Binding public var value: String?
    public let options: [String]

    @ScaledMetric(relativeTo: .caption) private var minHeight: CGFloat = ClarityMetrics.minTapTarget

    public init(
        label: String,
        value: Binding<String?>,
        options: [String] = ["Yes", "Mild", "No"]
    ) {
        self.label = label
        self._value = value
        self.options = options
    }

    public var body: some View {
        HStack {
            Text(label)
                .font(ClarityTypography.support)
                .foregroundStyle(ClarityPalette.text)
            Spacer()
            HStack(spacing: 0) {
                ForEach(options.indices, id: \.self) { i in
                    let opt = options[i]
                    let isSelected = value == opt
                    Button {
                        value = isSelected ? nil : opt
                    } label: {
                        Text(opt)
                            .font(ClarityTypography.caption)
                            .foregroundStyle(isSelected ? ClarityPalette.bg : ClarityPalette.muted)
                            .padding(.horizontal, 10)
                            .frame(minHeight: minHeight)
                            .background(isSelected ? ClarityPalette.accent : ClarityPalette.surface)
                    }
                    .buttonStyle(.plain)
                    .accessibilityAddTraits(isSelected ? [.isSelected] : [])
                    if i < options.count - 1 {
                        Divider().frame(maxHeight: 24)
                    }
                }
            }
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .overlay(RoundedRectangle(cornerRadius: 8).stroke(ClarityPalette.border, lineWidth: ClarityMetrics.borderWidth))
        }
        .accessibilityElement(children: .contain)
        .accessibilityLabel(label)
        .accessibilityValue(value ?? "not set")
    }
}
