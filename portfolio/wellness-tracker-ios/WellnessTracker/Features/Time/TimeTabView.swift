import SwiftUI

struct TimeTabView: View {
    @ObservedObject var store: WellnessStore

    @State private var category = ""
    @State private var minutes = "25"
    @State private var note = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    inputCard
                    streakCard
                    sessionsCard
                }
                .padding(16)
            }
            .background(WellnessTheme.bg.ignoresSafeArea())
            .navigationTitle("Time")
            .navigationBarTitleDisplayMode(.inline)
        }
        .tint(WellnessTheme.accent)
    }

    private var inputCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Log session")
                .font(.headline)
                .foregroundStyle(WellnessTheme.text)

            TextField("Category (e.g. Focus, Scripture)", text: $category)
                .textFieldStyle(.roundedBorder)

            TextField("Minutes", text: $minutes)
                .textFieldStyle(.roundedBorder)
                .keyboardType(.numberPad)

            TextField("Note (optional)", text: $note)
                .textFieldStyle(.roundedBorder)

            Button("Save session") {
                store.addTimeSession(
                    category: category,
                    minutes: Int(minutes) ?? 0,
                    note: note
                )
                category = ""
                minutes = "25"
                note = ""
            }
            .buttonStyle(.borderedProminent)
            .tint(WellnessTheme.accent)
        }
        .padding(14)
        .background(WellnessTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private var streakCard: some View {
        let streak = store.blob["scriptureStreak"] as? [String: Any] ?? [:]
        let count = streak["count"] as? Int ?? 0
        let lastDate = streak["lastDate"] as? String ?? "—"
        return VStack(alignment: .leading, spacing: 4) {
            Text("Scripture streak")
                .font(.headline)
                .foregroundStyle(WellnessTheme.text)
            Text("\(count) days")
                .font(.title3.weight(.bold))
                .foregroundStyle(WellnessTheme.accent)
            Text("Last date: \(lastDate)")
                .font(.caption)
                .foregroundStyle(WellnessTheme.muted)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(WellnessTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private var sessionsCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Today")
                .font(.headline)
                .foregroundStyle(WellnessTheme.text)

            if store.timeSessionsToday.isEmpty {
                Text("No sessions logged today.")
                    .font(.subheadline)
                    .foregroundStyle(WellnessTheme.muted)
            } else {
                ForEach(store.timeSessionsToday.indices, id: \.self) { index in
                    let session = store.timeSessionsToday[index]
                    let title = session["category"] as? String ?? "Session"
                    let duration = session["minutes"] as? Int ?? 0
                    let noteText = session["note"] as? String ?? ""

                    VStack(alignment: .leading, spacing: 3) {
                        Text("\(title) · \(duration)m")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(WellnessTheme.text)
                        if !noteText.isEmpty {
                            Text(noteText)
                                .font(.caption)
                                .foregroundStyle(WellnessTheme.muted)
                        }
                    }
                    .padding(10)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(WellnessTheme.faint)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                }
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(WellnessTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
