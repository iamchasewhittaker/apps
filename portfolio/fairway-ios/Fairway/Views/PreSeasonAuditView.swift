import SwiftUI

// MARK: - Main audit list

@MainActor
struct PreSeasonAuditView: View {
    @Environment(FairwayStore.self) private var store
    @State private var selectedHead: HeadData? = nil

    private var grassZones: [ZoneData] {
        store.blob.zones.filter { $0.number != 1 }
    }

    private var totalHeads: Int {
        grassZones.reduce(0) { $0 + $1.heads.count }
    }

    private var clearedHeads: Int {
        grassZones.reduce(0) { $0 + $1.heads.filter { $0.preSeasonChecked }.count }
    }

    private var blockedCount: Int {
        grassZones.reduce(0) { $0 + $1.heads.filter { $0.auditIsBlocked }.count }
    }

    var body: some View {
        List {
            headerSection
            ForEach(grassZones) { zone in
                zoneSection(zone)
            }
        }
        .scrollContentBackground(.hidden)
        .background(FairwayTheme.backgroundPrimary)
        .navigationTitle("Pre-Season Audit")
        .sheet(item: $selectedHead) { head in
            HeadAuditSheet(head: head) { updated in
                store.updateHead(updated)
            }
            .presentationDetents([.large])
        }
    }

    // MARK: - Header

    private var headerSection: some View {
        Section {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("\(clearedHeads) / \(totalHeads)")
                            .font(.title2.bold())
                            .foregroundStyle(FairwayTheme.textPrimary)
                        Text("heads cleared")
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }
                    Spacer()
                    if blockedCount > 0 {
                        VStack(alignment: .trailing, spacing: 2) {
                            Text("\(blockedCount)")
                                .font(.title2.bold())
                                .foregroundStyle(.red)
                            Text("need physical work")
                                .font(.caption)
                                .foregroundStyle(FairwayTheme.textSecondary)
                        }
                    }
                }
                ProgressView(value: Double(clearedHeads), total: Double(max(totalHeads, 1)))
                    .tint(FairwayTheme.accentGold)
            }
            .padding(.vertical, 4)
        } footer: {
            Text("Tap any head to log field observations. Blocked heads need physical cleanup before nozzle can be confirmed.")
                .font(.caption)
                .foregroundStyle(FairwayTheme.textSecondary)
        }
    }

    // MARK: - Zone section

    private func zoneSection(_ zone: ZoneData) -> some View {
        let cleared = zone.heads.filter { $0.preSeasonChecked }.count
        let total = zone.heads.count
        return Section {
            ForEach(zone.heads) { head in
                Button {
                    selectedHead = head
                } label: {
                    HeadAuditRow(head: head)
                }
                .buttonStyle(.plain)
            }
        } header: {
            HStack {
                Text("Zone \(zone.number) — \(zone.name)")
                Spacer()
                Text("\(cleared)/\(total)")
                    .font(.caption.bold())
                    .foregroundStyle(cleared == total ? FairwayTheme.accentGold : FairwayTheme.textSecondary)
            }
        }
    }
}

// MARK: - Head row

private struct HeadAuditRow: View {
    let head: HeadData

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: head.preSeasonChecked ? "checkmark.circle.fill" : "circle")
                .foregroundStyle(head.preSeasonChecked ? FairwayTheme.accentGold : FairwayTheme.textSecondary)
                .font(.title3)

            VStack(alignment: .leading, spacing: 3) {
                HStack(spacing: 6) {
                    Text(head.label)
                        .font(.headline)
                        .foregroundStyle(FairwayTheme.textPrimary)
                    confidenceBadge
                }
                if !head.auditObservation.isEmpty {
                    Text(head.auditObservation)
                        .font(.caption)
                        .foregroundStyle(head.auditIsBlocked ? .red : FairwayTheme.textSecondary)
                        .lineLimit(2)
                }
                if !head.fieldNozzle.isEmpty {
                    Label(head.fieldNozzle, systemImage: "checkmark.seal.fill")
                        .font(.caption.bold())
                        .foregroundStyle(FairwayTheme.accentGold)
                }
            }

            Spacer()
            Image(systemName: "chevron.right")
                .font(.caption)
                .foregroundStyle(FairwayTheme.textSecondary)
        }
        .padding(.vertical, 2)
    }

    @ViewBuilder private var confidenceBadge: some View {
        if !head.auditConfidence.isEmpty {
            Text(badgeLabel)
                .font(.caption2.bold())
                .padding(.horizontal, 5)
                .padding(.vertical, 2)
                .background(badgeColor.opacity(0.15))
                .foregroundStyle(badgeColor)
                .clipShape(Capsule())
        }
    }

    private var badgeLabel: String {
        switch head.auditConfidence {
        case "high":    return "CONFIRMED"
        case "med":     return "LIKELY"
        case "low":     return "UNCLEAR"
        case "blocked": return "BLOCKED"
        default:        return ""
        }
    }

    private var badgeColor: Color {
        switch head.auditConfidence {
        case "high":    return .green
        case "med":     return .orange
        case "low":     return .yellow
        case "blocked": return .red
        default:        return .gray
        }
    }
}

