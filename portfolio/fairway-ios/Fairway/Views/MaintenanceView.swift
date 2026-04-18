import SwiftUI

struct MaintenanceView: View {
    @Environment(FairwayStore.self) private var store
    @State private var showAddTask = false
    @State private var showTestRun = false

    @MainActor private var sortedTasks: [MaintenanceTask] {
        store.blob.maintenanceTasks.sorted { a, b in
            if a.isCompleted != b.isCompleted { return !a.isCompleted && b.isCompleted }
            switch (a.targetDate, b.targetDate) {
            case let (ad?, bd?): return ad < bd
            case (nil, _?): return false
            case (_?, nil): return true
            case (nil, nil): return a.title < b.title
            }
        }
    }

    @MainActor private var lastMow: MowEntry? {
        store.blob.mowLog.max(by: { $0.date < $1.date })
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                seasonTestCard
                taskListSection
                mowSection
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(FairwayTheme.backgroundPrimary)
        .navigationTitle("Maintenance")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button { showAddTask = true } label: {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(isPresented: $showAddTask) { AddMaintenanceTaskSheet() }
        .sheet(isPresented: $showTestRun) { SeasonTestRunSheet() }
    }

    private var seasonTestCard: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Image(systemName: "figure.walk")
                        .font(.title3)
                        .foregroundStyle(FairwayTheme.accentGold)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Season Test Run")
                            .font(.headline)
                            .foregroundStyle(FairwayTheme.textPrimary)
                        Text("First walkthrough of season")
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }
                    Spacer()
                }
                Text("Walk every zone, confirm heads, flag issues.")
                    .font(.footnote)
                    .foregroundStyle(FairwayTheme.textSecondary)
                Button {
                    showTestRun = true
                } label: {
                    HStack {
                        Image(systemName: "play.fill")
                        Text("Start Checklist")
                    }
                    .font(.subheadline.bold())
                    .padding(.horizontal, 14).padding(.vertical, 8)
                    .background(FairwayTheme.accentGreen)
                    .foregroundStyle(FairwayTheme.textPrimary)
                    .clipShape(Capsule())
                }
            }
        }
    }

    @MainActor private var taskListSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("TASKS")
                .font(.caption.bold())
                .foregroundStyle(FairwayTheme.textSecondary)
            VStack(spacing: 8) {
                ForEach(sortedTasks) { task in
                    TaskRow(task: task,
                            onToggleComplete: { toggleCompletion(task) },
                            onToggleReminder: { toggleReminder(task) })
                        .swipeActions {
                            Button(role: .destructive) {
                                store.deleteMaintenanceTask(id: task.id)
                            } label: {
                                Label("Delete", systemImage: "trash")
                            }
                        }
                }
            }
        }
    }

    @MainActor private var mowSection: some View {
        NavigationLink {
            MowLogView()
        } label: {
            FairwayCard {
                HStack {
                    Image(systemName: "scissors")
                        .foregroundStyle(FairwayTheme.accentGold)
                    VStack(alignment: .leading, spacing: 2) {
                        Text("Mow Log")
                            .font(.headline)
                            .foregroundStyle(FairwayTheme.textPrimary)
                        if let last = lastMow {
                            let days = Calendar.current.dateComponents([.day], from: last.date, to: Date()).day ?? 0
                            Text("Last mowed \(days) day\(days == 1 ? "" : "s") ago")
                                .font(.caption)
                                .foregroundStyle(FairwayTheme.textSecondary)
                        } else {
                            Text("No mows logged yet")
                                .font(.caption)
                                .foregroundStyle(FairwayTheme.textSecondary)
                        }
                    }
                    Spacer()
                    Image(systemName: "chevron.right").foregroundStyle(FairwayTheme.textSecondary)
                }
            }
        }
        .buttonStyle(.plain)
    }

    @MainActor private func toggleCompletion(_ task: MaintenanceTask) {
        var updated = task
        updated.isCompleted.toggle()
        updated.completedDate = updated.isCompleted ? Date() : nil
        store.updateMaintenanceTask(updated)
    }

    @MainActor private func toggleReminder(_ task: MaintenanceTask) {
        var updated = task
        updated.reminderEnabled.toggle()
        store.updateMaintenanceTask(updated)
    }
}

private struct TaskRow: View {
    let task: MaintenanceTask
    let onToggleComplete: () -> Void
    let onToggleReminder: () -> Void

    private var urgencyColor: Color {
        if task.isCompleted { return FairwayTheme.textSecondary }
        guard let due = task.targetDate else { return FairwayTheme.textPrimary }
        let days = Calendar.current.dateComponents([.day], from: Date(), to: due).day ?? 0
        if days < 0 { return FairwayTheme.statusAction }
        if days <= 7 { return FairwayTheme.statusAttention }
        return FairwayTheme.textPrimary
    }

