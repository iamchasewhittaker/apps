import SwiftUI
import ClarityUI

struct MissionTabView: View {
    @Environment(CommandStore.self) private var store

    var body: some View {
        @Bindable var s = store
        let scripture = ScriptureBank.todayScripture(custom: store.blob.scriptures)
        let reminder = ReminderBank.todayReminder(custom: store.blob.reminders)

        ScrollView {
            VStack(spacing: 16) {
                // Morning / Evening picker
                Picker("Mode", selection: $s.missionMode) {
                    ForEach(CommandStore.MissionMode.allCases, id: \.self) { mode in
                        Text(mode.rawValue).tag(mode)
                    }
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)

                if store.missionMode == .morning {
                    morningContent(scripture: scripture, reminder: reminder)
                } else {
                    EveningReflectionView()
                }
            }
            .padding(.bottom, 32)
        }
        .background(ClarityPalette.bg.ignoresSafeArea())
        .navigationTitle("Mission")
        .toolbarColorScheme(.dark, for: .navigationBar)
    }

    @MainActor @ViewBuilder
    private func morningContent(scripture: Scripture, reminder: Reminder) -> some View {
        // Conviction panel (only if yesterday had misses)
        if let yesterday = store.yesterdayLog {
            ConvictionPanel(
                yesterdayLog: yesterday,
                targets: store.blob.targets,
                customReminders: store.blob.reminders,
                scripture: scripture
            )
            .padding(.horizontal)
        }

        // Scripture card
        ScriptureCard(scripture: scripture)
            .padding(.horizontal)

        // Her words
        HerWordsCard(reminder: reminder)
            .padding(.horizontal)

        // Counters
        CounterBanner(
            daysSinceLayoff: store.daysSinceLayoff,
            streak: store.overallStreak()
        )
        .padding(.horizontal)

        // Commit button (if not yet committed)
        if store.todayLog?.committed != true {
            GoldButton(title: "I Accept Today\u{2019}s Mission") {
                store.commitMission()
            }
            .padding(.horizontal)
        } else {
            HStack(spacing: 8) {
                Image(systemName: "checkmark.seal.fill")
                    .foregroundStyle(CommandPalette.accent)
                Text("Mission Accepted")
                    .font(ClarityTypography.headline)
                    .foregroundStyle(CommandPalette.accent)
            }
            .frame(maxWidth: .infinity)
            .padding(12)
            .background(CommandPalette.accentLight)
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .padding(.horizontal)
        }

        // Daily targets
        TargetListView()
            .padding(.horizontal)

        // Job action logger
        JobActionLogger()
            .padding(.horizontal)
    }
}
