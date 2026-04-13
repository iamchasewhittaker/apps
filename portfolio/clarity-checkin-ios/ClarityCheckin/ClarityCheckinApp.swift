import SwiftUI
import ClarityUI

@main
struct ClarityCheckinApp: App {
    @State private var store = CheckinStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .onAppear { store.load() }
        }
    }
}
