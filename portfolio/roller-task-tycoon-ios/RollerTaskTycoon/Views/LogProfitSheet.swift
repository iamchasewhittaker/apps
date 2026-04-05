import SwiftData
import SwiftUI

struct LogProfitSheet: View {
    @Binding var parkCash: Int
    var readableFonts: Bool
    var onDone: () -> Void

    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext
    @State private var amountText: String = ""

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField("Dollars", text: $amountText)
                        .keyboardType(.numberPad)
                        .font(ParkTheme.bodyFont(readable: readableFonts))
                } header: {
                    Text("Log manual profit")
                } footer: {
                    Text("Adds to park cash and today’s profit ledger. Use for income that isn’t tied to closing an attraction.")
                        .font(ParkTheme.captionFont(readable: readableFonts))
                }
            }
            .navigationTitle("Log profit")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { save() }
                }
            }
        }
    }

    private func save() {
        let digits = amountText.filter(\.isNumber)
        guard let v = Int(digits), v > 0 else {
            dismiss()
            return
        }
        parkCash += v
        modelContext.insert(ProfitLedgerEntry(amount: v, taskId: nil, note: "Manual"))
        try? modelContext.save()
        onDone()
        dismiss()
    }
}
