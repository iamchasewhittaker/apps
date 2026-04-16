import SwiftUI
import ClarityUI

@MainActor
struct ContentView: View {
    @Environment(BudgetStore.self) private var store

    var body: some View {
        TabView {
            NavigationStack {
                SafeToSpendHomeView()
            }
            .tabItem {
                Label("Today", systemImage: "sparkles")
            }

            NavigationStack {
                BudgetScenariosView()
            }
            .tabItem {
                Label("Scenarios", systemImage: "square.split.2x1")
            }

            NavigationStack {
                WantsTrackerView()
            }
            .tabItem {
                Label("Wants", systemImage: "heart.circle")
            }

            NavigationStack {
                BudgetYNABSettingsView(isPresented: .constant(true), showDismiss: false)
            }
            .tabItem {
                Label("Settings", systemImage: "gearshape.fill")
            }
        }
        .background(ClarityPalette.bg.ignoresSafeArea())
        .preferredColorScheme(.dark)
    }
}
