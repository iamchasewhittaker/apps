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
                NavigationStack { ZoneListView() }
                    .tabItem { Label("Zones", systemImage: "leaf.fill") }

                NavigationStack { FertilizerView() }
                    .tabItem { Label("Lawn", systemImage: "sun.max.fill") }

                NavigationStack { SoilTestView() }
                    .tabItem { Label("Soil", systemImage: "chart.bar.fill") }

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
                NavigationLink("Spreader Calculator") {
                    SpreaderCalcView()
                }
                NavigationLink("Mow Log") {
                    MowLogView()
                }
                NavigationLink("Inventory (The Shed)") {
                    InventoryView()
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
