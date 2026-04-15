import SwiftUI

struct SettingsSheetView: View {
    @EnvironmentObject private var appState: AppState
    @Environment(\.dismiss) private var dismiss
    @State private var showTokenEntry = false
    @State private var showHowItWorks = false

    var body: some View {
        NavigationStack {
            ZStack {
                ClarityTheme.bg.ignoresSafeArea()
                List {
                    Section("Budget") {
                        LabeledContent(
                            "Active Budget",
                            value: appState.activeBudgetName.isEmpty ? "Not set" : appState.activeBudgetName
                        )
                    }

                    Section("Income Tax") {
                        HStack {
                            Text("Estimated Tax Rate")
                            Spacer()
                            Text("\(Int(appState.taxRate * 100))%")
                                .foregroundStyle(ClarityTheme.muted)
                        }
                        Slider(value: $appState.taxRate, in: 0.10...0.50, step: 0.01)
                            .tint(ClarityTheme.accent)
                    }

                    Section {
                        Button("How It Works") { showHowItWorks = true }
                            .foregroundStyle(ClarityTheme.accent)
                        Button("Re-enter YNAB Token") { showTokenEntry = true }
                            .foregroundStyle(ClarityTheme.accent)
                        Button("Reset Setup", role: .destructive) {
                            appState.setupComplete = false
                            dismiss()
                        }
                    }
                }
                .scrollContentBackground(.hidden)
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                        .foregroundStyle(ClarityTheme.accent)
                }
            }
        }
        .sheet(isPresented: $showTokenEntry) {
            TokenStepView(onNext: { _ in
                showTokenEntry = false
            })
        }
        .sheet(isPresented: $showHowItWorks) {
            HowItWorksView()
        }
    }
}
