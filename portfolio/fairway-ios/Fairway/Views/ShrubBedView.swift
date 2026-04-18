import SwiftUI

struct ShrubBedView: View {
    @Environment(FairwayStore.self) private var store
    let zoneID: UUID

    @MainActor private var zone: ZoneData? { store.zone(withID: zoneID) }

    var body: some View {
        VStack(spacing: 12) {
            if let zone {
                if zone.shrubBeds.isEmpty {
                    emptyState
                } else {
                    ForEach(zone.shrubBeds) { bed in
                        ShrubBedCard(zoneID: zone.id, bed: bed)
                    }
                }
            }
        }
    }

    private var emptyState: some View {
        FairwayCard {
            VStack(spacing: 8) {
                Image(systemName: "leaf")
                    .font(.system(size: 32))
                    .foregroundStyle(FairwayTheme.textSecondary)
                Text("No shrub beds defined")
                    .font(.subheadline.bold())
                    .foregroundStyle(FairwayTheme.textPrimary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
        }
    }
}

private struct ShrubBedCard: View {
    @Environment(FairwayStore.self) private var store
    let zoneID: UUID
    let bed: ShrubBed
    @State private var expanded = true
    @State private var showAddTask = false

    var body: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 10) {
                // Header
                Button {
                    expanded.toggle()
                } label: {
                    HStack {
                        VStack(alignment: .leading) {
                            Text(bed.label).font(.headline).foregroundStyle(FairwayTheme.textPrimary)
                            Text(bed.description).font(.caption).foregroundStyle(FairwayTheme.textSecondary)
                        }
                        Spacer()
                        Image(systemName: expanded ? "chevron.up" : "chevron.down")
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }
                }
                .buttonStyle(.plain)

                if expanded {
                    Divider().background(FairwayTheme.textSecondary.opacity(0.3))

                    // Plants
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Plants")
                            .font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                        ForEach(bed.plants) { plant in
                            HStack(spacing: 10) {
                                Image(systemName: "drop.fill")
                                    .foregroundStyle(FairwayTheme.waterNeedColor(plant.waterNeeds))
                                    .font(.footnote)
                                Text("\(plant.count) × \(plant.name)")
                                    .font(.footnote)
                                    .foregroundStyle(FairwayTheme.textPrimary)
                                Spacer()
                                Text(plant.waterNeeds.rawValue)
                                    .font(.caption2)
                                    .foregroundStyle(FairwayTheme.waterNeedColor(plant.waterNeeds))
                            }
                        }
                    }

                    // Upkeep
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Text("Upkeep")
                                .font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                            Spacer()
                            Button {
                                showAddTask = true
                            } label: {
                                Image(systemName: "plus.circle")
                                    .foregroundStyle(FairwayTheme.accentGold)
                            }
                        }
                        if bed.upkeepTasks.isEmpty {
                            Text("No tasks").font(.caption).foregroundStyle(FairwayTheme.textSecondary)
                        } else {
                            ForEach(bed.upkeepTasks) { task in
                                UpkeepRow(task: task, onToggle: { toggleTask(task) })
                            }
                        }
                    }

                    if let last = bed.lastUpkeepDate {
                        HStack {
                            Image(systemName: "clock")
                            Text("Last upkeep: \(last, style: .date)")
                        }
                        .font(.caption)
                        .foregroundStyle(FairwayTheme.textSecondary)
                    }

                    if !bed.notes.isEmpty {
                        Text(bed.notes)
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }
                }
            }
        }
        .sheet(isPresented: $showAddTask) {
            AddBedTaskSheet(zoneID: zoneID, bed: bed)
        }
    }

    @MainActor private func toggleTask(_ task: BedUpkeepTask) {
        var updatedBed = bed
        guard let idx = updatedBed.upkeepTasks.firstIndex(where: { $0.id == task.id }) else { return }
        updatedBed.upkeepTasks[idx].isCompleted.toggle()
        updatedBed.upkeepTasks[idx].completedDate = updatedBed.upkeepTasks[idx].isCompleted ? Date() : nil
        if updatedBed.upkeepTasks[idx].isCompleted {
            updatedBed.lastUpkeepDate = Date()
        }
        store.updateBed(updatedBed, in: zoneID)
    }
}

private struct UpkeepRow: View {
    let task: BedUpkeepTask
    let onToggle: () -> Void

    var body: some View {
        HStack(spacing: 10) {
            Button(action: onToggle) {
                Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                    .foregroundStyle(task.isCompleted ? FairwayTheme.statusHealthy : FairwayTheme.textSecondary)
            }
            .buttonStyle(.plain)

            VStack(alignment: .leading, spacing: 2) {
                Text(task.title)
                    .font(.footnote)
                    .foregroundStyle(FairwayTheme.textPrimary)
                    .strikethrough(task.isCompleted)
                if let due = task.dueDate {
                    Text(due, style: .date)
                        .font(.caption2)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
            }
            Spacer()
            if task.reminderEnabled {
                Image(systemName: "bell.fill")
                    .font(.caption)
                    .foregroundStyle(FairwayTheme.accentGold)
            }
        }
    }
}

struct AddBedTaskSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let zoneID: UUID
    let bed: ShrubBed
    @State private var title = ""
    @State private var dueDate: Date = Date()
    @State private var hasDueDate = true
    @State private var reminderEnabled = false

    var body: some View {
        NavigationStack {
            Form {
                Section("Task") {
                    TextField("Title", text: $title)
                }
                Section("When") {
                    Toggle("Has due date", isOn: $hasDueDate)
                    if hasDueDate {
                        DatePicker("Due", selection: $dueDate, displayedComponents: .date)
                    }
                    Toggle("Remind me", isOn: $reminderEnabled)
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Bed Upkeep")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        var updated = bed
                        updated.upkeepTasks.append(BedUpkeepTask(
                            title: title,
                            dueDate: hasDueDate ? dueDate : nil,
                            reminderEnabled: reminderEnabled
                        ))
                        store.updateBed(updated, in: zoneID)
                        dismiss()
                    }
                    .disabled(title.isEmpty)
                }
            }
        }
    }
}
