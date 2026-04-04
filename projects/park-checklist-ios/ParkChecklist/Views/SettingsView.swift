import SwiftUI

struct SettingsView: View {
    @Environment(\.dismiss) private var dismiss
    @AppStorage("chase_park_checklist_ios_readable") private var readableFonts = false

    var body: some View {
        NavigationStack {
            Form {
                Section("Display") {
                    Toggle("Readable fonts (system)", isOn: $readableFonts)
                }
                Section("About") {
                    Text("Park Checklist — a tycoon-style task list. Data stays on this device unless you export a backup.")
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
