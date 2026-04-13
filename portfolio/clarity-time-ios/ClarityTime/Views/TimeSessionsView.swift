import SwiftUI
import ClarityUI

struct TimeSessionsView: View {
    @Environment(TimeStore.self) private var store

    @State private var timerTitle = ""
    @State private var timerCategory = TimeConfig.categories[0]
    @State private var manualTitle = ""
    @State private var manualCategory = TimeConfig.categories[0]
    @State private var manualMinutes = 25

    var body: some View {
        List {
            if let quote = timeQuotes.todaysQuote {
                Section {
                    QuoteBanner(quote: quote)
                        .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 0))
                        .listRowBackground(Color.clear)
                }
            }

            Section("Focus timer") {
                if store.activeTimer == nil {
                    TextField("Session label (optional)", text: $timerTitle)
                    Picker("Category", selection: $timerCategory) {
                        ForEach(TimeConfig.categories, id: \.self) { key in
                            Text(TimeConfig.categoryLabels[key] ?? key).tag(key)
                        }
                    }
                    Button("Start") {
                        store.startTimer(title: timerTitle, category: timerCategory)
                    }
                } else {
                    Text(formatHMS(store.timerElapsedSeconds))
                        .font(.system(.title2, design: .monospaced))
                        .frame(maxWidth: .infinity, alignment: .center)
                        .padding(.vertical, 8)

                    HStack {
                        if store.activeTimer?.pauseBeganAtMs != nil {
                            Button("Resume") { store.resumeTimer() }
                        } else {
                            Button("Pause") { store.pauseTimer() }
                        }
                        Button("Stop & save") { store.stopTimer() }
                        Button("Discard", role: .destructive) { store.discardTimer() }
                    }
                    .buttonStyle(.bordered)
                }
            }

            Section("Manual session") {
                TextField("Label (optional)", text: $manualTitle)
                Picker("Category", selection: $manualCategory) {
                    ForEach(TimeConfig.categories, id: \.self) { key in
                        Text(TimeConfig.categoryLabels[key] ?? key).tag(key)
                    }
                }
                Stepper("Minutes: \(manualMinutes)", value: $manualMinutes, in: 1...180)
                Button("Log session") {
                    store.addManualSession(
                        title: manualTitle,
                        category: manualCategory,
                        durationMinutes: manualMinutes,
                        date: DateHelpers.todayString
                    )
                    manualTitle = ""
                }
            }

            Section("Recent sessions") {
                if store.sessionsNewestFirst.isEmpty {
                    Text("No sessions yet.")
                        .foregroundStyle(ClarityPalette.muted)
                } else {
                    ForEach(store.sessionsNewestFirst) { session in
                        VStack(alignment: .leading, spacing: 4) {
                            HStack {
                                Text(session.title)
                                    .font(ClarityTypography.body)
                                Spacer()
                                Text(session.kind == .timer ? "Timer" : "Manual")
                                    .font(ClarityTypography.caption)
                                    .foregroundStyle(ClarityPalette.muted)
                            }
                            Text("\(TimeConfig.categoryLabels[session.category] ?? session.category) · \(formatHMS(session.durationSeconds)) · \(session.date)")
                                .font(ClarityTypography.caption)
                                .foregroundStyle(ClarityPalette.muted)
                        }
                        .swipeActions(edge: .trailing, allowsFullSwipe: true) {
                            Button("Delete", role: .destructive) {
                                store.deleteSession(session.id)
                            }
                        }
                    }
                }
            }
        }
        .navigationTitle("Clarity Time")
        .scrollContentBackground(.hidden)
    }

    private func formatHMS(_ totalSeconds: Int) -> String {
        let s = max(0, totalSeconds)
        let h = s / 3600
        let m = (s % 3600) / 60
        let r = s % 60
        if h > 0 {
            return String(format: "%d:%02d:%02d", h, m, r)
        }
        return String(format: "%d:%02d", m, r)
    }
}
