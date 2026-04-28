import SwiftUI

struct ContentView: View {
    @Environment(FairwayStore.self) private var store
    @State private var isShowingQuickLog = false

    init() {
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(FairwayTheme.backgroundPrimary)
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }

    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            TabView {
                NavigationStack { OverviewView() }
                    .tabItem { Label("Overview", systemImage: "house.fill") }

                NavigationStack { ZoneListView() }
                    .tabItem { Label("Zones", systemImage: "leaf.fill") }

                NavigationStack { FertilizerView() }
                    .tabItem { Label("Lawn", systemImage: "sun.max.fill") }

                NavigationStack { MapTabView() }
                    .tabItem { Label("Map", systemImage: "map.fill") }

                NavigationStack { MaintenanceView() }
                    .tabItem { Label("Maintenance", systemImage: "checkmark.circle.fill") }

                NavigationStack { MoreView() }
                    .tabItem { Label("More", systemImage: "ellipsis.circle.fill") }
            }
            .tint(FairwayTheme.accentGold)

            if !isShowingQuickLog {
                QuickLogFAB(isShowing: $isShowingQuickLog)
                    .padding(.trailing, 20)
                    .padding(.bottom, 80)
            }
        }
        .sheet(isPresented: $isShowingQuickLog) {
            QuickLogSheet()
                .presentationDetents([.medium, .large])
        }
    }
}

struct MoreView: View {
    @Environment(FairwayStore.self) private var store

    var body: some View {
        List {
            Section("App") {
                HStack {
                    Text("Version")
                    Spacer()
                    Text(FairwayConfig.version)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
                HStack {
                    Text("Total grass area")
                    Spacer()
                    Text("\(FairwayConfig.totalGrassSqFt) sq ft")
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
            }

            Section("Tools") {
                NavigationLink {
                    PreSeasonAuditView()
                } label: {
                    HStack {
                        Text("Pre-Season Audit")
                        Spacer()
                        let total = store.blob.zones.filter { $0.number != 1 }.reduce(0) { $0 + $1.heads.count }
                        let cleared = store.blob.zones.filter { $0.number != 1 }.reduce(0) { $0 + $1.heads.filter { $0.preSeasonChecked }.count }
                        Text("\(cleared)/\(total)")
                            .font(.caption)
                            .foregroundStyle(cleared == total && total > 0 ? FairwayTheme.accentGold : FairwayTheme.textSecondary)
                    }
                }
                NavigationLink("Spreader Calculator") {
                    SpreaderCalcView()
                }
                NavigationLink("Mow Log") {
                    MowLogView()
                }
                NavigationLink("Inventory (The Shed)") {
                    InventoryView()
                }
                NavigationLink("Soil Test") {
                    SoilTestView()
                }
            }

            Section("Integrations") {
                NavigationLink {
                    RachioSettingsView()
                } label: {
                    HStack {
                        Text("Rachio Sync")
                        Spacer()
                        if store.rachioIsConnected {
                            Text(store.blob.rachio?.deviceName ?? "Connected")
                                .font(.caption)
                                .foregroundStyle(FairwayTheme.accentGold)
                        } else {
                            Text("Not connected")
                                .font(.caption)
                                .foregroundStyle(FairwayTheme.textSecondary)
                        }
                    }
                }
                NavigationLink("Watering History") {
                    RachioHistoryView()
                }
            }

            Section("Settings") {
                NavigationLink("Settings") {
                    SettingsView()
                }
            }

            Section("Data") {
                Button("Reseed from Defaults", role: .destructive) {
                    store.seedIfNeeded()
                }
            }
        }
        .scrollContentBackground(.hidden)
        .background(FairwayTheme.backgroundPrimary)
        .navigationTitle("More")
    }
}

#Preview {
    ContentView()
        .environment(FairwayStore())
}
