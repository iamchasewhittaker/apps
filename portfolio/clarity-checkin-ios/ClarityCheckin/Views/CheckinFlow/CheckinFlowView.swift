import SwiftUI
import ClarityUI

/// The morning/evening check-in wizard.
/// Sections advance linearly; user can go back. Draft is autosaved on every change.
struct CheckinFlowView: View {
    @Environment(CheckinStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    private var sections: [CheckinSection] {
        store.draft.isMorning ? morningSections : eveningSections
    }

    private var morningSections: [CheckinSection] {
        [.sleep, .morningStart]
    }

    private var eveningSections: [CheckinSection] {
        [.medCheckin, .healthLifestyle, .endOfDay]
    }

    var body: some View {
        @Bindable var s = store
        VStack(spacing: 0) {
            // Progress bar
            ClarityProgressBar(
                label: "",
                value: Double(store.draft.currentSection + 1) / Double(sections.count)
            )
            .padding(.horizontal, ClarityMetrics.pagePadding)
            .padding(.top, 8)

            // Section indicator
            HStack {
                Text("Step \(store.draft.currentSection + 1) of \(sections.count)")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
                Spacer()
                Text(store.draft.isMorning ? "Morning Check-in" : "Evening Check-in")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
            }
            .padding(.horizontal, ClarityMetrics.pagePadding)
            .padding(.vertical, 8)

            // Section content
            ScrollView {
                VStack(spacing: ClarityMetrics.cardSpacing) {
                    currentSectionView
                        .padding(ClarityMetrics.pagePadding)
                }
            }

            // Navigation buttons
            HStack(spacing: 12) {
                if store.draft.currentSection > 0 {
                    Button("Back") {
                        store.draft.currentSection -= 1
                        store.saveDraft()
                    }
                    .font(ClarityTypography.support)
                    .foregroundStyle(ClarityPalette.muted)
                    .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                    .background(ClarityPalette.surface)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(ClarityPalette.border))
                }

                Button(isLastSection ? "Save" : "Next") {
                    if isLastSection {
                        commit()
                        dismiss()
                    } else {
                        store.draft.currentSection += 1
                        store.saveDraft()
                    }
                }
                .font(ClarityTypography.headline)
                .foregroundStyle(ClarityPalette.bg)
                .frame(maxWidth: .infinity)
                .frame(minHeight: ClarityMetrics.minTapTarget)
                .background(ClarityPalette.accent)
                .clipShape(RoundedRectangle(cornerRadius: 10))
            }
            .padding(ClarityMetrics.pagePadding)
        }
        .background(ClarityPalette.bg.ignoresSafeArea())
        .navigationBarTitleDisplayMode(.inline)
        .navigationTitle(sections[safe: store.draft.currentSection]?.title ?? "")
        .onAppear {
            if store.draft.date != DateHelpers.todayString {
                store.resetDraft()
            }
        }
    }

    @ViewBuilder
    private var currentSectionView: some View {
        switch sections[safe: store.draft.currentSection] {
        case .sleep:         SleepSectionView()
        case .morningStart:  MorningStartSectionView()
        case .medCheckin:    MedCheckinSectionView()
        case .healthLifestyle: HealthLifestyleSectionView()
        case .endOfDay:      EndOfDaySectionView()
        default:             EmptyView()
        }
    }

    private var isLastSection: Bool {
        store.draft.currentSection == sections.count - 1
    }

    private func commit() {
        if store.draft.isMorning {
            store.commitMorning()
        } else {
            store.commitEvening()
        }
    }
}

enum CheckinSection: CaseIterable {
    case sleep, morningStart, medCheckin, healthLifestyle, endOfDay

    var title: String {
        switch self {
        case .sleep:           return "Sleep"
        case .morningStart:    return "Morning Start"
        case .medCheckin:      return "Medication"
        case .healthLifestyle: return "Health & Lifestyle"
        case .endOfDay:        return "End of Day"
        }
    }
}

private extension Array {
    subscript(safe index: Index) -> Element? {
        indices.contains(index) ? self[index] : nil
    }
}
