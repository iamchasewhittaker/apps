import SwiftUI

private enum RowMode { case view, edit, confirmDelete }

private struct InboxRowView: View {
    @Environment(AppStore.self) private var store
    let item: Item

    @State private var mode: RowMode = .view
    @State private var editText = ""
    @State private var revertTask: Task<Void, Never>? = nil

    var body: some View {
        Group {
            switch mode {
            case .view:
                HStack(spacing: 0) {
                    Text(item.text)
                        .foregroundStyle(.white)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.vertical, 2)

                    Button {
                        editText = item.text
                        mode = .edit
                    } label: {
                        Image(systemName: "pencil")
                            .foregroundStyle(Color(.systemGray))
                            .frame(width: 44, height: 44)
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Edit \"\(item.text)\"")

                    Button {
                        revertTask?.cancel()
                        mode = .confirmDelete
                        revertTask = Task {
                            try? await Task.sleep(nanoseconds: 3_000_000_000)
                            if !Task.isCancelled { mode = .view }
                        }
                    } label: {
                        Image(systemName: "trash")
                            .foregroundStyle(Color(.systemGray))
                            .frame(width: 44, height: 44)
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Delete \"\(item.text)\"")
                }

            case .edit:
                HStack(spacing: 8) {
                    TextField("", text: $editText)
                        .textFieldStyle(.plain)
                        .foregroundStyle(.white)
                        .submitLabel(.done)
                        .onSubmit(save)

                    Button("Save", action: save)
                        .foregroundStyle(Color(hex: "#f59e0b"))
                        .buttonStyle(.plain)

                    Button("Cancel") {
                        mode = .view
                        editText = ""
                    }
                    .foregroundStyle(Color(.systemGray))
                    .buttonStyle(.plain)
                }
                .padding(.vertical, 4)

            case .confirmDelete:
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text(item.text)
                            .foregroundStyle(.white)
                        Text("Tap trash again to delete")
                            .font(.caption)
                            .foregroundStyle(Color(hex: "#ef4444"))
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)

                    Button("Keep") {
                        revertTask?.cancel()
                        mode = .view
                    }
                    .foregroundStyle(Color(.systemGray))
                    .buttonStyle(.plain)

                    Button {
                        revertTask?.cancel()
                        store.deleteItem(id: item.id)
                    } label: {
                        Image(systemName: "trash")
                            .foregroundStyle(Color(hex: "#ef4444"))
                            .frame(width: 44, height: 44)
                    }
                    .buttonStyle(.plain)
                    .accessibilityLabel("Confirm delete \"\(item.text)\"")
                }
                .padding(.vertical, 4)
                .background(Color(hex: "#ef4444").opacity(0.1))
                .clipShape(RoundedRectangle(cornerRadius: 8))
            }
        }
    }

    @MainActor private func save() {
        let trimmed = editText.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { mode = .view; return }
        store.updateItemText(id: item.id, text: trimmed)
        mode = .view
    }
}

struct CaptureView: View {
    @Environment(AppStore.self) private var store
    @State private var text = ""
    @FocusState private var isFocused: Bool

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                HStack {
                    TextField("Capture something...", text: $text)
                        .textFieldStyle(.plain)
                        .focused($isFocused)
                        .foregroundStyle(.white)
                        .submitLabel(.done)
                        .onSubmit(submit)

                    Button(action: submit) {
                        Image(systemName: "plus.circle.fill")
                            .foregroundStyle(Color(hex: "#f59e0b"))
                            .font(.title2)
                    }
                    .disabled(text.trimmingCharacters(in: .whitespaces).isEmpty)
                }
                .padding()
                .background(Color(hex: "#18181b"))
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .padding()

                if store.inboxItems.isEmpty {
                    Spacer()
                    VStack(spacing: 8) {
                        Text("Nothing in the inbox.")
                            .foregroundStyle(.white)
                        Text("That's either great or suspicious.")
                            .foregroundStyle(Color(.systemGray))
                            .font(.subheadline)
                    }
                    Spacer()
                } else {
                    List(store.inboxItems) { item in
                        InboxRowView(item: item)
                            .listRowBackground(Color(hex: "#09090b"))
                            .listRowInsets(EdgeInsets(top: 4, leading: 16, bottom: 4, trailing: 8))
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                }
            }
            .background(Color(hex: "#09090b").ignoresSafeArea())
            .navigationTitle(store.inboxItems.isEmpty ? "Capture" : "\(store.inboxItems.count) unsorted")
            .navigationBarTitleDisplayMode(.large)
            .onAppear { isFocused = true }
        }
    }

    @MainActor private func submit() {
        guard !text.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        store.addItem(text: text)
        text = ""
    }
}
