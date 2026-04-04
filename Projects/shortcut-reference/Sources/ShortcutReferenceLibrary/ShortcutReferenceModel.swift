import AppKit
import ApplicationServices
import Combine
import Foundation

private enum AccessibilityLaunchContext {
    case xcodePreviews
    case appBundle(developmentBuild: Bool)
    case swiftPackageCLI
    case fallback
}

@MainActor
final class ShortcutReferenceModel: ObservableObject {
    @Published private(set) var activeAppName: String = "—"
    @Published private(set) var activeAppBundleID: String = ""
    @Published private(set) var shortcuts: [MenuShortcut] = []
    @Published private(set) var lastError: String?
    @Published private(set) var isTrusted: Bool = AXIsProcessTrusted()

    private var selfExecutablePath: String {
        NSRunningApplication.current.executableURL?.path
            ?? ProcessInfo.processInfo.arguments.first
            ?? "(unknown executable)"
    }

    private var selfBundlePath: String {
        let p = Bundle.main.bundleURL.path
        if !p.isEmpty, p != "/" { return p }
        return "(no .app bundle — command-line or tool)"
    }

    /// One line for the sidebar; full story is in `accessibilityLaunchExplanation` and diagnostics.
    var accessibilityProcessHint: String { selfExecutablePath }

    private var accessibilityLaunchContext: AccessibilityLaunchContext {
        let exe = selfExecutablePath
        let env = ProcessInfo.processInfo.environment

        if env["XCODE_RUNNING_FOR_PREVIEWS"] == "1" {
            return .xcodePreviews
        }
        if exe.contains(".app/Contents/MacOS/") {
            let devBuild = exe.contains("/build/") || exe.contains("/Build/") || exe.contains("DerivedData")
                || env["__XCODE_BUILT_PRODUCTS_DIR_PATHS"] != nil
            return .appBundle(developmentBuild: devBuild)
        }
        if exe.contains("/.build/") {
            return .swiftPackageCLI
        }
        return .fallback
    }

    /// Short headline for the onboarding card.
    var accessibilityOnboardingTitle: String {
        "Allow Shortcut Reference to read menus"
    }

    /// One friendly sentence under the title.
    var accessibilityOnboardingSubtitle: String {
        switch accessibilityLaunchContext {
        case .xcodePreviews:
            return "SwiftUI Previews don’t get Accessibility the same way a normal run does."
        case .appBundle(let dev):
            return dev
                ? "Turn on this app in System Settings—not just Xcode—so macOS can read other apps’ menus for you."
                : "macOS needs to allow Shortcut Reference once; then it can list shortcuts for whichever app is in front."
        case .swiftPackageCLI:
            return "This copy runs inside your terminal. macOS grants permission to Terminal (or your IDE), not to a separate Shortcut Reference entry."
        case .fallback:
            return "Without this permission, Shortcut Reference can’t see the front app’s menu bar."
        }
    }

    /// Numbered flow shown before actions; tailored to how this process was launched.
    var accessibilityOnboardingSteps: [String] {
        switch accessibilityLaunchContext {
        case .xcodePreviews:
            return [
                "Stop relying on the SwiftUI Canvas preview for this check.",
                "In Xcode, use Product → Run with the ShortcutReference scheme.",
                "When the real app window opens, follow the Accessibility steps there if macOS still blocks menu reading."
            ]
        case .appBundle(let dev):
            var steps = [
                "When Shortcut Reference isn’t trusted yet, this app opens System Settings to the Accessibility list for you (or use the button below)."
            ]
            if dev {
                steps.append(
                    "Turn ON “Shortcut Reference” for this .app. If it’s missing, click + and add the same app you run—use “Show app in Finder” here so you pick the right file. Turning on “Xcode” alone does not enable this built .app."
                )
            } else {
                steps.append(
                    "Turn ON “Shortcut Reference”. If it’s missing, use + and choose this app (or “Show app in Finder” below)."
                )
            }
            steps.append("Come back to this window, click Check permission again, or quit and reopen the app.")
            return steps
        case .swiftPackageCLI:
            return [
                "System Settings should open to Accessibility; if not, use the button below.",
                "Turn ON the app that launched this window: Terminal, iTerm, Cursor, or your editor’s integrated terminal.",
                "Click Check permission again here, or quit and run swift run again."
            ]
        case .fallback:
            return [
                "System Settings should open to Accessibility; if not, use the button below.",
                "If you use the .app, turn ON Shortcut Reference; if you use swift run, turn ON your terminal app.",
                "Click Check permission again or quit and reopen."
            ]
        }
    }

