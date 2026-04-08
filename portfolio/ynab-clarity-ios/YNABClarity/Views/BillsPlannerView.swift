import SwiftData
import SwiftUI

struct BillsPlannerView: View {
    @EnvironmentObject private var appState: AppState
    @Query private var mappings: [CategoryMapping]
    @Query(sort: \IncomeSource.sortOrder) private var sources: [IncomeSource]

    private var balances: [CategoryBalance] { appState.buildBalances(mappings: mappings) }
    private var mortgageItems: [CategoryBalance] { balances.filter { $0.role == .mortgage } }
    private var billItems: [CategoryBalance]     { balances.filter { $0.role == .bill } }
    private var essentialItems: [CategoryBalance] { balances.filter { $0.role == .essential } }

    var body: some View {
        NavigationStack {
            ZStack {
                ClarityTheme.bg.ignoresSafeArea()

                if appState.isLoading && appState.monthDetail == nil {
                    ProgressView().tint(ClarityTheme.accent)
                } else {
                    ScrollView {
                        VStack(spacing: 20) {
                            if !mortgageItems.isEmpty {
                                billSection(
                                    title: "Mortgage / Housing",
                                    icon: "house.fill",
                                    color: ClarityTheme.mortgage,
                                    items: mortgageItems
                                )
                            }
                            if !billItems.isEmpty {
                                billSection(
                                    title: "Fixed Bills",
                                    icon: "bolt.fill",
                                    color: ClarityTheme.accent,
                                    items: billItems
                                )
                            }
                            if !essentialItems.isEmpty {
                                billSection(
                                    title: "Essentials",
                                    icon: "cart.fill",
                                    color: ClarityTheme.caution,
                                    items: essentialItems
                                )
                            }
                            if mortgageItems.isEmpty && billItems.isEmpty && essentialItems.isEmpty {
                                emptyState
                            }
                        }
                        .padding(16)
                    }
                    .refreshable {
                        await appState.refresh(categoryMappings: mappings, incomeSources: sources)
                    }
                }
            }
            .navigationTitle("Bills")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    // MARK: - Section

    private func billSection(title: String, icon: String, color: Color, items: [CategoryBalance]) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Label(title, systemImage: icon)
                .font(ClarityTheme.headlineFont)
                .foregroundStyle(color)
                .padding(.horizontal, 4)

            VStack(spacing: 1) {
                ForEach(items, id: \.ynabCategoryID) { item in
                    billRow(item)
                }
            }
            .background(ClarityTheme.border.opacity(0.3))
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(ClarityTheme.border, lineWidth: 1)
            )
        }
    }

    // MARK: - Row

    private func billRow(_ b: CategoryBalance) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(b.name)
                    .font(ClarityTheme.bodyFont)
                    .foregroundStyle(ClarityTheme.text)
                Spacer()
                statusBadge(b)
            }

            if b.monthlyTarget > 0 {
                ProgressView(value: b.coverageFraction)
                    .tint(ClarityTheme.progressColor(fraction: b.coverageFraction))

                HStack {
                    Text(ClarityTheme.currency(max(0, b.available)) + " available")
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                    Spacer()
                    Text("Target: " + ClarityTheme.currency(b.monthlyTarget))
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                }
            }
        }
        .padding(12)
        .background(ClarityTheme.surface)
    }

    private func statusBadge(_ b: CategoryBalance) -> some View {
        let (label, color): (String, Color) = {
            if b.isCovered            { return ("Covered",  ClarityTheme.safe) }
            if b.coverageFraction >= 0.5 { return ("Partial",  ClarityTheme.caution) }
            return ("Shortfall", ClarityTheme.danger)
        }()

        return Text(label)
            .font(ClarityTheme.captionFont.weight(.semibold))
            .foregroundStyle(color)
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .background(color.opacity(0.15))
            .clipShape(Capsule())
    }

    // MARK: - Empty state

    private var emptyState: some View {
        VStack(spacing: 12) {
            Image(systemName: "list.bullet.rectangle")
                .font(.system(size: 40))
                .foregroundStyle(ClarityTheme.muted)
            Text("No bills categorized")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.muted)
            Text("Open Settings → Category Setup to tag your YNAB categories as Bills or Essentials.")
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 20)
        }
        .frame(maxWidth: .infinity)
        .padding(40)
    }
}

#Preview {
    BillsPlannerView()
        .environmentObject(AppState.preview)
        .modelContainer(for: [CategoryMapping.self, IncomeSource.self], inMemory: true)
}
