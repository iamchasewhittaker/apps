import SwiftUI

enum ZoneDetailTab: String, CaseIterable, Identifiable {
    case heads = "Heads"
    case problems = "Problems"
    case schedule = "Schedule"
    case beds = "Beds"

    var id: String { rawValue }
}

struct ZoneDetailView: View {
    @Environment(FairwayStore.self) private var store
    let zoneID: UUID
    let initialTab: ZoneDetailTab
    @State private var selectedTab: ZoneDetailTab

    init(zoneID: UUID, initialTab: ZoneDetailTab = .heads) {
        self.zoneID = zoneID
        self.initialTab = initialTab
        _selectedTab = State(initialValue: initialTab)
    }

    @MainActor private var zone: ZoneData? {
        store.zone(withID: zoneID)
    }

    @MainActor private var availableTabs: [ZoneDetailTab] {
        guard let zone else { return [] }
        if zone.type == .shrubs {
            return [.heads, .problems, .schedule, .beds]
        }
        return [.heads, .problems, .schedule]
    }

    var body: some View {
        Group {
            if let zone {
                ScrollView {
                    VStack(spacing: 16) {
                        header(for: zone)
                        Picker("Tab", selection: $selectedTab) {
                            ForEach(availableTabs) { tab in
                                Text(tab.rawValue).tag(tab)
                            }
                        }
                        .pickerStyle(.segmented)
                        .padding(.horizontal, 16)

                        tabContent(for: zone)
                            .padding(.horizontal, 16)
                    }
                    .padding(.vertical, 12)
                }
                .background(FairwayTheme.backgroundPrimary)
                .navigationTitle("Zone \(zone.number)")
                .navigationBarTitleDisplayMode(.inline)
            } else {
                ContentUnavailableView("Zone not found", systemImage: "questionmark.circle")
            }
        }
        .onAppear {
            if let zone, !availableTabs.contains(selectedTab) {
                selectedTab = availableTabs.first ?? .heads
                _ = zone
            }
        }
    }

    private func header(for zone: ZoneData) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    ZoneNumberBadge(number: zone.number)
                    VStack(alignment: .leading) {
                        Text(zone.name)
                            .font(.title2.bold())
                            .foregroundStyle(FairwayTheme.textPrimary)
                        Text(zone.type.rawValue)
                            .font(.subheadline)
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }
                    Spacer()
                    ZoneStatusDot(colorName: zone.statusColor, size: 14)
                }

                HStack(spacing: 16) {
                    stat(label: "Sq ft", value: "\(zone.squareFootage)")
                    stat(label: "Heads", value: "\(zone.heads.count)")
                    stat(label: "Open", value: "\(zone.openProblemCount)")
                }

                if !zone.notes.isEmpty {
                    Text(zone.notes)
                        .font(.footnote)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
            }
        }
        .padding(.horizontal, 16)
    }

    @ViewBuilder
    private func tabContent(for zone: ZoneData) -> some View {
        switch selectedTab {
        case .heads:
            HeadInventoryView(zoneID: zone.id)
        case .problems:
            ProblemAreaView(zoneID: zone.id)
        case .schedule:
            ScheduleView(zoneID: zone.id)
        case .beds:
            ShrubBedView(zoneID: zone.id)
        }
    }

    private func stat(label: String, value: String) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(value)
                .font(.title3.bold())
                .foregroundStyle(FairwayTheme.textPrimary)
            Text(label)
                .font(.caption2)
                .foregroundStyle(FairwayTheme.textSecondary)
                .textCase(.uppercase)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}

#Preview {
    NavigationStack {
        let store: FairwayStore = {
            let s = FairwayStore()
            s.blob = PreviewData.previewBlob
            return s
        }()
        ZoneDetailView(zoneID: store.blob.zones[1].id)
            .environment(store)
    }
}