// MARK: - Head detail sheet

struct HeadAuditSheet: View {
    let head: HeadData
    let onSave: (HeadData) -> Void

    @State private var fieldNozzle: String
    @State private var fieldArc: String
    @State private var fieldRadius: String
    @State private var fieldGPM: String
    @State private var preSeasonChecked: Bool
    @State private var extraNotes: String
    @Environment(\.dismiss) private var dismiss

    init(head: HeadData, onSave: @escaping (HeadData) -> Void) {
        self.head = head
        self.onSave = onSave

        // Pre-fill from saved field values; fall back to audit-derived estimates for a useful starting point.
        let prefilledNozzle: String = {
            if !head.fieldNozzle.isEmpty { return head.fieldNozzle }
            if !head.nozzle.hasPrefix("TBD") && !head.nozzle.hasPrefix("Buried") { return head.nozzle }
            return ""
        }()
        _fieldNozzle = State(initialValue: prefilledNozzle)

        let prefilledArc: String = {
            if let saved = head.fieldArcDegrees { return String(saved) }
            return head.arcDegrees > 0 ? String(head.arcDegrees) : ""
        }()
        _fieldArc = State(initialValue: prefilledArc)

        let prefilledRadius: String = {
            if let saved = head.fieldRadiusFeet { return String(saved) }
            return head.radiusFeet > 0 ? String(head.radiusFeet) : ""
        }()
        _fieldRadius = State(initialValue: prefilledRadius)

        let prefilledGPM: String = {
            if let saved = head.fieldGPM { return String(saved) }
            return head.gpm > 0 ? String(head.gpm) : ""
        }()
        _fieldGPM = State(initialValue: prefilledGPM)

        _preSeasonChecked = State(initialValue: head.preSeasonChecked)
        _extraNotes = State(initialValue: head.notes)
    }

