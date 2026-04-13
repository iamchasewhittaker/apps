import SwiftUI
import ClarityUI

@main
struct ClarityGrowthApp: App {
    @State private var store = GrowthStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .onAppear { store.load() }
        }
    }
}
