import SwiftUI

/// Main window content for both the SwiftPM CLI and the bundled `.app`.
public struct ShortcutReferenceRootView: View {
    @StateObject private var model = ShortcutReferenceModel()
    @AppStorage(ReferenceWindowSettings.alwaysOnTopKey) private var alwaysOnTop = true

    public init() {}

    public var body: some View {
        ContentView(model: model, alwaysOnTop: $alwaysOnTop)
            .frame(minWidth: 420, minHeight: 480)
            .background(ReferenceWindowConfigurator(alwaysOnTop: $alwaysOnTop))
            .task {
                guard !model.isTrusted else { return }
                // Apple’s trust API + toggling the switch in Settings is required; we open Settings for you.
                model.requestAccessibilityPermission()
                try? await Task.sleep(nanoseconds: 650_000_000)
                guard !model.isTrusted else { return }
                model.openAccessibilityPrivacyPane()
            }
    }
}
