import SwiftUI
import ClarityUI

@main
struct ClarityTimeApp: App {
    @State private var store = TimeStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .onAppear { store.load() }
        }
    }
}
