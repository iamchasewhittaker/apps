import Foundation

/// One menu command with an optional keyboard shortcut string.
struct MenuShortcut: Identifiable, Hashable, Sendable {
    var id: String { "\(menuPath.joined(separator: " › "))|\(title)|\(shortcut ?? "")" }
    /// Top-level menu names leading to this item, e.g. `["File", "Export"]`.
    let menuPath: [String]
    let title: String
    /// Human-readable shortcut, e.g. `⌘S`, or `nil` if none.
    let shortcut: String?

    /// First segment of `menuPath` (File, Edit, …) for grouping.
    var topLevelMenu: String {
        menuPath.first ?? "Other"
    }
}

struct MenuShortcutExtractionResult: Sendable {
    let shortcuts: [MenuShortcut]
    let errorMessage: String?
}
