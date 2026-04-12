import SwiftData
import SwiftUI

struct BillsPlannerView: View {
    @EnvironmentObject private var appState: AppState
    @Query private var mappings: [CategoryMapping]
    @Query(sort: \IncomeSource.sortOrder) private var sources: [IncomeSource]

    @State private var showCovered = false
    @State private var fundSheet: FundCategorySheetConfig? = nil
    @State private var isFunding = false
    @State private var reviewSheet: CategoryReviewConfig? = nil
    @State private var isAssigning = false

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
                                message: "Embrace your true expenses. Every dollar that comes in should go somewhere specific — review and confirm what YNAB categorized.",
                                storageKey: "chase_ynab_clarity_ios_tip_dismissed_bills"
                            )
                            categorizationReviewSection
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
                FundCategoryConfirmationSheet(
                    config: config,
                    isFunding: $isFunding,
                    onConfirm: {
                        try? await appState.fundCategory(
                            categoryID: config.categoryID,
                            budgetedMilliunits: config.targetMilliunits,
                            categoryMappings: mappings,
                            incomeSources: sources
                        )
                        fundSheet = nil
                    },
                    onCancel: { fundSheet = nil }
                )
            }
            .sheet(item: $reviewSheet) { config in
                AssignCategorySheet(
                    transaction: config.transaction,
                    suggestions: config.suggestions,
                    mappings: mappings,
                    isAssigning: $isAssigning,
                    onAssign: { mapping in
                        try? await appState.updateTransactionCategory(
                            transactionID: config.transaction.id,
                            categoryID: mapping.ynabCategoryID,
                            categoryMappings: mappings,
                            incomeSources: sources
                        )
                        reviewSheet = nil
                    },
                    onDismiss: { reviewSheet = nil }
                )
            }
        }
    }

    // MARK: - Categorization review

    private var uncategorizedTransactions: [YNABTransaction] {
        appState.transactions.filter { CategorySuggestionEngine.needsReview($0) }
    }

    private var categorizationReviewSection: some View {
        let items = uncategorizedTransactions
        return VStack(alignment: .leading, spacing: 10) {
            HStack {
                Label("Categorization Review", systemImage: "tag.fill")
                    .font(ClarityTheme.headlineFont)
                    .foregroundStyle(ClarityTheme.text)
                Spacer()
                if items.isEmpty {
                    Text("All Clear")
                        .font(ClarityTheme.captionFont.weight(.semibold))
                        .foregroundStyle(ClarityTheme.safe)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(ClarityTheme.safe.opacity(0.15))
                        .clipShape(Capsule())
                } else {
                    Text("\(items.count) to review")
                        .font(ClarityTheme.captionFont.weight(.semibold))
                        .foregroundStyle(ClarityTheme.caution)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(ClarityTheme.caution.opacity(0.15))
                        .clipShape(Capsule())
                }
            }
            .padding(.horizontal, 4)

            if items.isEmpty {
                HStack(spacing: 8) {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(ClarityTheme.safe)
                    Text("All transactions have categories assigned.")
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                }
                .padding(12)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(ClarityTheme.surface)
                .clipShape(RoundedRectangle(cornerRadius: 14))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(ClarityTheme.border, lineWidth: 1))
            } else {
                VStack(spacing: 1) {
                    ForEach(items) { txn in
                        let suggestions = CategorySuggestionEngine.suggest(for: txn, from: mappings)
                        reviewRow(txn: txn, suggestions: suggestions)
                    }
                }
                .background(ClarityTheme.border.opacity(0.3))
                .clipShape(RoundedRectangle(cornerRadius: 14))
                .overlay(RoundedRectangle(cornerRadius: 14).stroke(ClarityTheme.border, lineWidth: 1))
            }
        }
    }

    private func reviewRow(txn: YNABTransaction, suggestions: [CategorySuggestion]) -> some View {
        Button {
            reviewSheet = CategoryReviewConfig(transaction: txn, suggestions: suggestions)
        } label: {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(PayeeDisplayFormatter.displayPayee(txn.payeeName))
                        .font(ClarityTheme.bodyFont)
                        .foregroundStyle(ClarityTheme.text)
                        .lineLimit(2)
                    if let itemLine = PayeeDisplayFormatter.itemContextSubtitle(payeeRaw: txn.payeeName, memo: txn.memo) {
                        Text(itemLine)
                            .font(ClarityTheme.supportingFont)
                            .foregroundStyle(ClarityTheme.muted)
                            .lineLimit(3)
                    }
                    Text(txn.date)
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 4) {
                    Text(ClarityTheme.currency(-txn.amountDollars))
                        .font(ClarityTheme.bodyFont.weight(.semibold))
                        .foregroundStyle(ClarityTheme.text)
                    if let top = suggestions.first {
                        Text(top.mapping.ynabCategoryName)
                            .font(ClarityTheme.captionFont)
                            .foregroundStyle(ClarityTheme.accent)
                            .lineLimit(1)
                    } else {
                        Text("No match")
                            .font(ClarityTheme.captionFont)
                            .foregroundStyle(ClarityTheme.muted)
                    }
                }
                Image(systemName: "chevron.right")
                    .font(.caption2)
                    .foregroundStyle(ClarityTheme.muted)
            }
            .padding(12)
            .background(ClarityTheme.surface)
        }
        .buttonStyle(.plain)
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
                        fundSheet = FundCategorySheetConfig(
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
                ProgressView(value: ClarityTheme.clampedProgressFraction(b.coverageFraction))
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

// MARK: - Assign category sheet (suggestions + full mapped list + search)

private struct AssignCategorySheet: View {
    let transaction: YNABTransaction
    let suggestions: [CategorySuggestion]
    let mappings: [CategoryMapping]
    @Binding var isAssigning: Bool
    let onAssign: (CategoryMapping) async -> Void
    let onDismiss: () -> Void

    @State private var query = ""

    private let roleOrder: [CategoryRole] = [.mortgage, .bill, .essential, .flexible]

    private var suggestedIDs: Set<String> {
        Set(suggestions.map(\.mapping.ynabCategoryID))
    }

    private var assignableMappings: [CategoryMapping] {
        mappings
            .filter { $0.role != .ignore }
            .sorted { lhs, rhs in
                let lr = roleRank(lhs.role)
                let rr = roleRank(rhs.role)
                if lr != rr { return lr < rr }
                return lhs.ynabCategoryName.localizedCaseInsensitiveCompare(rhs.ynabCategoryName) == .orderedAscending
            }
    }

    private func roleRank(_ role: CategoryRole) -> Int {
        roleOrder.firstIndex(of: role) ?? 99
    }

    private func matchesQuery(_ m: CategoryMapping) -> Bool {
        let trimmed = query.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty { return true }
        let l = trimmed.lowercased()
        return m.ynabCategoryName.lowercased().contains(l)
            || m.ynabGroupName.lowercased().contains(l)
    }

    private var searchResults: [CategoryMapping] {
        assignableMappings.filter(matchesQuery)
    }

    var body: some View {
        NavigationStack {
            ZStack {
                ClarityTheme.bg.ignoresSafeArea()
                if assignableMappings.isEmpty {
                    VStack(spacing: 12) {
                        Text("No mapped categories")
                            .font(ClarityTheme.titleFont)
                            .foregroundStyle(ClarityTheme.text)
                        Text("Open Settings → Category Setup to map YNAB categories, then try again.")
                            .font(ClarityTheme.captionFont)
                            .foregroundStyle(ClarityTheme.muted)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 24)
                    }
                } else {
                    List {
                        Section {
                            VStack(alignment: .leading, spacing: 6) {
                                Text(PayeeDisplayFormatter.displayPayee(transaction.payeeName))
                                    .font(ClarityTheme.titleFont)
                                    .foregroundStyle(ClarityTheme.text)
                                Text(ClarityTheme.currency(-transaction.amountDollars) + " · " + transaction.date)
                                    .font(ClarityTheme.captionFont)
                                    .foregroundStyle(ClarityTheme.muted)
                                if let itemLine = PayeeDisplayFormatter.itemContextSubtitle(
                                    payeeRaw: transaction.payeeName,
                                    memo: transaction.memo
                                ) {
                                    Label(itemLine, systemImage: "note.text")
                                        .font(ClarityTheme.supportingFont)
                                        .foregroundStyle(ClarityTheme.accent)
                                        .labelStyle(.titleAndIcon)
                                }
                            }
                            .listRowBackground(ClarityTheme.surface)
                        }

                        if isAssigning {
                            Section {
                                HStack {
                                    Spacer()
                                    ProgressView("Saving to YNAB…")
                                        .tint(ClarityTheme.accent)
                                    Spacer()
                                }
                                .listRowBackground(ClarityTheme.bg)
                            }
                        }

                        if query.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                            if !suggestions.isEmpty {
                                Section("Suggested") {
                                    ForEach(suggestions) { suggestion in
                                        categoryRow(suggestion: suggestion, showSuggestedBadge: true)
                                    }
                                }
                            }
                            ForEach(roleOrder, id: \.self) { role in
                                let rows = assignableMappings.filter {
                                    $0.role == role && !suggestedIDs.contains($0.ynabCategoryID)
                                }
                                if !rows.isEmpty {
                                    Section(role.displayName) {
                                        ForEach(rows, id: \.ynabCategoryID) { mapping in
                                            plainCategoryRow(mapping)
                                        }
                                    }
                                }
                            }
                        } else {
                            Section("Matching categories") {
                                ForEach(searchResults, id: \.ynabCategoryID) { mapping in
                                    plainCategoryRow(mapping)
                                }
                            }
                        }
                    }
                    .scrollContentBackground(.hidden)
                    .listStyle(.insetGrouped)
                }
            }
            .navigationTitle("Assign Category")
            .navigationBarTitleDisplayMode(.inline)
            .searchable(text: $query, prompt: "Search mapped categories")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Cancel", action: onDismiss)
                        .foregroundStyle(ClarityTheme.accent)
                }
            }
        }
    }

    @ViewBuilder
    private func categoryRow(suggestion: CategorySuggestion, showSuggestedBadge: Bool) -> some View {
        Button {
            Task {
                isAssigning = true
                defer { isAssigning = false }
                await onAssign(suggestion.mapping)
            }
        } label: {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(suggestion.mapping.ynabCategoryName)
                        .font(ClarityTheme.bodyFont)
                        .foregroundStyle(ClarityTheme.text)
                    Text(suggestion.mapping.role.displayName)
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                }
                Spacer()
                if showSuggestedBadge, suggestion.confidence >= 0.8, !suggestion.matchedKeyword.isEmpty {
                    Text("Suggested")
                        .font(ClarityTheme.captionFont.weight(.semibold))
                        .foregroundStyle(ClarityTheme.accent)
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(ClarityTheme.accent.opacity(0.15))
                        .clipShape(Capsule())
                }
                Image(systemName: "chevron.right")
                    .font(.caption2)
                    .foregroundStyle(ClarityTheme.muted)
            }
        }
        .buttonStyle(.plain)
        .disabled(isAssigning)
        .listRowBackground(ClarityTheme.surface)
    }

    @ViewBuilder
    private func plainCategoryRow(_ mapping: CategoryMapping) -> some View {
        Button {
            Task {
                isAssigning = true
                defer { isAssigning = false }
                await onAssign(mapping)
            }
        } label: {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text(mapping.ynabCategoryName)
                        .font(ClarityTheme.bodyFont)
                        .foregroundStyle(ClarityTheme.text)
                    if !mapping.ynabGroupName.isEmpty {
                        Text(mapping.ynabGroupName)
                            .font(ClarityTheme.captionFont)
                            .foregroundStyle(ClarityTheme.muted)
                    } else {
                        Text(mapping.role.displayName)
                            .font(ClarityTheme.captionFont)
                            .foregroundStyle(ClarityTheme.muted)
                    }
                }
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.caption2)
                    .foregroundStyle(ClarityTheme.muted)
            }
        }
        .buttonStyle(.plain)
        .disabled(isAssigning)
        .listRowBackground(ClarityTheme.surface)
    }
}

// MARK: - Sheet configuration types

private struct CategoryReviewConfig: Identifiable {
    let id = UUID()
    let transaction: YNABTransaction
    let suggestions: [CategorySuggestion]
}

#Preview {
    BillsPlannerView()
        .environmentObject(AppState.preview)
        .modelContainer(for: [CategoryMapping.self, IncomeSource.self], inMemory: true)
}
