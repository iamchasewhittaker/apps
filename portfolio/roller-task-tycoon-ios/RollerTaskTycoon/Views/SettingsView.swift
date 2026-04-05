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
                    Text("RollerTask Tycoon — a park tycoon-style task list. Data stays on this device unless you export a backup. Import replaces all tasks and park cash from a JSON backup (schema v1 only).")
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
