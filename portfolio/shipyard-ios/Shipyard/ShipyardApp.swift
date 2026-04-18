import SwiftUI

@main
struct ShipyardApp: App {
    @State private var store = FleetStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .onAppear { store.loadMockFleet() }
                .preferredColorScheme(.dark)
                .tint(Palette.gold)
        }
    }
}
