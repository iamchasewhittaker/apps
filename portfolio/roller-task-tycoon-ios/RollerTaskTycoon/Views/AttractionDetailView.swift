import SwiftData
import SwiftUI

struct AttractionDetailView: View {
    @Bindable var task: ChecklistTaskItem
    @Binding var parkCash: Int
    var readableFonts: Bool
    var onToast: (String) -> Void

    @Environment(\.modelContext) private var modelContext
    @Environment(\.dismiss) private var dismiss
    @State private var showEdit = false
    @State private var newSubtaskText = ""
    @State private var coinBurstAmount: Int? = nil

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                Text(task.text)
                    .font(ParkTheme.displayFont(readable: readableFonts))
                    .foregroundStyle(ParkTheme.ink)

                row("Status", "\(task.status.emoji) \(task.status.displayTitle)")
                row("Zone", "\(task.zone.emoji) \(task.zone.displayTitle)")
                row("Staff", "\(task.staffRole.emoji) \(task.staffRole.displayTitle)")
                row("Reward", "$\(task.rewardDollars)")
                row("Priority", task.priority.displayTitle)
                dueRow

                if !task.details.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("Description")
                            .font(ParkTheme.titleFont(readable: readableFonts))
                            .foregroundStyle(ParkTheme.ink)
                        Text(task.details)
                            .font(ParkTheme.bodyFont(readable: readableFonts))
                            .foregroundStyle(ParkTheme.ink)
                    }
                    .parkPanel(readable: readableFonts)
                }

                subtasksSection

                actions
            }
            .padding(16)
        }
        .overlay(alignment: .center) {
            if let amount = coinBurstAmount {
                Text("💰 +$\(amount)")
                    .font(ParkTheme.titleFont(readable: readableFonts).weight(.heavy))
                    .foregroundStyle(ParkTheme.gold)
                    .shadow(color: .black.opacity(0.3), radius: 4, y: 2)
                    .transition(.asymmetric(
                        insertion: .move(edge: .bottom).combined(with: .opacity),
                        removal: .move(edge: .top).combined(with: .opacity)
                    ))
                    .allowsHitTesting(false)
            }
        }
        .animation(.spring(duration: 0.45), value: coinBurstAmount)
        .background(ParkTheme.parkBackground.ignoresSafeArea())
        .navigationTitle("Attraction")
        .navigationBarTitleDisplayMode(.inline)
        .toolbarBackground(ParkTheme.woodLight.opacity(0.95), for: .navigationBar)
        .toolbarBackground(.visible, for: .navigationBar)
        .toolbarColorScheme(.light, for: .navigationBar)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("Edit") { showEdit = true }
            }
        }
        .sheet(isPresented: $showEdit) {
            AttractionEditorView(existing: task, readableFonts: readableFonts) {
                showEdit = false
                onToast("✏️ Attraction updated")
            }
        }
    }

    private func row(_ k: String, _ v: String) -> some View {
        HStack {
            Text(k)
                .font(ParkTheme.bodyFont(readable: readableFonts).weight(.semibold))
                .foregroundStyle(ParkTheme.ink.opacity(0.75))
            Spacer()
            Text(v)
                .font(ParkTheme.bodyFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
                .multilineTextAlignment(.trailing)
        }
        .padding(.vertical, 4)
    }

    private var dueRow: some View {
        HStack {
            Text("Due")
                .font(ParkTheme.bodyFont(readable: readableFonts).weight(.semibold))
                .foregroundStyle(ParkTheme.ink.opacity(0.75))
            Spacer()
            Text(task.dueDateLabel())
                .font(ParkTheme.bodyFont(readable: readableFonts).weight(task.isOverdue() ? .semibold : .regular))
                .foregroundStyle(task.isOverdue() ? ParkTheme.alertRed : ParkTheme.ink)
                .multilineTextAlignment(.trailing)
        }
        .padding(.vertical, 4)
    }

    private var actions: some View {
        VStack(spacing: 10) {
            statusButton("Start testing", to: .testing, allowed: task.status != .testing && task.status != .closed)
            statusButton("Mark broken down", to: .brokenDown, allowed: task.status != .brokenDown && task.status != .closed)
            closeButton
            Button(role: .destructive) {
                modelContext.delete(task)
                do {
                    try modelContext.save()
                } catch {
                    onToast("⚠️ Delete failed — try again")
                    return
                }
                onToast("🗑️ \(GameFlavor.randomDeleteLine())")
                dismiss()
            } label: {
                Text("Delete attraction")
                    .font(ParkTheme.bodyFont(readable: readableFonts).weight(.bold))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
            }
            .buttonStyle(.borderedProminent)
            .tint(ParkTheme.alertRed)
        }
    }

    private var subtasksSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("Subtasks")
                    .font(ParkTheme.titleFont(readable: readableFonts))
                    .foregroundStyle(ParkTheme.ink)
                Spacer()
                if !task.subtasks.isEmpty {
                    let done = task.subtasks.filter(\.isDone).count
                    Text("\(done)/\(task.subtasks.count)")
                        .font(ParkTheme.captionFont(readable: readableFonts))
                        .foregroundStyle(ParkTheme.ink.opacity(0.6))
                }
            }

            let sorted = task.subtasks.sorted { $0.sortOrder < $1.sortOrder }
            ForEach(sorted, id: \.id) { sub in
                HStack(spacing: 10) {
                    Button {
                        sub.isDone.toggle()
                        try? modelContext.save()
                        checkAutoAdvance()
                    } label: {
                        Image(systemName: sub.isDone ? "checkmark.circle.fill" : "circle")
                            .foregroundStyle(sub.isDone ? ParkTheme.grassTop : ParkTheme.ink.opacity(0.5))
                            .font(.title3)
                    }
                    .buttonStyle(.plain)

                    Text(sub.text)
                        .font(ParkTheme.bodyFont(readable: readableFonts))
                        .foregroundStyle(sub.isDone ? ParkTheme.ink.opacity(0.45) : ParkTheme.ink)
                        .strikethrough(sub.isDone, color: ParkTheme.ink.opacity(0.45))
                        .frame(maxWidth: .infinity, alignment: .leading)

                    Button {
                        modelContext.delete(sub)
                        try? modelContext.save()
                    } label: {
                        Image(systemName: "xmark")
                            .font(.caption)
                            .foregroundStyle(ParkTheme.ink.opacity(0.4))
                    }
                    .buttonStyle(.plain)
                }
            }

            HStack(spacing: 8) {
                Image(systemName: "plus.circle")
                    .foregroundStyle(ParkTheme.accent)
                    .font(.title3)
                TextField("Add subtask…", text: $newSubtaskText)
                    .font(ParkTheme.bodyFont(readable: readableFonts))
                    .onSubmit { addSubtask() }
            }
        }
        .parkPanel(readable: readableFonts)
    }

    private func addSubtask() {
        let text = newSubtaskText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return }
        let next = (task.subtasks.map(\.sortOrder).max() ?? -1) + 1
        let sub = SubtaskItem(text: text, sortOrder: next)
        sub.task = task
        modelContext.insert(sub)
        try? modelContext.save()
        newSubtaskText = ""
    }

    private func checkAutoAdvance() {
        guard !task.subtasks.isEmpty,
              task.subtasks.allSatisfy(\.isDone),
              task.status == .open else { return }
        ParkStatusTransitions.apply(.testing, to: task, parkCash: &parkCash, context: modelContext)
        try? modelContext.save()
        onToast("🎢 Ride entering Testing — all checks passed!")
    }

    private var closeButton: some View {
        Button {
            guard task.status != .closed else { return }
            let reward = task.rewardDollars
            ParkStatusTransitions.apply(.closed, to: task, parkCash: &parkCash, context: modelContext)
            do {
                try modelContext.save()
            } catch {
                onToast("⚠️ Save failed — try again")
                return
            }
            coinBurstAmount = reward
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.4) {
                coinBurstAmount = nil
            }
            onToast("💰 Attraction closed! +$\(reward)")
        } label: {
            Text("Close attraction")
                .font(ParkTheme.bodyFont(readable: readableFonts).weight(.bold))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .background(task.status == .closed ? ParkTheme.wood.opacity(0.4) : ParkTheme.wood)
                .foregroundStyle(ParkTheme.plaque)
                .clipShape(RoundedRectangle(cornerRadius: 8))
        }
        .buttonStyle(.plain)
        .disabled(task.status == .closed)
        .opacity(task.status == .closed ? 0.45 : 1)
    }

    private func statusButton(_ title: String, to status: AttractionStatus, allowed: Bool) -> some View {
        Button {
            ParkStatusTransitions.apply(status, to: task, parkCash: &parkCash, context: modelContext)
            do {
                try modelContext.save()
            } catch {
                onToast("⚠️ Save failed — try again")
                return
            }
            onToast("🎢 Status: \(status.displayTitle)")
        } label: {
            Text(title)
                .font(ParkTheme.bodyFont(readable: readableFonts).weight(.bold))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .background(ParkTheme.wood)
                .foregroundStyle(ParkTheme.plaque)
                .clipShape(RoundedRectangle(cornerRadius: 8))
        }
        .buttonStyle(.plain)
        .disabled(!allowed)
        .opacity(allowed ? 1 : 0.45)
    }
}
