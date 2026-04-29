import SwiftUI

struct ContentView: View {
    @Environment(KeepStore.self) private var store

    var body: some View {
        TabView {
            NavigationStack {
                HomeView()
            }
            .tabItem {
                Label("Rooms", systemImage: "house.fill")
            }
            .badge(store.blob.unsortedCount)

            NavigationStack {
                StatsView()
            }
            .tabItem {
                Label("Stats", systemImage: "chart.bar.fill")
            }
        }
        .tint(KeepTheme.accent)
    }
}

#Preview {
    ContentView()
        .environment(KeepStore())
}
