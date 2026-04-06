import SwiftData
import SwiftUI
import UniformTypeIdentifiers

private struct SharePayload: Identifiable {
    let id = UUID()
    let url: URL
}

struct ContentView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \ChecklistTaskItem.createdAt, order: .reverse) private var tasks: [ChecklistTaskItem]
    @Query(sort: \ProfitLedgerEntry.createdAt, order: .reverse) private var ledger: [ProfitLedgerEntry]

    @AppStorage("chase_roller_task_tycoon_ios_cash") private var parkCash = 1000
    @AppStorage("chase_roller_task_tycoon_ios_readable") private var readableFonts = false

    @State private var selectedTab = 0
    @State private var attractionsStatusFocus: AttractionStatus?
    @State private var attractionsZoneFilter: ParkZone?

    @State private var showSettings = false
    @State private var showAddAttraction = false
    @State private var sharePayload: SharePayload?
    @State private var exportError: String?
    @State private var showImportPicker = false
    @State private var showImportConfirm = false
    @State private var pendingImport: BackupEnvelope?
    @State private var importError: String?
    @State private var toastText: String?

    var body: some View {
        ZStack {
            TabView(selection: $selectedTab) {
                OverviewConsoleView(
                    tasks: tasks,
                    ledger: ledger,
                    selectedTab: $selectedTab,
                    attractionsStatusFocus: $attractionsStatusFocus,
                    attractionsZoneFilter: $attractionsZoneFilter,
                    readableFonts: readableFonts,
                    onAddAttraction: { showAddAttraction = true },
                    onSettings: { showSettings = true }
                )
                .tabItem { Label("Overview", systemImage: "rectangle.grid.2x2") }
                .tag(0)

                ParkAttractionsView(
                    tasks: tasks,
                    parkCash: $parkCash,
                    statusFocus: $attractionsStatusFocus,
                    zoneFilter: $attractionsZoneFilter,
                    readableFonts: readableFonts,
                    onToast: showToast
                )
                .tabItem { Label("Attractions", systemImage: "square.stack.3d.up") }
                .tag(1)

                FinancesView(tasks: tasks, ledger: ledger, readableFonts: readableFonts)
                    .tabItem { Label("Finances", systemImage: "dollarsign.circle") }
                    .tag(2)
            }
            .tint(ParkTheme.wood)
            .safeAreaInset(edge: .bottom) {
                Button {
                    showAddAttraction = true
                } label: {
                    HStack(spacing: 8) {
                        Image(systemName: "plus.circle.fill")
                        Text("New Attraction")
                            .font(ParkTheme.bodyFont(readable: readableFonts).weight(.heavy))
                    }
                    .padding(.horizontal, 18)
                    .padding(.vertical, 12)
                    .background(ParkTheme.gold)
                    .foregroundStyle(ParkTheme.ink)
                    .clipShape(Capsule())
                    .shadow(color: .black.opacity(0.18), radius: 6, y: 2)
                }
                .buttonStyle(.plain)
                .padding(.bottom, 52)
            }
        }
        .preferredColorScheme(.light)
        .sheet(isPresented: $showSettings) {
            SettingsView(onExport: exportBackup, onImport: { showImportPicker = true })
        }
        .sheet(isPresented: $showAddAttraction) {
            AttractionEditorView(existing: nil, readableFonts: readableFonts) {
                showToast("🎢 New attraction added")
            }
        }
        .sheet(item: $sharePayload) { payload in
            ActivityShareView(items: [payload.url])
        }
        .fileImporter(
            isPresented: $showImportPicker,
            allowedContentTypes: [.json],
            allowsMultipleSelection: false
        ) { result in
            Task { @MainActor in
                switch result {
                case .success(let urls):
                    guard let url = urls.first else { return }
                    do {
                        let env = try BackupImporter.loadFromFile(url: url)
                        pendingImport = env
                        showImportConfirm = true
                    } catch {
                        importError = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
                    }
                case .failure(let err):
                    importError = err.localizedDescription
                }
            }
        }
        .alert("Replace all data?", isPresented: $showImportConfirm) {
            Button("Replace", role: .destructive) {
                if let env = pendingImport { applyImport(envelope: env) }
                pendingImport = nil
            }
            Button("Cancel", role: .cancel) { pendingImport = nil }
        } message: {
            Text("This removes every attraction, ledger entry, and your park cash, then loads the backup. You can't undo this.")
        }
        .alert("Export failed", isPresented: Binding(get: { exportError != nil }, set: { if !$0 { exportError = nil } })) {
            Button("OK", role: .cancel) { exportError = nil }
        } message: {
            Text(exportError ?? "")
        }
        .alert("Import failed", isPresented: Binding(get: { importError != nil }, set: { if !$0 { importError = nil } })) {
            Button("OK", role: .cancel) { importError = nil }
        } message: {
            Text(importError ?? "")
        }
        .overlay(alignment: .bottom) {
            if let toastText {
                Text(toastText)
                    .font(ParkTheme.bodyFont(readable: readableFonts).weight(.medium))
                    .foregroundStyle(ParkTheme.ink)
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(ParkTheme.plaque.opacity(0.95))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .shadow(color: .black.opacity(0.15), radius: 6, y: 2)
                    .padding(.bottom, 120)
                    .transition(.move(edge: .bottom).combined(with: .opacity))
            }
        }
        .animation(.easeInOut(duration: 0.25), value: toastText)
    }

    private func showToast(_ message: String) {
        toastText = message
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.6) {
            if toastText == message { toastText = nil }
        }
    }

    private func exportBackup() {
        let envelope = BackupExporter.buildEnvelope(cash: parkCash, items: tasks, ledger: ledger)
        do {
            let url = try BackupExporter.writeJSONFile(envelope: envelope)
            sharePayload = SharePayload(url: url)
        } catch {
            exportError = error.localizedDescription
        }
    }

    private func applyImport(envelope: BackupEnvelope) {
        do {
            parkCash = try ParkDataImport.replaceAll(envelope: envelope, modelContext: modelContext)
            showToast("Restored from backup")
        } catch {
            importError = (error as? LocalizedError)?.errorDescription ?? error.localizedDescription
        }
    }
}
