import AudioToolbox
import SwiftData
import SwiftUI
import UIKit

struct ChecklistView: View {
    var tasks: [ChecklistTaskItem]
    @Binding var parkCash: Int
    var readableFonts: Bool
    var onToast: (String) -> Void

    @Environment(\.modelContext) private var modelContext
    @State private var newTaskText = ""

    private var openTasks: [ChecklistTaskItem] { tasks.filter { !$0.isDone } }
    private var doneTasks: [ChecklistTaskItem] { tasks.filter(\.isDone) }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            addRow

            if tasks.isEmpty {
                emptyState
            } else {
                List {
                    if !openTasks.isEmpty {
                        Section {
                            ForEach(openTasks) { item in
                                taskRow(item)
                            }
                            .onDelete { offsets in
                                deleteOpen(at: offsets)
                            }
                        } header: {
                            sectionHeader("📋 Open work orders")
                        }
                    }

                    if !doneTasks.isEmpty {
                        Section {
                            ForEach(doneTasks) { item in
                                taskRow(item)
                            }
                            .onDelete { offsets in
                                deleteDone(at: offsets)
                            }
                        } header: {
                            sectionHeader("✅ Completed")
                        }
                    }
                }
                .listStyle(.plain)
                .scrollContentBackground(.hidden)
            }
        }
    }

    private var addRow: some View {
        HStack(spacing: 10) {
            TextField("New work order…", text: $newTaskText)
                .textFieldStyle(.roundedBorder)
                .font(ParkTheme.bodyFont(readable: readableFonts))
                .onSubmit(addTask)

            Button(action: addTask) {
                Text("Add")
                    .font(ParkTheme.bodyFont(readable: readableFonts).weight(.bold))
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(ParkTheme.wood)
                    .foregroundStyle(ParkTheme.plaque)
                    .clipShape(RoundedRectangle(cornerRadius: 8))
            }
            .buttonStyle(.plain)
            .disabled(newTaskText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
        }
        .padding(.horizontal, 4)
    }

    private var emptyState: some View {
        VStack(spacing: 12) {
            Text("🎡")
                .font(.system(size: 48))
            Text("Park open — add your first work order.")
                .font(ParkTheme.bodyFont(readable: readableFonts))
                .multilineTextAlignment(.center)
                .foregroundStyle(ParkTheme.ink.opacity(0.85))
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 36)
    }

    private func sectionHeader(_ title: String) -> some View {
        Text(title)
            .font(ParkTheme.titleFont(readable: readableFonts))
            .foregroundStyle(ParkTheme.ink)
            .textCase(nil)
    }

    private func taskRow(_ item: ChecklistTaskItem) -> some View {
        HStack(alignment: .center, spacing: 12) {
            Image(systemName: item.isDone ? "checkmark.circle.fill" : "circle")
                .font(.title3)
                .foregroundStyle(item.isDone ? ParkTheme.grassTop : ParkTheme.ink.opacity(0.35))
                .accessibilityLabel(item.isDone ? "Completed" : "Not completed")

            Text(item.text)
                .font(ParkTheme.bodyFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
                .strikethrough(item.isDone, color: ParkTheme.ink.opacity(0.4))
                .opacity(item.isDone ? 0.65 : 1)

            Spacer(minLength: 0)
        }
        .contentShape(Rectangle())
        .onTapGesture {
            toggle(item)
        }
        .accessibilityElement(children: .combine)
        .accessibilityAddTraits(.isButton)
    }

    private func addTask() {
        let t = newTaskText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !t.isEmpty else { return }
        modelContext.insert(ChecklistTaskItem(text: t))
        newTaskText = ""
        try? modelContext.save()
        onToast("🔨 New work order: \(t)")
    }

    private func toggle(_ item: ChecklistTaskItem) {
        let wasDone = item.isDone
        item.isDone.toggle()
        if item.isDone, !wasDone {
            parkCash += 250
            UINotificationFeedbackGenerator().notificationOccurred(.success)
            ParkSound.playTaskComplete()
            onToast("✅ \(GameFlavor.randomCompleteLine())")
        } else if !item.isDone, wasDone {
            UINotificationFeedbackGenerator().notificationOccurred(.warning)
            onToast("↩️ Marked open again")
        }
        try? modelContext.save()
    }

    private func deleteOpen(at offsets: IndexSet) {
        for i in offsets {
            modelContext.delete(openTasks[i])
        }
        try? modelContext.save()
        onToast("🗑️ \(GameFlavor.randomDeleteLine())")
    }

    private func deleteDone(at offsets: IndexSet) {
        for i in offsets {
            modelContext.delete(doneTasks[i])
        }
        try? modelContext.save()
        onToast("🗑️ \(GameFlavor.randomDeleteLine())")
    }
}

private enum ParkSound {
    static func playTaskComplete() {
        AudioServicesPlaySystemSound(1025)
    }
}
