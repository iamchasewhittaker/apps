import SwiftUI
import ClarityUI

@MainActor
struct SettingsTabView: View {
    @Environment(CommandStore.self) private var store
    @ObservedObject var commandSync: CommandCloudSync
    @State private var newReminderText = ""
    @State private var newScriptureRef = ""
    @State private var newScriptureText = ""
    @State private var layoffDate = Date()
    @State private var didLoadDate = false

    var body: some View {
        @Bindable var s = store

        ScrollView {
            VStack(spacing: 20) {
                CommandSyncSection(sync: commandSync)

                // Layoff Date
                VStack(alignment: .leading, spacing: 8) {
                    ClaritySectionLabel( "Layoff Date")
                    DatePicker(
                        "Layoff Date",
                        selection: $layoffDate,
                        displayedComponents: .date
                    )
                    .datePickerStyle(.compact)
                    .labelsHidden()
                    .tint(CommandPalette.accent)
                    .onChange(of: layoffDate) { _, newVal in
                        let fmt = DateFormatter()
                        fmt.dateFormat = "yyyy-MM-dd"
                        store.setLayoffDate(fmt.string(from: newVal))
                    }
                    .onAppear {
                        if !didLoadDate, !store.blob.layoffDate.isEmpty {
                            let fmt = DateFormatter()
                            fmt.dateFormat = "yyyy-MM-dd"
                            if let d = fmt.date(from: store.blob.layoffDate) {
                                layoffDate = d
                            }
                            didLoadDate = true
                        }
                    }

                    if let days = store.daysSinceLayoff {
                        Text("\(days) days since layoff")
                            .font(ClarityTypography.caption)
                            .foregroundStyle(ClarityPalette.danger)
                    }
                }
                .padding(12)
                .background(ClarityPalette.surface)
                .clipShape(RoundedRectangle(cornerRadius: 10))

                // Targets
                targetsSection

                // Reminders
                remindersSection

                // Scriptures
                scripturesSection

                // Data
                dataSection
            }
            .padding()
        }
        .background(ClarityPalette.bg.ignoresSafeArea())
        .navigationTitle("Settings")
        .toolbarColorScheme(.dark, for: .navigationBar)
        .alert("Clear All Logs?", isPresented: $s.showClearConfirm) {
            Button("Cancel", role: .cancel) {}
            Button("Clear", role: .destructive) { store.clearAllLogs() }
        } message: {
            Text("This will permanently delete all daily logs. This cannot be undone.")
        }
    }

    // MARK: - Targets

    private var targetsSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            ClaritySectionLabel( "Daily Targets")

