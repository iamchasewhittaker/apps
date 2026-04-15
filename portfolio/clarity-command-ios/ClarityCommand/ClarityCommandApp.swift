import SwiftUI
import ClarityUI

@main
struct ClarityCommandApp: App {
    @State private var store = CommandStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .onAppear { store.load() }
        }
    }
}
