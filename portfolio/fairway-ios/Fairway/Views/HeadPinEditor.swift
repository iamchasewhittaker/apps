import SwiftUI
import MapKit

struct HeadPinEditor: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    let zoneID: UUID
    let head: HeadData

    @State private var lat: Double
    @State private var lng: Double
    @State private var bearing: Int
    @State private var arc: Int
    @State private var radius: Double
    @State private var hasPin: Bool
    @State private var camera: MapCameraPosition

    // Capture handle screen positions at drag-start to avoid feedback loops
    @State private var startDragBase: CGPoint? = nil
    @State private var endDragBase: CGPoint? = nil

    init(zoneID: UUID, head: HeadData) {
        self.zoneID = zoneID
        self.head = head
        let iLat = head.latitude ?? 40.3330
        let iLng = head.longitude ?? -111.7550
        _lat = State(initialValue: iLat)
        _lng = State(initialValue: iLng)
        _bearing = State(initialValue: head.startBearingDegrees ?? 0)
        _arc = State(initialValue: head.arcDegrees)
        _radius = State(initialValue: max(1, head.radiusFeet))
        _hasPin = State(initialValue: head.latitude != nil)
        _camera = State(initialValue: .camera(MapCamera(
            centerCoordinate: CLLocationCoordinate2D(latitude: iLat, longitude: iLng),
            distance: 100,
            heading: 0,
            pitch: 0
        )))
    }

    var body: some View {
        NavigationStack {
            ZStack(alignment: .bottom) {
                MapReader { proxy in
                    Map(position: $camera) {
                        if hasPin {
                            Annotation("", coordinate: pinCoord) { pinMarker }
                            MapPolygon(coordinates: arcCoords())
                                .foregroundStyle(FairwayTheme.accentGreen.opacity(0.2))
                                .stroke(FairwayTheme.accentGreen.opacity(0.8), lineWidth: 1.5)
                        }
                    }
                    .mapStyle(.hybrid)
                    .onTapGesture { screenPoint in
                        if let coord = proxy.convert(screenPoint, from: .local) {
                            lat = coord.latitude
                            lng = coord.longitude
                            hasPin = true
                        }
                    }
                    .overlay {
                        if hasPin {
                            handleLayer(proxy: proxy)
                        }
                    }
                }

                bottomPanel
            }
            .ignoresSafeArea(edges: .bottom)
            .navigationTitle("Place on Map")
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
                        .disabled(!hasPin)
                }
            }
        }
    }

    // MARK: - Handle layer

    private func handleLayer(proxy: MapProxy) -> some View {
        let center = pinCoord
        let rm = radius * 0.3048
        let startCoord = geo(from: center, bearing: Double(bearing), meters: rm)
        let endCoord = geo(from: center, bearing: Double((bearing + arc) % 360), meters: rm)

        return ZStack {
            if let sp = proxy.convert(startCoord, to: .local) {
                handle(color: .yellow, label: "Arc start — drag to rotate bearing")
                    .position(sp)
                    .gesture(
                        DragGesture(minimumDistance: 0)
                            .onChanged { val in
                                if startDragBase == nil { startDragBase = sp }
                                guard let base = startDragBase else { return }
                                let moved = CGPoint(x: base.x + val.translation.width,
                                                   y: base.y + val.translation.height)
                                if let coord = proxy.convert(moved, from: .local) {
                                    bearing = bearingFrom(center, to: coord)
                                }
                            }
                            .onEnded { _ in startDragBase = nil }
                    )
            }
            if let ep = proxy.convert(endCoord, to: .local) {
                handle(color: .orange, label: "Arc end — drag to resize sweep")
                    .position(ep)
                    .gesture(
                        DragGesture(minimumDistance: 0)
                            .onChanged { val in
                                if endDragBase == nil { endDragBase = ep }
                                guard let base = endDragBase else { return }
                                let moved = CGPoint(x: base.x + val.translation.width,
                                                   y: base.y + val.translation.height)
                                if let coord = proxy.convert(moved, from: .local) {
                                    let endB = bearingFrom(center, to: coord)
                                    var sweep = endB - bearing
                                    if sweep <= 0 { sweep += 360 }
                                    arc = max(1, min(360, sweep))
                                }
                            }
                            .onEnded { _ in endDragBase = nil }
                    )
            }
        }
    }

    private func handle(color: Color, label: String) -> some View {
        ZStack {
            Circle()
                .fill(color)
                .frame(width: 24, height: 24)
                .overlay(Circle().stroke(Color.white, lineWidth: 2.5))
                .shadow(color: .black.opacity(0.55), radius: 4)
        }
        .frame(width: 44, height: 44)
        .contentShape(Circle())
        .accessibilityLabel(label)
    }

    // MARK: - Pin marker

    private var pinMarker: some View {
        VStack(spacing: 2) {
            Text(head.label)
                .font(.system(size: 9, weight: .bold))
                .foregroundStyle(.white)
                .padding(.horizontal, 5)
                .padding(.vertical, 2)
                .background(FairwayTheme.accentGreen)
                .clipShape(Capsule())
            Circle()
                .fill(FairwayTheme.accentGreen)
                .frame(width: 10, height: 10)
                .overlay(Circle().stroke(Color.white, lineWidth: 1.5))
        }
        .accessibilityLabel("\(head.label) — drag handles to adjust arc")
    }

    // MARK: - Bottom panel

    private var bottomPanel: some View {
        VStack(spacing: 10) {
            if !hasPin {
                Text("Tap the map to place this head")
                    .font(.footnote)
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
            HStack(spacing: 12) {
                numericField(label: "Arc°", value: Binding(
                    get: { Double(arc) },
                    set: { arc = Int(max(1, min(360, $0))) }
                ))
                numericField(label: "Bearing°", value: Binding(
                    get: { Double(bearing) },
                    set: { bearing = ((Int($0) % 360) + 360) % 360 }
                ))
                numericField(label: "Radius ft", value: Binding(
                    get: { radius },
                    set: { radius = max(1, $0) }
                ))
            }
            .padding(.horizontal, 16)
        }
        .padding(.top, 10)
        .padding(.bottom, 28)
        .frame(maxWidth: .infinity)
        .background(.ultraThinMaterial)
    }

    private func numericField(label: String, value: Binding<Double>) -> some View {
        VStack(spacing: 4) {
            Text(label)
                .font(.caption2)
                .foregroundStyle(FairwayTheme.textSecondary)
            TextField("0", value: value, format: .number)
                .keyboardType(.numberPad)
                .multilineTextAlignment(.center)
                .font(.body.monospacedDigit())
                .frame(width: 80)
                .padding(.vertical, 6)
                .background(FairwayTheme.backgroundSurface)
                .clipShape(RoundedRectangle(cornerRadius: 8))
        }
    }

    // MARK: - Coordinate helpers

    private var pinCoord: CLLocationCoordinate2D {
        CLLocationCoordinate2D(latitude: lat, longitude: lng)
    }

    private func arcCoords() -> [CLLocationCoordinate2D] {
        guard radius > 0 else { return [] }
        let center = pinCoord
        let rm = radius * 0.3048
        var pts: [CLLocationCoordinate2D] = [center]
        for i in 0...30 {
            let b = Double(bearing) + Double(arc) * Double(i) / 30.0
            pts.append(geo(from: center, bearing: b, meters: rm))
        }
        pts.append(center)
        return pts
    }

    private func geo(from origin: CLLocationCoordinate2D, bearing: Double, meters: Double) -> CLLocationCoordinate2D {
        let R = 6_371_000.0
        let d = meters / R
        let b = bearing * .pi / 180
        let lat1 = origin.latitude * .pi / 180
        let lon1 = origin.longitude * .pi / 180
        let lat2 = asin(sin(lat1) * cos(d) + cos(lat1) * sin(d) * cos(b))
        let lon2 = lon1 + atan2(sin(b) * sin(d) * cos(lat1), cos(d) - sin(lat1) * sin(lat2))
        return CLLocationCoordinate2D(latitude: lat2 * 180 / .pi, longitude: lon2 * 180 / .pi)
    }

    private func bearingFrom(_ from: CLLocationCoordinate2D, to: CLLocationCoordinate2D) -> Int {
        let lat1 = from.latitude * .pi / 180
        let lat2 = to.latitude * .pi / 180
        let dLon = (to.longitude - from.longitude) * .pi / 180
        let y = sin(dLon) * cos(lat2)
        let x = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(dLon)
        let b = atan2(y, x) * 180 / .pi
        return Int((b + 360).truncatingRemainder(dividingBy: 360))
    }

    // MARK: - Save

    @MainActor
    private func save() {
        var updated = head
        updated.latitude = lat
        updated.longitude = lng
        updated.startBearingDegrees = bearing
        updated.arcDegrees = arc
        updated.radiusFeet = radius
        store.updateHead(updated, in: zoneID)
        dismiss()
    }
}
