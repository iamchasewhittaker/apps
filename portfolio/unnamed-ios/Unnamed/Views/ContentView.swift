import SwiftUI

struct ContentView: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        TabView {
            CaptureView()
                .tabItem { Label("Capture", systemImage: "plus") }
                .badge(store.inboxItems.count)

            SortView()
                .tabItem { Label("Sort", systemImage: "arrow.up.arrow.down") }

            TodayView()
                .tabItem { Label("Today", systemImage: "triangle.fill") }
                .badge(store.isLockedToday ? 1 : 0)

            CheckView()
                .tabItem { Label("Check", systemImage: "checkmark") }
                .badge(store.hasCheckedToday ? 1 : 0)
        }
        .tint(Color(hex: "#f59e0b"))
    }
}
