import SwiftUI
import ClarityUI

@MainActor
struct WantsTrackerView: View {
    @Environment(BudgetStore.self) private var store

    @State private var focus: BudgetScenarioKind = .baseline
    @State private var customDollars: String = ""

    var body: some View {
        List {
            if let quote = budgetQuotes.todaysQuote {
                Section {
                    QuoteBanner(quote: quote)
                        .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 0))
                        .listRowBackground(Color.clear)
                }
            }

            Section {
                Picker("Scenario", selection: $focus) {
                    Text(store.scenario(.baseline).label).tag(BudgetScenarioKind.baseline)
                    Text(store.scenario(.stretch).label).tag(BudgetScenarioKind.stretch)
                }
                .pickerStyle(.segmented)
            } header: {
                Text("Log wants toward")
            }

            Section {
                let s = store.scenario(focus)
                LabeledContent("Wants budget", value: BudgetMoneyFormat.string(fromCents: s.wantsBudgetCents))
                LabeledContent("Wants spent", value: BudgetMoneyFormat.string(fromCents: s.wantsSpentCents))
                LabeledContent("Remaining vs plan", value: BudgetMoneyFormat.string(fromCents: s.wantsRemainingVersusBudgetCents))
            } header: {
                Text("Status")
            }

            Section {
                HStack {
                    quickAddButton(title: "+$5", cents: 500)
                    quickAddButton(title: "+$20", cents: 2_000)
                    quickAddButton(title: "+$50", cents: 5_000)
                }
                .buttonStyle(.bordered)

                HStack {
                    TextField("Custom ($)", text: $customDollars)
                        .keyboardType(.decimalPad)
                    Button("Add") {
                        let cents = parseDollarsToCents(customDollars)
                        guard cents > 0 else { return }
                        store.addWantsSpend(cents: cents, to: focus)
                        customDollars = ""
                    }
                }

                Button("Reset wants spent for this scenario", role: .destructive) {
                    store.resetWantsSpent(for: focus)
                }
            } header: {
                Text("Log spending")
            }
        }
        .navigationTitle("Wants")
        .scrollContentBackground(.hidden)
        .background(ClarityPalette.bg)
    }

    private func quickAddButton(title: String, cents: Int) -> some View {
        Button(title) {
            store.addWantsSpend(cents: cents, to: focus)
        }
    }

    private func parseDollarsToCents(_ raw: String) -> Int {
        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return 0 }
        let normalized = trimmed.replacingOccurrences(of: ",", with: "")
        guard let d = Double(normalized) else { return 0 }
        return Int((d * 100.0).rounded())
    }
}
