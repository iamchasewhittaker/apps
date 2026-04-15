import SwiftUI
import ClarityUI

struct ApplicationEditorSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var draft: JobApplication
    let onCommit: (JobApplication) -> Void

    init(initial: JobApplication, onCommit: @escaping (JobApplication) -> Void) {
        _draft = State(initialValue: initial)
        self.onCommit = onCommit
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Role") {
                    TextField("Company", text: $draft.company)
                    TextField("Title", text: $draft.title)
                    Picker("Stage", selection: $draft.stage) {
                        ForEach(JobSearchConfig.stages, id: \.self) { s in
                            Text(s).tag(s)
                        }
                    }
                }
                Section("Tracking") {
                    TextField("Applied date (YYYY-MM-DD)", text: $draft.appliedDate)
                    TextField("Job URL", text: $draft.url)
                    TextField("Next step", text: $draft.nextStep)
                    TextField("Next step date", text: $draft.nextStepDate)
                    TextField("Next step type", text: $draft.nextStepType)
                }
                Section("Notes") {
                    TextField("Notes", text: $draft.notes, axis: .vertical)
                        .lineLimit(3 ... 8)
                }
            }
            .scrollContentBackground(.hidden)
            .background(JSHQTheme.background)
            .navigationTitle(draft.company.isEmpty && draft.title.isEmpty ? "New application" : "Edit application")
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
