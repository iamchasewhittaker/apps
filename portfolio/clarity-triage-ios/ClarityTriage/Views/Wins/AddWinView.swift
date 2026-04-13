import SwiftUI
import ClarityUI

@MainActor
struct AddWinView: View {
    @Environment(TriageStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var category: String = TriageConfig.winCategories[0]
    @State private var note: String = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Category") {
                    Picker("Category", selection: $category) {
                        ForEach(TriageConfig.winCategories, id: \.self) { value in
                            Text(TriageConfig.winCategoryLabels[value] ?? value).tag(value)
                        }
                    }
                }
                Section("Note (optional)") {
                    TextField("What happened?", text: $note, axis: .vertical)
                        .lineLimit(2...4)
                }
            }
            .scrollContentBackground(.hidden)
            .background(ClarityPalette.bg)
            .navigationTitle("Log Win")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        store.logWin(category: category, note: note)
                        dismiss()
                    }
                }
            }
        }
    }
}
