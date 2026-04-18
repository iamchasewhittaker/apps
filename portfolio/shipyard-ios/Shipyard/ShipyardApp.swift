import SwiftUI

@main
struct ShipyardApp: App {
    @State private var store = FleetStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .preferredColorScheme(.dark)
                .tint(Palette.gold)
        }
    }
}
