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
                        .listRowBackground(Palette.surface)
                    }
                } header: {
                    HStack {
                        Text(group.bucket.rawValue.uppercased())
                            .font(.shipyardMono(11))
                            .tracking(2)
                            .foregroundStyle(Palette.dim)
                        Spacer()
                        Text("\(group.ships.count)")
                            .font(.shipyardMono(11))
                            .foregroundStyle(Palette.dim.opacity(0.7))
                    }
                }
            }
        }
        .listStyle(.insetGrouped)
        .scrollContentBackground(.hidden)
        .background(Palette.bg)
        .navigationDestination(for: Ship.self) { ship in
            ShipDetailView(ship: ship)
        }
        .refreshable {
            await store.loadFleet()
        }
        .overlay {
            if store.isLoading && store.ships.isEmpty {
                ProgressView("Loading fleet…")
                    .tint(Palette.steel)
                    .foregroundStyle(Palette.dim)
                    .font(.shipyardMono(12))
            }
        }
        .safeAreaInset(edge: .top) {
            if let msg = store.errorMessage {
                Text(msg)
                    .font(.shipyardMono(11))
                    .foregroundStyle(Palette.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color.red.opacity(0.85))
            }
        }
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Menu {
                    Button("Reload", systemImage: "arrow.clockwise") {
                        Task { await store.loadFleet() }
                    }
                    Button("Sign out", systemImage: "rectangle.portrait.and.arrow.right", role: .destructive) {
                        Task { await store.signOut() }
                    }
                } label: {
                    Image(systemName: "ellipsis.circle")
                        .foregroundStyle(Palette.steel)
                }
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
        s.loadMockFleet()
        return s
    }())
}
