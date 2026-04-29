import SwiftUI

@MainActor
struct HeadInventoryView: View {
    @Environment(FairwayStore.self) private var store
    let zoneID: UUID
    var subZoneHeadIDs: Set<UUID>? = nil
    @State private var showAddHead = false

    private var zone: ZoneData? { store.zone(withID: zoneID) }
    private func visibleHeads(in zone: ZoneData) -> [HeadData] {
        guard let filter = subZoneHeadIDs else { return zone.heads }
        return zone.heads.filter { filter.contains($0.id) }
    }

    var body: some View {
        VStack(spacing: 10) {
            HStack {
                let count = zone.map { visibleHeads(in: $0).count } ?? 0
                Text("\(count) heads")
                    .font(.caption)
                    .foregroundStyle(FairwayTheme.textSecondary)
                Spacer()
                Button {
                    showAddHead = true
                } label: {
                    Label("Add Head", systemImage: "plus.circle.fill")
                        .font(.subheadline.bold())
                        .foregroundStyle(FairwayTheme.accentGold)
                }
            }

            if let zone {
                let visible = visibleHeads(in: zone)
                if visible.isEmpty {
                    emptyState
                } else if zone.number == 2 && subZoneHeadIDs == nil {
                    z2GroupedList(zone: zone)
                } else {
                    flatList(zone: zone, heads: visible)
                }
            }
        }
        .sheet(isPresented: $showAddHead) {
            AddHeadSheet(zoneID: zoneID)
        }
    }

    @ViewBuilder
    private func z2GroupedList(zone: ZoneData) -> some View {
        let parkStrip = zone.heads.filter { isParkStrip(label: $0.label) }
        let mainYard  = zone.heads.filter { !isParkStrip(label: $0.label) }
        VStack(spacing: 8) {
            if !parkStrip.isEmpty {
                sectionHeader("Park Strip")
                flatList(zone: zone, heads: parkStrip)
            }
            if !mainYard.isEmpty {
                sectionHeader("Main Yard")
                flatList(zone: zone, heads: mainYard)
            }
        }
    }

    @ViewBuilder
    private func flatList(zone: ZoneData, heads: [HeadData]) -> some View {
        VStack(spacing: 8) {
            ForEach(heads) { head in
                NavigationLink {
                    HeadDetailView(zoneID: zone.id, headID: head.id)
                } label: {
                    HeadRow(head: head)
                }
                .buttonStyle(.plain)
                .swipeActions {
                    Button(role: .destructive) {
                        store.deleteHead(id: head.id, from: zone.id)
                    } label: {
                        Label("Delete", systemImage: "trash")
                    }
                }
            }
        }
    }

    private func sectionHeader(_ title: String) -> some View {
        HStack {
            Text(title.uppercased())
                .font(.caption.bold())
                .foregroundStyle(FairwayTheme.textSecondary)
            Spacer()
        }
        .padding(.top, 4)
    }

    /// Park strip: Z2-S1..Z2-S6 + Z2-MATCH-* (the 6 numbered park-strip pins).
    /// Everything else inside Z2 is treated as Main Yard.
    private func isParkStrip(label: String) -> Bool {
        if label.hasPrefix("Z2-MATCH-") { return true }
        guard label.hasPrefix("Z2-S"),
              let n = Int(label.dropFirst(4)) else { return false }
        return (1...6).contains(n)
    }

    private var emptyState: some View {
        FairwayCard {
            VStack(spacing: 8) {
                Image(systemName: "drop.circle")
                    .font(.system(size: 32))
                    .foregroundStyle(FairwayTheme.textSecondary)
                Text("No heads logged yet")
                    .font(.subheadline.bold())
                    .foregroundStyle(FairwayTheme.textPrimary)
                Text("Tap + to add your first head.")
                    .font(.caption)
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
        }
    }
}

private struct HeadRow: View {
    let head: HeadData

    var body: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text(head.label)
                        .font(.headline)
                        .foregroundStyle(FairwayTheme.textPrimary)
                    if !head.isConfirmed {
                        PreSeasonBadge()
                    }
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.caption)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
                Text("\(head.headType) — \(head.nozzle)")
                    .font(.subheadline)
                    .foregroundStyle(FairwayTheme.textSecondary)
                if !head.location.isEmpty {
                    Label(head.location, systemImage: "mappin.circle")
                        .font(.caption)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
                if !head.issues.isEmpty {
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 6) {
                            ForEach(head.issues) { issue in
                                Text(issue.rawValue)
                                    .font(.caption2.bold())
                                    .padding(.horizontal, 8).padding(.vertical, 3)
                                    .background(FairwayTheme.statusAction.opacity(0.18))
                                    .foregroundStyle(FairwayTheme.statusAction)
                                    .clipShape(Capsule())
                            }
                        }
                    }
                }
            }
        }
    }
}

struct AddHeadSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let zoneID: UUID
    @State private var draft = HeadData(label: "", headType: "Hunter Pro-Spray", nozzle: "", arcDegrees: 90, location: "", isConfirmed: false)

    var body: some View {
        NavigationStack {
            Form {
                Section("Identity") {
                    TextField("Label (e.g. H2-7)", text: $draft.label)
                    TextField("Head type", text: $draft.headType)
                    TextField("Nozzle", text: $draft.nozzle)
                    Stepper("Arc: \(draft.arcDegrees)°", value: $draft.arcDegrees, in: 0...360, step: 45)
                }
                Section("Location") {
                    TextField("Location", text: $draft.location)
                    Toggle("Confirmed", isOn: $draft.isConfirmed)
                }
                Section("Specs") {
                    HStack {
                        Text("Radius (ft)")
                        Spacer()
                        TextField("0", value: $draft.radiusFeet, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                    }
                    HStack {
                        Text("GPM")
                        Spacer()
                        TextField("0", value: $draft.gpm, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Add Head")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        store.addHead(draft, to: zoneID)
                        dismiss()
                    }
                    .disabled(draft.label.isEmpty)
                }
            }
        }
    }
}
