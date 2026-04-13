import SwiftUI
import ClarityUI

@MainActor
struct TaskListView: View {
    @Environment(TriageStore.self) private var store
    @State private var showAddTask = false

    var body: some View {
        ScrollView {
            VStack(spacing: ClarityMetrics.cardSpacing) {
                if let quote = triageQuotes.todaysQuote {
                    QuoteBanner(quote: quote)
                }

                CapacityPickerView()

                VStack(alignment: .leading, spacing: 10) {
                    CapacityBadge(slotsUsed: store.slotsUsed, slotsAvailable: store.slotsAvailable)

                    Toggle("Show only tasks that fit remaining slots", isOn: Bindable(store).showFitOnly)
                        .font(ClarityTypography.caption)
                        .foregroundStyle(ClarityPalette.muted)

                    if store.visibleTasks.isEmpty {
                        Text("No active tasks. Add one to start a focused day.")
                            .font(ClarityTypography.caption)
                            .foregroundStyle(ClarityPalette.muted)
                            .frame(maxWidth: .infinity, alignment: .leading)
                    } else {
                        ForEach(store.visibleTasks) { task in
                            taskRow(task)
                        }
                    }
                }
                .clarityCard()
            }
            .padding(ClarityMetrics.pagePadding)
        }
        .background(ClarityPalette.bg.ignoresSafeArea())
        .navigationTitle("Tasks")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    showAddTask = true
                } label: {
                    Label("Add Task", systemImage: "plus")
                }
                .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
            }
        }
        .sheet(isPresented: $showAddTask) {
            AddTaskView()
        }
    }

    private func taskRow(_ task: TriageTask) -> some View {
        HStack(alignment: .top, spacing: 10) {
            Button {
                store.completeTask(task.id)
            } label: {
                Image(systemName: task.isComplete ? "checkmark.circle.fill" : "circle")
                    .foregroundStyle(task.isComplete ? ClarityPalette.safe : ClarityPalette.muted)
            }
            .buttonStyle(.plain)
            .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)

            VStack(alignment: .leading, spacing: 4) {
                Text(task.title)
                    .font(ClarityTypography.body)
                    .foregroundStyle(ClarityPalette.text)

                HStack(spacing: 8) {
                    Text(TriageConfig.categoryLabels[task.category] ?? task.category)
                    Text("•")
                    Text(TriageConfig.sizeLabels[task.size] ?? task.size)
                    Text("•")
                    Text("\(store.slotsRequired(for: task.size)) slot")
                }
                .font(ClarityTypography.caption)
                .foregroundStyle(ClarityPalette.muted)
            }

            Spacer()

            Button(role: .destructive) {
                store.deleteTask(task.id)
            } label: {
                Image(systemName: "trash")
            }
            .buttonStyle(.plain)
            .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
        }
        .padding(.vertical, 6)
    }
}
