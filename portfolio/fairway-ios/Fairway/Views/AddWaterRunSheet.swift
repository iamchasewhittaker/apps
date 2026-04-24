import SwiftUI

struct AddWaterRunSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var date = Date()
    @State private var zoneNumber: Int = 1
    @State private var durationMinutes: Int = 15
    @State private var notes = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("When") {
                    DatePicker("Date", selection: $date, displayedComponents: [.date, .hourAndMinute])
                }

                Section("Zone") {
                    Picker("Zone", selection: $zoneNumber) {
                        ForEach(1...4, id: \.self) { n in
                            Text("Zone \(n)").tag(n)
                        }
                    }
                    .pickerStyle(.segmented)
                }

                Section("Duration") {
                    Stepper("\(durationMinutes) minutes", value: $durationMinutes, in: 1...180, step: 1)
                }

                Section("Notes") {
                    TextField("Optional notes", text: $notes, axis: .vertical)
                        .lineLimit(2...4)
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Log Water Run")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(FairwayTheme.accentGold)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { save() }
                        .bold()
                        .foregroundStyle(FairwayTheme.accentGold)
                }
            }
        }
    }

    @MainActor private func save() {
        let run = WaterRun(zoneNumber: zoneNumber, durationMinutes: durationMinutes, notes: notes)
        store.addWaterRun(run)
        dismiss()
    }
}
