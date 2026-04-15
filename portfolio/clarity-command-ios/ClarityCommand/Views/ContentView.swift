import SwiftUI
import ClarityUI

struct ContentView: View {
    @Environment(CommandStore.self) private var store

    var body: some View {
        TabView {
            NavigationStack {
                MissionTabView()
            }
            .tabItem {
                Label("Mission", systemImage: "target")
            }

            NavigationStack {
                ScoreboardTabView()
            }
            .tabItem {
                Label("Scoreboard", systemImage: "chart.bar.fill")
            }

            NavigationStack {
                SettingsTabView()
            }
            .tabItem {
                Label("Settings", systemImage: "gearshape.fill")
            }
        }
        .tint(CommandPalette.accent)
        .preferredColorScheme(.dark)
    }
}
