import SwiftData
import SwiftUI
import UniformTypeIdentifiers

private struct SharePayload: Identifiable {
    let id = UUID()
    let url: URL
}

struct ContentView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \ChecklistTaskItem.createdAt, order: .reverse)
    private var tasks: [ChecklistTaskItem]

    @AppStorage("chase_roller_task_tycoon_ios_cash") private var parkCash = 1000
    @AppStorage("chase_roller_task_tycoon_ios_readable") private var readableFonts = false

    @State private var showTemplates = false
    @State private var showSettings = false
    @State private var sharePayload: SharePayload?
    @State private var exportError: String?
    @State private var showImportPicker = false
    @State private var showImportConfirm = false
    @State private var pendingImport: BackupEnvelope?
    @State private var importError: String?
    @State private var toastText: String?

    private var rating: GameFlavor.Rating {
        let total = tasks.count
        let done = tasks.filter(\.isDone).count
        return GameFlavor.rating(total: total, done: done)
    }

    var body: some View {
        NavigationStack {
            ZStack {
                ParkTheme.parkBackground
                    .ignoresSafeArea()

                VStack(spacing: 0) {
                    statusBanner
                        .padding(.horizontal, 16)
                        .padding(.top, 8)

                    ChecklistView(
                        tasks: tasks,
                        parkCash: $parkCash,
                        readableFonts: readableFonts,
                        onToast: showToast
                    )
                    .padding(.horizontal, 12)
                    .padding(.vertical, 8)
                    .safeAreaPadding(.bottom, 6)
                }
                // NavigationStack does not always give children a bounded max height; without
                // this, List can collapse and the scene can look like a black/empty window.
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
            }
            .navigationTitle("RollerTask Tycoon")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(ParkTheme.woodLight.opacity(0.95), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.light, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    // Two lines: narrow phones clip a single wide HStack next to three trailing buttons.
                    VStack(alignment: .leading, spacing: 2) {
                        Text("$\(parkCash.formatted())")
                            .font(ParkTheme.bodyFont(readable: readableFonts).weight(.bold))
                            .foregroundStyle(ParkTheme.gold)
                            .monospacedDigit()
                            .lineLimit(1)
                            .minimumScaleFactor(0.75)
                        Text("\(rating.emoji) \(rating.label)")
                            .font(ParkTheme.bodyFont(readable: readableFonts).weight(.semibold))
                            .foregroundStyle(ParkTheme.ink)
                            .lineLimit(1)
                            .minimumScaleFactor(0.55)
                    }
                }
                ToolbarItemGroup(placement: .topBarTrailing) {
                    Button {
                        showTemplates = true
                    } label: {
                        Image(systemName: "list.bullet.rectangle")
                            .fontWeight(.semibold)
                            .foregroundStyle(ParkTheme.ink)
                    }
                    .accessibilityLabel("Templates")

                    Button {
                        exportBackup()
                    } label: {
                        Image(systemName: "square.and.arrow.up")
                            .fontWeight(.semibold)
                            .foregroundStyle(ParkTheme.ink)
                    }
                    .accessibilityLabel("Export backup")

                    Button {
                        showImportPicker = true
                    } label: {
                        Image(systemName: "square.and.arrow.down")
                            .fontWeight(.semibold)
                            .foregroundStyle(ParkTheme.ink)
                    }
                    .accessibilityLabel("Import backup")

                    Button {
                        showSettings = true
                    } label: {
                        Image(systemName: "gearshape")
                            .fontWeight(.semibold)
                            .foregroundStyle(ParkTheme.ink)
                    }
                    .accessibilityLabel("Settings")
                }
            }
            .sheet(isPresented: $showTemplates) {
                TemplatesView(readableFonts: readableFonts) {
                    showToast("📋 Added from template")
                }
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
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
                    if let env = pendingImport {
                        applyImport(envelope: env)
                    }
                    pendingImport = nil
                }
                Button("Cancel", role: .cancel) {
                    pendingImport = nil
                }
            } message: {
                Text("This removes every task and your park cash, then loads the backup. You can’t undo this.")
            }
            .alert("Export failed", isPresented: Binding(
                get: { exportError != nil },
                set: { if !$0 { exportError = nil } }
            )) {
                Button("OK", role: .cancel) { exportError = nil }
            } message: {
                Text(exportError ?? "")
            }
            .alert("Import failed", isPresented: Binding(
                get: { importError != nil },
                set: { if !$0 { importError = nil } }
            )) {
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
                        .padding(.bottom, 28)
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                }
            }
            .animation(.easeInOut(duration: 0.25), value: toastText)
            // UI uses fixed light palette; in Dark Appearance nav/content can read as empty.
            .preferredColorScheme(.light)
        }
    }

    private var statusBanner: some View {
        let total = tasks.count
        let done = tasks.filter(\.isDone).count
        let line: String
        if total == 0 {
            line = "Park open — waiting for visitors"
        } else if done == total {
            line = "🏆 All tasks complete! Tycoon status!"
        } else {
            line = "\(total - done) task(s) remaining in the park · \(done)/\(total) complete"
        }
        return Text(line)
            .font(ParkTheme.bodyFont(readable: readableFonts))
            .foregroundStyle(ParkTheme.ink)
            .multilineTextAlignment(.leading)
            .fixedSize(horizontal: false, vertical: true)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(12)
            .background(ParkTheme.plaque.opacity(0.92))
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(ParkTheme.wood.opacity(0.5), lineWidth: 2)
            )
    }

    private func showToast(_ message: String) {
        toastText = message
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.6) {
            if toastText == message {
                toastText = nil
            }
        }
    }

    private func exportBackup() {
        let envelope = BackupExporter.buildEnvelope(cash: parkCash, items: tasks)
        do {
            let url = try BackupExporter.writeJSONFile(envelope: envelope)
            sharePayload = SharePayload(url: url)
        } catch {
            exportError = error.localizedDescription
        }
    }

    private func applyImport(envelope: BackupEnvelope) {
        let iso = ISO8601DateFormatter()
        iso.formatOptions = [.withInternetDateTime]
        let toRemove = Array(tasks)
        for item in toRemove {
            modelContext.delete(item)
        }
        for row in envelope.tasks {
            guard let id = UUID(uuidString: row.id),
                  let created = iso.date(from: row.createdAt) else { continue }
            let newItem = ChecklistTaskItem(id: id, text: row.text, isDone: row.isDone, createdAt: created)
            modelContext.insert(newItem)
        }
        parkCash = max(0, envelope.cash)
        do {
            try modelContext.save()
            showToast("Restored from backup")
        } catch {
            importError = error.localizedDescription
        }
    }
}
