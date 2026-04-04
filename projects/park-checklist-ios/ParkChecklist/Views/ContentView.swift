import SwiftData
import SwiftUI

private struct SharePayload: Identifiable {
    let id = UUID()
    let url: URL
}

struct ContentView: View {
    @Query(sort: \ChecklistTaskItem.createdAt, order: .reverse)
    private var tasks: [ChecklistTaskItem]

    @AppStorage("chase_park_checklist_ios_cash") private var parkCash = 1000
    @AppStorage("chase_park_checklist_ios_readable") private var readableFonts = false

    @State private var showTemplates = false
    @State private var showSettings = false
    @State private var sharePayload: SharePayload?
    @State private var exportError: String?
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
                }
            }
            .navigationTitle("Park checklist")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(ParkTheme.woodLight.opacity(0.95), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.light, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    HStack(spacing: 10) {
                        Text("\(rating.emoji) \(rating.label)")
                            .font(ParkTheme.bodyFont(readable: readableFonts).weight(.semibold))
                            .foregroundStyle(ParkTheme.ink)
                            .lineLimit(1)
                            .minimumScaleFactor(0.7)
                        Text("$\(parkCash.formatted())")
                            .font(ParkTheme.bodyFont(readable: readableFonts).weight(.bold))
                            .foregroundStyle(ParkTheme.gold)
                            .monospacedDigit()
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
            .alert("Export failed", isPresented: Binding(
                get: { exportError != nil },
                set: { if !$0 { exportError = nil } }
            )) {
                Button("OK", role: .cancel) { exportError = nil }
            } message: {
                Text(exportError ?? "")
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
}
