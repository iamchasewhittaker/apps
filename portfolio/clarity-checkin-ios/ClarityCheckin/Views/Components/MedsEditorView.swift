import SwiftUI
import ClarityUI

struct MedsEditorView: View {
    @Environment(CheckinStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @State private var newMed: String = ""

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: ClarityMetrics.cardSpacing) {
                    VStack(alignment: .leading, spacing: ClarityMetrics.cardSpacing) {
                        ClaritySectionLabel("Add Medication", showDivider: false)
                        HStack(spacing: 12) {
                            TextField("Medication name", text: $newMed)
                                .font(ClarityTypography.body)
                                .foregroundStyle(ClarityPalette.text)
                                .submitLabel(.done)
                                .onSubmit { addMed() }
                            Button(action: addMed) {
                                Image(systemName: "plus.circle.fill")
                                    .foregroundStyle(ClarityPalette.accent)
                                    .font(.system(size: 24))
                            }
                            .disabled(newMed.trimmingCharacters(in: .whitespaces).isEmpty)
                            .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                            .accessibilityLabel("Add medication")
                        }
                    }
                    .clarityCard()

                    if store.meds.isEmpty {
                        ClarityEmptyState(
                            icon: "pills",
                            title: "No medications",
                            message: "Add your medications above to track them during evening check-in."
                        )
                    } else {
                        VStack(alignment: .leading, spacing: 0) {
                            ClaritySectionLabel("Current Medications")
                                .padding(.bottom, 8)
                            ForEach(store.meds, id: \.self) { med in
                                HStack {
                                    Text(med)
                                        .font(ClarityTypography.body)
                                        .foregroundStyle(ClarityPalette.text)
                                    Spacer()
                                    Button {
                                        store.removeMed(med)
                                    } label: {
                                        Image(systemName: "minus.circle.fill")
                                            .foregroundStyle(ClarityPalette.danger)
                                    }
                                    .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                                    .accessibilityLabel("Remove \(med)")
                                }
                                .padding(.vertical, 10)
                                Divider().background(ClarityPalette.border)
                            }
                        }
                        .padding(.horizontal, ClarityMetrics.cardPadding)
                        .background(ClarityPalette.surface)
                        .clipShape(RoundedRectangle(cornerRadius: ClarityMetrics.cornerRadius))
                        .overlay(RoundedRectangle(cornerRadius: ClarityMetrics.cornerRadius)
                            .stroke(ClarityPalette.border, lineWidth: ClarityMetrics.borderWidth))
                    }
                }
                .padding(ClarityMetrics.pagePadding)
            }
            .background(ClarityPalette.bg.ignoresSafeArea())
            .navigationTitle("Medications")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                        .foregroundStyle(ClarityPalette.accent)
                        .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                }
            }
        }
        .preferredColorScheme(.dark)
    }

    @MainActor private func addMed() {
        store.addMed(newMed)
        newMed = ""
    }
}
