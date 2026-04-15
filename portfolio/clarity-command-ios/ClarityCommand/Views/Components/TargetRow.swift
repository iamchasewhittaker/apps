import SwiftUI
import ClarityUI

struct TargetRow: View {
    let icon: String
    let label: String
    let current: Int
    let target: Int
    let unit: String

    var body: some View {
        let fraction = target > 0 ? Double(min(current, target)) / Double(target) : 0

        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(icon)
                    .font(ClarityTypography.body)
                Text(label)
                    .font(ClarityTypography.headline)
                    .foregroundStyle(ClarityPalette.text)
                Spacer()
                Text("\(current)/\(target) \(unit)")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(current >= target ? ClarityPalette.safe : ClarityPalette.muted)
            }
            ClarityProgressBar(label: "", value: fraction)
        }
        .padding(12)
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(label): \(current) of \(target) \(unit)")
    }
}

struct ToggleTargetRow: View {
    let icon: String
    let label: String
    @Binding var isOn: Bool

    var body: some View {
        HStack {
            Text(icon)
                .font(ClarityTypography.body)
            Text(label)
                .font(ClarityTypography.headline)
                .foregroundStyle(ClarityPalette.text)
            Spacer()
            Toggle("", isOn: $isOn)
                .labelsHidden()
                .tint(CommandPalette.accent)
        }
        .frame(minHeight: ClarityMetrics.minTapTarget)
        .padding(.horizontal, 12)
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(label): \(isOn ? "done" : "not done")")
    }
}
