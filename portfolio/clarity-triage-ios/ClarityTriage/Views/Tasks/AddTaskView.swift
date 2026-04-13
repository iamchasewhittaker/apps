import SwiftUI
import ClarityUI

@MainActor
struct AddTaskView: View {
    @Environment(TriageStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var title: String = ""
    @State private var category: String = TriageConfig.categories[0]
    @State private var size: String = TriageConfig.sizes[0]

    var body: some View {
        NavigationStack {
            Form {
                Section("Task") {
                    TextField("Title", text: $title)
                        .textInputAutocapitalization(.sentences)
                }

                Section("Category") {
                    Picker("Category", selection: $category) {
                        ForEach(TriageConfig.categories, id: \.self) { value in
                            Text(TriageConfig.categoryLabels[value] ?? value).tag(value)
                        }
                    }
                }

                Section("Size") {
                    Picker("Size", selection: $size) {
                        ForEach(TriageConfig.sizes, id: \.self) { value in
                            Text(TriageConfig.sizeLabels[value] ?? value).tag(value)
                        }
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(ClarityPalette.bg)
            .navigationTitle("Add Task")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        store.addTask(title: title, category: category, size: size)
                        dismiss()
                    }
                    .disabled(title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
    }
}
