import SwiftUI

@main
struct ShipyardApp: App {
    @State private var store = FleetStore()
    @AppStorage("hasOnboarded") private var hasOnboarded = false
    @State private var showLaunch = true

    var body: some Scene {
        WindowGroup {
            Group {
                if !hasOnboarded {
                    OnboardingView()
                } else if showLaunch {
                    LaunchScreenView()
                        .task {
                            try? await Task.sleep(for: .seconds(0.9))
                            withAnimation { showLaunch = false }
                        }
                } else {
                    ContentView()
                }
            }
            .environment(store)
            .preferredColorScheme(.dark)
            .tint(Palette.steel)
            .task { await store.bootstrapSession() }
        }
    }
}