    var body: some View {
        NavigationStack {
            Form {
                // Photo audit observation
                Section("Photo Audit Finding") {
                    if !head.auditObservation.isEmpty {
                        HStack(alignment: .top, spacing: 8) {
                            confidenceDot
                            Text(head.auditObservation)
                                .font(.callout)
                                .foregroundStyle(FairwayTheme.textPrimary)
                        }
                    } else {
                        Text("No audit data for this head")
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }
                }

                // What photos can't tell us (with estimates)
                if !head.auditIsBlocked {
                    Section("Still needed from field") {
                        estimatedRow(icon: "arrow.trianglehead.clockwise", label: "Arc (°)",
                                     estimate: head.arcDegrees > 0 ? "\(head.arcDegrees)°" : nil,
                                     fallback: "measure during wet run")
                        estimatedRow(icon: "ruler", label: "Radius (ft)",
                                     estimate: radiusEstimate,
                                     fallback: "tape measure during wet run")
                        estimatedRow(icon: "drop", label: "GPM",
                                     estimate: gpmEstimate,
                                     fallback: "catch cup or nozzle spec")
                        if head.auditConfidence == "low" || head.auditConfidence == "med" {
                            Label("Nozzle re-confirm — read label physically", systemImage: "magnifyingglass")
                                .foregroundStyle(.orange)
                                .font(.callout)
                        }
                    }
                } else {
                    Section("Required before anything else") {
                        Label(blockedAction, systemImage: "exclamationmark.triangle.fill")
                            .foregroundStyle(.red)
                    }
                }

                // Field inputs
                Section("Field Findings") {
                    TextField("Confirmed nozzle (e.g. MP1000, VAN yellow)", text: $fieldNozzle)
                    TextField("Arc (°)", text: $fieldArc)
                        .keyboardType(.numberPad)
                    TextField("Radius (ft)", text: $fieldRadius)
                        .keyboardType(.decimalPad)
                    TextField("GPM", text: $fieldGPM)
                        .keyboardType(.decimalPad)
                    TextField("Notes", text: $extraNotes, axis: .vertical)
                        .lineLimit(3...)
                }

                // Mark as checked
                Section {
                    Toggle("Head cleared — field walk done", isOn: $preSeasonChecked)
                        .tint(FairwayTheme.accentGold)
                }

                // Measurement guide (collapsed by default)
                Section {
                    DisclosureGroup("Field Measurement Guide") {
                        VStack(alignment: .leading, spacing: 16) {
                            guideItem(
                                icon: "arrow.trianglehead.clockwise",
                                title: "Arc (°)",
                                body: "Stand at the head during a wet run and look straight down. Note where the spray starts and where it stops. Common values: 90° = quarter circle, 180° = half circle, 270° = three-quarters, 360° = full rotation. Many Hunter heads have a small slot on top to adjust arc with a flat-head screwdriver."
                            )
                            Divider()
                            guideItem(
                                icon: "ruler",
                                title: "Radius (ft)",
                                body: "Hold a tape measure from the center of the head to the farthest point of consistent coverage during a wet run. Measure at the edge of the main spray pattern, not stray mist. MP Rotators: 8–30 ft depending on model. Fixed sprays: 4–8 ft."
                            )
                            Divider()
                            guideItem(
                                icon: "drop",
                                title: "GPM — Catch Cup Test",
                                body: """
Rachio uses precipitation rate (in/hr), not raw GPM. The catch cup test measures PR directly.

1. Place flat-sided containers (tuna cans work well, ~1 in depth) in a grid across the spray zone
2. Run the zone exactly 15 minutes
3. Measure water depth in each can (inches)
4. Average all depths, then multiply × 4 → that's your PR in in/hr

To estimate single-head GPM from the spec sheet instead:
• Rain Bird VAN yellow (4 ft) — ~0.3 GPM
• Rain Bird 1555 fixed spray — ~0.5–0.7 GPM
• MP800 (6–12 ft) — ~0.4–0.5 GPM
• MP1000 (8–15 ft) — ~0.45–0.6 GPM
• MP2000 (13–21 ft) — ~0.6–0.8 GPM
• MP3000 (22–30 ft) — ~0.8–1.0 GPM

Log PR (in/hr) in each Zone's Schedule settings in Rachio — that's what drives Flex Daily math.
"""
                            )
                        }
                        .padding(.top, 8)
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle(head.label)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { save() }
                        .bold()
                }
            }
        }
    }

    // MARK: - Estimated values

    private var radiusEstimate: String? {
        if head.radiusFeet > 0 { return "\(head.radiusFeet) ft" }
        let obs = head.auditObservation.lowercased()
        if obs.contains("mp3000") { return "22–30 ft" }
        if obs.contains("mp2000") || obs.contains("cobalt blue") { return "13–21 ft" }
        if obs.contains("mp800") || obs.contains("teal") || obs.contains("sea-green") { return "6–12 ft" }
        if obs.contains("mp1000") || obs.contains("cream cap") || obs.contains("cream/tan") { return "8–15 ft" }
        if obs.contains("mp rotator") { return "8–15 ft" }
        if obs.contains("van yellow") { return "~4 ft" }
        if obs.contains("1555") { return "5–8 ft" }
        return nil
    }

    private var gpmEstimate: String? {
        let obs = head.auditObservation.lowercased()
        if obs.contains("mp3000") || obs.contains("red cap") { return "~0.8–1.0 GPM" }
        if obs.contains("mp2000") || obs.contains("cobalt blue") { return "~0.6–0.8 GPM" }
        if obs.contains("mp800") || obs.contains("teal") || obs.contains("sea-green") { return "~0.4–0.5 GPM" }
        if obs.contains("mp1000") || obs.contains("cream cap") || obs.contains("cream/tan") { return "~0.45–0.6 GPM" }
        if obs.contains("mp rotator") { return "~0.4–0.8 GPM" }
        if obs.contains("van yellow") { return "~0.3 GPM" }
        if obs.contains("1555") { return "~0.5–0.7 GPM" }
        return nil
    }

    // MARK: - Blocked action

    private var blockedAction: String {
        let obs = head.auditObservation
        if obs.contains("erosion pit") { return "Dig out head + raise with swing-pipe extender" }
        if obs.contains("mud") { return "Dig out head completely, clean cap, re-photo" }
        if obs.contains("empty nozzle") || obs.contains("dirt-packed") { return "Clear nozzle slot, then install and confirm nozzle type" }
        if obs.contains("buried") { return "Clear soil from cap, then re-photo close-up" }
        return "Clear obstruction, then re-photo"
    }

    // MARK: - Sub-views

    @ViewBuilder
    private func estimatedRow(icon: String, label: String, estimate: String?, fallback: String) -> some View {
        HStack {
            Label(label, systemImage: icon)
                .foregroundStyle(FairwayTheme.textPrimary)
            Spacer()
            if let e = estimate {
                Text(e)
                    .font(.caption.bold())
                    .foregroundStyle(FairwayTheme.accentGold)
            } else {
                Text(fallback)
                    .font(.caption)
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
        }
        .font(.callout)
    }

    @ViewBuilder
    private func guideItem(icon: String, title: String, body: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Label(title, systemImage: icon)
                .font(.subheadline.bold())
                .foregroundStyle(FairwayTheme.textPrimary)
            Text(body)
                .font(.caption)
                .foregroundStyle(FairwayTheme.textSecondary)
        }
    }

    private var confidenceDot: some View {
        Circle()
            .fill(dotColor)
            .frame(width: 10, height: 10)
            .padding(.top, 4)
    }

    private var dotColor: Color {
        switch head.auditConfidence {
        case "high":    return .green
        case "med":     return .orange
        case "low":     return .yellow
        case "blocked": return .red
        default:        return .gray
        }
    }

    private func save() {
        var updated = head
        updated.fieldNozzle = fieldNozzle
        updated.fieldArcDegrees = Int(fieldArc)
        updated.fieldRadiusFeet = Double(fieldRadius)
        updated.fieldGPM = Double(fieldGPM)
        updated.preSeasonChecked = preSeasonChecked
        updated.notes = extraNotes
        onSave(updated)
        dismiss()
    }
}
