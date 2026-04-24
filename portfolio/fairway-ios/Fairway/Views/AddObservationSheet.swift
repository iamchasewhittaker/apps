import SwiftUI
import PhotosUI

struct AddObservationSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var text = ""
    @State private var zoneNumber: Int? = nil
    @State private var pickerItem: PhotosPickerItem? = nil
    @State private var selectedImage: UIImage? = nil

    var body: some View {
        NavigationStack {
            Form {
                Section("Observation") {
                    TextField("What did you notice?", text: $text, axis: .vertical)
                        .lineLimit(3...6)
                }

                Section {
                    Picker("Zone", selection: $zoneNumber) {
                        Text("Any zone").tag(nil as Int?)
                        ForEach(1...4, id: \.self) { n in
                            Text("Zone \(n)").tag(n as Int?)
                        }
                    }
                } header: {
                    Text("Zone (optional)")
                }

                Section {
                    PhotosPicker(selection: $pickerItem, matching: .images) {
                        Label(
                            selectedImage == nil ? "Add Photo" : "Change Photo",
                            systemImage: "camera.fill"
                        )
                    }
                    if let img = selectedImage {
                        Image(uiImage: img)
                            .resizable()
                            .scaledToFit()
                            .frame(maxHeight: 200)
                            .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
                    }
                } header: {
                    Text("Photo (optional)")
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Log Observation")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(FairwayTheme.accentGold)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { save() }
                        .bold()
                        .foregroundStyle(FairwayTheme.accentGold)
                        .disabled(text.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
        .onChange(of: pickerItem) { _, item in
            Task {
                if let data = try? await item?.loadTransferable(type: Data.self),
                   let img = UIImage(data: data) {
                    selectedImage = img
                }
            }
        }
    }

    @MainActor private func save() {
        var obs = LawnObservation(text: text.trimmingCharacters(in: .whitespacesAndNewlines))
        obs.zoneNumber = zoneNumber
        if let img = selectedImage {
            obs.photoID = store.photos.save(image: img)
        }
        store.addObservation(obs)
        dismiss()
    }
}
