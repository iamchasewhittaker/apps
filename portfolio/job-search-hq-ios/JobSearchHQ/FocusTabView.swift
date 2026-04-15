import SwiftUI
import ClarityUI

struct FocusTabView: View {
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: ClarityMetrics.cardSpacing) {
                    Text("Daily blocks")
                        .font(ClarityTypography.title)
                        .foregroundStyle(JSHQTheme.textPrimary)

                    Text("Use these as a checklist. AI tools stay on the web app for now.")
                        .font(ClarityTypography.body)
                        .foregroundStyle(JSHQTheme.textMuted)

                    ForEach(DailyFocusBlocks.all) { block in
                        focusCard(block)
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(ClarityMetrics.pagePadding)
            }
            .background(JSHQTheme.background.ignoresSafeArea())
            .navigationTitle("Focus")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    @ViewBuilder
    private func focusCard(_ block: DailyFocusBlock) -> some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack(alignment: .firstTextBaseline) {
                Text(block.emoji)
                    .font(.title2)
                Text(block.title)
                    .font(ClarityTypography.headline)
                    .foregroundStyle(JSHQTheme.textPrimary)
                Spacer()
                Text(block.time)
                    .font(ClarityTypography.caption)
                    .foregroundStyle(JSHQTheme.textMuted)
            }

            Text(block.tag.uppercased())
                .font(ClarityTypography.caption)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(JSHQTheme.color(hex: block.tagColorHex).opacity(0.25))
                .foregroundStyle(JSHQTheme.color(hex: block.tagColorHex))
                .clipShape(RoundedRectangle(cornerRadius: 6))

            VStack(alignment: .leading, spacing: 8) {
                ForEach(Array(block.steps.enumerated()), id: \.offset) { i, step in
                    HStack(alignment: .top, spacing: 8) {
                        Text("\(i + 1).")
                            .font(ClarityTypography.body)
                            .foregroundStyle(JSHQTheme.textMuted)
                            .frame(minWidth: 24, alignment: .trailing)
                        Text(step)
                            .font(ClarityTypography.body)
                            .foregroundStyle(JSHQTheme.textPrimary)
                    }
                }
            }

            Text(block.adhd)
                .font(ClarityTypography.caption)
                .foregroundStyle(JSHQTheme.accentAmber)
                .padding(12)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(JSHQTheme.surface)
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .overlay(
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(JSHQTheme.border, lineWidth: 1)
                )
        }
        .padding(16)
        .background(JSHQTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(JSHQTheme.border, lineWidth: 1)
        )
    }
}
