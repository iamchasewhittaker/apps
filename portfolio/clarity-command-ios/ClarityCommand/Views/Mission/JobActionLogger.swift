import SwiftUI
import ClarityUI

struct JobActionLogger: View {
    @Environment(CommandStore.self) private var store

    var body: some View {
        @Bindable var s = store
        let log = store.todayLog ?? DailyLog(date: DateHelpers.todayString)

        VStack(alignment: .leading, spacing: 8) {
            HStack {
                ClaritySectionLabel( "Job Actions")
                Spacer()
                Text("\(log.jobActions.count)")
                    .font(ClarityTypography.caption.bold())
                    .foregroundStyle(ClarityPalette.bg)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(CommandPalette.accent)
                    .clipShape(Capsule())
            }

            // Add form
            VStack(spacing: 8) {
                Picker("Type", selection: $s.newJobType) {
                    ForEach(CommandConfig.jobActionTypes, id: \.self) { type in
                        Text(type).tag(type)
                    }
                }
                .pickerStyle(.menu)
                .tint(CommandPalette.accent)

                HStack(spacing: 8) {
                    TextField("Note (optional)", text: $s.newJobNote)
                        .font(ClarityTypography.body)
                        .foregroundStyle(ClarityPalette.text)
                        .padding(10)
                        .background(ClarityPalette.surface)
                        .clipShape(RoundedRectangle(cornerRadius: 8))

                    Button {
                        store.addJobAction(type: store.newJobType, note: store.newJobNote)
                        store.newJobNote = ""
                    } label: {
                        Text("Add")
                            .font(ClarityTypography.caption.bold())
                            .foregroundStyle(ClarityPalette.bg)
                            .padding(.horizontal, 16)
                            .frame(minHeight: ClarityMetrics.minTapTarget)
                            .background(CommandPalette.accent)
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                    }
                    .accessibilityLabel("Add job action")
                }
            }
            .padding(12)
            .background(ClarityPalette.surface)
            .clipShape(RoundedRectangle(cornerRadius: 10))

            // Logged actions
            ForEach(log.jobActions) { action in
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(action.type)
                            .font(ClarityTypography.caption.bold())
                            .foregroundStyle(ClarityPalette.text)
                        if !action.note.isEmpty {
                            Text(action.note)
                                .font(ClarityTypography.caption)
                                .foregroundStyle(ClarityPalette.muted)
                        }
                    }
                    Spacer()
                    if !action.time.isEmpty {
                        Text(action.time)
                            .font(ClarityTypography.caption)
                            .foregroundStyle(ClarityPalette.muted)
                    }
                    Button {
                        store.removeJobAction(id: action.id)
                    } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(ClarityPalette.muted)
                    }
                    .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                    .accessibilityLabel("Remove \(action.type) action")
                }
                .padding(10)
                .background(ClarityPalette.surface)
                .clipShape(RoundedRectangle(cornerRadius: 8))
            }
        }
    }
}
