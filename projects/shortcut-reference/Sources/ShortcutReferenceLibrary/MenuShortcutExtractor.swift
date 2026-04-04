import AppKit
import ApplicationServices
import Foundation

/// Traverses another app’s Accessibility menu tree and collects shortcuts.
struct MenuShortcutExtractor: Sendable {
    private static let axMenu = String(kAXMenuRole as CFString)
    private static let axMenuItem = String(kAXMenuItemRole as CFString)

    func shortcuts(forPID pid: pid_t) -> MenuShortcutExtractionResult {
        var ctx = ExtractionContext()

        let appEl = AXUIElementCreateApplication(pid)
        guard ctx.allowAXCall() else {
            return .init(shortcuts: [], errorMessage: ctx.truncationMessage())
        }

        var menuBarRef: CFTypeRef?
        let barResult = AXUIElementCopyAttributeValue(appEl, kAXMenuBarAttribute as CFString, &menuBarRef)
        guard barResult == .success, let menuBar = castToAX(menuBarRef) else {
            return MenuShortcutExtractionResult(
                shortcuts: [],
                errorMessage: "Could not read the menu bar for this app (pid \(pid)). The app may block Accessibility."
            )
        }

        var collected: [MenuShortcut] = []
        for menu in axChildren(menuBar, ctx: &ctx) {
            let topTitle = axString(menu, kAXTitleAttribute as String, ctx: &ctx) ?? ""
            guard !topTitle.isEmpty else { continue }
            walk(element: menu, path: [topTitle], depth: 0, ctx: &ctx, into: &collected)
        }

        let unique = Dictionary(grouping: collected, by: \.id).compactMap { $0.value.first }
        let sorted = unique.sorted {
            ($0.menuPath.joined(), $0.title) < ($1.menuPath.joined(), $1.title)
        }
        return MenuShortcutExtractionResult(
            shortcuts: sorted,
            errorMessage: ctx.truncationMessage()
        )
    }

    // MARK: - Walking

    private func walk(
        element: AXUIElement,
        path: [String],
        depth: Int,
        ctx: inout ExtractionContext,
        into result: inout [MenuShortcut]
    ) {
        guard depth < ExtractionContext.maxDepth else {
            ctx.truncated = true
            return
        }
        guard ctx.markVisited(element) else { return }

        for child in axChildren(element, ctx: &ctx) {
            let role = axString(child, kAXRoleAttribute as String, ctx: &ctx)

            if role == Self.axMenu {
                walk(element: child, path: path, depth: depth + 1, ctx: &ctx, into: &result)
                continue
            }

            guard role == Self.axMenuItem else { continue }

            let title = axString(child, kAXTitleAttribute as String, ctx: &ctx) ?? ""
            if title.isEmpty { continue }

            let submenus = axChildren(child, ctx: &ctx).filter {
                axString($0, kAXRoleAttribute as String, ctx: &ctx) == Self.axMenu
            }
            if let submenu = submenus.first {
                walk(element: submenu, path: path + [title], depth: depth + 1, ctx: &ctx, into: &result)
                continue
            }

            let shortcut = shortcutString(for: child, ctx: &ctx)
            result.append(MenuShortcut(menuPath: path, title: title, shortcut: shortcut))
        }
    }

    // MARK: - Shortcut formatting

    private func shortcutString(for item: AXUIElement, ctx: inout ExtractionContext) -> String? {
        guard ctx.allowAXCall(), ctx.allowAXCall() else { return nil }

        var charRef: CFTypeRef?
        var modRef: CFTypeRef?
        _ = AXUIElementCopyAttributeValue(item, kAXMenuItemCmdCharAttribute as CFString, &charRef)
        _ = AXUIElementCopyAttributeValue(item, kAXMenuItemCmdModifiersAttribute as CFString, &modRef)

        let charString: String? = {
            if let s = charRef as? String, !s.isEmpty { return s }
            if let n = charRef as? NSNumber {
                let v = n.uint32Value
                if let scalar = UnicodeScalar(v) {
                    return String(Character(scalar))
                }
            }
            return nil
        }()

        guard let charString, !charString.isEmpty else { return nil }

        let modValue = (modRef as? NSNumber).map { $0.uint32Value } ?? 0
        return Self.formatModifiers(modValue) + charString.uppercased()
    }

    private static func formatModifiers(_ value: UInt32) -> String {
        let command = NSEvent.ModifierFlags.command.rawValue
        let shift = NSEvent.ModifierFlags.shift.rawValue
        let option = NSEvent.ModifierFlags.option.rawValue
        let control = NSEvent.ModifierFlags.control.rawValue

        let mask = UInt(value)
        if mask == 0 {
            return "⌘"
        }

        var parts: [String] = []
        if mask & control != 0 { parts.append("⌃") }
        if mask & option != 0 { parts.append("⌥") }
        if mask & shift != 0 { parts.append("⇧") }
        if mask & command != 0 { parts.append("⌘") }
        return parts.isEmpty ? "⌘" : parts.joined()
    }

    // MARK: - AX helpers

    private func castToAX(_ ref: CFTypeRef?) -> AXUIElement? {
        guard let ref else { return nil }
        let any = ref as AnyObject
        return unsafeBitCast(any, to: AXUIElement.self)
    }

    private func axChildren(_ element: AXUIElement, ctx: inout ExtractionContext) -> [AXUIElement] {
        guard ctx.allowAXCall() else { return [] }
        var ref: CFTypeRef?
        guard AXUIElementCopyAttributeValue(element, kAXChildrenAttribute as CFString, &ref) == .success else {
            return []
        }
        guard let array = ref as? NSArray else { return [] }
        var out: [AXUIElement] = []
        for idx in 0..<array.count {
            guard let obj = array.object(at: idx) as CFTypeRef? else { continue }
            out.append(unsafeBitCast(obj as AnyObject, to: AXUIElement.self))
        }
        return out
    }

    private func axString(_ element: AXUIElement, _ attribute: String, ctx: inout ExtractionContext) -> String? {
        guard ctx.allowAXCall() else { return nil }
        var ref: CFTypeRef?
        guard AXUIElementCopyAttributeValue(element, attribute as CFString, &ref) == .success else { return nil }
        return ref as? String
    }
}

// MARK: - Traversal limits

private struct ExtractionContext {
    /// Hard cap on AX calls per extraction (prevents runaway trees).
    static let maxAXCalls = 12_000
    static let maxDepth = 28

    private(set) var axCallCount = 0
    var truncated = false
    private var visitedHashes = Set<UInt>()

    mutating func allowAXCall() -> Bool {
        axCallCount += 1
        if axCallCount >= Self.maxAXCalls {
            truncated = true
            return false
        }
        return true
    }

    /// Returns `false` if this element was already entered (likely cycle).
    mutating func markVisited(_ element: AXUIElement) -> Bool {
        let h: UInt = CFHash(element as CFTypeRef)
        return visitedHashes.insert(h).inserted
    }

    func truncationMessage() -> String? {
        guard truncated else { return nil }
        return "Menu scan stopped early (too many items, very deep menus, or a cyclic tree). Showing partial results if any."
    }
}
