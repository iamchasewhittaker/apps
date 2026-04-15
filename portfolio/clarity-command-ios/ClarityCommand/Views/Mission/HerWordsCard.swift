import SwiftUI
import ClarityUI

struct HerWordsCard: View {
    let reminder: Reminder

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text("HER WORDS")
                    .font(ClarityTypography.caption.bold())
                    .foregroundStyle(CommandPalette.purple)
                    .tracking(1)
                Spacer()
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(CommandPalette.purpleLight)

            Text("\u{201C}\(reminder.text)\u{201D}")
                .font(ClarityTypography.body)
                .italic()
                .foregroundStyle(ClarityPalette.text)
                .lineSpacing(4)
                .padding(14)
        }
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(ClarityPalette.border, lineWidth: 1)
        )
        .accessibilityElement(children: .combine)
        .accessibilityLabel("Her words: \(reminder.text)")
    }
}
