import SwiftUI
import ClarityUI

struct ContentView: View {
    @Environment(TriageStore.self) private var store

    var body: some View {
        TabView {
            NavigationStack {
                TaskListView()
            }
            .tabItem {
                Label("Tasks", systemImage: "checklist")
            }

            NavigationStack {
                IdeasView()
            }
            .tabItem {
                Label("Ideas", systemImage: "lightbulb")
            }

            NavigationStack {
                WinLoggerView()
            }
            .tabItem {
                Label("Wins", systemImage: "star.fill")
            }
        }
        .background(ClarityPalette.bg.ignoresSafeArea())
        .preferredColorScheme(.dark)
        .onAppear { store.resetCapacityIfNeeded() }
    }
}
