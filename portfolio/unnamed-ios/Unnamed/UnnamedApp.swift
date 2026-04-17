import SwiftUI

@main
struct UnnamedApp: App {
    @State private var store = AppStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .onAppear { store.load() }
                .preferredColorScheme(.dark)
        }
    }
}
