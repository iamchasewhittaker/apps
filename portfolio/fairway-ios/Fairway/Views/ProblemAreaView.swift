import SwiftUI

@MainActor
struct ProblemAreaView: View {
    @Environment(FairwayStore.self) private var store
    let zoneID: UUID
    @State private var showAddProblem = false

    private var zone: ZoneData? { store.zone(withID: zoneID) }
    private var open: [ProblemData] { zone?.problemAreas.filter { !$0.isResolved } ?? [] }
    private var resolved: [ProblemData] { zone?.problemAreas.filter { $0.isResolved } ?? [] }
    private var shoppingList: [NozzleShoppingItem] { store.recommendedNozzleShoppingList(for: zoneID) }

    var body: some View {
        VStack(spacing: 10) {
            HStack {
                Text("\(open.count) open, \(resolved.count) resolved")
                    .font(.caption)
                    .foregroundStyle(FairwayTheme.textSecondary)
                Spacer()
                Button {
                    showAddProblem = true
                } label: {
                    Label("Add Problem", systemImage: "plus.circle.fill")
                        .font(.subheadline.bold())
                        .foregroundStyle(FairwayTheme.accentGold)
                }
            }

            if (zone?.problemAreas.isEmpty ?? true) && shoppingList.isEmpty {
                emptyState
            } else {
                if !open.isEmpty {
                    sectionHeader("Open")
                    VStack(spacing: 8) {
                        ForEach(open) { problem in
                            ProblemRow(problem: problem,
                                       onToggle: { toggleResolved(problem) },
                                       onDelete: { delete(problem) })
                        }
                    }
                }
                if !resolved.isEmpty {
                    sectionHeader("Resolved")
                    VStack(spacing: 8) {
                        ForEach(resolved) { problem in
                            ProblemRow(problem: problem,
                                       onToggle: { toggleResolved(problem) },
                                       onDelete: { delete(problem) })
                                .opacity(0.65)
                        }
                    }
                }
                if !shoppingList.isEmpty {
                    sectionHeader("More — Shopping List")
                    VStack(spacing: 8) {
                        ForEach(shoppingList) { item in
                            ShoppingItemRow(item: item)
                        }
                    }
                }
            }
        }
        .sheet(isPresented: $showAddProblem) {
            AddProblemSheet(zoneID: zoneID)
        }
    }

    private func sectionHeader(_ title: String) -> some View {
        HStack {
            Text(title.uppercased())
                .font(.caption.bold())
                .foregroundStyle(FairwayTheme.textSecondary)
            Spacer()
        }
        .padding(.top, 8)
    }

    private func toggleResolved(_ problem: ProblemData) {
        var updated = problem
        updated.isResolved.toggle()
        updated.resolvedDate = updated.isResolved ? Date() : nil
        store.updateProblem(updated, in: zoneID)
    }

    private func delete(_ problem: ProblemData) {
        store.deleteProblem(id: problem.id, from: zoneID)
    }

    private var emptyState: some View {
        FairwayCard {
            VStack(spacing: 8) {
                Image(systemName: "checkmark.seal.fill")
                    .font(.system(size: 32))
                    .foregroundStyle(FairwayTheme.statusHealthy)
                Text("No problems logged")
                    .font(.subheadline.bold())
                    .foregroundStyle(FairwayTheme.textPrimary)
                Text("Looking good!")
                    .font(.caption)
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
        }
    }
}

private struct ProblemRow: View {
    let problem: ProblemData
    let onToggle: () -> Void
    let onDelete: () -> Void

