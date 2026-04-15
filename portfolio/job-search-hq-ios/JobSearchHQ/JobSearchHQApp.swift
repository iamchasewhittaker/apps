import SwiftUI

@main
struct JobSearchHQApp: App {
    @State private var store = JobSearchStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .onAppear { store.load() }
        }
    }
}
