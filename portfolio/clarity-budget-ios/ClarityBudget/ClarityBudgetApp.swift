import SwiftUI
import ClarityUI

@main
@MainActor
struct ClarityBudgetApp: App {
    @State private var store = BudgetStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .onAppear { store.load() }
                .task {
                    await BudgetSupabaseSync.pullIntoStore(store)
                }
        }
    }
}
