import SwiftUI
import ClarityUI

struct ContactEditorSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var draft: JobContact
    let onCommit: (JobContact) -> Void

    init(initial: JobContact, onCommit: @escaping (JobContact) -> Void) {
        _draft = State(initialValue: initial)
        self.onCommit = onCommit
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Person") {
                    TextField("Name", text: $draft.name)
                    TextField("Company", text: $draft.company)
                    TextField("Role", text: $draft.role)
                }
                Section("Reach") {
                    TextField("Email", text: $draft.email)
                        .textContentType(.emailAddress)
                        .keyboardType(.emailAddress)
                    TextField("LinkedIn", text: $draft.linkedin)
                }
                Section("Outreach") {
                    Picker("Status", selection: $draft.outreachStatus) {
                        Text("No outreach").tag("none")
                        Text("Sent").tag("sent")
                        Text("Replied").tag("replied")
                        Text("Meeting").tag("meeting")
                        Text("Intro made").tag("intro_made")
                    }
                    TextField("Outreach date (YYYY-MM-DD)", text: $draft.outreachDate)
                    Toggle("Hiring signal", isOn: $draft.isHiring)
                }
                Section("Notes") {
                    TextField("Notes", text: $draft.notes, axis: .vertical)
                        .lineLimit(3 ... 8)
                }
            }
            .scrollContentBackground(.hidden)
            .background(JSHQTheme.background)
            .navigationTitle(draft.name.isEmpty ? "New contact" : "Edit contact")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        onCommit(draft)
                        dismiss()
                    }
                    .fontWeight(.semibold)
                }
            }
        }
        .presentationDetents([.medium, .large])
    }
}
