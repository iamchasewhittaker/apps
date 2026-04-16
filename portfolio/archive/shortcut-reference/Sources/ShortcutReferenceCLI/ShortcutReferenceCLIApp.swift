import ShortcutReferenceLibrary
import SwiftUI

@main
struct ShortcutReferenceCLIApp: App {
    @AppStorage(ReferenceWindowSettings.alwaysOnTopKey) private var alwaysOnTop = true

    var body: some Scene {
        WindowGroup {
            ShortcutReferenceRootView()
        }
        .commands {
            CommandGroup(replacing: .newItem) {}
            CommandMenu("Window") {
                Toggle("Keep on Top", isOn: $alwaysOnTop)
                    .keyboardShortcut("t", modifiers: [.command, .shift])
            }
        }
    }
}
