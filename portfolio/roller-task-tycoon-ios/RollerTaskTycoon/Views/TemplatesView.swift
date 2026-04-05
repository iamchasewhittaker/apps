import SwiftData
import SwiftUI

struct TemplatesView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext

    var readableFonts: Bool
    var onAdded: () -> Void

    var body: some View {
        NavigationStack {
            List {
                ForEach(TemplateLibrary.categories) { category in
                    Section(header: Text(category.name)
                        .font(ParkTheme.titleFont(readable: readableFonts))) {
                        ForEach(category.templates) { tpl in
                            Button {
                                add(tpl.title)
                            } label: {
                                Text(tpl.title)
                                    .font(ParkTheme.bodyFont(readable: readableFonts))
                                    .foregroundStyle(ParkTheme.ink)
                            }
                        }
                    }
                }
            }
            .navigationTitle("Templates")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    private func add(_ title: String) {
        modelContext.insert(ChecklistTaskItem(text: title))
        try? modelContext.save()
        onAdded()
        dismiss()
    }
}
