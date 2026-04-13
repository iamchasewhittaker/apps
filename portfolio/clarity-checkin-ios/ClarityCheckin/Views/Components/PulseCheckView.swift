import SwiftUI
import ClarityUI

struct PulseCheckView: View {
    @Environment(CheckinStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var mood: Int = 5
    @State private var note: String = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: ClarityMetrics.cardSpacing) {
                    VStack(spacing: ClarityMetrics.cardSpacing) {
                        ClarityRating(label: "How are you feeling right now?", value: $mood)

                        VStack(alignment: .leading, spacing: 8) {
                            Text("Note (optional)")
                                .font(ClarityTypography.caption)
                                .foregroundStyle(ClarityPalette.muted)
                            TextField("What's on your mind?", text: $note, axis: .vertical)
                                .font(ClarityTypography.body)
                                .foregroundStyle(ClarityPalette.text)
                                .lineLimit(2...5)
                        }
                    }
                    .clarityCard()

                    // Recent pulses
                    if !store.blob.pulseChecks.isEmpty {
                        ClaritySectionLabel("Recent")
                        ForEach(store.blob.pulseChecks.prefix(5)) { pulse in
                            HStack {
                                Text(DateHelpers.displayShort(from: pulse.date))
                                    .font(ClarityTypography.caption)
                                    .foregroundStyle(ClarityPalette.muted)
                                    .frame(width: 50, alignment: .leading)
                                Text("\(pulse.mood)/10")
                                    .font(ClarityTypography.support)
                                    .foregroundStyle(moodColor(pulse.mood))
                                if !pulse.note.isEmpty {
                                    Text(pulse.note)
                                        .font(ClarityTypography.caption)
                                        .foregroundStyle(ClarityPalette.muted)
                                        .lineLimit(1)
                                }
                                Spacer()
                            }
                            .clarityCard()
                            .accessibilityElement(children: .combine)
                        }
                    }
                }
                .padding(ClarityMetrics.pagePadding)
            }
            .background(ClarityPalette.bg.ignoresSafeArea())
            .navigationTitle("Pulse Check")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(ClarityPalette.muted)
                        .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Log") {
                        store.logPulse(mood: mood, note: note)
                        dismiss()
                    }
                    .font(ClarityTypography.headline)
                    .foregroundStyle(ClarityPalette.accent)
                    .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                }
            }
        }
        .preferredColorScheme(.dark)
    }

    private func moodColor(_ mood: Int) -> Color {
        if mood >= 7 { return ClarityPalette.safe }
        if mood >= 4 { return ClarityPalette.caution }
        return ClarityPalette.danger
    }
}
