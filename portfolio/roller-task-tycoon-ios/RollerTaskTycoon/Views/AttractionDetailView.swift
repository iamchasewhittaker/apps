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
                row("Due", task.dueDateLabel())

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

    private var subtasksSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Subtasks")
                .font(ParkTheme.titleFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
            let sorted = task.subtasks.sorted { $0.sortIndex < $1.sortIndex }
            if sorted.isEmpty {
                Text("No subtasks yet — add them in Edit.")
                    .font(ParkTheme.captionFont(readable: readableFonts))
                    .foregroundStyle(ParkTheme.ink.opacity(0.75))
            } else {
                ForEach(sorted) { sub in
                    Button {
                        sub.isDone.toggle()
                        try? modelContext.save()
                    } label: {
                        HStack(alignment: .top, spacing: 10) {
                            Image(systemName: sub.isDone ? "checkmark.square.fill" : "square")
                                .foregroundStyle(sub.isDone ? ParkTheme.grassTop : ParkTheme.ink.opacity(0.35))
                            Text(sub.text)
                                .font(ParkTheme.bodyFont(readable: readableFonts))
                                .strikethrough(sub.isDone)
                                .foregroundStyle(ParkTheme.ink)
                                .frame(maxWidth: .infinity, alignment: .leading)
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
        }
        .parkPanel(readable: readableFonts)
    }

    private var actions: some View {
        VStack(spacing: 10) {
            statusButton("Start testing", to: .testing, allowed: task.status != .testing && task.status != .closed)
            statusButton("Mark broken down", to: .brokenDown, allowed: task.status != .brokenDown && task.status != .closed)
            statusButton("Close attraction", to: .closed, allowed: task.status != .closed)
            Button(role: .destructive) {
                modelContext.delete(task)
                try? modelContext.save()
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

    private func statusButton(_ title: String, to status: AttractionStatus, allowed: Bool) -> some View {
        Button {
            ParkStatusTransitions.apply(status, to: task, parkCash: &parkCash, context: modelContext)
            try? modelContext.save()
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
