import SwiftUI
import ClarityUI

struct EveningReflectionView: View {
    @Environment(CommandStore.self) private var store

    var body: some View {
        @Bindable var s = store
        let log = store.todayLog ?? DailyLog(date: DateHelpers.todayString)

        VStack(alignment: .leading, spacing: 12) {
            ClaritySectionLabel( "Evening Reflection")

            // Evening prayer
            ToggleTargetRow(
                icon: "\u{1F64F}",
                label: "Evening Prayer",
                isOn: Binding(
                    get: { log.areas.prayer.evening },
                    set: { val in store.patchAreas { $0.prayer.evening = val } }
                )
            )

            // Wellness check-ins
            ToggleTargetRow(
                icon: "\u{2764}\u{FE0F}",
                label: "Morning Wellness",
                isOn: Binding(
                    get: { log.areas.wellness.morning },
                    set: { val in store.patchAreas { $0.wellness.morning = val } }
                )
            )
            ToggleTargetRow(
                icon: "\u{1F31B}",
                label: "Evening Wellness",
                isOn: Binding(
                    get: { log.areas.wellness.evening },
                    set: { val in store.patchAreas { $0.wellness.evening = val } }
                )
            )

            // Excuses audit
            VStack(alignment: .leading, spacing: 6) {
                Text("Excuses Audit")
                    .font(ClarityTypography.caption.bold())
                    .foregroundStyle(ClarityPalette.muted)
                TextEditor(text: Binding(
                    get: { log.excuses },
                    set: { val in store.upsertTodayLog { $0.excuses = val } }
                ))
                .font(ClarityTypography.body)
                .foregroundStyle(ClarityPalette.text)
                .scrollContentBackground(.hidden)
                .frame(minHeight: 80)
                .padding(8)
                .background(ClarityPalette.surface)
                .clipShape(RoundedRectangle(cornerRadius: 8))
            }

            // Accomplishments
            VStack(alignment: .leading, spacing: 6) {
                Text("What did you accomplish?")
                    .font(ClarityTypography.caption.bold())
                    .foregroundStyle(ClarityPalette.muted)
                TextEditor(text: Binding(
                    get: { log.notes },
                    set: { val in store.upsertTodayLog { $0.notes = val } }
                ))
                .font(ClarityTypography.body)
                .foregroundStyle(ClarityPalette.text)
                .scrollContentBackground(.hidden)
                .frame(minHeight: 80)
                .padding(8)
                .background(ClarityPalette.surface)
                .clipShape(RoundedRectangle(cornerRadius: 8))
            }

            // Top 3 tomorrow
            VStack(alignment: .leading, spacing: 6) {
                Text("Top 3 for Tomorrow")
                    .font(ClarityTypography.caption.bold())
                    .foregroundStyle(ClarityPalette.muted)
                ForEach(0..<3, id: \.self) { i in
                    TextField("\(i + 1).", text: Binding(
                        get: { log.top3Tomorrow.indices.contains(i) ? log.top3Tomorrow[i] : "" },
                        set: { val in
                            store.upsertTodayLog { l in
                                while l.top3Tomorrow.count <= i { l.top3Tomorrow.append("") }
                                l.top3Tomorrow[i] = val
                            }
                        }
                    ))
                    .font(ClarityTypography.body)
                    .foregroundStyle(ClarityPalette.text)
                    .padding(10)
                    .background(ClarityPalette.surface)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                }
            }

            // Final scorecard
            VStack(alignment: .leading, spacing: 8) {
                ClaritySectionLabel( "Final Scorecard")
                let status = store.dayStatus(store.todayLog)
                StatusBadge(status: status)

                scoreRow("Job Actions", met: log.jobActions.count >= store.blob.targets.jobActions)
                scoreRow("Productive Hours", met: log.areas.time >= store.blob.targets.productiveHours)
                scoreRow("Budget", met: log.areas.budget)
                scoreRow("Scripture", met: log.areas.scripture >= store.blob.targets.scriptureMinutes)
                scoreRow("Prayer", met: log.areas.prayer.morning && log.areas.prayer.evening)
                scoreRow("Wellness", met: log.areas.wellness.activity)
            }
            .padding(12)
            .background(ClarityPalette.surface)
            .clipShape(RoundedRectangle(cornerRadius: 10))
        }
    }

    private func scoreRow(_ label: String, met: Bool) -> some View {
        HStack {
            Image(systemName: met ? "checkmark.circle.fill" : "xmark.circle")
                .foregroundStyle(met ? ClarityPalette.safe : ClarityPalette.danger)
            Text(label)
                .font(ClarityTypography.body)
                .foregroundStyle(ClarityPalette.text)
            Spacer()
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(label): \(met ? "met" : "missed")")
    }
}
