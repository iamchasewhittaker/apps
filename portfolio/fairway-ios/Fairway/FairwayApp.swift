import SwiftUI

@main
struct FairwayApp: App {
    @State private var store = FairwayStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .preferredColorScheme(.dark)
                .onAppear { store.load() }
        }
    }
}
