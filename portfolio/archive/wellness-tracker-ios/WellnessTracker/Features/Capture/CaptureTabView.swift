import SwiftUI

struct CaptureTabView: View {
    @ObservedObject var store: WellnessStore

    @State private var winText = ""
    @State private var pulseMood = ""
    @State private var pulseNote = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    winCard
                    pulseCard
                    recentCard
                }
                .padding(16)
            }
            .background(WellnessTheme.bg.ignoresSafeArea())
            .navigationTitle("Capture")
            .navigationBarTitleDisplayMode(.inline)
        }
        .tint(WellnessTheme.accent)
    }

    private var winCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Quick win")
                .font(.headline)
                .foregroundStyle(WellnessTheme.text)
            TextField("What went well?", text: $winText)
                .textFieldStyle(.roundedBorder)
            Button("Save win") {
                store.addWin(note: winText)
                winText = ""
            }
            .buttonStyle(.borderedProminent)
            .tint(WellnessTheme.accent)
        }
        .padding(14)
        .background(WellnessTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private var pulseCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Pulse check")
                .font(.headline)
                .foregroundStyle(WellnessTheme.text)
            TextField("Mood (1-2 words)", text: $pulseMood)
                .textFieldStyle(.roundedBorder)
            TextField("Note (optional)", text: $pulseNote)
                .textFieldStyle(.roundedBorder)
            Button("Save pulse") {
                store.addPulse(mood: pulseMood, note: pulseNote)
                pulseMood = ""
                pulseNote = ""
            }
            .buttonStyle(.borderedProminent)
            .tint(WellnessTheme.accent)
        }
        .padding(14)
        .background(WellnessTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private var recentCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Recent")
                .font(.headline)
                .foregroundStyle(WellnessTheme.text)
            Text("Wins: \(store.wins.count)")
                .font(.subheadline)
                .foregroundStyle(WellnessTheme.muted)
            Text("Pulse checks: \(store.pulseChecks.count)")
                .font(.subheadline)
                .foregroundStyle(WellnessTheme.muted)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(WellnessTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
