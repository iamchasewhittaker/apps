import AppKit
import SwiftUI

struct ContentView: View {
    @ObservedObject var model: ShortcutReferenceModel
    @Binding var alwaysOnTop: Bool
    @State private var searchText = ""
    @State private var accessibilityDetailsExpanded = false

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 0) {
                activeAppHeader
                Divider()

                if !model.isTrusted {
                    accessibilitySection
                    Divider()
                }

                mainContent
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
            .navigationTitle("Shortcut Reference")
            .searchable(text: $searchText, prompt: "Search shortcuts")
            .toolbar {
                ToolbarItem(placement: .automatic) {
                    Toggle(isOn: $alwaysOnTop) {
                        Label("Keep on Top", systemImage: "pin.fill")
                    }
                    .toggleStyle(.button)
                    .help("Keep this window above normal windows (floating level)")
                }
                ToolbarItem(placement: .primaryAction) {
                    Button(action: { model.refreshNow() }) {
                        Label("Refresh", systemImage: "arrow.clockwise")
                    }
                    .disabled(!model.isTrusted)
                }
            }
        }
    }

    private var filteredShortcuts: [MenuShortcut] {
        let q = searchText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !q.isEmpty else { return model.shortcuts }
        return model.shortcuts.filter { item in
            let blob = (item.title + " " + item.menuPath.joined(separator: " ") + " " + (item.shortcut ?? ""))
            return blob.localizedStandardContains(q)
        }
    }

    /// Sorted sections: top-level menu name → items sorted by path + title.
    private var groupedShortcuts: [(section: String, items: [MenuShortcut])] {
        let grouped = Dictionary(grouping: filteredShortcuts) { $0.topLevelMenu }
        return grouped.keys.sorted { $0.localizedCaseInsensitiveCompare($1) == .orderedAscending }.map { key in
            let items = (grouped[key] ?? []).sorted {
                if $0.menuPath != $1.menuPath {
                    return $0.menuPath.lexicographicallyPrecedes($1.menuPath)
                }
                return $0.title.localizedStandardCompare($1.title) == .orderedAscending
            }
            return (key, items)
        }
    }

    private var activeAppHeader: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Frontmost application")
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(model.activeAppName)
                .font(.title2)
            if !model.activeAppBundleID.isEmpty {
                Text(model.activeAppBundleID)
                    .font(.caption)
                    .foregroundStyle(.tertiary)
                    .textSelection(.enabled)
            }
            if model.isTrusted {
                Text("Accessibility is on — shortcuts for that app appear below.")
                    .font(.caption2)
                    .foregroundStyle(.secondary)
            }
            #if DEBUG
            Text("If macOS keeps asking for Accessibility after every Xcode build: open the ShortcutReference target → Signing & Capabilities → select a **Team** (Personal Team is OK). Ad-hoc rebuilds look like a new app to macOS.")
                .font(.caption2)
                .foregroundStyle(.orange)
            #endif
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
        .background(Color(nsColor: .controlBackgroundColor))
    }

    @ViewBuilder
    private var accessibilitySection: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text(model.accessibilityOnboardingTitle)
                .font(.title3)
                .fontWeight(.semibold)

            Text(model.accessibilityOnboardingSubtitle)
                .font(.subheadline)
                .foregroundStyle(.secondary)
                .fixedSize(horizontal: false, vertical: true)

            VStack(alignment: .leading, spacing: 8) {
                ForEach(Array(model.accessibilityOnboardingSteps.enumerated()), id: \.offset) { index, step in
                    HStack(alignment: .top, spacing: 10) {
                        Text("\(index + 1).")
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .foregroundStyle(.secondary)
                            .frame(width: 22, alignment: .trailing)
                        Text(step)
                            .font(.subheadline)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
            }

            if let err = model.lastError {
                Text(err)
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }

            VStack(alignment: .leading, spacing: 10) {
                Button {
                    model.requestAccessibilityPermissionAndOpenSettings()
                } label: {
                    Label("Open Accessibility Settings", systemImage: "gearshape")
                }
                .buttonStyle(.borderedProminent)
                .controlSize(.large)

                HStack(spacing: 12) {
                    Button("Show app in Finder") {
                        model.revealBundledAppInFinder()
                    }
                    Button("Check permission again") {
                        model.recomputeAccessibilityTrust(andRefreshIfNewlyTrusted: true)
                    }
                }

                Button("Copy steps & details for support") {
                    model.copyAccessibilityDiagnosticsToPasteboard()
                }
                .buttonStyle(.borderless)
            }

            DisclosureGroup(isExpanded: $accessibilityDetailsExpanded) {
                VStack(alignment: .leading, spacing: 10) {
                    Text(model.accessibilityLaunchExplanation)
                        .font(.callout)
                        .fixedSize(horizontal: false, vertical: true)
                    LabeledContent("Executable path") {
                        Text(model.accessibilityProcessHint)
                            .font(.system(.caption2, design: .monospaced))
                            .textSelection(.enabled)
                    }
                }
                .padding(.top, 4)
            } label: {
                Text("More detail")
                    .font(.subheadline)
                    .fontWeight(.medium)
            }
        }
        .padding()
    }

    @ViewBuilder
    private var mainContent: some View {
        if !model.isTrusted {
            EmptyStateView(
                title: "Shortcuts will appear here",
                systemImage: "keyboard",
                message: "Use the steps above, then click Check permission again or quit and reopen."
            )
        } else if let error = model.lastError, model.isTrusted {
            EmptyStateView(
                title: "Couldn’t load shortcuts",
                systemImage: "exclamationmark.triangle",
                message: error
            )
        } else if model.shortcuts.isEmpty {
            EmptyStateView(
                title: "No shortcuts found",
                systemImage: "keyboard",
                message: "Switch to another app with a normal menu bar (e.g. Notes or Safari), or click Refresh. Cursor and some editors are skipped on purpose."
            )
        } else if filteredShortcuts.isEmpty {
            EmptyStateView(
                title: "No matches",
                systemImage: "magnifyingglass",
                message: "Nothing matches “\(searchText)”. Clear the search field or try different words."
            )
        } else {
            List {
                ForEach(groupedShortcuts, id: \.section) { group in
                    Section {
                        ForEach(group.items) { item in
                            shortcutRow(item)
                        }
                    } header: {
                        Text(group.section)
                            .font(.headline)
                            .foregroundStyle(.primary)
                    }
                }
            }
            .listStyle(.inset)
        }
    }

    private func shortcutRow(_ item: MenuShortcut) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                Text(item.title)
                    .font(.headline)
                if item.menuPath.count > 1 {
                    Text(item.menuPath.dropFirst().joined(separator: " › "))
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            Spacer(minLength: 8)
            if let shortcut = item.shortcut {
                Text(shortcut)
                    .font(.system(.body, design: .monospaced))
                    .multilineTextAlignment(.trailing)
            }
        }
        .padding(.vertical, 2)
        .contextMenu {
            if let s = item.shortcut {
                Button("Copy shortcut") {
                    copyToPasteboard(s)
                }
            }
            Button("Copy description") {
                copyToPasteboard(Self.describeRow(item))
            }
        }
    }

    private static func describeRow(_ item: MenuShortcut) -> String {
        let path = item.menuPath.joined(separator: " › ")
        if let s = item.shortcut {
            return "\(path): \(item.title) — \(s)"
        }
        return "\(path): \(item.title)"
    }

    private func copyToPasteboard(_ string: String) {
        NSPasteboard.general.clearContents()
        NSPasteboard.general.setString(string, forType: .string)
    }
}

/// Replaces `ContentUnavailableView` (macOS 14+) so the app runs on macOS 13.
private struct EmptyStateView: View {
    let title: String
    let systemImage: String
    let message: String

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: systemImage)
                .font(.system(size: 40))
                .foregroundStyle(.secondary)
            Text(title)
                .font(.title2)
            Text(message)
                .font(.callout)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 24)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .padding(.vertical, 32)
    }
}