            targetStepper("Job Actions", value: store.blob.targets.jobActions, range: 1...20) { val in
                var t = store.blob.targets
                t.jobActions = val
                store.setTargets(t)
            }
            targetStepper("Productive Hours", value: store.blob.targets.productiveHours, range: 1...16) { val in
                var t = store.blob.targets
                t.productiveHours = val
                store.setTargets(t)
            }
            targetStepper("Scripture Minutes", value: store.blob.targets.scriptureMinutes, range: 5...120, step: 5) { val in
                var t = store.blob.targets
                t.scriptureMinutes = val
                store.setTargets(t)
            }
        }
        .padding(12)
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }

    private func targetStepper(_ label: String, value: Int, range: ClosedRange<Int>, step: Int = 1, onChange: @escaping (Int) -> Void) -> some View {
        HStack {
            Text(label)
                .font(ClarityTypography.body)
                .foregroundStyle(ClarityPalette.text)
            Spacer()
            Text("\(value)")
                .font(ClarityTypography.headline)
                .foregroundStyle(CommandPalette.accent)
                .frame(width: 40)
            Stepper("", value: Binding(
                get: { value },
                set: { onChange(min(max($0, range.lowerBound), range.upperBound)) }
            ), step: step)
            .labelsHidden()
            .frame(width: 94)
        }
        .frame(minHeight: ClarityMetrics.minTapTarget)
    }

    // MARK: - Reminders

    private var remindersSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            ClaritySectionLabel( "Wife\u{2019}s Reminders (\(ReminderBank.base.count + store.blob.reminders.count))")

            // Base reminders (read-only)
            ForEach(Array(ReminderBank.base.enumerated()), id: \.offset) { _, r in
                Text("\u{201C}\(r.text)\u{201D}")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
                    .padding(8)
            }

            // Custom reminders (deletable)
            ForEach(Array(store.blob.reminders.enumerated()), id: \.offset) { i, r in
                HStack {
                    Text("\u{201C}\(r.text)\u{201D}")
                        .font(ClarityTypography.caption)
                        .foregroundStyle(ClarityPalette.text)
                    Spacer()
                    Button { store.removeReminder(at: i) } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(ClarityPalette.muted)
                    }
                    .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                    .accessibilityLabel("Remove reminder")
                }
                .padding(8)
            }

            // Add form
            HStack(spacing: 8) {
                TextField("Add a reminder...", text: $newReminderText)
                    .font(ClarityTypography.body)
                    .foregroundStyle(ClarityPalette.text)
                    .padding(10)
                    .background(ClarityPalette.bg)
                    .clipShape(RoundedRectangle(cornerRadius: 8))

                Button {
                    let trimmed = newReminderText.trimmingCharacters(in: .whitespaces)
                    guard !trimmed.isEmpty else { return }
                    store.addReminder(Reminder(text: trimmed))
                    newReminderText = ""
                } label: {
                    Text("Add")
                        .font(ClarityTypography.caption.bold())
                        .foregroundStyle(ClarityPalette.bg)
                        .padding(.horizontal, 14)
                        .frame(minHeight: ClarityMetrics.minTapTarget)
                        .background(CommandPalette.accent)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }
            }
        }
        .padding(12)
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }

    // MARK: - Scriptures

    private var scripturesSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            ClaritySectionLabel( "Scripture Bank (\(ScriptureBank.base.count + store.blob.scriptures.count))")

            // Custom scriptures (deletable)
            ForEach(Array(store.blob.scriptures.enumerated()), id: \.offset) { i, scr in
                HStack(alignment: .top) {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(scr.ref)
                            .font(ClarityTypography.caption.bold())
                            .foregroundStyle(CommandPalette.accent)
                        Text(scr.text)
                            .font(ClarityTypography.caption)
                            .foregroundStyle(ClarityPalette.text)
                            .lineLimit(2)
                    }
                    Spacer()
                    Button { store.removeScripture(at: i) } label: {
                        Image(systemName: "xmark.circle.fill")
                            .foregroundStyle(ClarityPalette.muted)
                    }
                    .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                }
                .padding(8)
            }

            // Add form
            VStack(spacing: 8) {
                TextField("Reference (e.g. Mosiah 2:17)", text: $newScriptureRef)
                    .font(ClarityTypography.body)
                    .foregroundStyle(ClarityPalette.text)
                    .padding(10)
                    .background(ClarityPalette.bg)
                    .clipShape(RoundedRectangle(cornerRadius: 8))

                TextField("Scripture text...", text: $newScriptureText)
                    .font(ClarityTypography.body)
                    .foregroundStyle(ClarityPalette.text)
                    .padding(10)
                    .background(ClarityPalette.bg)
                    .clipShape(RoundedRectangle(cornerRadius: 8))

                Button {
                    let ref = newScriptureRef.trimmingCharacters(in: .whitespaces)
                    let text = newScriptureText.trimmingCharacters(in: .whitespaces)
                    guard !ref.isEmpty, !text.isEmpty else { return }
                    store.addScripture(Scripture(ref: ref, text: text))
                    newScriptureRef = ""
                    newScriptureText = ""
                } label: {
                    Text("Add Scripture")
                        .font(ClarityTypography.caption.bold())
                        .foregroundStyle(ClarityPalette.bg)
                        .frame(maxWidth: .infinity)
                        .frame(minHeight: ClarityMetrics.minTapTarget)
                        .background(CommandPalette.accent)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }
            }
        }
        .padding(12)
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }

    // MARK: - Data

    private var dataSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            ClaritySectionLabel( "Data")

            ShareLink(item: store.exportJSON()) {
                HStack {
                    Image(systemName: "square.and.arrow.up")
                    Text("Export as JSON")
                        .font(ClarityTypography.body)
                }
                .foregroundStyle(CommandPalette.accent)
                .frame(maxWidth: .infinity)
                .frame(minHeight: ClarityMetrics.minTapTarget)
                .background(ClarityPalette.surface)
                .clipShape(RoundedRectangle(cornerRadius: 8))
                .overlay(
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(ClarityPalette.border, lineWidth: 1)
                )
            }

            Button {
                store.showClearConfirm = true
            } label: {
                HStack {
                    Image(systemName: "trash")
                    Text("Clear All Logs")
                        .font(ClarityTypography.body)
                }
                .foregroundStyle(ClarityPalette.danger)
                .frame(maxWidth: .infinity)
                .frame(minHeight: ClarityMetrics.minTapTarget)
                .background(ClarityPalette.danger.opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 8))
            }
        }
        .padding(12)
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}
