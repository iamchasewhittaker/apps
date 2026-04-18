import SwiftUI

private let sectionTitles: [String: String] = [
    "sleep": "Sleep",
    "morning_start": "Morning Start",
    "med_checkin": "Daily Tracker",
    "health_lifestyle": "Health & Lifestyle",
    "end_of_day": "End of Day",
]

struct CheckinFlowView: View {
    @ObservedObject private var store: WellnessStore

    @State private var showPastDays = false

    init(store: WellnessStore) {
        self.store = store
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 12) {
                    header
                    if store.savedForCurrentMode {
                        completionCard
                    } else {
                        progressBar
                        sectionSwitcher
                        navButtons
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
            }
            .dynamicTypeSize(.medium ... .xxxLarge)
            .background(WellnessTheme.bg.ignoresSafeArea())
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Past days") { showPastDays = true }
                        .font(.subheadline)
                        .foregroundStyle(WellnessTheme.accent)
                }
            }
            .navigationDestination(isPresented: $showPastDays) {
                PastDaysView(store: store)
            }
        }
        .tint(WellnessTheme.accent)
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Wellness Tracker")
                .font(.caption.weight(.semibold))
                .foregroundStyle(WellnessTheme.muted)
                .textCase(.uppercase)
                .tracking(2)
            Text(Date().formatted(date: .complete, time: .omitted))
                .font(.title3.weight(.bold))
                .foregroundStyle(WellnessTheme.text)
            HStack {
                Text(store.checkinMode == .morning ? "Morning check-in" : "Evening check-in")
                    .font(.subheadline)
                    .foregroundStyle(WellnessTheme.accent)
                Spacer()
                Text("\(store.entries.count) entries")
                    .font(.subheadline)
                    .foregroundStyle(WellnessTheme.muted)
            }
            .padding(.top, 4)
        }
    }

    private var progressBar: some View {
        let n = store.activeSections.count
        let p = n > 0 ? Double(store.sectionIdx) / Double(n) : 0
        return VStack(alignment: .leading, spacing: 6) {
            GeometryReader { g in
                ZStack(alignment: .leading) {
                    Capsule().fill(WellnessTheme.border).frame(height: 6)
                    Capsule().fill(WellnessTheme.accent).frame(width: g.size.width * p, height: 6)
                }
            }
            .frame(height: 6)
            Text(sectionTitles[store.activeSections[store.sectionIdx]] ?? "")
                .font(.headline)
                .foregroundStyle(WellnessTheme.text)
        }
    }

    @ViewBuilder
    private var sectionSwitcher: some View {
        let id = store.activeSections[store.sectionIdx]
        switch id {
        case "sleep":
            SleepSectionView(store: store)
        case "morning_start":
            MorningStartSectionView(store: store)
        case "med_checkin":
            MedCheckinSectionView(store: store)
        case "health_lifestyle":
            HealthLifestyleSectionView(store: store)
        case "end_of_day":
            EndOfDaySectionView(store: store)
        default:
            EmptyView()
        }
    }

    private var navButtons: some View {
        HStack(spacing: 12) {
            if store.sectionIdx > 0 {
                Button("Back") {
                    store.goToPreviousSection()
                }
                .buttonStyle(.bordered)
                .tint(WellnessTheme.border)
            }
            Spacer()
            if store.sectionIdx < store.activeSections.count - 1 {
                Button("Next") {
                    store.goToNextSection()
                }
                .buttonStyle(.borderedProminent)
                .tint(WellnessTheme.accent)
            } else {
                Button("Save check-in") {
                    store.saveEntry()
                }
                .buttonStyle(.borderedProminent)
                .tint(WellnessTheme.accent)
            }
        }
        .padding(.top, 6)
    }

    private var completionCard: some View {
        VStack(spacing: 12) {
            Text(store.checkinMode == .morning ? "Morning check-in saved" : "Evening check-in saved")
                .font(.headline.weight(.bold))
                .foregroundStyle(WellnessTheme.text)
            Text("Great work. Your check-in is saved on this device.")
                .font(.subheadline)
                .foregroundStyle(WellnessTheme.muted)
                .multilineTextAlignment(.center)
            if store.checkinMode == .morning {
                Button("Continue with evening check-in") {
                    store.checkinMode = .evening
                    store.sectionIdx = 0
                    store.resetTrackerForm()
                }
                .buttonStyle(.borderedProminent)
                .tint(WellnessTheme.accent)
            }
        }
        .padding(20)
        .frame(maxWidth: .infinity)
        .background(WellnessTheme.surface)
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(WellnessTheme.accent.opacity(0.4)))
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
