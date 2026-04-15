import AppKit
import Foundation

/// Some apps expose menus over Accessibility in ways that **block forever** or recurse badly
/// (many Electron apps, including Cursor). We skip them and show guidance instead of hanging.
enum AccessibilityIntrospectionPolicy {
    /// If non-nil, do not call `AXUIElement` for this app; show this message in the UI.
    static func skipReason(for app: NSRunningApplication) -> String? {
        guard let bid = app.bundleIdentifier?.lowercased() else {
            return heuristicSkipReason(app: app)
        }

        // Cursor and other Todesktop-wrapped Electron apps.
        if bid.hasPrefix("com.todesktop.") {
            return Self.electronMessage(named: app.localizedName ?? "This app")
        }

        if bid.contains("cursor") {
            return Self.electronMessage(named: app.localizedName ?? "Cursor")
        }

        // VS Code / forks — same class of issues as Cursor.
        if bid == "com.microsoft.vscode"
            || bid.hasPrefix("com.vscodium.")
            || bid.hasSuffix(".vscode") {
            return Self.electronMessage(named: app.localizedName ?? "This editor")
        }

        return heuristicSkipReason(app: app)
    }

    private static func heuristicSkipReason(app: NSRunningApplication) -> String? {
        let name = (app.localizedName ?? "").lowercased()
        if name == "cursor" {
            return Self.electronMessage(named: "Cursor")
        }
        let path = app.executableURL?.path.lowercased() ?? ""
        if path.contains("cursor.app") {
            return Self.electronMessage(named: "Cursor")
        }
        return nil
    }

    private static func electronMessage(named: String) -> String {
        """
        \(named) uses an Electron-style menu that often **hangs or breaks** when read through macOS Accessibility, so Shortcut Reference skips it.

        Switch to a **native app** (Notes, Safari, Mail) to see shortcuts, or use that app’s own shortcut help (e.g. Cursor: Command Palette / Keyboard Shortcuts).
        """
    }
}
