import SwiftData
import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var appState: AppState
    @Query private var mappings: [CategoryMapping]
    @Query(sort: \IncomeSource.sortOrder) private var sources: [IncomeSource]

    @State private var selectedTab = 0

    var body: some View {
        Group {
            if !appState.setupComplete {
                SetupFlowView {
                    appState.setupComplete = true
                }
            } else {
                mainTabs
                    .task {
                        await appState.refresh(categoryMappings: mappings, incomeSources: sources)
                    }
            }
        }
        .preferredColorScheme(.dark)
        .onAppear { configureTabBarAppearance() }
    }

    private var mainTabs: some View {
        TabView(selection: $selectedTab) {
            OverviewView()
                .tabItem { Label("Overview", systemImage: "square.grid.2x2.fill") }
                .tag(0)
            DashboardView()
                .tabItem { Label("Assign", systemImage: "dollarsign.circle.fill") }
                .tag(1)
            BillsPlannerView()
                .tabItem { Label("Bills", systemImage: "list.bullet.rectangle") }
                .tag(2)
            IncomeGapView()
                .tabItem { Label("Adjust", systemImage: "arrow.triangle.2.circlepath") }
                .tag(3)
            CashFlowView()
                .tabItem { Label("Age Money", systemImage: "hourglass") }
                .tag(4)
        }
        .tint(ClarityTheme.accent)
    }

    private func configureTabBarAppearance() {
        let appearance = UITabBarAppearance()
        appearance.configureWithOpaqueBackground()
        appearance.backgroundColor = UIColor(ClarityTheme.surface)
        UITabBar.appearance().standardAppearance = appearance
        UITabBar.appearance().scrollEdgeAppearance = appearance
    }
}

#Preview {
    ContentView()
        .environmentObject(AppState.preview)
        .modelContainer(for: [CategoryMapping.self, IncomeSource.self], inMemory: true)
}
