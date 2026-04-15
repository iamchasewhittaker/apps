import SwiftUI
import ClarityUI

@MainActor
struct AreaStreaksView: View {
    @Environment(CommandStore.self) private var store

    private struct AreaInfo: Identifiable {
        let id: String
        let icon: String
        let label: String
        let streak: Int
    }

    private var areas: [AreaInfo] {
        let t = store.blob.targets
        return [
            AreaInfo(id: "jobs", icon: "\u{1F3AF}", label: "Job Search", streak: store.areaStreak { $0.jobActions.count >= t.jobActions }),
            AreaInfo(id: "time", icon: "\u{1F4BC}", label: "Productive Hours", streak: store.areaStreak { $0.areas.time >= t.productiveHours }),
            AreaInfo(id: "budget", icon: "\u{1F4B0}", label: "Budget", streak: store.areaStreak { $0.areas.budget }),
            AreaInfo(id: "scripture", icon: "\u{1F4D6}", label: "Scripture", streak: store.areaStreak { $0.areas.scripture >= t.scriptureMinutes }),
            AreaInfo(id: "prayer", icon: "\u{1F64F}", label: "Prayer", streak: store.areaStreak { $0.areas.prayer.morning && $0.areas.prayer.evening }),
            AreaInfo(id: "activity", icon: "\u{1F4AA}", label: "Activity", streak: store.areaStreak { $0.areas.wellness.activity }),
        ]
    }

    var body: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 8) {
            ForEach(areas) { area in
                HStack(spacing: 8) {
                    Text(area.icon)
                        .font(ClarityTypography.body)
                    VStack(alignment: .leading, spacing: 2) {
                        Text(area.label)
                            .font(ClarityTypography.caption.bold())
                            .foregroundStyle(ClarityPalette.text)
                        Text("\(area.streak) day\(area.streak == 1 ? "" : "s")")
                            .font(ClarityTypography.caption)
                            .foregroundStyle(area.streak > 0 ? ClarityPalette.safe : ClarityPalette.muted)
                    }
                    Spacer()
                }
                .padding(10)
                .background(ClarityPalette.surface)
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .accessibilityElement(children: .combine)
                .accessibilityLabel("\(area.label) streak: \(area.streak) days")
            }
        }
    }
}
