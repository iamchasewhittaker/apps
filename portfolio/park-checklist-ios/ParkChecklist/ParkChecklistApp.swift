import SwiftData
import SwiftUI

@main
struct ParkChecklistApp: App {
    var sharedModelContainer: ModelContainer = {
        let schema = Schema([ChecklistTaskItem.self])
        let configuration = ModelConfiguration(schema: schema, isStoredInMemoryOnly: false)
        do {
            return try ModelContainer(for: schema, configurations: [configuration])
        } catch {
            fatalError("Could not create ModelContainer: \(error)")
        }
    }()

    var body: some Scene {
        WindowGroup {
            // Attach SwiftData here (not only on WindowGroup) so @Query and modelContext
            // reliably receive the container on device; avoids blank first screen.
            ContentView()
                .modelContainer(sharedModelContainer)
        }
    }
}
