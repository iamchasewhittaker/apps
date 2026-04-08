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
            DashboardView()
                .tabItem { Label("Overview", systemImage: "chart.bar.fill") }
                .tag(0)
            BillsPlannerView()
                .tabItem { Label("Bills", systemImage: "list.bullet.rectangle") }
                .tag(1)
            IncomeGapView()
                .tabItem { Label("Salary", systemImage: "dollarsign.circle.fill") }
                .tag(2)
            CashFlowView()
                .tabItem { Label("Cash Flow", systemImage: "arrow.left.arrow.right.circle.fill") }
                .tag(3)
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
