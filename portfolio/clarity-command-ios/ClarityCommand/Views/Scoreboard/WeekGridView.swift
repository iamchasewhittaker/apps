import SwiftUI
import ClarityUI

@MainActor
struct WeekGridView: View {
    @Environment(CommandStore.self) private var store

    private struct DayCell: Identifiable {
        let id: String
        let label: String
        let dayNum: Int
        let status: DayStatus
    }

    private var days: [DayCell] {
        let cal = Calendar.current
        let fmt = DateFormatter()
        fmt.dateFormat = "yyyy-MM-dd"
        let dayFmt = DateFormatter()
        dayFmt.dateFormat = "EEE"

        return (0..<7).reversed().map { offset in
            let date = cal.date(byAdding: .day, value: -offset, to: .now) ?? .now
            let dateStr = fmt.string(from: date)
            let log = store.blob.dailyLogs.first { $0.date == dateStr }
            return DayCell(
                id: dateStr,
                label: dayFmt.string(from: date),
                dayNum: cal.component(.day, from: date),
                status: store.dayStatus(log)
            )
        }
    }

    var body: some View {
        VStack(spacing: 10) {
            HStack(spacing: 6) {
                ForEach(days) { day in
                    VStack(spacing: 4) {
                        Text(day.label)
                            .font(ClarityTypography.caption)
                            .foregroundStyle(ClarityPalette.muted)
                        Text("\(day.dayNum)")
                            .font(ClarityTypography.headline)
                            .foregroundStyle(statusColor(day.status))
                            .frame(height: 36)
                            .frame(maxWidth: .infinity)
                            .background(statusColor(day.status).opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 8))
                            .overlay(
                                RoundedRectangle(cornerRadius: 8)
                                    .stroke(statusColor(day.status), lineWidth: 1)
                            )
                    }
                    .accessibilityElement(children: .combine)
                    .accessibilityLabel("Day \(day.dayNum): \(String(describing: day.status))")
                }
            }

            // Legend
            HStack(spacing: 14) {
                legendItem("Met", color: ClarityPalette.safe)
                legendItem("Partial", color: ClarityPalette.caution)
                legendItem("Missed", color: ClarityPalette.danger)
            }
        }
    }

    private func statusColor(_ status: DayStatus) -> Color {
        switch status {
        case .met: ClarityPalette.safe
        case .partial: ClarityPalette.caution
        case .missed: ClarityPalette.danger
        }
    }

    private func legendItem(_ label: String, color: Color) -> some View {
        HStack(spacing: 4) {
            Circle().fill(color).frame(width: 8, height: 8)
            Text(label)
                .font(ClarityTypography.caption)
                .foregroundStyle(ClarityPalette.muted)
        }
    }
}
