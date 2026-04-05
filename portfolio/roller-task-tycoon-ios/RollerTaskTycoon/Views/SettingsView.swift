import SwiftUI

struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @AppStorage("chase_roller_task_tycoon_ios_readable") private var readableFonts = false

    var body: some View {
        NavigationStack {
            Form {
                Section("Display") {
                    Toggle("Readable fonts (system)", isOn: $readableFonts)
                }
                Section("About") {
                    Text("RollerTask Tycoon — park operations console for your real life. Data stays on this device unless you export a backup. Import replaces attractions, subtasks, ledger entries, and park cash from JSON (schema v1 or v2).")
                        .font(.footnote)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
}
