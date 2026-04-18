import SwiftUI

struct HeadDetailView: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let zoneID: UUID
    let headID: UUID
    @State private var editing = false
    @State private var draft: HeadData?

    @MainActor private var currentHead: HeadData? {
        store.zone(withID: zoneID)?.heads.first(where: { $0.id == headID })
    }

    var body: some View {
        Group {
            if let head = draft ?? currentHead {
                ScrollView {
                    VStack(spacing: 16) {
                        headerCard(head: head)
                        if editing {
                            editForm()
                        } else {
                            displayCards(head: head)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                }
                .background(FairwayTheme.backgroundPrimary)
                .navigationTitle(head.label)
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        if editing {
                            Button("Save") {
                                if let d = draft {
                                    store.updateHead(d, in: zoneID)
                                }
                                editing = false
                                draft = nil
                            }
                            .bold()
                        } else {
                            Button("Edit") {
                                draft = currentHead
                                editing = true
                            }
                        }
                    }
                }
            } else {
                ContentUnavailableView("Head not found", systemImage: "questionmark.circle")
            }
        }
    }

    private func headerCard(head: HeadData) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Text(head.label).font(.title2.bold())
                        .foregroundStyle(FairwayTheme.textPrimary)
                    Spacer()
                    if !head.isConfirmed { PreSeasonBadge() }
                }
                Text("\(head.headType) — \(head.nozzle)")
                    .font(.subheadline)
                    .foregroundStyle(FairwayTheme.textSecondary)
                if !head.location.isEmpty {
                    Label(head.location, systemImage: "mappin.circle")
                        .font(.footnote)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
            }
        }
    }

    private func displayCards(head: HeadData) -> some View {
        VStack(spacing: 12) {
            FairwayCard {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Specs").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                    InfoLine(label: "Arc", value: "\(head.arcDegrees)°")
                    InfoLine(label: "Radius", value: String(format: "%.1f", head.radiusFeet) + " ft")
                    InfoLine(label: "GPM", value: String(format: "%.2f", head.gpm))
                    InfoLine(label: "Confirmed", value: head.isConfirmed ? "Yes" : "Pre-season")
                    InfoLine(label: "Confirmed by season test", value: head.confirmedBySeasonTest ? "Yes" : "No")
                }
            }

            FairwayCard {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Service").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                    InfoLine(label: "Installed", value: head.installDate.map(format) ?? "—")
                    InfoLine(label: "Last serviced", value: head.lastServiced.map(format) ?? "—")
                    InfoLine(label: "Photo attached", value: head.photoAttached ? "Yes" : "No")
                }
            }

            FairwayCard {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Issues").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                    if head.issues.isEmpty {
                        Text("No active issues").font(.footnote).foregroundStyle(FairwayTheme.textSecondary)
                    } else {
                        FlowChips(items: head.issues.map(\.rawValue), color: FairwayTheme.statusAction)
                    }
                }
            }

            if !head.notes.isEmpty {
                FairwayCard {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Notes").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                        Text(head.notes).font(.footnote).foregroundStyle(FairwayTheme.textPrimary)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private func editForm() -> some View {
        Form {
            Section("Identity") {
                TextField("Label", text: Binding(
                    get: { draft?.label ?? "" },
                    set: { draft?.label = $0 }
                ))
                TextField("Head type", text: Binding(
                    get: { draft?.headType ?? "" },
                    set: { draft?.headType = $0 }
                ))
                TextField("Nozzle", text: Binding(
                    get: { draft?.nozzle ?? "" },
                    set: { draft?.nozzle = $0 }
                ))
                Stepper("Arc: \(draft?.arcDegrees ?? 0)°", value: Binding(
                    get: { draft?.arcDegrees ?? 0 },
                    set: { draft?.arcDegrees = $0 }
                ), in: 0...360, step: 45)
                TextField("Location", text: Binding(
                    get: { draft?.location ?? "" },
                    set: { draft?.location = $0 }
                ))
            }
            Section("Specs") {
                HStack {
                    Text("Radius (ft)"); Spacer()
                    TextField("0", value: Binding(
                        get: { draft?.radiusFeet ?? 0 },
                        set: { draft?.radiusFeet = $0 }
                    ), format: .number)
                    .keyboardType(.decimalPad)
                    .multilineTextAlignment(.trailing)
                }
                HStack {
                    Text("GPM"); Spacer()
                    TextField("0", value: Binding(
                        get: { draft?.gpm ?? 0 },
                        set: { draft?.gpm = $0 }
                    ), format: .number)
                    .keyboardType(.decimalPad)
                    .multilineTextAlignment(.trailing)
                }
            }
            Section("Confirmation") {
                Toggle("Confirmed", isOn: Binding(
                    get: { draft?.isConfirmed ?? false },
                    set: { draft?.isConfirmed = $0 }
                ))
                Toggle("Confirmed by season test", isOn: Binding(
                    get: { draft?.confirmedBySeasonTest ?? false },
                    set: { draft?.confirmedBySeasonTest = $0 }
                ))
                Toggle("Photo attached", isOn: Binding(
                    get: { draft?.photoAttached ?? false },
                    set: { draft?.photoAttached = $0 }
                ))
            }
            Section("Issues") {
                ForEach(HeadIssue.allCases) { issue in
                    let isSelected = draft?.issues.contains(issue) ?? false
                    Button {
                        toggleIssue(issue)
                    } label: {
                        HStack {
                            Text(issue.rawValue)
                            Spacer()
                            if isSelected {
                                Image(systemName: "checkmark")
                                    .foregroundStyle(FairwayTheme.accentGold)
                            }
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
            Section("Notes") {
                TextField("Notes", text: Binding(
                    get: { draft?.notes ?? "" },
                    set: { draft?.notes = $0 }
                ), axis: .vertical)
                .lineLimit(3...6)
            }
        }
        .scrollContentBackground(.hidden)
        .background(FairwayTheme.backgroundPrimary)
        .frame(minHeight: 700)
    }

    private func toggleIssue(_ issue: HeadIssue) {
        guard var d = draft else { return }
        if let idx = d.issues.firstIndex(of: issue) {
            d.issues.remove(at: idx)
        } else {
            d.issues.append(issue)
        }
        draft = d
    }

    private func format(_ date: Date) -> String {
        let df = DateFormatter()
        df.dateStyle = .medium
        return df.string(from: date)
    }
}

struct InfoLine: View {
    let label: String
    let value: String
    var body: some View {
        HStack {
            Text(label).foregroundStyle(FairwayTheme.textSecondary)
            Spacer()
            Text(value).foregroundStyle(FairwayTheme.textPrimary)
        }
        .font(.footnote)
    }
}

struct FlowChips: View {
    let items: [String]
    let color: Color

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            ForEach(items, id: \.self) { item in
                Text(item)
                    .font(.caption2.bold())
                    .padding(.horizontal, 8).padding(.vertical, 3)
                    .background(color.opacity(0.18))
                    .foregroundStyle(color)
                    .clipShape(Capsule())
            }
        }
    }
}
