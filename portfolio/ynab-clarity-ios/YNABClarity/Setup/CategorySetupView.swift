import SwiftData
import SwiftUI

struct CategorySetupView: View {
    let groups: [YNABCategoryGroup]
    var onNext: () -> Void

    @Environment(\.modelContext) private var modelContext
    @Query private var existingMappings: [CategoryMapping]

    /// Local editing state: category ID → chosen role
    @State private var roleSelections: [String: CategoryRole] = [:]
    @State private var isSaving = false
    @State private var wasAutoSuggested = false

    /// Groups that should not be shown (YNAB system groups)
    private let hiddenGroupNames = Set(["Internal Master Category", "Credit Card Payments"])

    private var visibleGroups: [YNABCategoryGroup] {
        groups.filter { group in
            !group.hidden &&
            !hiddenGroupNames.contains(group.name) &&
            group.categories.contains(where: { !$0.hidden && !$0.deleted })
        }
    }

    var body: some View {
        ZStack {
            ClarityTheme.bg.ignoresSafeArea()
            VStack(spacing: 0) {
                instructionBanner
                categoryList
                saveButton
            }
        }
        .onAppear { initializeSelections() }
    }

    private var instructionBanner: some View {
        VStack(spacing: 4) {
            Text("Tag each category so the app knows what's required vs. flexible spending.")
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
                .multilineTextAlignment(.center)
            if wasAutoSuggested {
                Label("Roles were auto-suggested — review and adjust as needed.", systemImage: "wand.and.stars")
                    .font(ClarityTheme.captionFont)
                    .foregroundStyle(ClarityTheme.accent)
                    .multilineTextAlignment(.center)
            }
            Button("Re-suggest All") {
                withAnimation { initializeSelections() }
            }
            .font(ClarityTheme.captionFont)
            .foregroundStyle(ClarityTheme.accent)
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .frame(maxWidth: .infinity)
        .background(ClarityTheme.surface)
    }

    private var categoryList: some View {
        List {
            ForEach(visibleGroups) { group in
                Section(header:
                    Text(group.name)
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.muted)
                        .textCase(nil)
                ) {
                    ForEach(group.categories.filter { !$0.hidden && !$0.deleted }) { category in
                        categoryRow(category: category, groupName: group.name)
                    }
                }
            }
        }
        .scrollContentBackground(.hidden)
        .listStyle(.insetGrouped)
    }

    private func categoryRow(category: YNABCategory, groupName: String) -> some View {
        HStack {
            Text(category.name)
                .font(ClarityTheme.bodyFont)
                .foregroundStyle(ClarityTheme.text)
            Spacer()
            Picker("", selection: Binding(
                get: { roleSelections[category.id] ?? .ignore },
                set: { roleSelections[category.id] = $0 }
            )) {
                ForEach(CategoryRole.allCases) { role in
                    Text(role.displayName).tag(role)
                }
            }
            .pickerStyle(.menu)
            .tint(roleColor(roleSelections[category.id] ?? .ignore))
            .labelsHidden()
        }
        .listRowBackground(ClarityTheme.surface)
    }

