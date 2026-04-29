import SwiftUI

@MainActor
struct AddItemView: View {
    @Environment(KeepStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let roomID: UUID

    @State private var name = ""
    @State private var capturedImage: UIImage?
    @State private var showCamera = false
    @State private var addedCount = 0

    var body: some View {
        NavigationStack {
            VStack(spacing: 20) {
                photoSection
                nameSection
                addButton

                if addedCount > 0 {
                    Text("\(addedCount) item\(addedCount == 1 ? "" : "s") added")
                        .font(.subheadline)
                        .foregroundStyle(KeepTheme.statusKeep)
                }

                Spacer()
            }
            .padding()
            .background(KeepTheme.backgroundPrimary)
            .navigationTitle("Add Items")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
            .sheet(isPresented: $showCamera) {
                CameraPicker(image: $capturedImage)
            }
        }
    }

    @ViewBuilder
    private var photoSection: some View {
        Button { showCamera = true } label: {
            if let image = capturedImage {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFill()
                    .frame(height: 200)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
            } else {
                VStack(spacing: 12) {
                    Image(systemName: "camera.fill")
                        .font(.system(size: 40))
                    Text("Tap to take a photo")
                        .font(.subheadline)
                }
                .foregroundStyle(KeepTheme.textMuted)
                .frame(maxWidth: .infinity)
                .frame(height: 200)
                .background(KeepTheme.backgroundSurface)
                .clipShape(RoundedRectangle(cornerRadius: 12))
            }
        }
    }

    @ViewBuilder
    private var nameSection: some View {
        TextField("Item name (e.g. Camping stove)", text: $name)
            .textFieldStyle(.roundedBorder)
            .font(.body)
    }

    @ViewBuilder
    private var addButton: some View {
        Button {
            let item = Item(name: name.trimmingCharacters(in: .whitespaces), roomID: roomID)
            store.addItem(item, photo: capturedImage)
            name = ""
            capturedImage = nil
            addedCount += 1
        } label: {
            Label("Add & Next", systemImage: "plus.circle.fill")
                .frame(maxWidth: .infinity)
                .padding(.vertical, 4)
        }
        .buttonStyle(.borderedProminent)
        .tint(KeepTheme.accent)
        .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
    }
}

// MARK: - Camera Picker

struct CameraPicker: UIViewControllerRepresentable {
    @Binding var image: UIImage?
    @Environment(\.dismiss) private var dismiss

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.delegate = context.coordinator
        // Use camera if available, otherwise photo library (simulator)
        if UIImagePickerController.isSourceTypeAvailable(.camera) {
            picker.sourceType = .camera
        } else {
            picker.sourceType = .photoLibrary
        }
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}

    func makeCoordinator() -> Coordinator { Coordinator(self) }

    class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let parent: CameraPicker

        init(_ parent: CameraPicker) {
            self.parent = parent
        }

        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
            if let image = info[.originalImage] as? UIImage {
                parent.image = image
            }
            parent.dismiss()
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            parent.dismiss()
        }
    }
}
