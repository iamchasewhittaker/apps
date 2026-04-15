import SwiftUI

@main
struct WellnessTrackerApp: App {
    @StateObject private var store = WellnessStore()
    @StateObject private var cloud = WellnessCloudSync()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(store)
                .environmentObject(cloud)
                .onAppear {
                    store.onPersisted = {
                        Task { await cloud.schedulePush(from: store) }
                    }
                }
                .task {
                    await cloud.bootstrapSession()
                    await cloud.pullWellness(into: store)
                }
        }
    }
}