    private var saveButton: some View {
        Button {
            Task { await saveAndAdvance() }
        } label: {
            HStack {
                if isSaving {
                    ProgressView().progressViewStyle(.circular).tint(ClarityTheme.bg)
                } else {
                    Text("Save & Continue")
                        .font(ClarityTheme.headlineFont)
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(ClarityTheme.accent)
            .foregroundStyle(ClarityTheme.text)
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .disabled(isSaving)
        .padding(20)
    }

    // MARK: - Helpers

    private func roleColor(_ role: CategoryRole) -> Color {
        switch role {
        case .mortgage:  return ClarityTheme.mortgage
        case .bill:      return ClarityTheme.danger
        case .essential: return ClarityTheme.caution
        case .flexible:  return ClarityTheme.safe
        case .ignore:    return ClarityTheme.muted
        }
    }

    private func initializeSelections() {
        // Only trust existing non-ignore mappings — .ignore means "never classified",
        // not "intentionally ignored". Re-run suggestions for anything saved as ignore.
        let existing = Dictionary(uniqueKeysWithValues:
            existingMappings.compactMap { m -> (String, CategoryRole)? in
                m.role == .ignore ? nil : (m.ynabCategoryID, m.role)
            }
        )
        let isFirstRun = existingMappings.isEmpty
        var selections: [String: CategoryRole] = [:]
        for group in visibleGroups {
            for category in group.categories where !category.hidden && !category.deleted {
                selections[category.id] = existing[category.id]
                    ?? Self.suggestRole(categoryName: category.name, groupName: group.name)
            }
        }
        roleSelections = selections
        if isFirstRun { wasAutoSuggested = true }
    }

    private static func suggestRole(categoryName: String, groupName: String) -> CategoryRole {
        let combined  = (categoryName + " " + groupName).lowercased()
        let groupOnly = groupName.lowercased()

        // --- Group-level pass (stronger signal than individual keywords) ---
        let ignoreGroups    = ["saving", "savings", "goal", "goals", "investment",
                               "next month", "rainy day"]
        let mortgageGroups  = ["mortgage", "housing"]
        let billGroups      = ["bill", "bills", "utilities", "utility", "subscription",
                               "subscriptions", "insurance", "debt", "loan", "giving",
                               "tithe", "tithes", "donation", "donations", "fixed"]
        let essentialGroups = ["grocery", "groceries", "health", "medical", "healthcare",
                               "transportation", "transit", "essential", "everyday",
                               "needs", "kids", "children"]
        let flexibleGroups  = ["fun", "entertainment", "dining", "eating", "restaurant",
                               "flexible", "discretionary", "gifts", "celebrations",
                               "holiday", "holidays", "wants", "personal", "lifestyle",
                               "career", "development"]

        if ignoreGroups.contains(where:    { groupOnly.contains($0) }) { return .ignore }
        if mortgageGroups.contains(where:  { groupOnly.contains($0) }) { return .mortgage }
        if billGroups.contains(where:      { groupOnly.contains($0) }) { return .bill }
        if essentialGroups.contains(where: { groupOnly.contains($0) }) { return .essential }
        if flexibleGroups.contains(where:  { groupOnly.contains($0) }) { return .flexible }

        // --- Individual keyword pass ---
        // Note: "rent" excluded from mortgageKW — group-level handles it more accurately.
        let mortgageKW  = ["mortgage", "hoa", "home loan", "property tax"]
        let billKW      = ["electric", "gas", "water", "internet", "phone", "cable",
                           "insurance", "subscription", "netflix", "spotify", "hulu",
                           "streaming", "car payment", "loan", "debt", "wifi", "cellular",
                           "broadband", "amazon prime", "vivint", "utility", "utilities",
                           "tithe", "tithing", "offering", "donation", "giving"]
        let essentialKW = ["groceries", "grocery", "food", "medical", "health",
                           "prescription", "medication", "fuel", "transportation",
                           "transit", "clothing", "household", "childcare", "toiletries",
                           "personal care", "maintenance", "repair", "pharmacy",
                           "doctor", "dentist", "dental", "vision", "baby", "pet"]
        let flexibleKW  = ["dining", "restaurant", "eating out", "entertainment",
                           "shopping", "hobbies", "vacation", "travel", "fun", "gifts",
                           "hair", "gym", "fitness", "coffee", "bars", "games", "sports",
                           "birthday", "christmas", "holiday", "books", "media"]

        if mortgageKW.contains(where:  { combined.contains($0) }) { return .mortgage }
        if billKW.contains(where:      { combined.contains($0) }) { return .bill }
        if essentialKW.contains(where: { combined.contains($0) }) { return .essential }
        if flexibleKW.contains(where:  { combined.contains($0) }) { return .flexible }
        return .ignore
    }

    private func saveAndAdvance() async {
        isSaving = true
        defer { isSaving = false }

        // Build a lookup of existing mappings by ID for upsert.
        let existingByID = Dictionary(uniqueKeysWithValues: existingMappings.map { ($0.ynabCategoryID, $0) })

        for group in visibleGroups {
            for category in group.categories where !category.hidden && !category.deleted {
                let chosenRole = roleSelections[category.id] ?? .ignore
                if let existing = existingByID[category.id] {
                    // Update existing mapping in-place.
                    existing.role = chosenRole
                    existing.ynabCategoryName = category.name
                    existing.ynabGroupName = group.name
                } else {
                    // Insert new mapping.
                    let mapping = CategoryMapping(
                        ynabCategoryID: category.id,
                        ynabCategoryName: category.name,
                        ynabGroupName: group.name,
                        role: chosenRole
                    )
                    modelContext.insert(mapping)
                }
            }
        }

        try? modelContext.save()
        onNext()
    }
}