    var body: some View {
        FairwayCard {
            HStack(alignment: .top, spacing: 12) {
                Button(action: onToggleComplete) {
                    Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                        .font(.title3)
                        .foregroundStyle(task.isCompleted ? FairwayTheme.statusHealthy : FairwayTheme.textSecondary)
                }
                .buttonStyle(.plain)

                VStack(alignment: .leading, spacing: 4) {
                    HStack {
                        Image(systemName: task.category.icon)
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.textSecondary)
                        Text(task.title)
                            .font(.subheadline)
                            .foregroundStyle(urgencyColor)
                            .strikethrough(task.isCompleted)
                    }
                    HStack(spacing: 8) {
                        Text(task.category.rawValue)
                            .font(.caption2.bold())
                            .padding(.horizontal, 6).padding(.vertical, 2)
                            .background(FairwayTheme.backgroundElevated)
                            .clipShape(Capsule())
                            .foregroundStyle(FairwayTheme.textSecondary)
                        if let date = task.targetDate {
                            Text(date, style: .date)
                                .font(.caption2)
                                .foregroundStyle(urgencyColor)
                        }
                        if task.isRecurring, !task.recurrenceNote.isEmpty {
                            Label(task.recurrenceNote, systemImage: "arrow.triangle.2.circlepath")
                                .font(.caption2)
                                .foregroundStyle(FairwayTheme.textSecondary)
                        }
                    }
                }

                Spacer()
                Button(action: onToggleReminder) {
                    Image(systemName: task.reminderEnabled ? "bell.fill" : "bell")
                        .foregroundStyle(task.reminderEnabled ? FairwayTheme.accentGold : FairwayTheme.textSecondary)
                }
                .buttonStyle(.plain)
            }
        }
    }
}

struct AddMaintenanceTaskSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @State private var title = ""
    @State private var category: MaintenanceCategory = .irrigation
    @State private var hasDate = true
    @State private var date: Date = Date()
    @State private var reminderEnabled = false
    @State private var isRecurring = false
    @State private var recurrenceNote = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Task") {
                    TextField("Title", text: $title)
                    Picker("Category", selection: $category) {
                        ForEach(MaintenanceCategory.allCases) { c in
                            Text(c.rawValue).tag(c)
                        }
                    }
                }
                Section("Schedule") {
                    Toggle("Has target date", isOn: $hasDate)
                    if hasDate {
                        DatePicker("Date", selection: $date, displayedComponents: .date)
                    }
                    Toggle("Remind me", isOn: $reminderEnabled)
                    Toggle("Recurring", isOn: $isRecurring)
                    if isRecurring {
                        TextField("Recurrence note", text: $recurrenceNote)
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("New Task")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        store.addMaintenanceTask(MaintenanceTask(
                            title: title,
                            category: category,
                            targetDate: hasDate ? date : nil,
                            isRecurring: isRecurring,
                            recurrenceNote: recurrenceNote,
                            reminderEnabled: reminderEnabled
                        ))
                        dismiss()
                    }
                    .disabled(title.isEmpty)
                }
            }
        }
    }
}

struct SeasonTestRunSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @State private var walked: Set<Int> = []

    var body: some View {
        NavigationStack {
            List {
                Section(header: Text("Zones").foregroundStyle(FairwayTheme.textSecondary)) {
                    ForEach(store.blob.zones) { zone in
                        Button {
                            if walked.contains(zone.number) { walked.remove(zone.number) }
                            else { walked.insert(zone.number) }
                        } label: {
                            HStack {
                                Image(systemName: walked.contains(zone.number) ? "checkmark.circle.fill" : "circle")
                                    .foregroundStyle(walked.contains(zone.number) ? FairwayTheme.statusHealthy : FairwayTheme.textSecondary)
                                VStack(alignment: .leading) {
                                    Text("Zone \(zone.number) — \(zone.name)")
                                        .foregroundStyle(FairwayTheme.textPrimary)
                                    Text("\(zone.heads.count) heads • \(zone.openProblemCount) open problems")
                                        .font(.caption)
                                        .foregroundStyle(FairwayTheme.textSecondary)
                                }
                            }
                        }
                        .buttonStyle(.plain)
                    }
                }
                Section(header: Text("Reminders").foregroundStyle(FairwayTheme.textSecondary)) {
                    Text("Confirm nozzles and arcs")
                    Text("Flag leaks, coverage gaps, overspray")
                    Text("Update head records → Confirmed")
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Season Test Run")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) { Button("Done") { dismiss() } }
            }
        }
    }
}
