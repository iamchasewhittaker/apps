import SwiftUI

struct TasksTabView: View {
    @ObservedObject var store: WellnessStore
    @State private var taskTitle = ""

    var body: some View {
        NavigationStack {
            VStack(spacing: 12) {
                HStack(spacing: 8) {
                    TextField("Add a task", text: $taskTitle)
                        .textFieldStyle(.roundedBorder)
                    Button("Add") {
                        store.addTask(title: taskTitle)
                        taskTitle = ""
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(WellnessTheme.accent)
                }

                if store.tasksActive.isEmpty {
                    emptyCard("No tasks yet", detail: "Add your first task for today.")
                } else {
                    List {
                        ForEach(store.tasksActive.indices, id: \.self) { index in
                            let item = store.tasksActive[index]
                            let id = item["id"] as? String ?? "\(index)"
                            let title = item["title"] as? String ?? "Untitled task"
                            let done = item["done"] as? Bool ?? false
                            Button {
                                store.toggleTaskDone(id: id)
                            } label: {
                                HStack {
                                    Image(systemName: done ? "checkmark.circle.fill" : "circle")
                                        .foregroundStyle(done ? WellnessTheme.accent : WellnessTheme.muted)
                                    Text(title)
                                        .foregroundStyle(done ? WellnessTheme.muted : WellnessTheme.text)
                                        .strikethrough(done)
                                    Spacer()
                                }
                            }
                            .buttonStyle(.plain)
                            .listRowBackground(WellnessTheme.surface)
                        }
                    }
                    .scrollContentBackground(.hidden)
                    .background(WellnessTheme.bg)
                }
            }
            .padding(16)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
            .background(WellnessTheme.bg)
            .navigationTitle("Tasks")
            .navigationBarTitleDisplayMode(.inline)
        }
        .tint(WellnessTheme.accent)
    }

    private func emptyCard(_ title: String, detail: String) -> some View {
        VStack(spacing: 6) {
            Text(title)
                .font(.headline)
                .foregroundStyle(WellnessTheme.text)
            Text(detail)
                .font(.subheadline)
                .foregroundStyle(WellnessTheme.muted)
                .multilineTextAlignment(.center)
        }
        .padding(20)
        .frame(maxWidth: .infinity)
        .background(WellnessTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}
