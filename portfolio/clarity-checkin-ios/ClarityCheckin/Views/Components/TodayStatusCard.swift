import SwiftUI
import ClarityUI

/// Shows today's check-in status and the primary action button.
struct TodayStatusCard: View {
    @Environment(CheckinStore.self) private var store

    var body: some View {
        VStack(spacing: 12) {
            HStack {
                Text("Today")
                    .font(ClarityTypography.title)
                    .foregroundStyle(ClarityPalette.text)
                Spacer()
                Text(DateHelpers.displayLong(from: DateHelpers.todayString))
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
            }

            HStack(spacing: 12) {
                StatusBadge(label: "Morning", isDone: store.hasMorningToday, icon: "sunrise.fill")
                StatusBadge(label: "Evening", isDone: store.hasEveningToday, icon: "moon.fill")
            }

            NavigationLink {
                CheckinFlowView()
            } label: {
                Label(primaryButtonLabel, systemImage: primaryButtonIcon)
                    .font(ClarityTypography.headline)
                    .foregroundStyle(ClarityPalette.bg)
                    .frame(maxWidth: .infinity)
                    .frame(minHeight: ClarityMetrics.minTapTarget)
                    .background(ClarityPalette.accent)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
            }
            .buttonStyle(.plain)
            .accessibilityLabel(primaryButtonLabel)
        }
        .clarityCard()
    }

    private var primaryButtonLabel: String {
        if !store.hasMorningToday { return "Start Morning Check-in" }
        if !store.hasEveningToday { return "Start Evening Check-in" }
        return "View Today's Entry"
    }

    private var primaryButtonIcon: String {
        if !store.hasMorningToday { return "sunrise.fill" }
        if !store.hasEveningToday { return "moon.fill" }
        return "checkmark.circle.fill"
    }
}

struct StatusBadge: View {
    let label: String
    let isDone: Bool
    let icon: String

    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: isDone ? "checkmark.circle.fill" : icon)
                .foregroundStyle(isDone ? ClarityPalette.safe : ClarityPalette.muted)
                .accessibilityHidden(true)
            Text(label)
                .font(ClarityTypography.caption)
                .foregroundStyle(isDone ? ClarityPalette.safe : ClarityPalette.muted)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(RoundedRectangle(cornerRadius: 8).stroke(
            isDone ? ClarityPalette.safe.opacity(0.4) : ClarityPalette.border,
            lineWidth: ClarityMetrics.borderWidth
        ))
        .accessibilityLabel("\(label): \(isDone ? "complete" : "not yet done")")
    }
}
