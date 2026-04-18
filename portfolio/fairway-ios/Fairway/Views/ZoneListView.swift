import SwiftUI

struct ZoneListView: View {
    @Environment(FairwayStore.self) private var store
    @State private var showInfo = false

    var body: some View {
        ScrollView {
            VStack(spacing: 12) {
                ForEach(store.blob.zones) { zone in
                    NavigationLink {
                        ZoneDetailView(zoneID: zone.id)
                    } label: {
                        ZoneCard(zone: zone)
                    }
                    .buttonStyle(.plain)
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(FairwayTheme.backgroundPrimary)
        .navigationTitle("Zones")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button { showInfo = true } label: {
                    Image(systemName: "info.circle")
                }
            }
        }
        .sheet(isPresented: $showInfo) {
            NavigationStack {
                List {
                    Section("Property Overview") {
                        InfoRow(label: "Total grass", value: "\(FairwayConfig.totalGrassSqFt) sq ft")
                        InfoRow(label: "Zones", value: "4 (1 shrubs + 3 lawn)")
                        InfoRow(label: "Grass type", value: "KBG + cool season mix")
                    }
                    Section("Zone Legend") {
                        LegendRow(colorName: "statusHealthy", label: "Healthy — no open problems")
                        LegendRow(colorName: "statusAttention", label: "Attention — open low/medium problems")
                        LegendRow(colorName: "statusAction", label: "Action needed — high severity problem")
                    }
                }
                .scrollContentBackground(.hidden)
                .background(FairwayTheme.backgroundPrimary)
                .navigationTitle("About Zones")
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button("Done") { showInfo = false }
                    }
                }
            }
        }
    }
}

private struct ZoneCard: View {
    let zone: ZoneData

    var body: some View {
        FairwayCard {
            HStack(alignment: .top, spacing: 14) {
                ZoneNumberBadge(number: zone.number)

                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        Text(zone.name)
                            .font(.title3.bold())
                            .foregroundStyle(FairwayTheme.textPrimary)
                        Spacer()
                        ZoneStatusDot(colorName: zone.statusColor)
                    }

                    Text(zone.type.rawValue)
                        .font(.subheadline)
                        .foregroundStyle(FairwayTheme.textSecondary)

                    HStack(spacing: 12) {
                        Label("\(zone.squareFootage) sq ft", systemImage: "square.dashed")
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.textSecondary)
                        Label("\(zone.heads.count) heads", systemImage: "drop.fill")
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }

                    HStack(spacing: 8) {
                        if zone.preSeasonHeadCount > 0 {
                            HStack(spacing: 4) {
                                Image(systemName: "exclamationmark.circle.fill")
                                Text("\(zone.preSeasonHeadCount) pre-season")
                            }
                            .font(.caption2.bold())
                            .foregroundStyle(FairwayTheme.badgePreSeason)
                        }
                        if zone.openProblemCount > 0 {
                            HStack(spacing: 4) {
                                Image(systemName: "exclamationmark.triangle.fill")
                                Text("\(zone.openProblemCount) open")
                            }
                            .font(.caption2.bold())
                            .foregroundStyle(FairwayTheme.color(named: zone.statusColor))
                        }
                    }
                    .padding(.top, 2)
                }
            }
        }
    }
}

private struct InfoRow: View {
    let label: String
    let value: String
    var body: some View {
        HStack {
            Text(label)
            Spacer()
            Text(value).foregroundStyle(FairwayTheme.textSecondary)
        }
    }
}

private struct LegendRow: View {
    let colorName: String
    let label: String
    var body: some View {
        HStack(spacing: 10) {
            Circle().fill(FairwayTheme.color(named: colorName)).frame(width: 10, height: 10)
            Text(label)
        }
    }
}

#Preview {
    NavigationStack { ZoneListView() }
        .environment({ let s = FairwayStore(); s.blob = PreviewData.previewBlob; return s }())
}
