import SwiftUI

/// Shared confirmation UI for assigning dollars to a YNAB category (PATCH `budgeted`).
struct FundCategorySheetConfig: Identifiable {
    let id = UUID()
    let categoryID: String
    let categoryName: String
    let shortfall: Double
    let targetMilliunits: Int
}

struct FundCategoryConfirmationSheet: View {
    let config: FundCategorySheetConfig
    @Binding var isFunding: Bool
    let onConfirm: () async -> Void
    let onCancel: () -> Void

    var body: some View {
        NavigationStack {
            ZStack {
                ClarityTheme.bg.ignoresSafeArea()
                VStack(spacing: 20) {
                    Image(systemName: "dollarsign.arrow.circlepath")
                        .font(.system(size: 40))
                        .foregroundStyle(ClarityTheme.accent)
                        .accessibilityHidden(true)

                    Text("Fund \(config.categoryName)?")
                        .font(ClarityTheme.titleFont)
                        .foregroundStyle(ClarityTheme.text)
                        .multilineTextAlignment(.center)

                    Text(
                        "This will assign \(ClarityTheme.currency(config.shortfall)) in YNAB so this category reaches its target for this month."
                    )
                    .font(ClarityTheme.supportingFont)
                    .foregroundStyle(ClarityTheme.muted)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 20)

                    Button {
                        Task {
                            isFunding = true
                            defer { isFunding = false }
                            await onConfirm()
                        }
                    } label: {
                        HStack {
                            if isFunding {
                                ProgressView().tint(ClarityTheme.bg)
                            } else {
                                Text("Assign " + ClarityTheme.currency(config.shortfall))
                                    .font(ClarityTheme.headlineFont)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 14)
                        .background(ClarityTheme.accent)
                        .foregroundStyle(ClarityTheme.text)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                    .disabled(isFunding)
                    .padding(.horizontal, 20)
                    .accessibilityHint("Confirms assigning money to this category in YNAB.")
                }
                .padding(24)
            }
            .navigationTitle("Fund Category")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Cancel", action: onCancel)
                        .foregroundStyle(ClarityTheme.accent)
                }
            }
        }
    }
}
