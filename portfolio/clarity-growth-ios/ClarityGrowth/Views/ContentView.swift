import SwiftUI
import ClarityUI

@MainActor
struct ContentView: View {
    @Environment(GrowthStore.self) private var store

    var body: some View {
        TabView {
            NavigationStack {
                GrowthDashboardView()
            }
            .tabItem {
                Label("Growth", systemImage: "leaf.fill")
            }

            NavigationStack {
                GrowthHistoryView()
            }
            .tabItem {
                Label("History", systemImage: "clock.arrow.circlepath")
            }
        }
        .background(ClarityPalette.bg.ignoresSafeArea())
        .preferredColorScheme(.dark)
    }
}
