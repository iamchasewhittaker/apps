import SwiftUI

@MainActor
struct RachioHistoryView: View {
    @Environment(FairwayStore.self) private var store

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                if let state = store.blob.rachio, !state.recentEvents.isEmpty {
                    summaryCard(state: state)
                    ForEach(grouped(state.recentEvents), id: \.day) { group in
                        dayCard(day: group.day, label: group.label, events: group.events)
                    }
                } else {
                    emptyState
                }
            }
            .padding(16)
        }
        .background(FairwayTheme.backgroundPrimary)
        .navigationTitle("Watering History")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    Task { await store.syncRachio() }
                } label: {
                    if store.rachioSyncing {
                        ProgressView().tint(FairwayTheme.textPrimary)
                    } else {
                        Image(systemName: "arrow.clockwise")
                    }
                }
                .disabled(store.rachioSyncing || !store.rachioIsConnected)
            }
        }
    }

    private func summaryCard(state: RachioState) -> some View {
        FairwayCard {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Cached Events")
                        .font(.caption.bold())
                        .foregroundStyle(FairwayTheme.textSecondary)
                        .textCase(.uppercase)
                    Text("\(state.recentEvents.count)")
                        .font(.title2.bold())
                        .foregroundStyle(FairwayTheme.textPrimary)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 4) {
                    Text("Last Sync")
                        .font(.caption.bold())
                        .foregroundStyle(FairwayTheme.textSecondary)
                        .textCase(.uppercase)
                    Text(RelativeDateTimeFormatter().localizedString(
                        for: state.lastSyncAt, relativeTo: Date()
                    ))
                    .font(.subheadline)
                    .foregroundStyle(FairwayTheme.textPrimary)
                }
            }
        }
    }

    private func dayCard(day: String, label: String, events: [RachioEventSnapshot]) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 10) {
                Text(label)
                    .font(.caption.bold())
                    .foregroundStyle(FairwayTheme.accentGold)
                    .textCase(.uppercase)

                ForEach(events) { event in
                    HStack(alignment: .top, spacing: 10) {
                        Text(timeString(event.date))
                            .font(.footnote.monospacedDigit())
                            .foregroundStyle(FairwayTheme.textSecondary)
                            .frame(width: 68, alignment: .leading)
                        VStack(alignment: .leading, spacing: 3) {
                            Text(event.summary.isEmpty ? event.subType : event.summary)
                                .font(.footnote)
                                .foregroundStyle(FairwayTheme.textPrimary)
                            HStack(spacing: 6) {
                                if let zoneNum = event.zoneNumber {
                                    zonePill(number: zoneNum)
                                }
                                if let dur = event.durationSeconds, dur > 0 {
                                    Text(formatDuration(seconds: dur))
                                        .font(.caption2)
                                        .foregroundStyle(FairwayTheme.textSecondary)
                                }
                                Text(event.subType)
                                    .font(.caption2)
                                    .foregroundStyle(FairwayTheme.textSecondary)
                            }
                        }
                        Spacer()
                    }
                    if event.id != events.last?.id {
                        Divider().background(FairwayTheme.backgroundElevated)
                    }
                }
            }
        }
    }

    private func zonePill(number: Int) -> some View {
        Text("Z\(number)")
            .font(.caption2.bold())
            .padding(.horizontal, 6).padding(.vertical, 2)
            .background(FairwayTheme.accentGreen.opacity(0.3))
            .foregroundStyle(FairwayTheme.textPrimary)
            .clipShape(Capsule())
    }

    private var emptyState: some View {
        FairwayCard {
            VStack(spacing: 10) {
                Image(systemName: "clock.arrow.circlepath")
                    .font(.system(size: 36))
                    .foregroundStyle(FairwayTheme.textSecondary)
                Text(store.rachioIsConnected ? "No events yet" : "Not connected to Rachio")
                    .font(.subheadline.bold())
                    .foregroundStyle(FairwayTheme.textPrimary)
                Text(store.rachioIsConnected
                     ? "Pull events by tapping Sync."
                     : "Connect in More → Rachio Sync.")
                    .font(.caption)
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 24)
        }
    }

    // MARK: - Helpers

    private struct EventGroup {
        let day: String
        let label: String
        let events: [RachioEventSnapshot]
    }

    private func grouped(_ events: [RachioEventSnapshot]) -> [EventGroup] {
        let sorted = events.sorted { $0.date > $1.date }
        let byDay = Dictionary(grouping: sorted, by: { $0.dayKey })
        let labelFmt = DateFormatter()
        labelFmt.dateFormat = "EEEE, MMM d"
        return byDay
            .sorted { $0.key > $1.key }
            .map { key, list in
                let label = list.first.map { labelFmt.string(from: $0.date) } ?? key
                return EventGroup(day: key, label: label, events: list)
            }
    }

    private func timeString(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "h:mm a"
        return f.string(from: date)
    }

    private func formatDuration(seconds: Int) -> String {
        let m = seconds / 60
        if m >= 60 {
            let h = m / 60
            let mm = m % 60
            return mm == 0 ? "\(h)h" : "\(h)h \(mm)m"
        }
        return "\(m)m"
    }
}