    /// Guesses how you launched this build so you don’t need to know “Xcode vs Terminal.”
    var accessibilityLaunchExplanation: String {
        switch accessibilityLaunchContext {
        case .xcodePreviews:
            return "This copy is running under Xcode SwiftUI Previews. Previews often fail Accessibility checks. Use Product → Run on the ShortcutReference scheme instead."
        case .appBundle(let dev):
            if dev {
                return """
You’re running the ShortcutReference.app that Xcode (or xcodebuild) built. The process that calls Accessibility is this app, not Xcode—so turn ON “ShortcutReference” in the list. “Xcode” alone is usually not enough.

If ShortcutReference isn’t listed: click + in Accessibility, then use “Show app in Finder” below and drag the app in, or select it from the sheet.

If ShortcutReference is ON but this message stays: turn it OFF then ON, or remove it and add it again (rebuilds can confuse macOS until you re-toggle).
"""
            }
            return "You’re running ShortcutReference.app (for example from /Applications). In Accessibility, turn ON “ShortcutReference”."
        case .swiftPackageCLI:
            return "This copy was started from the terminal (for example swift run). In Accessibility, turn ON the terminal app you used: Terminal, iTerm, Cursor, or the integrated terminal in your editor—not ShortcutReference unless you’re using the .app."
        case .fallback:
            return "Turn ON “ShortcutReference” if you use the .app, or your terminal app if you use swift run. Use “Copy steps & details” for more."
        }
    }

    /// Full text for the pasteboard (support, or reading slowly).
    var accessibilityDiagnosticsText: String {
        let app = NSRunningApplication.current
        let name = app.localizedName ?? "?"
        let bid = app.bundleIdentifier ?? "(none)"
        let trustedNow = AXIsProcessTrusted() ? "yes" : "no"
        let fromXcodeTools = ProcessInfo.processInfo.environment["XCODE_VERSION_ACTUAL"] != nil ? "yes" : "no"
        let resetBid = app.bundleIdentifier ?? "dev.chase.shortcut-reference"

        return """
        Shortcut Reference — Accessibility help
        =======================================
        macOS says Accessibility is ON for this process: \(trustedNow)

        What to do (macOS Ventura / Sonoma / Sequoia):
        1) System Settings → Privacy & Security → Accessibility.
        2) For a built .app (your path ends in ShortcutReference.app/.../MacOS/...): turn ON “ShortcutReference”. Enabling “Xcode” alone is usually NOT enough.
        3) If ShortcutReference is missing: click + and add the .app (use “Show app in Finder” in the app’s sidebar).
        4) If it’s ON but still “no”: turn ShortcutReference OFF then ON, or remove it and add again. Rebuilds often need this.
        5) Return here and tap “Check permission again”. Quit and reopen if needed.

        How you’re running (our best guess):
        \(accessibilityLaunchExplanation)

        Details macOS uses to match the list:
        • Menu bar / Dock name: \(name)
        • Bundle ID: \(bid)
        • Bundle folder: \(selfBundlePath)
        • Executable: \(selfExecutablePath)
        • Xcode toolchain in environment: \(fromXcodeTools)

        Last resort (Terminal.app — resets Accessibility for this bundle ID only):
        tccutil reset Accessibility \(resetBid)
        Then reopen Shortcut Reference and enable it when asked.

        ────────────────────────────────────────
        PERMISSIONS KEEP RESETTING?
        Each time you ⌘R in Xcode, the built app is **re-signed**. With **ad-hoc** signing (no Team / “Sign to Run Locally” only), macOS often treats it like a **new app** and asks for Accessibility again.

        Fix: Xcode → target ShortcutReference → **Signing & Capabilities** → pick a **Team** (free Apple ID “Personal Team” is fine). That uses a **stable** Apple Development certificate so TCC stops churning.

        For sharing with others, use **Developer ID Application** + notarization (Release archive)—same idea: one stable identity per version.

        ────────────────────────────────────────
        STILL “no” AFTER YOU TURNED IT ON?
        • The switch must be for THIS exact .app. In Finder, select ShortcutReference.app → hold Option and choose File → Show Enclosing Folder until you see the full path. It must match “Bundle folder” above (same folder, same file).
        • If you have more than one copy (Desktop, dist/, build/Debug/), remove ALL “ShortcutReference” rows from Accessibility, then add ONLY the one you double-click.
        • Quit Shortcut Reference completely (ShortcutReference → Quit). Run in Terminal.app:
          tccutil reset Accessibility dev.chase.shortcut-reference
          Reopen the .app from Finder, accept any prompt, turn it ON in Settings again, quit and reopen once more.
        • Xcode: target ShortcutReference → Signing & Capabilities → pick a Team. An empty Team makes each rebuild look like a new app to macOS.
        • After reset, a Mac restart sometimes clears a stuck TCC state (rare).
        """
    }

    /// Opens **System Settings → Privacy & Security → Accessibility** (same target as the onboarding button).
    func openAccessibilityPrivacyPane() {
        guard let url = URL(string: "x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility") else { return }
        NSWorkspace.shared.open(url)
    }

    /// Runs the trust check, shows Apple’s system dialog **once per install**, then opens the Accessibility pane.
    func requestAccessibilityPermissionAndOpenSettings() {
        requestAccessibilityPermission()
        openAccessibilityPrivacyPane()
    }

