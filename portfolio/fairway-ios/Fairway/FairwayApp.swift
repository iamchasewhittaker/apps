import SwiftUI

@main
@MainActor
struct FairwayApp: App {
    @State private var store = FairwayStore()
    @State private var showLaunch = true

    var body: some Scene {
        WindowGroup {
            ZStack {
                if showLaunch {
                    LaunchView()
                        .transition(.opacity)
                } else {
                    ContentView()
                        .environment(store)
                        .transition(.opacity)
                }
            }
            .preferredColorScheme(.dark)
            .onAppear { store.load() }
            .task {
                await store.applyPhase1PropertyMigrationIfNeeded()
            }
            .task {
                try? await Task.sleep(for: .seconds(1.8))
                withAnimation(.easeInOut(duration: 0.4)) {
                    showLaunch = false
                }
            }
        }
    }
}
