import SwiftUI
import ClarityUI

struct PastDaysSection: View {
    @Environment(CheckinStore.self) private var store

    private var pastEntries: [CheckinEntry] {
        store.blob.entries
            .filter { !DateHelpers.isToday($0.date) }
            .sorted { $0.date > $1.date }
            .prefix(14)
            .map { $0 }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: ClarityMetrics.cardSpacing) {
            ClaritySectionLabel("Past Days")

            if pastEntries.isEmpty {
                ClarityEmptyState(
                    icon: "calendar",
                    title: "No past entries yet",
                    message: "Complete your first check-in to start seeing your history here."
                )
            } else {
                ForEach(pastEntries) { entry in
                    NavigationLink {
                        EntryDetailView(entry: entry)
                    } label: {
                        PastDayRow(entry: entry)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }
}

struct PastDayRow: View {
    let entry: CheckinEntry

    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(DateHelpers.displayLong(from: entry.date))
                    .font(ClarityTypography.support)
                    .foregroundStyle(ClarityPalette.text)
                HStack(spacing: 8) {
                    if entry.morning != nil {
                        Label("Morning", systemImage: "sunrise.fill")
                            .font(ClarityTypography.caption)
                            .foregroundStyle(ClarityPalette.caution)
                    }
                    if entry.evening != nil {
                        Label("Evening", systemImage: "moon.fill")
                            .font(ClarityTypography.caption)
                            .foregroundStyle(ClarityPalette.accent)
                    }
                }
            }
            Spacer()
            Image(systemName: "chevron.right")
                .foregroundStyle(ClarityPalette.muted)
                .accessibilityHidden(true)
        }
        .clarityCard()
        .accessibilityLabel("\(DateHelpers.displayLong(from: entry.date)), \(entryDescription)")
        .accessibilityHint("Tap to view entry details")
    }

    private var entryDescription: String {
        switch (entry.morning != nil, entry.evening != nil) {
        case (true, true): return "morning and evening complete"
        case (true, false): return "morning only"
        case (false, true): return "evening only"
        default: return "no data"
        }
    }
}
