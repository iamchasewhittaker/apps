import SwiftUI
import ClarityUI

@MainActor
struct BudgetScenariosView: View {
    @Environment(BudgetStore.self) private var store

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
                scenarioSummaryRow(title: store.blob.baseline.label, scenario: store.blob.baseline)
                scenarioSummaryRow(title: store.blob.stretch.label, scenario: store.blob.stretch)
            } header: {
                Text("At a glance")
            }

            Section {
                BudgetScenarioEditor(
                    title: store.blob.baseline.label,
                    scenario: store.blob.baseline
                ) { updated in
                    store.replaceBaseline(updated)
                }
            } header: {
                Text("Baseline scenario")
            }

            Section {
                BudgetScenarioEditor(
                    title: store.blob.stretch.label,
                    scenario: store.blob.stretch
                ) { updated in
                    store.replaceStretch(updated)
                }
            } header: {
                Text("Stretch scenario")
            }
        }
        .navigationTitle("Budget")
        .scrollContentBackground(.hidden)
        .background(ClarityPalette.bg)
    }

    @ViewBuilder
    private func scenarioSummaryRow(title: String, scenario: BudgetScenario) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.headline)
            Text("After needs: \(BudgetMoneyFormat.string(fromCents: scenario.afterNeedsCents))")
                .foregroundStyle(ClarityPalette.text)
            Text("Wants left (vs plan): \(BudgetMoneyFormat.string(fromCents: scenario.wantsRemainingVersusBudgetCents))")
                .foregroundStyle(ClarityPalette.muted)
            Text("Surplus after wants spent: \(BudgetMoneyFormat.string(fromCents: scenario.surplusAfterNeedsAndWantsCents))")
                .font(.caption)
                .foregroundStyle(ClarityPalette.muted)
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Editor

@MainActor
private struct BudgetScenarioEditor: View {
    let title: String
    let scenario: BudgetScenario
    let onCommit: (BudgetScenario) -> Void

    @State private var label: String = ""
    @State private var incomeDollars: String = ""
    @State private var fixedDollars: String = ""
    @State private var flexibleDollars: String = ""
    @State private var wantsBudgetDollars: String = ""
    @State private var wantsSpentDollars: String = ""

    var body: some View {
        Group {
            TextField("Label", text: $label)
                .onChange(of: label) { _, _ in push() }

            TextField("Monthly income ($)", text: $incomeDollars)
                .keyboardType(.decimalPad)
                .onChange(of: incomeDollars) { _, _ in push() }

            TextField("Fixed needs ($)", text: $fixedDollars)
                .keyboardType(.decimalPad)
                .onChange(of: fixedDollars) { _, _ in push() }

            TextField("Flexible needs estimate ($)", text: $flexibleDollars)
                .keyboardType(.decimalPad)
                .onChange(of: flexibleDollars) { _, _ in push() }

            TextField("Wants budget cap ($)", text: $wantsBudgetDollars)
                .keyboardType(.decimalPad)
                .onChange(of: wantsBudgetDollars) { _, _ in push() }

            TextField("Wants spent so far ($)", text: $wantsSpentDollars)
                .keyboardType(.decimalPad)
                .onChange(of: wantsSpentDollars) { _, _ in push() }
        }
        .onAppear {
            syncFromScenario()
        }
        // Wants tab updates `wantsSpentCents` — refresh dollar fields when it changes.
        .onChange(of: scenario.wantsSpentCents) { _, _ in
            wantsSpentDollars = dollarsString(fromCents: scenario.wantsSpentCents)
        }
    }

    private func syncFromScenario() {
        label = scenario.label
        incomeDollars = dollarsString(fromCents: scenario.monthlyIncomeCents)
        fixedDollars = dollarsString(fromCents: scenario.fixedNeedsCents)
        flexibleDollars = dollarsString(fromCents: scenario.flexibleNeedsEstimateCents)
        wantsBudgetDollars = dollarsString(fromCents: scenario.wantsBudgetCents)
        wantsSpentDollars = dollarsString(fromCents: scenario.wantsSpentCents)
    }

    private func push() {
        var next = scenario
        next.label = label.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? title : label
        next.monthlyIncomeCents = parseDollarsToCents(incomeDollars)
        next.fixedNeedsCents = parseDollarsToCents(fixedDollars)
        next.flexibleNeedsEstimateCents = parseDollarsToCents(flexibleDollars)
        next.wantsBudgetCents = parseDollarsToCents(wantsBudgetDollars)
        next.wantsSpentCents = max(0, parseDollarsToCents(wantsSpentDollars))
        onCommit(next)
    }

    private func dollarsString(fromCents cents: Int) -> String {
        let v = Double(cents) / 100.0
        if v == floor(v) { return String(format: "%.0f", v) }
        return String(format: "%.2f", v)
    }

    private func parseDollarsToCents(_ raw: String) -> Int {
        let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return 0 }
        let normalized = trimmed.replacingOccurrences(of: ",", with: "")
        guard let d = Double(normalized) else { return 0 }
        return Int((d * 100.0).rounded())
    }
}
