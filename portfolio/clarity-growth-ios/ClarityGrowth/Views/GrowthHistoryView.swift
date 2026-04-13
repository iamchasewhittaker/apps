import SwiftUI
import ClarityUI

@MainActor
struct GrowthHistoryView: View {
    @Environment(GrowthStore.self) private var store
    @State private var selectedArea: String = "all"

    private var filteredLogs: [GrowthSessionEntry] {
        let sorted = store.blob.sessions.sorted { $0.timestampMs > $1.timestampMs }
        guard selectedArea != "all" else { return sorted }
        return sorted.filter { $0.area == selectedArea }
    }

    var body: some View {
        List {
            Section {
                Picker("Area", selection: $selectedArea) {
                    Text("All").tag("all")
                    ForEach(GrowthCatalog.areas) { area in
                        Text("\(area.icon) \(area.name)").tag(area.id)
                    }
                }
                .pickerStyle(.menu)
            }

            if filteredLogs.isEmpty {
                Section {
                    ClarityEmptyState(
                        title: "No sessions yet",
                        message: "Log your first session from the Growth tab to start building streaks."
                    )
                    .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 0))
                    .listRowBackground(Color.clear)
                }
            } else {
                Section("Recent sessions") {
                    ForEach(filteredLogs) { log in
                        GrowthHistoryRow(log: log)
                    }
                    .onDelete { offsets in
                        store.deleteSessions(at: offsets, inOrderedLogs: filteredLogs)
                    }
                }
            }
        }
        .navigationTitle("History")
        .scrollContentBackground(.hidden)
        .background(ClarityPalette.bg)
    }
}

@MainActor
private struct GrowthHistoryRow: View {
    let log: GrowthSessionEntry

    private var area: GrowthAreaModel? {
        GrowthCatalog.area(id: log.area)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack(alignment: .firstTextBaseline) {
                Text(titleText)
                    .font(ClarityTypography.support)
                    .foregroundStyle(ClarityPalette.text)
                Spacer()
                Text("\(log.mins)m")
                    .font(ClarityTypography.support)
                    .foregroundStyle(ClarityPalette.accent)
                Text(DateHelpers.displayShort(from: log.date))
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
            }

            if !log.note.isEmpty {
                Text(log.note)
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
            }

            if !log.milestones.isEmpty {
                FlowLayout(spacing: 6) {
                    ForEach(log.milestones, id: \.self) { milestone in
                        Text(milestone)
                            .font(ClarityTypography.caption)
                            .foregroundStyle(ClarityPalette.accent)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(ClarityPalette.surface)
                            .clipShape(Capsule())
                    }
                }
                .padding(.top, 2)
            }
        }
        .padding(.vertical, 2)
    }

    private var titleText: String {
        if let area {
            return "\(area.icon) \(area.name)"
        }
        return log.area
    }
}
