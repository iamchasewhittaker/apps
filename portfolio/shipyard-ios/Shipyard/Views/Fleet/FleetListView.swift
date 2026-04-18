import SwiftUI

struct FleetListView: View {
    @Environment(FleetStore.self) private var store

    var body: some View {
        List {
            ForEach(store.groupedByBucket(), id: \.bucket) { group in
                Section {
                    ForEach(group.ships) { ship in
                        NavigationLink(value: ship) {
                            ShipRowView(ship: ship)
                        }
                        .listRowBackground(Palette.deepSea)
                    }
                } header: {
                    HStack {
                        Text(group.bucket.rawValue.uppercased())
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(Palette.mist)
                        Spacer()
                        Text("\(group.ships.count)")
                            .font(.caption.monospacedDigit())
                            .foregroundStyle(Palette.mist.opacity(0.7))
                    }
                }
            }
        }
        .listStyle(.insetGrouped)
        .scrollContentBackground(.hidden)
        .background(Palette.navy)
        .navigationDestination(for: Ship.self) { ship in
            ShipDetailView(ship: ship)
        }
        .refreshable {
            await store.loadFleet()
        }
        .overlay {
            if store.isLoading && store.ships.isEmpty {
                ProgressView("Loading fleet…")
                    .tint(Palette.gold)
            }
        }
    }
}

#Preview {
    NavigationStack {
        FleetListView()
            .navigationTitle("Fleet")
    }
    .environment({
        let s = FleetStore()
        s.signIn()
        return s
    }())
}