    var body: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(problem.title)
                        .font(.headline)
                        .foregroundStyle(FairwayTheme.textPrimary)
                    Spacer()
                    SeverityBadge(severity: problem.severity)
                }
                HStack(spacing: 8) {
                    ProblemBadge(isPreSeason: problem.isPreSeason)
                    if problem.isResolved {
                        Label("Resolved", systemImage: "checkmark.circle.fill")
                            .font(.caption2.bold())
                            .foregroundStyle(FairwayTheme.statusHealthy)
                    }
                }
                if !problem.description.isEmpty {
                    Text(problem.description)
                        .font(.footnote)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
                if !problem.actions.isEmpty {
                    VStack(alignment: .leading, spacing: 4) {
                        ForEach(problem.actions, id: \.self) { action in
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
                    .padding(.top, 2)
                }
                HStack {
                    Spacer()
                    Button(problem.isResolved ? "Reopen" : "Resolve", action: onToggle)
                        .font(.caption.bold())
                        .padding(.horizontal, 12).padding(.vertical, 6)
                        .background(FairwayTheme.backgroundElevated)
                        .clipShape(Capsule())
                        .foregroundStyle(FairwayTheme.textPrimary)
                    Button(role: .destructive, action: onDelete) {
                        Image(systemName: "trash")
                    }
                    .font(.caption)
                    .padding(.horizontal, 10).padding(.vertical, 6)
                    .background(FairwayTheme.backgroundElevated)
                    .clipShape(Capsule())
                }
            }
        }
    }
}

private struct ShoppingItemRow: View {
    let item: NozzleShoppingItem

    var body: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Label(item.recommendedNozzle, systemImage: "cart.fill")
                        .font(.subheadline.bold())
                        .foregroundStyle(FairwayTheme.textPrimary)
                    Spacer()
                    Text("×\(item.quantity)")
                        .font(.subheadline.bold())
                        .padding(.horizontal, 8).padding(.vertical, 2)
                        .background(FairwayTheme.accentGold.opacity(0.25))
                        .foregroundStyle(FairwayTheme.accentGold)
                        .clipShape(Capsule())
                }
                Text(item.reason)
                    .font(.caption)
                    .foregroundStyle(FairwayTheme.textSecondary)
                Text(item.headLabels.joined(separator: ", "))
                    .font(.caption.monospaced())
                    .foregroundStyle(FairwayTheme.textSecondary)
                    .fixedSize(horizontal: false, vertical: true)
            }
        }
    }
}

struct AddProblemSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let zoneID: UUID
    @State private var draft = ProblemData(title: "", severity: .low, isPreSeason: true)
    @State private var actionDraft: String = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Describe") {
                    TextField("Title", text: $draft.title)
                    TextField("Description", text: $draft.description, axis: .vertical).lineLimit(2...5)
                }
                Section("Specific things needed") {
                    ForEach(draft.actions.indices, id: \.self) { idx in
                        HStack {
                            Text("•").foregroundStyle(FairwayTheme.accentGold)
                            Text(draft.actions[idx]).font(.footnote)
                            Spacer()
                            Button(role: .destructive) {
                                draft.actions.remove(at: idx)
                            } label: { Image(systemName: "minus.circle") }
                                .buttonStyle(.plain)
                        }
                    }
                    HStack {
                        TextField("Add an action…", text: $actionDraft)
                        Button {
                            let trimmed = actionDraft.trimmingCharacters(in: .whitespacesAndNewlines)
                            guard !trimmed.isEmpty else { return }
                            draft.actions.append(trimmed)
                            actionDraft = ""
                        } label: { Image(systemName: "plus.circle.fill") }
                            .buttonStyle(.plain)
                            .foregroundStyle(FairwayTheme.accentGold)
                            .disabled(actionDraft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                    }
                }
                Section("Classification") {
                    Picker("Severity", selection: $draft.severity) {
                        ForEach(Severity.allCases) { s in
                            Text(s.rawValue).tag(s)
                        }
                    }
                    Toggle("Pre-season (unconfirmed)", isOn: $draft.isPreSeason)
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Add Problem")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        store.addProblem(draft, to: zoneID)
                        dismiss()
                    }
                    .disabled(draft.title.isEmpty)
                }
            }
        }
    }
}
