import SwiftUI

struct FleetListView: View {
    @Environment(FleetStore.self) private var store

    var body: some View {
        List {
            ForEach(store.groupedByBucket(), id: \.bucket) { group in
                Section {
                    ForEach(group.ships) { ship in
                        ShipRowView(ship: ship)
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
    }
}

#Preview {
    NavigationStack {
        FleetListView()
            .navigationTitle("Fleet")
    }
    .environment({
        let s = FleetStore()
        s.loadMockFleet()
        return s
    }())
}
