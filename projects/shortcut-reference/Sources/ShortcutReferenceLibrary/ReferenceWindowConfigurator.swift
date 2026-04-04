import AppKit
import SwiftUI

/// `UserDefaults` key shared by the app shell and `ContentView` toolbar toggle.
public enum ReferenceWindowSettings {
    public static let alwaysOnTopKey = "dev.chase.shortcut-reference.window.alwaysOnTop"
}

/// Applies reference-panel window behavior to the hosting `NSWindow` (floating level, all spaces).
/// Uses a standard `NSWindow` with a high level; true `NSPanel` would require a custom app bootstrap.
struct ReferenceWindowConfigurator: NSViewRepresentable {
    @Binding var alwaysOnTop: Bool

    func makeNSView(context: Context) -> NSView {
        let view = WindowAttachmentView()
        view.onMoveToWindow = { [weak view] in
            guard let view else { return }
            Self.apply(alwaysOnTop: alwaysOnTop, to: view.window)
        }
        return view
    }

    func updateNSView(_ nsView: NSView, context: Context) {
        let top = alwaysOnTop
        if let view = nsView as? WindowAttachmentView {
            view.onMoveToWindow = { [weak view] in
                guard let view else { return }
                Self.apply(alwaysOnTop: top, to: view.window)
            }
        }
        DispatchQueue.main.async {
            Self.apply(alwaysOnTop: top, to: nsView.window)
        }
    }

    static func apply(alwaysOnTop: Bool, to window: NSWindow?) {
        guard let window else { return }

        if alwaysOnTop {
            window.level = .floating
            window.collectionBehavior.insert(.canJoinAllSpaces)
            window.collectionBehavior.insert(.fullScreenAuxiliary)
        } else {
            window.level = .normal
            window.collectionBehavior.remove(.canJoinAllSpaces)
            window.collectionBehavior.remove(.fullScreenAuxiliary)
        }
    }
}

/// Notifies when SwiftUI attaches the view to an `NSWindow` so level/behavior apply reliably.
private final class WindowAttachmentView: NSView {
    var onMoveToWindow: (() -> Void)?

    override func viewDidMoveToWindow() {
        super.viewDidMoveToWindow()
        onMoveToWindow?()
    }
}
