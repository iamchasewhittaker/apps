import SwiftUI
import ClarityUI

@main
struct ClarityTriageApp: App {
    @State private var store = TriageStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .onAppear { store.load() }
        }
    }
}
