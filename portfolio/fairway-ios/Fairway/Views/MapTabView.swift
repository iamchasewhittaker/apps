import SwiftUI
import MapKit

struct MapTabView: View {
    @Environment(FairwayStore.self) private var store
    @State private var visibleZones: Set<Int> = [1, 2, 3, 4]
    @State private var showList = false
    @State private var showPropertySettings = false
    @State private var cameraPosition: MapCameraPosition = .automatic
    @State private var selectedHead: HeadData?
    @State private var selectedZoneNumber: Int = 0

    var body: some View {
        NavigationStack {
            Group {
                if let property = store.blob.property {
                    if property.hasValidCoordinates {
                        mapContent(property: property)
                    } else {
                        invalidCoordinatesState(property: property)
                    }
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
            .navigationDestination(for: UUID.self) { zoneID in
                ZoneDetailView(zoneID: zoneID, initialTab: .problems)
            }
        }
        .sheet(isPresented: $showList) {
            MapListToggleView()
        }
        .sheet(isPresented: $showPropertySettings) {
            NavigationStack { PropertySettingsView() }
        }
        .sheet(item: $selectedHead) { head in
            NavigationStack {
                HeadMapCallout(head: head, zoneNumber: selectedZoneNumber)
            }
        }
    }

    // MARK: - Map content

    @MainActor @ViewBuilder
    private func mapContent(property: PropertySettings) -> some View {
        let snapshot = store.blob.zones
        let visZones = visibleZones
        ZStack(alignment: .top) {
            Map(position: $cameraPosition) {
                // Head pins + arcs. Zone-hull overlays were removed — convex
                // hulls of L-shaped zones cross each other and confuse more
                // than they clarify. Pin color + filter chips do the work.
                ForEach(snapshot) { zone in
                    if visZones.contains(zone.number) {
                        let zColor = zoneColor(zone.number)
                        ForEach(zone.heads.filter(\.hasCoordinates)) { head in
                            if let lat = head.latitude, let lng = head.longitude {
                                let coord = CLLocationCoordinate2D(latitude: lat, longitude: lng)
                                Annotation("", coordinate: coord) {
                                    Button {
                                        selectedZoneNumber = zone.number
                                        selectedHead = head
                                    } label: {
                                        HeadMapPin(head: head, zoneNumber: zone.number)
                                    }
                                    .buttonStyle(.plain)
                                }
                                .annotationTitles(.hidden)
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
                cameraPosition = makeCamera(for: property)
            }
            .onChange(of: store.blob.property) { _, newValue in
                if let p = newValue, p.hasValidCoordinates {
                    cameraPosition = makeCamera(for: p)
                }
            }

            VStack(spacing: 0) {
                zoneSummaryStrip(snapshot: snapshot, visible: visZones)
                zoneFilterChips
            }
            .padding(.top, 8)
        }
    }

    private func makeCamera(for property: PropertySettings) -> MapCameraPosition {
        let center = CLLocationCoordinate2D(
            latitude: property.latitude,
            longitude: property.longitude
        )
        return .camera(MapCamera(
            centerCoordinate: center,
            distance: 200,
            heading: 0,
            pitch: 0
        ))
    }

    @ViewBuilder
    private func invalidCoordinatesState(property: PropertySettings) -> some View {
        VStack(spacing: 16) {
            Image(systemName: "mappin.slash")
                .font(.system(size: 48))
                .foregroundStyle(FairwayTheme.textSecondary)
            Text("Property Location Needs Attention")
                .font(.headline)
                .foregroundStyle(FairwayTheme.textPrimary)
            Text("We have your address but not a valid pin yet. Re-geocode or edit in Settings.")
                .font(.subheadline)
                .foregroundStyle(FairwayTheme.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 40)
            Button("Fix in Settings") {
                showPropertySettings = true
            }
            .buttonStyle(.borderedProminent)
            .tint(FairwayTheme.accentGold)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(FairwayTheme.backgroundPrimary)
    }

    // MARK: - Zone summary strip

    @MainActor @ViewBuilder
    private func zoneSummaryStrip(snapshot: [ZoneData], visible: Set<Int>) -> some View {
        let cards = snapshot.filter { visible.contains($0.number) && !openActionsForZone($0).isEmpty }
        if !cards.isEmpty {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 10) {
                    ForEach(cards) { zone in
                        ZoneSummaryCard(zone: zone, actions: openActionsForZone(zone))
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 6)
            }
            .background(.ultraThinMaterial)
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
        MapTabView.zoneColor(number)
    }

    static func zoneColor(_ number: Int) -> Color {
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

// MARK: - Compact-nozzle + open-action helpers (file-internal so tests can reach them)

func compactNozzle(for head: HeadData) -> String? {
    let trimmedField = head.fieldNozzle.trimmingCharacters(in: .whitespacesAndNewlines)
    if !trimmedField.isEmpty {
        return String(trimmedField.prefix(14))
    }
    let trimmedSpec = head.nozzle.trimmingCharacters(in: .whitespacesAndNewlines)
    if trimmedSpec.isEmpty { return nil }
    if trimmedSpec.uppercased().hasPrefix("TBD") { return "TBD" }
    return String(trimmedSpec.prefix(14))
}

func openActionsForZone(_ zone: ZoneData) -> [String] {
    zone.problemAreas
        .filter { !$0.isResolved }
        .flatMap(\.actions)
}

// MARK: - Head map pin

private struct HeadMapPin: View {
    let head: HeadData
    let zoneNumber: Int

    private var zoneColor: Color {
        MapTabView.zoneColor(zoneNumber)
    }

    private var nozzleLine: String? {
        compactNozzle(for: head)
    }

    var body: some View {
        VStack(spacing: 1) {
            Text(head.label)
                .font(.system(size: 9, weight: .bold))
                .foregroundStyle(.white)
                .padding(.horizontal, 6)
                .padding(.vertical, 2)
                .background(zoneColor)
                .clipShape(Capsule())
            if let line = nozzleLine {
                Text(line)
                    .font(.system(size: 8, weight: .medium))
                    .foregroundStyle(zoneColor)
                    .padding(.horizontal, 4)
                    .padding(.vertical, 1)
                    .background(Color.black.opacity(0.55))
                    .clipShape(Capsule())
            }
            Circle()
                .fill(zoneColor)
                .frame(width: 8, height: 8)
        }
        .accessibilityLabel("\(head.label), Zone \(zoneNumber), \(head.location), nozzle \(head.nozzle)")
    }
}

// MARK: - Zone summary card

private struct ZoneSummaryCard: View {
    let zone: ZoneData
    let actions: [String]

    private var openCount: Int { zone.problemAreas.filter { !$0.isResolved }.count }
    private var bullets: [String] { Array(actions.prefix(3)) }

    var body: some View {
        NavigationLink(value: zone.id) {
            VStack(alignment: .leading, spacing: 6) {
                HStack(alignment: .firstTextBaseline) {
                    Text("ZONE \(zone.number) · \(zone.name.uppercased())")
                        .font(.caption2.bold())
                        .foregroundStyle(FairwayTheme.textSecondary)
                        .lineLimit(1)
                    Spacer()
                    Text("\(openCount) open")
                        .font(.caption2.bold())
                        .padding(.horizontal, 6).padding(.vertical, 2)
                        .background(MapTabView.zoneColor(zone.number).opacity(0.25))
                        .foregroundStyle(MapTabView.zoneColor(zone.number))
                        .clipShape(Capsule())
                }
                ForEach(bullets, id: \.self) { action in
                    HStack(alignment: .top, spacing: 6) {
                        Text("•")
                            .font(.footnote.bold())
                            .foregroundStyle(FairwayTheme.accentGold)
                        Text(action)
                            .font(.footnote)
                            .foregroundStyle(FairwayTheme.textPrimary)
                            .lineLimit(1)
                            .truncationMode(.tail)
                    }
                }
                HStack {
                    Spacer()
                    Text("more →")
                        .font(.caption2.bold())
                        .foregroundStyle(FairwayTheme.accentGold)
                }
            }
            .padding(10)
            .frame(width: 280, alignment: .leading)
            .background(FairwayTheme.backgroundSurface.opacity(0.95))
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .stroke(MapTabView.zoneColor(zone.number).opacity(0.5), lineWidth: 1)
            )
        }
        .buttonStyle(.plain)
        .accessibilityLabel("Zone \(zone.number) \(zone.name), \(openCount) open problems. Tap for details.")
    }
}

// MARK: - Head detail callout

@MainActor
private struct HeadMapCallout: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let head: HeadData
    let zoneNumber: Int

    private var zone: ZoneData? {
        store.blob.zones.first(where: { $0.number == zoneNumber })
    }

    private var linkedActions: [String] {
        guard let zone else { return [] }
        let openActions = zone.problemAreas.filter { !$0.isResolved }.flatMap(\.actions)
        let needles = [head.label.lowercased(), head.label.replacingOccurrences(of: "Z\(zoneNumber)-", with: "").lowercased()]
        let specific = openActions.filter { action in
            let lower = action.lowercased()
            return needles.contains { !$0.isEmpty && lower.contains($0) }
        }
        return specific.isEmpty ? openActions : specific
    }

    private var fieldNozzleDisplay: String {
        head.fieldNozzle.isEmpty ? "—" : head.fieldNozzle
    }

    private var fieldArcDisplay: String {
        head.fieldArcDegrees.map { "\($0)°" } ?? "—"
    }

    private var fieldRadiusDisplay: String {
        head.fieldRadiusFeet.map { String(format: "%.0f ft", $0) } ?? "—"
    }

    private var fieldGPMDisplay: String {
        head.fieldGPM.map { String(format: "%.2f", $0) } ?? "—"
    }

    private var auditChipColor: Color {
        switch head.auditConfidence.lowercased() {
        case "high": return FairwayTheme.statusHealthy
        case "med", "medium": return FairwayTheme.statusAttention
        case "low": return FairwayTheme.statusAttention
        case "blocked": return FairwayTheme.statusAction
        default: return FairwayTheme.textSecondary
        }
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                header
                metrics
                if !head.auditObservation.isEmpty {
                    auditCard
                }
                if !linkedActions.isEmpty {
                    actionsCard
                }
            }
            .padding(16)
        }
        .background(FairwayTheme.backgroundPrimary)
        .navigationTitle(head.label)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("Done") { dismiss() }
                    .foregroundStyle(FairwayTheme.accentGold)
            }
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(head.label)
                    .font(.title2.bold())
                    .foregroundStyle(FairwayTheme.textPrimary)
                Spacer()
                Text("Zone \(zoneNumber)")
                    .font(.caption.bold())
                    .padding(.horizontal, 10).padding(.vertical, 4)
                    .background(MapTabView.zoneColor(zoneNumber).opacity(0.25))
                    .foregroundStyle(MapTabView.zoneColor(zoneNumber))
                    .clipShape(Capsule())
                if !head.isConfirmed {
                    PreSeasonBadge()
                } else if head.confirmedBySeasonTest {
                    ConfirmedBadge()
                }
            }
            if !head.location.isEmpty {
                Text(head.location)
                    .font(.subheadline)
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
            if !head.notes.isEmpty {
                Text(head.notes)
                    .font(.footnote)
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
        }
    }

    private var metrics: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 10) {
                metricRow(label: "NOZZLE",
                          field: fieldNozzleDisplay,
                          spec: head.nozzle.isEmpty ? "—" : head.nozzle)
                metricRow(label: "ARC",
                          field: fieldArcDisplay,
                          spec: "\(head.arcDegrees)°")
                metricRow(label: "RADIUS",
                          field: fieldRadiusDisplay,
                          spec: head.radiusFeet > 0 ? String(format: "%.0f ft", head.radiusFeet) : "—")
                metricRow(label: "GPM",
                          field: fieldGPMDisplay,
                          spec: head.gpm > 0 ? String(format: "%.2f", head.gpm) : "—")
            }
        }
    }

    private func metricRow(label: String, field: String, spec: String) -> some View {
        HStack(alignment: .firstTextBaseline) {
            Text(label)
                .font(.caption.bold())
                .foregroundStyle(FairwayTheme.textSecondary)
                .frame(width: 64, alignment: .leading)
            VStack(alignment: .leading, spacing: 2) {
                Text("field \(field)")
                    .font(.footnote.bold())
                    .foregroundStyle(FairwayTheme.textPrimary)
                Text("spec \(spec)")
                    .font(.footnote)
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
            Spacer()
        }
    }

    private var auditCard: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text("AUDIT")
                        .font(.caption.bold())
                        .foregroundStyle(FairwayTheme.textSecondary)
                    Spacer()
                    if !head.auditConfidence.isEmpty {
                        Text(head.auditConfidence.uppercased())
                            .font(.caption2.bold())
                            .padding(.horizontal, 6).padding(.vertical, 2)
                            .background(auditChipColor.opacity(0.18))
                            .foregroundStyle(auditChipColor)
                            .clipShape(Capsule())
                    }
                }
                Text(head.auditObservation)
                    .font(.footnote)
                    .foregroundStyle(FairwayTheme.textPrimary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }

    private var actionsCard: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("LINKED ACTIONS")
                    .font(.caption.bold())
                    .foregroundStyle(FairwayTheme.textSecondary)
                ForEach(linkedActions, id: \.self) { action in
                    HStack(alignment: .top, spacing: 6) {
                        Text("•")
                            .font(.footnote.bold())
                            .foregroundStyle(FairwayTheme.accentGold)
                        Text(action)
                            .font(.footnote)
                            .foregroundStyle(FairwayTheme.textPrimary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
            }
        }
    }
}
