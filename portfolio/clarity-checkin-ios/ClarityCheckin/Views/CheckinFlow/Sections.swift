import SwiftUI
import ClarityUI

// MARK: - Sleep Section

struct SleepSectionView: View {
    @Environment(CheckinStore.self) private var store

    var body: some View {
        @Bindable var s = store
        VStack(spacing: ClarityMetrics.cardSpacing) {
            ClaritySectionLabel("Sleep Quality", showDivider: false)

            ClarityRating(
                label: "Sleep Onset (how long to fall asleep?)",
                value: $s.draft.morning.sleepOnset
            )
            .onChange(of: store.draft.morning.sleepOnset) { _, _ in store.saveDraft() }

            ClarityRating(
                label: "Sleep Quality (how restful?)",
                value: $s.draft.morning.sleepQuality
            )
            .onChange(of: store.draft.morning.sleepQuality) { _, _ in store.saveDraft() }
        }
        .clarityCard()
    }
}

// MARK: - Morning Start Section

struct MorningStartSectionView: View {
    @Environment(CheckinStore.self) private var store

    var body: some View {
        @Bindable var s = store
        VStack(spacing: ClarityMetrics.cardSpacing) {
            ClaritySectionLabel("Morning Readiness", showDivider: false)

            ClarityRating(
                label: "Morning Readiness (how ready do you feel?)",
                value: $s.draft.morning.morningReadiness
            )
            .onChange(of: store.draft.morning.morningReadiness) { _, _ in store.saveDraft() }

            VStack(alignment: .leading, spacing: 8) {
                Text("Notes (optional)")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
                TextField("Anything on your mind this morning?", text: $s.draft.morning.notes, axis: .vertical)
                    .font(ClarityTypography.body)
                    .foregroundStyle(ClarityPalette.text)
                    .lineLimit(3...6)
                    .onChange(of: store.draft.morning.notes) { _, _ in store.saveDraft() }
            }
        }
        .clarityCard()
    }
}

// MARK: - Med Checkin Section

struct MedCheckinSectionView: View {
    @Environment(CheckinStore.self) private var store

    var body: some View {
        @Bindable var s = store
        VStack(spacing: ClarityMetrics.cardSpacing) {
            ClaritySectionLabel("Medications Taken Today", showDivider: false)

            if store.meds.isEmpty {
                Text("No medications added. Tap the pills button to add some.")
                    .font(ClarityTypography.support)
                    .foregroundStyle(ClarityPalette.muted)
            } else {
                FlowLayout(spacing: 8) {
                    ForEach(store.meds, id: \.self) { med in
                        let isChecked = store.draft.evening.medsChecked.contains(med)
                        ClarityMultiChip(med, isSelected: isChecked) {
                            if isChecked {
                                store.draft.evening.medsChecked.removeAll { $0 == med }
                            } else {
                                store.draft.evening.medsChecked.append(med)
                            }
                            store.saveDraft()
                        }
                    }
                }
            }

            ClarityRating(
                label: "Focus today (1 = very foggy, 10 = sharp)",
                value: $s.draft.evening.focus
            )
            .onChange(of: store.draft.evening.focus) { _, _ in store.saveDraft() }

            ClarityRating(
                label: "Mood today",
                value: $s.draft.evening.mood
            )
            .onChange(of: store.draft.evening.mood) { _, _ in store.saveDraft() }
        }
        .clarityCard()
    }
}

// MARK: - Health & Lifestyle Section

struct HealthLifestyleSectionView: View {
    @Environment(CheckinStore.self) private var store

    var body: some View {
        @Bindable var s = store
        VStack(spacing: ClarityMetrics.cardSpacing) {
            ClaritySectionLabel("Health & Lifestyle", showDivider: false)

            Group {
                ClarityTriToggle(label: "ADHD Symptoms", value: $s.draft.evening.adhdSymptoms)
                    .onChange(of: store.draft.evening.adhdSymptoms) { _, _ in store.saveDraft() }
                ClarityTriToggle(label: "Side Effects", value: $s.draft.evening.sideEffects)
                    .onChange(of: store.draft.evening.sideEffects) { _, _ in store.saveDraft() }
                ClarityTriToggle(label: "Exercise", value: $s.draft.evening.exercise)
                    .onChange(of: store.draft.evening.exercise) { _, _ in store.saveDraft() }
                ClarityTriToggle(label: "Healthy Eating", value: $s.draft.evening.eating)
                    .onChange(of: store.draft.evening.eating) { _, _ in store.saveDraft() }
                ClarityTriToggle(label: "Stress Level", value: $s.draft.evening.stress,
                                 options: ["Low", "Medium", "High"])
                    .onChange(of: store.draft.evening.stress) { _, _ in store.saveDraft() }
                ClarityTriToggle(label: "Scripture / Faith", value: $s.draft.evening.faith)
                    .onChange(of: store.draft.evening.faith) { _, _ in store.saveDraft() }
                ClarityTriToggle(label: "Caffeine", value: $s.draft.evening.caffeine,
                                 options: ["None", "Moderate", "High"])
                    .onChange(of: store.draft.evening.caffeine) { _, _ in store.saveDraft() }
            }
        }
        .clarityCard()
    }
}

// MARK: - End of Day Section

struct EndOfDaySectionView: View {
    @Environment(CheckinStore.self) private var store

    var body: some View {
        @Bindable var s = store
        VStack(spacing: ClarityMetrics.cardSpacing) {
            ClaritySectionLabel("End of Day", showDivider: false)

            ClarityRating(
                label: "Day Quality overall",
                value: $s.draft.evening.dayQuality
            )
            .onChange(of: store.draft.evening.dayQuality) { _, _ in store.saveDraft() }

            VStack(alignment: .leading, spacing: 8) {
                Text("Spending notes (optional)")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
                TextField("Any purchases or financial thoughts?", text: $s.draft.evening.spendingNotes, axis: .vertical)
                    .font(ClarityTypography.body)
                    .foregroundStyle(ClarityPalette.text)
                    .lineLimit(2...4)
                    .onChange(of: store.draft.evening.spendingNotes) { _, _ in store.saveDraft() }
            }

            VStack(alignment: .leading, spacing: 8) {
                Text("Tomorrow's focus (optional)")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
                TextField("One thing for tomorrow", text: $s.draft.evening.tomorrowFocus, axis: .vertical)
                    .font(ClarityTypography.body)
                    .foregroundStyle(ClarityPalette.text)
                    .lineLimit(2...4)
                    .onChange(of: store.draft.evening.tomorrowFocus) { _, _ in store.saveDraft() }
            }
        }
        .clarityCard()
    }
}
