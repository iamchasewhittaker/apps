import SwiftUI
import ClarityUI

/// Read-only detail view for a past check-in entry.
struct EntryDetailView: View {
    let entry: CheckinEntry

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: ClarityMetrics.cardSpacing) {
                if let m = entry.morning {
                    MorningSummaryCard(data: m)
                }
                if let e = entry.evening {
                    EveningSummaryCard(data: e)
                }
                if entry.morning == nil && entry.evening == nil {
                    ClarityEmptyState(icon: "doc", title: "No data", message: "Nothing was saved for this day.")
                }
            }
            .padding(ClarityMetrics.pagePadding)
        }
        .background(ClarityPalette.bg.ignoresSafeArea())
        .navigationTitle(DateHelpers.displayLong(from: entry.date))
        .navigationBarTitleDisplayMode(.inline)
    }
}

struct MorningSummaryCard: View {
    let data: MorningData

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            ClaritySectionLabel("Morning", showDivider: false)
            DataRow(label: "Sleep Onset", value: "\(data.sleepOnset)/10")
            DataRow(label: "Sleep Quality", value: "\(data.sleepQuality)/10")
            DataRow(label: "Morning Readiness", value: "\(data.morningReadiness)/10")
            if !data.notes.isEmpty {
                DataRow(label: "Notes", value: data.notes)
            }
        }
        .clarityCard()
    }
}

struct EveningSummaryCard: View {
    let data: EveningData

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            ClaritySectionLabel("Evening", showDivider: false)
            if !data.medsChecked.isEmpty {
                DataRow(label: "Meds Taken", value: data.medsChecked.joined(separator: ", "))
            }
            DataRow(label: "Focus", value: "\(data.focus)/10")
            DataRow(label: "Mood", value: "\(data.mood)/10")
            if let v = data.adhdSymptoms { DataRow(label: "ADHD Symptoms", value: v) }
            if let v = data.sideEffects  { DataRow(label: "Side Effects", value: v) }
            if let v = data.exercise     { DataRow(label: "Exercise", value: v) }
            if let v = data.eating       { DataRow(label: "Healthy Eating", value: v) }
            if let v = data.stress       { DataRow(label: "Stress", value: v) }
            if let v = data.faith        { DataRow(label: "Scripture / Faith", value: v) }
            if let v = data.caffeine     { DataRow(label: "Caffeine", value: v) }
            DataRow(label: "Day Quality", value: "\(data.dayQuality)/10")
            if !data.spendingNotes.isEmpty { DataRow(label: "Spending", value: data.spendingNotes) }
            if !data.tomorrowFocus.isEmpty { DataRow(label: "Tomorrow", value: data.tomorrowFocus) }
        }
        .clarityCard()
    }
}

struct DataRow: View {
    let label: String
    let value: String

    var body: some View {
        HStack(alignment: .top) {
            Text(label)
                .font(ClarityTypography.caption)
                .foregroundStyle(ClarityPalette.muted)
                .frame(width: 120, alignment: .leading)
            Text(value)
                .font(ClarityTypography.support)
                .foregroundStyle(ClarityPalette.text)
            Spacer()
        }
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(label): \(value)")
    }
}
