import SwiftUI
import ClarityUI

struct ContentView: View {
    @Environment(TimeStore.self) private var store

    var body: some View {
        TabView {
            NavigationStack {
                TimeSessionsView()
            }
            .tabItem {
                Label("Time", systemImage: "timer")
            }

            NavigationStack {
                ScriptureStreakView()
            }
            .tabItem {
                Label("Scripture", systemImage: "book.closed")
            }
        }
        .background(ClarityPalette.bg.ignoresSafeArea())
        .preferredColorScheme(.dark)
    }
}
