import SwiftUI
import ClarityUI

struct ScriptureCard: View {
    let scripture: Scripture
    @State private var expanded = false

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header
            HStack {
                Text("TODAY\u{2019}S IDENTITY TRUTH")
                    .font(ClarityTypography.caption.bold())
                    .foregroundStyle(CommandPalette.accent)
                    .tracking(1)
                Spacer()
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(CommandPalette.accentLight)

            // Body
            VStack(alignment: .leading, spacing: 8) {
                Text("\u{201C}\(scripture.text)\u{201D}")
                    .font(ClarityTypography.body)
                    .italic()
                    .foregroundStyle(ClarityPalette.text)
                    .lineSpacing(4)

                Text(scripture.ref)
                    .font(ClarityTypography.caption.bold())
                    .foregroundStyle(CommandPalette.accent)

                if expanded {
                    Text(scripture.convictionMsg)
                        .font(ClarityTypography.caption)
                        .foregroundStyle(ClarityPalette.muted)
                        .lineSpacing(3)
                        .padding(10)
                        .background(ClarityPalette.surface)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }

                Button(expanded ? "Less" : "Apply this \u{2192}") {
                    withAnimation(.easeInOut(duration: 0.2)) { expanded.toggle() }
                }
                .font(ClarityTypography.caption)
                .foregroundStyle(ClarityPalette.muted)
                .frame(minHeight: ClarityMetrics.minTapTarget)
            }
            .padding(14)
        }
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(ClarityPalette.border, lineWidth: 1)
        )
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Today\u{2019}s scripture: \(scripture.ref)")
    }
}
