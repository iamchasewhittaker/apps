import SwiftUI

struct PropertySettingsView: View {
    @Environment(FairwayStore.self) private var store
    @State private var address: String = ""
    @State private var isGeocoding = false
    @State private var geocodeError: String? = nil

    var body: some View {
        Form {
            Section {
                TextField("345 E 170 N, Vineyard, UT 84059", text: $address)
                    .autocorrectionDisabled()
                    .textInputAutocapitalization(.words)
            } header: {
                Text("Property Address")
            } footer: {
                if let err = geocodeError {
                    Text(err).foregroundStyle(.red)
                } else if let prop = store.blob.property {
                    let lat = String(format: "%.4f", prop.latitude)
                    let lng = String(format: "%.4f", prop.longitude)
                    Text("Geocoded: \(lat), \(lng)")
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
            }

            Section {
                Button {
                    Task { await saveAddress() }
                } label: {
                    HStack {
                        Text("Save and Geocode")
                        if isGeocoding {
                            Spacer()
                            ProgressView()
                        }
                    }
                }
                .disabled(address.trimmingCharacters(in: .whitespaces).isEmpty || isGeocoding)
                .foregroundStyle(FairwayTheme.accentGold)
            }

            if store.blob.property != nil {
                Section {
                    Button("Clear Address", role: .destructive) {
                        store.clearProperty()
                        address = ""
                        geocodeError = nil
                    }
                }
            }
        }
        .scrollContentBackground(.hidden)
        .background(FairwayTheme.backgroundPrimary)
        .navigationTitle("Property")
        .navigationBarTitleDisplayMode(.inline)
        .onAppear {
            address = store.blob.property?.address ?? ""
        }
    }

    @MainActor private func saveAddress() async {
        let trimmed = address.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        isGeocoding = true
        geocodeError = nil

        if let coord = await Geocoder.geocode(address: trimmed) {
            store.setProperty(PropertySettings(
                address: trimmed,
                latitude: coord.latitude,
                longitude: coord.longitude
            ))
        } else {
            geocodeError = "Address not found. Check the address and try again."
        }
        isGeocoding = false
    }
}
