import SwiftUI
import ClarityUI

@main
struct ClarityBudgetApp: App {
    @State private var store = BudgetStore()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environment(store)
                .onAppear { store.load() }
        }
    }
}
