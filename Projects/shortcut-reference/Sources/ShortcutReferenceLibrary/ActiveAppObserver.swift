import AppKit
import Combine
import Foundation

/// Publishes the frontmost app whenever macOS activates a different app.
final class ActiveAppObserver: NSObject, ObservableObject {
    @Published private(set) var frontmostApplication: NSRunningApplication?

    private var workspaceObservation: NSObjectProtocol?

    override init() {
        super.init()
    }

    func start() {
        guard workspaceObservation == nil else { return }

        workspaceObservation = NSWorkspace.shared.notificationCenter.addObserver(
            forName: NSWorkspace.didActivateApplicationNotification,
            object: nil,
            queue: .main
        ) { [weak self] notification in
            guard
                let app = notification.userInfo?[NSWorkspace.applicationUserInfoKey] as? NSRunningApplication
            else { return }
            self?.frontmostApplication = app
        }

        frontmostApplication = NSWorkspace.shared.frontmostApplication
    }

    deinit {
        if let workspaceObservation {
            NSWorkspace.shared.notificationCenter.removeObserver(workspaceObservation)
        }
    }
}
