import SwiftUI
import ClarityUI

/// Cross-app daily summaries pulled from Supabase (`job-search-daily`, `wellness-daily`).
/// Mirrors the web Clarity Command `LiveAppData` component.
@MainActor
struct LiveAppDataView: View {
    let jobSearch: JobSearchDaily?
    let wellness: WellnessDaily?

    var body: some View {
        if jobSearch == nil && wellness == nil {
            EmptyView()
        } else {
            VStack(spacing: 0) {
                if let js = jobSearch {
                    jobSearchRow(js)
                    if wellness != nil {
                        Divider().background(ClarityPalette.border)
                    }
                }
                if let wl = wellness {
                    wellnessRow(wl)
                }
            }
            .padding(.vertical, 4)
            .padding(.horizontal, 14)
            .background(ClarityPalette.surface)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(ClarityPalette.border, lineWidth: 1)
            )
        }
    }

    // MARK: - Job Search row

    private func jobSearchRow(_ js: JobSearchDaily) -> some View {
        let isToday = DateHelpers.isToday(js.date)
        let target = 5  // matches web `LiveAppData` default; Job Search HQ writes `met` based on its own minimum
        let countColor: Color = js.met ? ClarityPalette.safe : ClarityPalette.accent

        return HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 2) {
                Text("Job Search HQ")
                    .font(ClarityTypography.support)
                    .fontWeight(.semibold)
                    .foregroundStyle(ClarityPalette.text)
                Text(isToday ? "Today" : DateHelpers.displayShort(from: js.date))
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 2) {
                HStack(spacing: 4) {
                    Text("\(js.count)/\(target) actions")
                        .font(ClarityTypography.support)
                        .fontWeight(.semibold)
                        .foregroundStyle(countColor)
                    if js.met {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundStyle(ClarityPalette.safe)
                    }
                }
                if !isToday {
                    Text("last sync")
                        .font(.caption2)
                        .foregroundStyle(ClarityPalette.muted)
                }
            }
        }
        .padding(.vertical, 12)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(jobSearchA11y(js, isToday: isToday, target: target))
    }

    private func jobSearchA11y(_ js: JobSearchDaily, isToday: Bool, target: Int) -> String {
        let when = isToday ? "today" : "last synced \(DateHelpers.displayShort(from: js.date))"
        let met = js.met ? ", target met" : ""
        return "Job Search HQ, \(when), \(js.count) of \(target) actions\(met)"
    }

    // MARK: - Wellness row

    private func wellnessRow(_ wl: WellnessDaily) -> some View {
        let isToday = DateHelpers.isToday(wl.date)
        return HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 2) {
                Text("Wellness Tracker")
                    .font(ClarityTypography.support)
                    .fontWeight(.semibold)
                    .foregroundStyle(ClarityPalette.text)
                Text(isToday ? "Today" : DateHelpers.displayShort(from: wl.date))
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
            }
            Spacer()
            HStack(spacing: 6) {
                wellnessIcon("sun.max.fill", on: wl.morningDone, tint: ClarityPalette.caution)
                wellnessIcon("moon.fill", on: wl.eveningDone, tint: ClarityPalette.accent)
                wellnessIcon("figure.run", on: wl.activityDone == "yes", tint: ClarityPalette.safe)
                if wl.met {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundStyle(ClarityPalette.safe)
                }
            }
        }
        .padding(.vertical, 12)
        .accessibilityElement(children: .combine)
        .accessibilityLabel(wellnessA11y(wl, isToday: isToday))
    }

    private func wellnessIcon(_ system: String, on: Bool, tint: Color) -> some View {
        Image(systemName: on ? system : "square")
            .font(.system(size: 16, weight: .semibold))
            .foregroundStyle(on ? tint : ClarityPalette.muted)
            .frame(minWidth: 22, minHeight: 22)
    }

    private func wellnessA11y(_ wl: WellnessDaily, isToday: Bool) -> String {
        let when = isToday ? "today" : "last synced \(DateHelpers.displayShort(from: wl.date))"
        let parts = [
            wl.morningDone ? "morning done" : "morning pending",
            wl.eveningDone ? "evening done" : "evening pending",
            wl.activityDone == "yes" ? "activity done" : "activity pending",
        ]
        return "Wellness Tracker, \(when), \(parts.joined(separator: ", "))"
    }
}
