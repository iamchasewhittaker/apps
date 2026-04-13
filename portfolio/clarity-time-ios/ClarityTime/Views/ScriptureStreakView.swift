import SwiftUI
import ClarityUI

struct ScriptureStreakView: View {
    @Environment(TimeStore.self) private var store

    private var today: String { DateHelpers.todayString }

    var body: some View {
        List {
            Section {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Current streak")
                        .font(ClarityTypography.caption)
                        .foregroundStyle(ClarityPalette.muted)
                    Text("\(store.scriptureStreak) day\(store.scriptureStreak == 1 ? "" : "s")")
                        .font(ClarityTypography.title)
                        .foregroundStyle(ClarityPalette.text)
                }
                .listRowBackground(Color.clear)
            }

            Section("Today (\(today))") {
                Toggle("Scripture done today", isOn: Binding(
                    get: { store.scriptureDay(for: today).completed },
                    set: { store.setScriptureCompleted($0, date: today) }
                ))
                TextField(
                    "Reference (optional)",
                    text: Binding(
                        get: { store.scriptureDay(for: today).scriptureReference },
                        set: { store.setScriptureReference($0, date: today) }
                    )
                )
            }

            Section("Notes") {
                Text("Streak counts when “Scripture done today” is on. A reference is optional.")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
            }
        }
        .navigationTitle("Scripture")
        .scrollContentBackground(.hidden)
    }
}
