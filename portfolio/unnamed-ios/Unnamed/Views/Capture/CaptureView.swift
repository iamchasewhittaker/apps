import SwiftUI

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
                        Text(item.text)
                            .foregroundStyle(.white)
                            .listRowBackground(Color(hex: "#09090b"))
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
