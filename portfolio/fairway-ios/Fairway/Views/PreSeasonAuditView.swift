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
            // Checked state
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
    @State private var preSeasonChecked: Bool
    @State private var extraNotes: String
    @Environment(\.dismiss) private var dismiss

    init(head: HeadData, onSave: @escaping (HeadData) -> Void) {
        self.head = head
        self.onSave = onSave
        _fieldNozzle = State(initialValue: head.fieldNozzle)
        _fieldArc = State(initialValue: head.fieldArcDegrees.map { String($0) } ?? "")
        _fieldRadius = State(initialValue: head.fieldRadiusFeet.map { String($0) } ?? "")
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

                // What photos can't tell us
                if !head.auditIsBlocked {
                    Section("Still needed from field") {
                        Label("Arc (°)", systemImage: "arrow.trianglehead.clockwise")
                        Label("Radius (ft) — tape measure during wet run", systemImage: "ruler")
                        Label("GPM — catch-cup test", systemImage: "drop")
                        if head.auditConfidence == "low" || head.auditConfidence == "med" {
                            Label("Nozzle re-confirm — read label physically", systemImage: "magnifyingglass")
                                .foregroundStyle(.orange)
                        }
                    }
                    .foregroundStyle(FairwayTheme.textSecondary)
                    .font(.callout)
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
                    TextField("Notes", text: $extraNotes, axis: .vertical)
                        .lineLimit(3...)
                }

                // Mark as checked
                Section {
                    Toggle("Head cleared — field walk done", isOn: $preSeasonChecked)
                        .tint(FairwayTheme.accentGold)
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

    private var blockedAction: String {
        if head.auditObservation.contains("erosion pit") { return "Dig out head + raise with swing-pipe extender" }
        if head.auditObservation.contains("mud") { return "Dig out head completely, clean cap, re-photo" }
        if head.auditObservation.contains("empty nozzle") || head.auditObservation.contains("dirt-packed") { return "Clear nozzle slot, then install and confirm nozzle type" }
        if head.auditObservation.contains("buried") { return "Clear soil from cap, then re-photo close-up" }
        return "Clear obstruction, then re-photo"
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
        updated.preSeasonChecked = preSeasonChecked
        updated.notes = extraNotes
        onSave(updated)
        dismiss()
    }
}
