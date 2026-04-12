import SwiftData
import SwiftUI

struct AttractionEditorView: View {
    var existing: ChecklistTaskItem?
    var readableFonts: Bool
    var onDone: () -> Void

    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext

    @State private var title: String = ""
    @State private var zone: ParkZone = .home
    @State private var staff: StaffRole = .janitor
    @State private var priority: TaskPriority = .medium
    @State private var reward: Int = 5
    @State private var hasDue = false
    @State private var dueDate = Date()
    @State private var details: String = ""
    @State private var saveError: String?

    var body: some View {
        NavigationStack {
            Form {
                Section("Attraction") {
                    TextField("Name", text: $title)
                        .font(ParkTheme.bodyFont(readable: readableFonts))
                }
                Section("Park ops") {
                    Picker("Zone", selection: $zone) {
                        ForEach(ParkZone.allCases) { z in
                            Text("\(z.emoji) \(z.displayTitle)").tag(z)
                        }
                    }
                    Picker("Staff", selection: $staff) {
                        ForEach(StaffRole.allCases) { r in
                            Text("\(r.emoji) \(r.displayTitle)").tag(r)
                        }
                    }
                    Picker("Priority", selection: $priority) {
                        ForEach(TaskPriority.allCases) { p in
                            Text(p.displayTitle).tag(p)
                        }
                    }
                    Stepper(value: $reward, in: 0...9_999) {
                        Text("Reward: $\(reward)")
                    }
                    Toggle("Due date", isOn: $hasDue)
                    if hasDue {
                        DatePicker("Due", selection: $dueDate, displayedComponents: .date)
                    }
                }
                Section("Description") {
                    TextField("Details (optional)", text: $details, axis: .vertical)
                        .lineLimit(3...8)
                }
            }
            .navigationTitle(existing == nil ? "New attraction" : "Edit attraction")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { save() }
                        .disabled(title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
            .alert("Save failed", isPresented: Binding(get: { saveError != nil }, set: { if !$0 { saveError = nil } })) {
                Button("OK", role: .cancel) { saveError = nil }
            } message: {
                Text(saveError ?? "")
            }
            .onAppear {
                guard let e = existing else { return }
                title = e.text
                zone = e.zone
                staff = e.staffRole
                priority = e.priority
                reward = e.rewardDollars
                details = e.details
                if let d = e.dueDate {
                    hasDue = true
                    dueDate = d
                }
            }
        }
    }

    private func save() {
        let trimmed = title.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }
        let item: ChecklistTaskItem
        if let e = existing {
            item = e
        } else {
            item = ChecklistTaskItem(text: trimmed)
            modelContext.insert(item)
        }
        item.text = trimmed
        item.zone = zone
        item.staffRole = staff
        item.priority = priority
        item.rewardDollars = max(0, reward)
        item.details = details
        item.dueDate = hasDue ? Calendar.current.startOfDay(for: dueDate) : nil

        do {
            try modelContext.save()
        } catch {
            saveError = error.localizedDescription
            return
        }
        onDone()
        dismiss()
    }
}
