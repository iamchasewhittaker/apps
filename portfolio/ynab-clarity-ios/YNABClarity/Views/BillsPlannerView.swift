import SwiftData
import SwiftUI

struct BillsPlannerView: View {
    @EnvironmentObject private var appState: AppState
    @Query private var mappings: [CategoryMapping]
    @Query(sort: \IncomeSource.sortOrder) private var sources: [IncomeSource]

    @State private var showCovered = false
    @State private var fundSheet: FundSheetConfig? = nil
    @State private var isFunding = false

    private var balances: [CategoryBalance] { appState.buildBalances(mappings: mappings) }

    private var allRequired: [CategoryBalance] {
        balances.filter { $0.role == .mortgage || $0.role == .bill || $0.role == .essential }
    }
    private var needsAttention: [CategoryBalance] {
        allRequired.filter { !$0.isCovered && $0.coverageFraction < 0.5 }
    }
    private var partiallyFunded: [CategoryBalance] {
        allRequired.filter { !$0.isCovered && $0.coverageFraction >= 0.5 }
    }
    private var fullyCovered: [CategoryBalance] {
        allRequired.filter { $0.isCovered }
    }

    var body: some View {
        NavigationStack {
            ZStack {
                ClarityTheme.bg.ignoresSafeArea()

                if appState.isLoading && appState.monthDetail == nil {
                    ProgressView().tint(ClarityTheme.accent)
                } else {
                    ScrollView {
                        VStack(spacing: 20) {
                            TipBanner(
                                message: "Red = needs attention. Green = fully funded this month.",
                                storageKey: "chase_ynab_clarity_ios_tip_dismissed_bills"
                            )
                            if !needsAttention.isEmpty {
                                billSection(
                                    title: "Needs Attention",
                                    icon: "exclamationmark.triangle.fill",
                                    color: ClarityTheme.danger,
                                    items: needsAttention
                                )
                            }
                            if !partiallyFunded.isEmpty {
                                billSection(
                                    title: "Partially Funded",
                                    icon: "circle.lefthalf.filled",
                                    color: ClarityTheme.caution,
                                    items: partiallyFunded
                                )
                            }
                            if !fullyCovered.isEmpty {
                                coveredSection
                            }
                            if allRequired.isEmpty {
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
            .sheet(item: $fundSheet) { config in
                fundConfirmationSheet(config)
            }
        }
    }

    // MARK: - Covered section (collapsible)

    private var coveredSection: some View {
        VStack(alignment: .leading, spacing: 10) {
            Button {
                withAnimation(.easeInOut(duration: 0.25)) { showCovered.toggle() }
            } label: {
                HStack {
                    Label("Fully Covered (\(fullyCovered.count))", systemImage: "checkmark.seal.fill")
                        .font(ClarityTheme.headlineFont)
                        .foregroundStyle(ClarityTheme.safe)
                    Spacer()
                    Image(systemName: showCovered ? "chevron.up" : "chevron.down")
                        .font(.caption)
                        .foregroundStyle(ClarityTheme.muted)
                }
                .padding(.horizontal, 4)
            }
            .buttonStyle(.plain)

            if showCovered {
                VStack(spacing: 1) {
                    ForEach(fullyCovered, id: \.ynabCategoryID) { item in
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
                if !b.isCovered && b.shortfall > 0 {
                    Button {
                        let milliunits = Int(b.monthlyTarget * 1000)
                        fundSheet = FundSheetConfig(
                            categoryID: b.ynabCategoryID,
                            categoryName: b.name,
                            shortfall: b.shortfall,
                            targetMilliunits: milliunits
                        )
                    } label: {
                        Text("Fund")
                            .font(ClarityTheme.captionFont.weight(.semibold))
                            .foregroundStyle(ClarityTheme.accent)
                            .padding(.horizontal, 8)
                            .padding(.vertical, 3)
                            .background(ClarityTheme.accent.opacity(0.15))
                            .clipShape(Capsule())
                    }
                }
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

    // MARK: - Fund confirmation sheet

    private func fundConfirmationSheet(_ config: FundSheetConfig) -> some View {
        NavigationStack {
            ZStack {
                ClarityTheme.bg.ignoresSafeArea()
                VStack(spacing: 20) {
                    Image(systemName: "dollarsign.arrow.circlepath")
                        .font(.system(size: 40))
                        .foregroundStyle(ClarityTheme.accent)

                    Text("Fund \(config.categoryName)?")
                        .font(ClarityTheme.titleFont)
                        .foregroundStyle(ClarityTheme.text)

                    Text("This will assign \(ClarityTheme.currency(config.shortfall)) to fully fund this category's goal in YNAB.")
                        .font(ClarityTheme.bodyFont)
                        .foregroundStyle(ClarityTheme.muted)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 20)

                    Button {
                        Task {
                            isFunding = true
                            defer { isFunding = false }
                            try? await appState.fundCategory(
                                categoryID: config.categoryID,
                                budgetedMilliunits: config.targetMilliunits,
                                categoryMappings: mappings,
                                incomeSources: sources
                            )
                            fundSheet = nil
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
                }
                .padding(24)
            }
            .navigationTitle("Fund Category")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Cancel") { fundSheet = nil }
                        .foregroundStyle(ClarityTheme.accent)
                }
            }
        }
        .preferredColorScheme(.dark)
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

// MARK: - Fund sheet configuration

private struct FundSheetConfig: Identifiable {
    let id = UUID()
    let categoryID: String
    let categoryName: String
    let shortfall: Double
    let targetMilliunits: Int
}

#Preview {
    BillsPlannerView()
        .environmentObject(AppState.preview)
        .modelContainer(for: [CategoryMapping.self, IncomeSource.self], inMemory: true)
}
