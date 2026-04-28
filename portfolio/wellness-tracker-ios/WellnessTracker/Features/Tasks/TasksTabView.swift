import SwiftUI

@MainActor
struct TasksTabView: View {
    @ObservedObject var store: WellnessStore
    @State private var taskTitle = ""
    @State private var showTriagePicker = false
    @State private var triagePicks: Set<String> = []
    @State private var showWaiting = false
    @State private var showDone = false
    @State private var paralysisMode = false

    private var undoneTasks: [[String: Any]] {
        store.tasksActive.filter { !($0["done"] as? Bool ?? false) }
    }

    private var doneTasks: [[String: Any]] {
        store.tasksActive.filter { $0["done"] as? Bool ?? false }
    }

    var body: some View {
        NavigationStack {
            if paralysisMode {
                paralysisView
            } else {
                mainView
            }
        }
        .tint(WellnessTheme.accent)
    }

    // MARK: - Main view

    private var mainView: some View {
        ScrollView {
            VStack(spacing: 12) {
                addTaskRow

                if let focus = store.tasksOneThing {
                    oneThingBanner(focus)
                }

                if store.triageIsNeeded && !showTriagePicker {
                    triageNeededBanner
                }

                if showTriagePicker {
                    triagePickerSection
                }

                if !store.pinnedTasks.isEmpty {
                    pinnedSection
                } else if !undoneTasks.isEmpty && !showTriagePicker {
                    allTasksSection
                }

                if !store.waitingTasks.isEmpty {
                    waitingSection
                }

                if !doneTasks.isEmpty {
                    doneSection
                }

                if !store.tasksActive.isEmpty && store.tasksOneThing == nil {
                    overwhelmedButton
                }
            }
            .padding(16)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(WellnessTheme.bg)
        .navigationTitle("Tasks")
        .navigationBarTitleDisplayMode(.inline)
    }

    // MARK: - Add task row

    private var addTaskRow: some View {
        HStack(spacing: 8) {
            TextField("Add a task", text: $taskTitle)
                .textFieldStyle(.roundedBorder)
            Button("Add") {
                store.addTask(title: taskTitle)
                taskTitle = ""
            }
            .buttonStyle(.borderedProminent)
            .tint(WellnessTheme.accent)
            .disabled(taskTitle.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
        }
    }

    // MARK: - One-thing banner

    private func oneThingBanner(_ focus: String) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Focus")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(WellnessTheme.accent)
                Spacer()
                Button("Clear") {
                    store.clearOneThing()
                }
                .font(.caption)
                .foregroundStyle(WellnessTheme.muted)
            }
            Text(focus)
                .font(.body.weight(.medium))
                .foregroundStyle(WellnessTheme.text)
            Button("Done — I did it") {
                store.clearOneThing()
            }
            .font(.subheadline.weight(.semibold))
            .foregroundStyle(WellnessTheme.accent)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
            .background(WellnessTheme.accent.opacity(0.12))
            .clipShape(RoundedRectangle(cornerRadius: 8))
        }
        .padding(14)
        .background(WellnessTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(WellnessTheme.accent.opacity(0.3), lineWidth: 1)
        )
    }

    // MARK: - Triage needed banner

    private var triageNeededBanner: some View {
        HStack(spacing: 10) {
            VStack(alignment: .leading, spacing: 2) {
                Text("You have \(undoneTasks.count) tasks")
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(WellnessTheme.text)
                Text("Pick your top 3 for today")
                    .font(.caption)
                    .foregroundStyle(WellnessTheme.muted)
            }
            Spacer()
            Button("Pick my 3") {
                triagePicks = []
                showTriagePicker = true
            }
            .font(.subheadline.weight(.semibold))
            .foregroundStyle(.white)
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(WellnessTheme.accent)
            .clipShape(RoundedRectangle(cornerRadius: 8))
        }
        .padding(14)
        .background(WellnessTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    // MARK: - Triage picker

    private var triagePickerSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Pick 3 tasks for today")
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(WellnessTheme.text)
                Spacer()
                Text("\(triagePicks.count)/3")
                    .font(.caption.weight(.medium))
                    .foregroundStyle(triagePicks.count == 3 ? WellnessTheme.accent : WellnessTheme.muted)
            }

            ForEach(undoneTasks.indices, id: \.self) { index in
                let item = undoneTasks[index]
                let id = item["id"] as? String ?? "\(index)"
                let title = item["title"] as? String ?? "Untitled"
                let picked = triagePicks.contains(id)

                Button {
                    if picked {
                        triagePicks.remove(id)
                    } else if triagePicks.count < 3 {
                        triagePicks.insert(id)
                    }
                } label: {
                    HStack {
                        Image(systemName: picked ? "checkmark.circle.fill" : "circle")
                            .foregroundStyle(picked ? WellnessTheme.accent : WellnessTheme.muted)
                        Text(title)
                            .foregroundStyle(WellnessTheme.text)
                            .multilineTextAlignment(.leading)
                        Spacer()
                    }
                    .padding(.vertical, 8)
                    .padding(.horizontal, 10)
                    .background(picked ? WellnessTheme.accent.opacity(0.1) : Color.clear)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
                }
                .buttonStyle(.plain)
            }

            HStack(spacing: 10) {
                Button("Cancel") {
                    showTriagePicker = false
                    triagePicks = []
                }
                .font(.subheadline)
                .foregroundStyle(WellnessTheme.muted)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 8)
                .background(WellnessTheme.surface)
                .clipShape(RoundedRectangle(cornerRadius: 8))

                Button("Save my 3") {
                    store.saveTriage(pinned: Array(triagePicks))
                    showTriagePicker = false
                    triagePicks = []
                }
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 8)
                .background(triagePicks.count == 3 ? WellnessTheme.accent : WellnessTheme.muted)
                .clipShape(RoundedRectangle(cornerRadius: 8))
                .disabled(triagePicks.count != 3)
            }
        }
        .padding(14)
        .background(WellnessTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    // MARK: - Pinned / "Your 3" section

    private var pinnedSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            sectionHeader("Your 3", count: nil)
            ForEach(store.pinnedTasks.indices, id: \.self) { index in
                taskRow(store.pinnedTasks[index], isPinned: true)
            }
        }
    }

    // MARK: - All tasks (when ≤3, no triage needed)

    private var allTasksSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            sectionHeader("Tasks", count: undoneTasks.count)
            ForEach(undoneTasks.indices, id: \.self) { index in
                taskRow(undoneTasks[index], isPinned: false)
            }
        }
    }

    // MARK: - Waiting section

    private var waitingSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Button {
                showWaiting.toggle()
            } label: {
                HStack {
                    sectionHeader("Waiting", count: store.waitingTasks.count)
                    Spacer()
                    Image(systemName: showWaiting ? "chevron.up" : "chevron.down")
                        .font(.caption)
                        .foregroundStyle(WellnessTheme.muted)
                }
            }
            .buttonStyle(.plain)

            if showWaiting {
                ForEach(store.waitingTasks.indices, id: \.self) { index in
                    taskRow(store.waitingTasks[index], isPinned: false)
                }
            }
        }
    }

    // MARK: - Done section

    private var doneSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Button {
                showDone.toggle()
            } label: {
                HStack {
                    sectionHeader("Done", count: doneTasks.count)
                    Spacer()
                    Image(systemName: showDone ? "chevron.up" : "chevron.down")
                        .font(.caption)
                        .foregroundStyle(WellnessTheme.muted)
                }
            }
            .buttonStyle(.plain)

            if showDone {
                ForEach(doneTasks.indices, id: \.self) { index in
                    let item = doneTasks[index]
                    let id = item["id"] as? String ?? "\(index)"
                    let title = item["title"] as? String ?? "Untitled task"
                    Button {
                        store.toggleTaskDone(id: id)
                    } label: {
                        HStack {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundStyle(WellnessTheme.muted)
                            Text(title)
                                .foregroundStyle(WellnessTheme.muted)
                                .strikethrough()
                                .multilineTextAlignment(.leading)
                            Spacer()
                        }
                        .padding(.vertical, 8)
                        .padding(.horizontal, 10)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    // MARK: - Overwhelmed button

    private var overwhelmedButton: some View {
        Button {
            let first = store.pinnedTasks.first ?? undoneTasks.first
            if let t = first, let title = t["title"] as? String {
                store.setOneThing(title)
                paralysisMode = true
            }
        } label: {
            Text("Overwhelmed — strip it all away")
                .font(.subheadline)
                .foregroundStyle(WellnessTheme.muted)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .background(WellnessTheme.surface)
                .clipShape(RoundedRectangle(cornerRadius: 10))
        }
        .buttonStyle(.plain)
    }

    // MARK: - Paralysis mode (one-thing stripped view)

    private var paralysisView: some View {
        VStack(spacing: 0) {
            Spacer()

            VStack(spacing: 20) {
                Text("One thing.")
                    .font(.title2.weight(.bold))
                    .foregroundStyle(WellnessTheme.muted)

                if let focus = store.tasksOneThing {
                    Text(focus)
                        .font(.title.weight(.semibold))
                        .foregroundStyle(WellnessTheme.text)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 24)
                }

                Button("Done — I did it") {
                    store.clearOneThing()
                    paralysisMode = false
                }
                .font(.headline)
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(WellnessTheme.accent)
                .clipShape(RoundedRectangle(cornerRadius: 12))
                .padding(.horizontal, 32)
                .padding(.top, 8)
            }

            Spacer()

            Button("Back to all tasks") {
                paralysisMode = false
            }
            .font(.subheadline)
            .foregroundStyle(WellnessTheme.muted)
            .padding(.bottom, 32)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(WellnessTheme.bg)
        .navigationTitle("Focus")
        .navigationBarTitleDisplayMode(.inline)
    }

    // MARK: - Shared task row

    @ViewBuilder
    private func taskRow(_ item: [String: Any], isPinned: Bool) -> some View {
        let id = item["id"] as? String ?? ""
        let title = item["title"] as? String ?? "Untitled task"

        HStack {
            Button {
                if isPinned {
                    store.completeTask(id: id)
                } else {
                    store.toggleTaskDone(id: id)
                }
            } label: {
                Image(systemName: isPinned ? "checkmark.circle" : "circle")
                    .foregroundStyle(isPinned ? WellnessTheme.accent : WellnessTheme.muted)
            }
            .buttonStyle(.plain)

            Text(title)
                .foregroundStyle(WellnessTheme.text)
                .multilineTextAlignment(.leading)
            Spacer()
        }
        .padding(.vertical, 8)
        .padding(.horizontal, 10)
        .background(WellnessTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 8))
    }

    // MARK: - Section header helper

    private func sectionHeader(_ title: String, count: Int?) -> some View {
        HStack(spacing: 4) {
            Text(title)
                .font(.caption.weight(.semibold))
                .foregroundStyle(WellnessTheme.muted)
                .textCase(.uppercase)
            if let n = count {
                Text("(\(n))")
                    .font(.caption)
                    .foregroundStyle(WellnessTheme.muted)
            }
        }
    }
}
