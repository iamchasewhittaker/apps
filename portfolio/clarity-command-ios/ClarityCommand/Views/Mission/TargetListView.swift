import SwiftUI
import ClarityUI

struct TargetListView: View {
    @Environment(CommandStore.self) private var store

    var body: some View {
        @Bindable var s = store
        let log = store.todayLog ?? DailyLog(date: DateHelpers.todayString)
        let t = store.blob.targets

        VStack(spacing: 8) {
            ClaritySectionLabel( "Daily Targets")

            TargetRow(
                icon: "\u{1F3AF}",
                label: "Job Actions",
                current: log.jobActions.count,
                target: t.jobActions,
                unit: "actions"
            )

            // Productive hours stepper
            HStack {
                Text("\u{1F4BC}")
                    .font(ClarityTypography.body)
                Text("Productive Hours")
                    .font(ClarityTypography.headline)
                    .foregroundStyle(ClarityPalette.text)
                Spacer()
                Text("\(log.areas.time)/\(t.productiveHours) hrs")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(log.areas.time >= t.productiveHours ? ClarityPalette.safe : ClarityPalette.muted)
                Stepper("", value: Binding(
                    get: { log.areas.time },
                    set: { val in store.patchAreas { $0.time = max(0, val) } }
                ))
                .labelsHidden()
                .frame(width: 94)
            }
            .frame(minHeight: ClarityMetrics.minTapTarget)
            .padding(.horizontal, 12)
            .background(ClarityPalette.surface)
            .clipShape(RoundedRectangle(cornerRadius: 10))

            // Budget check-in toggle
            ToggleTargetRow(
                icon: "\u{1F4B0}",
                label: "Budget Check-in",
                isOn: Binding(
                    get: { log.areas.budget },
                    set: { val in store.patchAreas { $0.budget = val } }
                )
            )

            // Scripture minutes stepper
            HStack {
                Text("\u{1F4D6}")
                    .font(ClarityTypography.body)
                Text("Scripture Study")
                    .font(ClarityTypography.headline)
                    .foregroundStyle(ClarityPalette.text)
                Spacer()
                Text("\(log.areas.scripture)/\(t.scriptureMinutes) min")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(log.areas.scripture >= t.scriptureMinutes ? ClarityPalette.safe : ClarityPalette.muted)
                Stepper("", value: Binding(
                    get: { log.areas.scripture },
                    set: { val in store.patchAreas { $0.scripture = max(0, val) } }
                ), step: 5)
                .labelsHidden()
                .frame(width: 94)
            }
            .frame(minHeight: ClarityMetrics.minTapTarget)
            .padding(.horizontal, 12)
            .background(ClarityPalette.surface)
            .clipShape(RoundedRectangle(cornerRadius: 10))

            // Prayer toggles
            ToggleTargetRow(
                icon: "\u{1F64F}",
                label: "Morning Prayer",
                isOn: Binding(
                    get: { log.areas.prayer.morning },
                    set: { val in store.patchAreas { $0.prayer.morning = val } }
                )
            )

            // Physical activity toggle
            ToggleTargetRow(
                icon: "\u{1F4AA}",
                label: "Physical Activity",
                isOn: Binding(
                    get: { log.areas.wellness.activity },
                    set: { val in store.patchAreas { $0.wellness.activity = val } }
                )
            )
        }
    }
}