    /// Opens a Finder window with this .app selected (for Accessibility “+” picker).
    func revealBundledAppInFinder() {
        let url = Bundle.main.bundleURL
        guard url.pathExtension.lowercased() == "app", FileManager.default.fileExists(atPath: url.path) else { return }
        NSWorkspace.shared.activateFileViewerSelecting([url])
    }

    func copyAccessibilityDiagnosticsToPasteboard() {
        NSPasteboard.general.clearContents()
        NSPasteboard.general.setString(accessibilityDiagnosticsText, forType: .string)
    }

    private let extractor = MenuShortcutExtractor()
    private let observer = ActiveAppObserver()
    private var cancellables = Set<AnyCancellable>()
    private var refreshTask: Task<Void, Never>?
    private var trustPoll: AnyCancellable?

    /// Persisted so we don’t show Apple’s blocking trust dialog on **every** cold launch.
    private static let accessibilityApplePromptShownKey = "dev.chase.shortcut-reference.accessibility-apple-prompt-shown"

    init() {
        observer.$frontmostApplication
            .receive(on: RunLoop.main)
            .sink { [weak self] app in
                self?.handleFrontmostChange(app)
            }
            .store(in: &cancellables)

        NotificationCenter.default.publisher(for: NSApplication.didBecomeActiveNotification)
            .receive(on: RunLoop.main)
            .sink { [weak self] _ in
                self?.recomputeAccessibilityTrust(andRefreshIfNewlyTrusted: true)
            }
            .store(in: &cancellables)

        observer.start()
        if let app = NSWorkspace.shared.frontmostApplication {
            handleFrontmostChange(app)
        }

        if !isTrusted {
            startTrustPollingIfNeeded()
        }
    }

    /// Re-read TCC after returning from System Settings (or any app activation).
    func recomputeAccessibilityTrust(andRefreshIfNewlyTrusted: Bool) {
        let wasTrusted = isTrusted
        isTrusted = AXIsProcessTrusted()
        if isTrusted {
            trustPoll?.cancel()
            trustPoll = nil
            if !wasTrusted, andRefreshIfNewlyTrusted {
                lastError = nil
                refreshShortcuts()
            }
        } else {
            startTrustPollingIfNeeded()
        }
    }

    private func startTrustPollingIfNeeded() {
        guard !isTrusted else { return }
        guard trustPoll == nil else { return }
        trustPoll = Timer.publish(every: 1.25, tolerance: 0.35, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                self?.recomputeAccessibilityTrust(andRefreshIfNewlyTrusted: true)
            }
    }

    func requestAccessibilityPermission() {
        let showApplePrompt = !UserDefaults.standard.bool(forKey: Self.accessibilityApplePromptShownKey)
        let options = [kAXTrustedCheckOptionPrompt.takeUnretainedValue() as String: showApplePrompt] as CFDictionary
        AXIsProcessTrustedWithOptions(options)
        if showApplePrompt {
            UserDefaults.standard.set(true, forKey: Self.accessibilityApplePromptShownKey)
        }
        recomputeAccessibilityTrust(andRefreshIfNewlyTrusted: true)
        startTrustPollingIfNeeded()
    }

    func refreshNow() {
        refreshShortcuts()
    }

    private func handleFrontmostChange(_ app: NSRunningApplication?) {
        guard let app else {
            activeAppName = "—"
            activeAppBundleID = ""
            shortcuts = []
            return
        }

        activeAppName = app.localizedName ?? app.bundleURL?.lastPathComponent ?? "Unknown"
        activeAppBundleID = app.bundleIdentifier ?? ""

        scheduleRefresh(pid: app.processIdentifier)
    }

    private func scheduleRefresh(pid: pid_t) {
        refreshTask?.cancel()
        refreshTask = Task { [weak self] in
            try? await Task.sleep(nanoseconds: 200_000_000)
            guard !Task.isCancelled else { return }
            await self?.refreshShortcutsAsync(pid: pid)
        }
    }

    private func refreshShortcuts() {
        guard let app = NSWorkspace.shared.frontmostApplication else { return }
        Task { await refreshShortcutsAsync(pid: app.processIdentifier) }
    }

    private func refreshShortcutsAsync(pid: pid_t) async {
        recomputeAccessibilityTrust(andRefreshIfNewlyTrusted: false)
        guard isTrusted else {
            lastError = "Accessibility permission required. Enable the app below, then return here—the list updates automatically."
            shortcuts = []
            return
        }

        lastError = nil

        if let app = NSRunningApplication(processIdentifier: pid),
           let reason = AccessibilityIntrospectionPolicy.skipReason(for: app) {
            shortcuts = []
            lastError = reason
            return
        }

        // Let the first frame commit before a potentially heavy menu walk.
        await Task.yield()

        // Accessibility calls must run on the main thread. Using `Task.detached` here
        // commonly deadlocks with WindowServer and leaves the app frozen.
        let result = extractor.shortcuts(forPID: pid)

        shortcuts = result.shortcuts
        if let message = result.errorMessage {
            lastError = message
        }
    }
}
