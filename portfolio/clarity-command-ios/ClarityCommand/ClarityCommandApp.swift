import SwiftUI
import ClarityUI

@main
struct ClarityCommandApp: App {
    @State private var store = CommandStore()
    @StateObject private var commandSync = CommandCloudSync()

    var body: some Scene {
        WindowGroup {
            ContentView(commandSync: commandSync)
                .environment(store)
                .onAppear {
                    store.load()
                    store.onPersisted = { [commandSync] in
                        commandSync.schedulePush(from: store)
                    }
                }
        }
    }
}
