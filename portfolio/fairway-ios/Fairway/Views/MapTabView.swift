import SwiftUI
import MapKit

struct MapTabView: View {
    @Environment(FairwayStore.self) private var store
    @State private var visibleZones: Set<Int> = [1, 2, 3, 4]
    @State private var showList = false
    @State private var showPropertySettings = false
    @State private var cameraPosition: MapCameraPosition = .automatic

    var body: some View {
        NavigationStack {
            Group {
                if let property = store.blob.property {
                    mapContent(property: property)
                } else {
                    emptyState
                }
            }
            .navigationTitle("Map")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        showList = true
                    } label: {
                        Label("List", systemImage: "list.bullet")
                    }
                    .accessibilityLabel("Show heads and observations as list")
                }
            }
        }
        .sheet(isPresented: $showList) {
            MapListToggleView()
        }
        .sheet(isPresented: $showPropertySettings) {
            NavigationStack { PropertySettingsView() }
        }
    }

    // MARK: - Map content

    @MainActor @ViewBuilder
    private func mapContent(property: PropertySettings) -> some View {
        let center = CLLocationCoordinate2D(latitude: property.latitude, longitude: property.longitude)
        let snapshot = store.blob.zones
        let visZones = visibleZones
        ZStack(alignment: .top) {
            Map(position: $cameraPosition) {
                ForEach(snapshot) { zone in
                    if visZones.contains(zone.number) {
                        let zColor = zoneColor(zone.number)
                        ForEach(zone.heads.filter(\.hasCoordinates)) { head in
                            if let lat = head.latitude, let lng = head.longitude {
                                let coord = CLLocationCoordinate2D(latitude: lat, longitude: lng)
                                Annotation(head.label, coordinate: coord) {
                                    HeadMapPin(head: head, zoneNumber: zone.number)
                                }
                                if let poly = arcPolygonCoords(for: head, center: coord) {
                                    MapPolygon(coordinates: poly)
                                        .foregroundStyle(zColor.opacity(0.18))
                                        .stroke(zColor.opacity(0.7), lineWidth: 1.5)
                                }
                            }
                        }
                    }
                }
            }
            .mapStyle(.hybrid)
            .onAppear {
                cameraPosition = .camera(MapCamera(
                    centerCoordinate: center,
                    distance: 120,
                    heading: 0,
                    pitch: 0
                ))
            }

            zoneFilterChips
                .padding(.top, 8)
        }
    }

    // MARK: - Zone filter chips

    private var zoneFilterChips: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(1...4, id: \.self) { n in
                    let on = visibleZones.contains(n)
                    Button {
                        if on { visibleZones.remove(n) }
                        else { visibleZones.insert(n) }
                    } label: {
                        Text("Zone \(n)")
                            .font(.caption.weight(.semibold))
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(on ? zoneColor(n) : FairwayTheme.backgroundSurface)
                            .foregroundStyle(on ? Color.black : FairwayTheme.textSecondary)
                            .clipShape(Capsule())
                    }
                    .accessibilityLabel("Zone \(n) filter, \(on ? "visible" : "hidden")")
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 4)
            .background(.ultraThinMaterial)
        }
    }

    // MARK: - Empty state

    private var emptyState: some View {
        VStack(spacing: 16) {
            Image(systemName: "map")
                .font(.system(size: 48))
                .foregroundStyle(FairwayTheme.textSecondary)
            Text("No Property Set")
                .font(.headline)
                .foregroundStyle(FairwayTheme.textPrimary)
            Text("Add your property address so the map can center on your lawn.")
                .font(.subheadline)
                .foregroundStyle(FairwayTheme.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
            Button("Set Property Address") {
                showPropertySettings = true
            }
            .buttonStyle(.borderedProminent)
            .tint(FairwayTheme.accentGold)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(FairwayTheme.backgroundPrimary)
    }

    // MARK: - Helpers

    private func zoneColor(_ number: Int) -> Color {
        switch number {
        case 1: return FairwayTheme.accentGreen
        case 2: return Color(red: 0.2, green: 0.5, blue: 1.0)
        case 3: return FairwayTheme.sunAmber
        default: return Color(red: 0.8, green: 0.4, blue: 0.9)
        }
    }

    private func arcPolygonCoords(for head: HeadData, center: CLLocationCoordinate2D) -> [CLLocationCoordinate2D]? {
        guard let startBearing = head.startBearingDegrees, head.radiusFeet > 0 else { return nil }
        let radiusMeters = head.radiusFeet * 0.3048
        let stepCount = 30
        let startDeg = Double(startBearing)
        let sweepDeg = Double(head.arcDegrees)

        var points: [CLLocationCoordinate2D] = [center]
        for i in 0...stepCount {
            let bearing = startDeg + sweepDeg * Double(i) / Double(stepCount)
            points.append(destination(from: center, bearing: bearing, meters: radiusMeters))
        }
        points.append(center)
        return points
    }

    private func destination(from origin: CLLocationCoordinate2D, bearing: Double, meters: Double) -> CLLocationCoordinate2D {
        let earthRadius = 6_371_000.0
        let d = meters / earthRadius
        let bearingRad = bearing * .pi / 180.0
        let lat1 = origin.latitude * .pi / 180.0
        let lon1 = origin.longitude * .pi / 180.0

        let lat2 = asin(sin(lat1) * cos(d) + cos(lat1) * sin(d) * cos(bearingRad))
        let lon2 = lon1 + atan2(sin(bearingRad) * sin(d) * cos(lat1),
                                cos(d) - sin(lat1) * sin(lat2))
        return CLLocationCoordinate2D(latitude: lat2 * 180.0 / .pi, longitude: lon2 * 180.0 / .pi)
    }
}

// MARK: - Head map pin

private struct HeadMapPin: View {
    let head: HeadData
    let zoneNumber: Int

    private var zoneColor: Color {
        switch zoneNumber {
        case 1: return FairwayTheme.accentGreen
        case 2: return Color(red: 0.2, green: 0.5, blue: 1.0)
        case 3: return FairwayTheme.sunAmber
        default: return Color(red: 0.8, green: 0.4, blue: 0.9)
        }
    }

    var body: some View {
        VStack(spacing: 2) {
            Text(head.label)
                .font(.system(size: 9, weight: .bold))
                .foregroundStyle(.white)
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
                .background(zoneColor)
                .clipShape(Capsule())
            Circle()
                .fill(zoneColor)
                .frame(width: 8, height: 8)
        }
        .accessibilityLabel("\(head.label), Zone \(zoneNumber), \(head.location)")
    }
}
