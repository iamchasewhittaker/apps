import SwiftUI

struct AddFertAppSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var date = Date()
    @State private var selectedInventoryID: UUID? = nil
    @State private var customProductName = ""
    @State private var zoneNumbers: Set<Int> = []
    @State private var amountLbs: Double = 0
    @State private var notes = ""

    @MainActor private var fertItems: [InventoryItem] {
        store.blob.inventory.filter { $0.category == .fertilizer }
    }

    @MainActor private var productName: String {
        if let id = selectedInventoryID,
           let item = fertItems.first(where: { $0.id == id }) {
            return item.name
        }
        return customProductName
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("When") {
                    DatePicker("Date", selection: $date, displayedComponents: .date)
                }

                Section("Product") {
                    if fertItems.isEmpty {
                        TextField("Product name", text: $customProductName)
                    } else {
                        Picker("Inventory item", selection: $selectedInventoryID) {
                            Text("Custom…").tag(nil as UUID?)
                            ForEach(fertItems) { item in
                                Text(item.name).tag(item.id as UUID?)
                            }
                        }
                        if selectedInventoryID == nil {
                            TextField("Product name", text: $customProductName)
                        }
                    }
                }

                Section("Zones applied") {
                    ForEach(1...4, id: \.self) { n in
                        Toggle("Zone \(n)", isOn: Binding(
                            get: { zoneNumbers.contains(n) },
                            set: { checked in
                                if checked { zoneNumbers.insert(n) }
                                else { zoneNumbers.remove(n) }
                            }
                        ))
                    }
                }

                Section("Amount") {
                    HStack {
                        Text("Lbs applied")
                        Spacer()
                        TextField("0", value: $amountLbs, format: .number)
                            .keyboardType(.decimalPad)
                            .multilineTextAlignment(.trailing)
                            .frame(width: 80)
                        Text("lbs")
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }
                }

                Section("Notes") {
                    TextField("Optional notes", text: $notes, axis: .vertical)
                        .lineLimit(2...4)
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Log Fert App")
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
                        .disabled(productName.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
        }
    }

    @MainActor private func save() {
        var app = FertApplication(
            productName: productName.trimmingCharacters(in: .whitespaces),
            zoneNumbers: zoneNumbers.sorted(),
            amountLbs: amountLbs,
            notes: notes
        )
        app.inventoryItemID = selectedInventoryID
        if let id = selectedInventoryID, amountLbs > 0 {
            store.decrementInventory(id: id, by: amountLbs)
        }
        store.addFertApplication(app)
        dismiss()
    }
}
