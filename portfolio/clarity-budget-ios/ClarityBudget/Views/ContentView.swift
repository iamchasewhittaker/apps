import SwiftUI
import ClarityUI

@MainActor
struct ContentView: View {
    @Environment(BudgetStore.self) private var store

    var body: some View {
        TabView {
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
        }
        .background(ClarityPalette.bg.ignoresSafeArea())
        .preferredColorScheme(.dark)
    }
}
