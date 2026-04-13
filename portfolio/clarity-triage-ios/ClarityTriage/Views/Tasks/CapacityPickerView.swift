import SwiftUI
import ClarityUI

@MainActor
struct CapacityPickerView: View {
    @Environment(TriageStore.self) private var store

    private let levels: [(Int, String, Int)] = [
        (1, "Survival Mode", 1),
        (2, "Limited", 2),
        (3, "Average", 3),
        (4, "Strong", 5)
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Today's Capacity")
                .font(ClarityTypography.title)
                .foregroundStyle(ClarityPalette.text)

            Text("Pick your energy level. Capacity resets daily.")
                .font(ClarityTypography.caption)
                .foregroundStyle(ClarityPalette.muted)

            ForEach(levels, id: \.0) { level in
                Button {
                    store.setCapacity(level.0)
                } label: {
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(level.1)
                                .font(ClarityTypography.headline)
                            Text("\(level.2) slots")
                                .font(ClarityTypography.caption)
                                .foregroundStyle(ClarityPalette.muted)
                        }
                        Spacer()
                        if store.capacity == level.0 {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundStyle(ClarityPalette.safe)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .frame(minHeight: ClarityMetrics.minTapTarget)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 8)
                    .background(ClarityPalette.surface)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                    .overlay(
                        RoundedRectangle(cornerRadius: 10)
                            .stroke(
                                store.capacity == level.0 ? ClarityPalette.accent : ClarityPalette.border,
                                lineWidth: ClarityMetrics.borderWidth
                            )
                    )
                }
                .buttonStyle(.plain)
            }
        }
        .clarityCard()
    }
}
