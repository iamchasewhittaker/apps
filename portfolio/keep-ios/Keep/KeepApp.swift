import SwiftUI

@main
@MainActor
struct KeepApp: App {
    @State private var store = KeepStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .onAppear { store.load() }
                .preferredColorScheme(.dark)
        }
    }
}
