import SwiftUI
import ClarityUI

@MainActor
struct MonthCalendarView: View {
    @Environment(CommandStore.self) private var store

    private let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    var body: some View {
        @Bindable var s = store
        let cal = Calendar.current
        let monthName = cal.monthSymbols[store.selectedMonth]

        VStack(spacing: 12) {
            // Month navigation
            HStack {
                Button {
                    navigateMonth(by: -1)
                } label: {
                    Image(systemName: "chevron.left")
                        .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                }
                .accessibilityLabel("Previous month")

                Spacer()
                Text("\(monthName) \(String(store.selectedYear))")
                    .font(ClarityTypography.headline)
                    .foregroundStyle(ClarityPalette.text)
                Spacer()

                Button {
                    navigateMonth(by: 1)
                } label: {
                    Image(systemName: "chevron.right")
                        .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                }
                .accessibilityLabel("Next month")
            }
            .foregroundStyle(CommandPalette.accent)

            // Weekday headers
            HStack(spacing: 0) {
                ForEach(weekdays, id: \.self) { day in
                    Text(day)
                        .font(ClarityTypography.caption)
                        .foregroundStyle(ClarityPalette.muted)
                        .frame(maxWidth: .infinity)
                }
            }

            // Calendar grid
            let cells = calendarCells()
            LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 2), count: 7), spacing: 2) {
                ForEach(cells, id: \.id) { cell in
                    if cell.dayNum > 0 {
                        let color = statusColor(cell.status)
                        Text("\(cell.dayNum)")
                            .font(ClarityTypography.caption)
                            .foregroundStyle(cell.isToday ? ClarityPalette.bg : color)
                            .frame(height: 32)
                            .frame(maxWidth: .infinity)
                            .background(cell.isToday ? CommandPalette.accent : color.opacity(0.1))
                            .clipShape(RoundedRectangle(cornerRadius: 6))
                            .overlay(
                                RoundedRectangle(cornerRadius: 6)
                                    .stroke(cell.isToday ? CommandPalette.accent : color.opacity(0.3), lineWidth: 1)
                            )
                    } else {
                        Color.clear.frame(height: 32)
                    }
                }
            }
        }
        .padding(12)
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }

    private struct CalCell {
        let id: String
        let dayNum: Int
        let status: DayStatus?
        let isToday: Bool
    }

    private func calendarCells() -> [CalCell] {
        let cal = Calendar.current
        var comps = DateComponents()
        comps.year = store.selectedYear
        comps.month = store.selectedMonth + 1
        comps.day = 1
        guard let firstDay = cal.date(from: comps) else { return [] }

        let weekdayOfFirst = cal.component(.weekday, from: firstDay) - 1
        let daysInMonth = cal.range(of: .day, in: .month, for: firstDay)?.count ?? 30
        let todayStr = DateHelpers.todayString
        let fmt = DateFormatter()
        fmt.dateFormat = "yyyy-MM-dd"

        var cells: [CalCell] = []

        // Leading blanks
        for i in 0..<weekdayOfFirst {
            cells.append(CalCell(id: "blank-\(i)", dayNum: 0, status: nil, isToday: false))
        }

        // Actual days
        for day in 1...daysInMonth {
            comps.day = day
            let date = cal.date(from: comps) ?? firstDay
            let dateStr = fmt.string(from: date)
            let log = store.blob.dailyLogs.first { $0.date == dateStr }
            let isFuture = dateStr > todayStr
            let status: DayStatus? = isFuture ? nil : store.dayStatus(log)
            cells.append(CalCell(id: dateStr, dayNum: day, status: status, isToday: dateStr == todayStr))
        }

        return cells
    }

    private func statusColor(_ status: DayStatus?) -> Color {
        switch status {
        case .met: ClarityPalette.safe
        case .partial: ClarityPalette.caution
        case .missed: ClarityPalette.danger
        case nil: ClarityPalette.border
        }
    }

    private func navigateMonth(by delta: Int) {
        var month = store.selectedMonth + delta
        var year = store.selectedYear
        if month < 0 { month = 11; year -= 1 }
        if month > 11 { month = 0; year += 1 }
        store.selectedMonth = month
        store.selectedYear = year
    }
}
