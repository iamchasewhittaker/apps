import SwiftUI
import MapKit

struct PropertySettingsView: View {
    @Environment(FairwayStore.self) private var store
    @State private var address: String = ""
    @State private var isGeocoding = false
    @State private var geocodeError: String? = nil

    @State private var pendingPin: CLLocationCoordinate2D? = nil
    @State private var previewCamera: MapCameraPosition = .automatic
    @State private var dragBase: CGPoint? = nil

    var body: some View {
        Form {
            addressSection
            actionSection
            if pendingPin != nil {
                previewSection
            }
            if store.blob.property != nil {
                clearSection
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

    // MARK: - Sections

    @ViewBuilder
    private var addressSection: some View {
        Section {
            TextField("345 E 170 N, Vineyard, UT 84059", text: $address)
                .autocorrectionDisabled()
                .textInputAutocapitalization(.words)
                .onChange(of: address) { _, _ in
                    pendingPin = nil
                }
        } header: {
            Text("Property Address")
        } footer: {
            if let err = geocodeError {
                Text(err).foregroundStyle(.red)
            } else if let issue = store.propertyLocationIssue {
                Text(issue).foregroundStyle(.orange)
            } else if let prop = store.blob.property, prop.hasValidCoordinates {
                let lat = String(format: "%.4f", prop.latitude)
                let lng = String(format: "%.4f", prop.longitude)
                Text("Geocoded: \(lat), \(lng)")
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
        }
    }

    @ViewBuilder
    private var actionSection: some View {
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
    }

    @ViewBuilder
    private var previewSection: some View {
        Section {
            VStack(spacing: 12) {
                MapReader { proxy in
                    Map(position: $previewCamera) {
                        if let pin = pendingPin {
                            Annotation("", coordinate: pin) {
                                previewPinMarker
                            }
                        }
                    }
                    .mapStyle(.hybrid)
                    .frame(height: 220)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .overlay {
                        if let pin = pendingPin, let sp = proxy.convert(pin, to: .local) {
                            dragHandle
                                .position(sp)
                                .gesture(pinDragGesture(proxy: proxy, anchor: sp))
                        }
                    }
                }

                Text("Drag the pin to fine-tune the location.")
                    .font(.caption)
                    .foregroundStyle(FairwayTheme.textSecondary)
                    .multilineTextAlignment(.center)

                HStack(spacing: 12) {
                    Button("Cancel") {
                        pendingPin = nil
                    }
                    .buttonStyle(.bordered)

                    Button("Use This Location") {
                        commitPin()
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(FairwayTheme.accentGold)
                }
            }
            .padding(.vertical, 4)
        } header: {
            Text("Confirm Pin")
        }
    }

    @ViewBuilder
    private var clearSection: some View {
        Section {
            Button("Clear Address", role: .destructive) {
                store.clearProperty()
                address = ""
                geocodeError = nil
                pendingPin = nil
            }
        }
    }

    // MARK: - Preview helpers

    private var previewPinMarker: some View {
        VStack(spacing: 2) {
            Image(systemName: "house.fill")
                .foregroundStyle(.white)
                .padding(6)
                .background(FairwayTheme.accentGold)
                .clipShape(Circle())
            Circle()
                .fill(FairwayTheme.accentGold)
                .frame(width: 8, height: 8)
        }
        .accessibilityLabel("Property pin — drag to adjust")
    }

    private var dragHandle: some View {
        Color.clear.frame(width: 44, height: 44).contentShape(Circle())
    }

    private func pinDragGesture(proxy: MapProxy, anchor: CGPoint) -> some Gesture {
        DragGesture(minimumDistance: 0)
            .onChanged { val in
                if dragBase == nil { dragBase = anchor }
                guard let base = dragBase else { return }
                let moved = CGPoint(
                    x: base.x + val.translation.width,
                    y: base.y + val.translation.height
                )
                if let coord = proxy.convert(moved, from: .local) {
                    pendingPin = coord
                }
            }
            .onEnded { _ in dragBase = nil }
    }

    // MARK: - Commit

    @MainActor private func saveAddress() async {
        let trimmed = address.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        isGeocoding = true
        geocodeError = nil
        pendingPin = nil

        if let coord = await Geocoder.geocode(address: trimmed) {
            pendingPin = coord
            previewCamera = .camera(MapCamera(
                centerCoordinate: coord,
                distance: 180,
                heading: 0,
                pitch: 0
            ))
        } else {
            geocodeError = "Address not found or invalid location. Check and try again."
        }
        isGeocoding = false
    }

    @MainActor private func commitPin() {
        guard let pin = pendingPin else { return }
        let trimmed = address.trimmingCharacters(in: .whitespaces)
        store.setProperty(PropertySettings(
            address: trimmed,
            latitude: pin.latitude,
            longitude: pin.longitude
        ))
        store.propertyLocationIssue = nil
        pendingPin = nil
    }
}
