import SwiftUI

struct MapListToggleView: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            List {
                let headsWithCoords = store.blob.zones.flatMap { zone in
                    zone.heads.filter(\.hasCoordinates).map { (zone: zone, head: $0) }
                }

                if headsWithCoords.isEmpty && store.blob.observations.isEmpty {
                    Text("No mapped items yet. Place heads on the map to see them here.")
                        .foregroundStyle(FairwayTheme.textSecondary)
                        .font(.subheadline)
                } else {
                    if !headsWithCoords.isEmpty {
                        Section("Heads (\(headsWithCoords.count))") {
                            ForEach(headsWithCoords, id: \.head.id) { item in
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(item.head.label)
                                        .font(.subheadline.bold())
                                        .foregroundStyle(FairwayTheme.textPrimary)
                                    Text("Zone \(item.zone.number) · \(item.head.location)")
                                        .font(.caption)
                                        .foregroundStyle(FairwayTheme.textSecondary)
                                    if let lat = item.head.latitude, let lng = item.head.longitude {
                                        Text(String(format: "%.4f, %.4f", lat, lng))
                                            .font(.caption2)
                                            .foregroundStyle(FairwayTheme.textSecondary)
                                    }
                                }
                                .accessibilityElement(children: .combine)
                            }
                        }
                    }

                    if !store.blob.observations.isEmpty {
                        Section("Observations (\(store.blob.observations.count))") {
                            ForEach(store.blob.observations) { obs in
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(obs.text)
                                        .font(.subheadline)
                                        .foregroundStyle(FairwayTheme.textPrimary)
                                    HStack {
                                        Text(obs.date, style: .date)
                                        if let zn = obs.zoneNumber {
                                            Text("· Zone \(zn)")
                                        }
                                    }
                                    .font(.caption)
                                    .foregroundStyle(FairwayTheme.textSecondary)
                                }
                                .accessibilityElement(children: .combine)
                            }
                        }
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Map Items")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                        .foregroundStyle(FairwayTheme.accentGold)
                }
            }
        }
    }
}
