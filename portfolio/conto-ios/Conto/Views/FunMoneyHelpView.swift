import SwiftUI

struct FunMoneyHelpView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ZStack {
                ClarityTheme.bg.ignoresSafeArea()
                ScrollView {
                    VStack(alignment: .leading, spacing: 24) {
                        Text("No justification needed — that's the point.")
                            .font(ClarityTheme.bodyFont)
                            .foregroundStyle(ClarityTheme.muted)
                            .padding(.top, 4)

                        ruleSection(
                            icon: "checkmark.circle.fill",
                            color: ClarityTheme.safe,
                            title: "Use your fun money for",
                            items: [
                                "Personal hobbies (gear, supplies, classes)",
                                "Personal clothing splurges",
                                "Apps, games, or subscriptions just for you",
                                "Coffee or lunch alone",
                                "Books, media, and personal subscriptions",
                                "Anything purely for you — no shared benefit",
                            ]
                        )

                        ruleSection(
                            icon: "xmark.circle.fill",
                            color: ClarityTheme.danger,
                            title: "Don't use it for — redirect instead",
                            items: [
                                "Family meals → Eating Out",
                                "Date nights → Fun Outings",
                                "Kids' stuff → Kids category",
                                "Household goods → Household Goods",
                                "Gifts for others → Gifts & Celebrations",
                                "Groceries → Groceries",
                            ]
                        )

                        VStack(alignment: .leading, spacing: 8) {
                            Text("Rule of thumb")
                                .font(ClarityTheme.headlineFont)
                                .foregroundStyle(ClarityTheme.text)
                            Text("If both people benefit → shared category.\nIf only you do → your fun money.")
                                .font(ClarityTheme.bodyFont)
                                .foregroundStyle(ClarityTheme.muted)
                        }
                        .padding(14)
                        .background(ClarityTheme.accent.opacity(0.12))
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(ClarityTheme.accent.opacity(0.3), lineWidth: 1)
                        )

                        VStack(alignment: .leading, spacing: 10) {
                            Text("Monthly budgets")
                                .font(ClarityTheme.headlineFont)
                                .foregroundStyle(ClarityTheme.text)
                            HStack(spacing: 12) {
                                budgetChip(name: "Chase", amount: "$250")
                                budgetChip(name: "Kassie", amount: "$200")
                            }
                        }

                        Spacer(minLength: 20)
                    }
                    .padding(20)
                }
            }
            .navigationTitle("Fun Money Rules")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Got it") { dismiss() }
                        .foregroundStyle(ClarityTheme.accent)
                        .fontWeight(.semibold)
                }
            }
        }
    }

    private func ruleSection(icon: String, color: Color, title: String, items: [String]) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Label(title, systemImage: icon)
                .font(ClarityTheme.headlineFont)
                .foregroundStyle(color)
            VStack(alignment: .leading, spacing: 8) {
                ForEach(items, id: \.self) { item in
                    HStack(alignment: .top, spacing: 8) {
                        Image(systemName: icon)
                            .font(.caption)
                            .foregroundStyle(color.opacity(0.7))
                            .frame(width: 14, height: 16)
                        Text(item)
                            .font(ClarityTheme.bodyFont)
                            .foregroundStyle(ClarityTheme.text)
                    }
                }
            }
        }
        .padding(14)
        .background(color.opacity(0.08))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(color.opacity(0.2), lineWidth: 1)
        )
    }

    private func budgetChip(name: String, amount: String) -> some View {
        VStack(spacing: 4) {
            Text(name)
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
            Text(amount)
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.accent)
        }
        .frame(maxWidth: .infinity)
        .padding(12)
        .background(ClarityTheme.surface)
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}

#Preview {
    FunMoneyHelpView()
}
