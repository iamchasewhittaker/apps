import SwiftUI

@main
struct WellnessTrackerApp: App {
    @StateObject private var store = WellnessStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(store)
        }
    }
}
