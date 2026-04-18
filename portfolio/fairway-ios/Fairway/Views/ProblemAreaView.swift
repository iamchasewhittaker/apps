import SwiftUI

struct ProblemAreaView: View {
    @Environment(FairwayStore.self) private var store
    let zoneID: UUID
    @State private var showAddProblem = false

    @MainActor private var zone: ZoneData? { store.zone(withID: zoneID) }
    @MainActor private var open: [ProblemData] { zone?.problemAreas.filter { !$0.isResolved } ?? [] }
    @MainActor private var resolved: [ProblemData] { zone?.problemAreas.filter { $0.isResolved } ?? [] }

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

            if zone?.problemAreas.isEmpty ?? true {
                emptyState
            } else {
                if !open.isEmpty {
                    sectionHeader("Open")
                    VStack(spacing: 8) {
                        ForEach(open) { problem in
                            ProblemRow(problem: problem, onToggle: { toggleResolved(problem) }, onDelete: { delete(problem) })
                        }
                    }
                }
                if !resolved.isEmpty {
                    sectionHeader("Resolved")
                    VStack(spacing: 8) {
                        ForEach(resolved) { problem in
                            ProblemRow(problem: problem, onToggle: { toggleResolved(problem) }, onDelete: { delete(problem) })
                                .opacity(0.65)
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

    @MainActor private func toggleResolved(_ problem: ProblemData) {
        var updated = problem
        updated.isResolved.toggle()
        updated.resolvedDate = updated.isResolved ? Date() : nil
        store.updateProblem(updated, in: zoneID)
    }

    @MainActor private func delete(_ problem: ProblemData) {
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

struct AddProblemSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let zoneID: UUID
    @State private var draft = ProblemData(title: "", severity: .low, isPreSeason: true)

    var body: some View {
        NavigationStack {
            Form {
                Section("Describe") {
                    TextField("Title", text: $draft.title)
                    TextField("Description", text: $draft.description, axis: .vertical).lineLimit(2...5)
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
