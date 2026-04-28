import SwiftUI

@MainActor
struct TimeTabView: View {
    @ObservedObject var store: WellnessStore

    @State private var now = Date()

    private let ticker = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    if let active = store.activeTimeSession {
                        activeCard(active: active)
                    }
                    categoryGrid
                    streakCard
                    sessionsCard
                }
                .padding(16)
            }
            .background(WellnessTheme.bg.ignoresSafeArea())
            .navigationTitle("Time")
            .navigationBarTitleDisplayMode(.inline)
            .onReceive(ticker) { now = $0 }
        }
        .tint(WellnessTheme.accent)
    }

    // MARK: - Active card

    @ViewBuilder
    private func activeCard(active: [String: Any]) -> some View {
        let catId = active["catId"] as? String ?? ""
        let cat = TimeCategories.find(catId)
        let elapsed = elapsedSeconds(active: active)

        VStack(alignment: .leading, spacing: 10) {
            Text("Currently tracking")
                .font(.caption.weight(.bold))
                .textCase(.uppercase)
                .tracking(1.0)
                .foregroundStyle(cat?.color ?? WellnessTheme.accent)

            Text("\(cat?.icon ?? "⏱️") \(cat?.label ?? catId.capitalized)")
                .font(.title2.weight(.bold))
                .foregroundStyle(WellnessTheme.text)

            Text(formatHHMM(elapsed))
                .font(.system(size: 36, weight: .bold, design: .rounded).monospacedDigit())
                .foregroundStyle(cat?.color ?? WellnessTheme.accent)

            Button {
                store.stopActiveSession()
            } label: {
                Text("Stop")
                    .font(.subheadline.weight(.semibold))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
            }
            .buttonStyle(.borderedProminent)
            .tint(cat?.color ?? WellnessTheme.accent)
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background((cat?.color ?? WellnessTheme.accent).opacity(0.12))
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(cat?.color ?? WellnessTheme.accent, lineWidth: 2)
        )
        .clipShape(RoundedRectangle(cornerRadius: 14))
    }

    // MARK: - Category grid

    private var categoryGrid: some View {
        let isActive = store.activeTimeSession != nil
        let columns = [GridItem(.flexible(), spacing: 10), GridItem(.flexible(), spacing: 10)]
        return VStack(alignment: .leading, spacing: 10) {
            Text(isActive ? "Switch to" : "Start tracking")
                .font(.caption.weight(.bold))
                .textCase(.uppercase)
                .tracking(1.0)
                .foregroundStyle(WellnessTheme.muted)

            LazyVGrid(columns: columns, spacing: 10) {
                ForEach(TimeCategories.all) { cat in
                    Button {
                        store.startCategorySession(categoryId: cat.id)
                    } label: {
                        HStack(spacing: 8) {
                            Text(cat.icon)
                                .font(.title3)
                            Text(cat.label)
                                .font(.subheadline.weight(.semibold))
                                .foregroundStyle(WellnessTheme.text)
                                .lineLimit(1)
                                .minimumScaleFactor(0.8)
                            Spacer(minLength: 0)
                        }
                        .padding(.horizontal, 12)
                        .padding(.vertical, 12)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(WellnessTheme.surface)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(cat.color.opacity(0.6), lineWidth: 1.5)
                        )
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    // MARK: - Scripture streak

    private var streakCard: some View {
        let streak = store.blob["scriptureStreak"] as? [String: Any] ?? [:]
        let count = streak["count"] as? Int ?? 0
        let lastDate = streak["lastDate"] as? String ?? "—"
        return VStack(alignment: .leading, spacing: 4) {
            Text("Scripture streak")
                .font(.headline)
                .foregroundStyle(WellnessTheme.text)
            Text("\(count) day\(count == 1 ? "" : "s")")
                .font(.title3.weight(.bold))
                .foregroundStyle(WellnessTheme.accent)
            Text("Last logged: \(lastDate)")
                .font(.caption)
                .foregroundStyle(WellnessTheme.muted)
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(WellnessTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    // MARK: - Today's log

    private var sessionsCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Today")
                .font(.headline)
                .foregroundStyle(WellnessTheme.text)

            if store.timeSessionsToday.isEmpty {
                Text("No sessions logged yet today.")
                    .font(.subheadline)
                    .foregroundStyle(WellnessTheme.muted)
            } else {
                ForEach(Array(store.timeSessionsToday.enumerated()), id: \.offset) { _, session in
                    sessionRow(session)
                }
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(WellnessTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    @ViewBuilder
    private func sessionRow(_ session: [String: Any]) -> some View {
        let catId = session["catId"] as? String ?? (session["category"] as? String ?? "")
        let cat = TimeCategories.find(catId)
        let label = cat?.label ?? (session["category"] as? String ?? "Session")
        let icon = cat?.icon ?? "⏱️"
        let durationMs = session["duration"] as? Double
        let minutesStored = session["minutes"] as? Int
        let minutes: Int = {
            if let durationMs { return max(0, Int(durationMs / 60000)) }
            if let minutesStored { return minutesStored }
            return 0
        }()
        let noteText = session["note"] as? String ?? ""

        VStack(alignment: .leading, spacing: 3) {
            Text("\(icon) \(label) · \(minutes)m")
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

    // MARK: - Helpers

    /// DST/midnight guard: if active.startTime is on a different calendar day, treat elapsed as 0.
    /// Mirrors web `TimeTrackerTab.jsx` lines 181–184.
    private func elapsedSeconds(active: [String: Any]) -> Int {
        guard let start = active["startTime"] as? Double else { return 0 }
        let startDate = Date(timeIntervalSince1970: start / 1000)
        let today = WellnessBlob.jsToDateString(now)
        let startDay = WellnessBlob.jsToDateString(startDate)
        guard startDay == today else { return 0 }
        let delta = now.timeIntervalSince(startDate)
        return max(0, Int(delta))
    }

    private func formatHHMM(_ totalSeconds: Int) -> String {
        let h = totalSeconds / 3600
        let m = (totalSeconds % 3600) / 60
        let s = totalSeconds % 60
        return String(format: "%02d:%02d:%02d", h, m, s)
    }
}
