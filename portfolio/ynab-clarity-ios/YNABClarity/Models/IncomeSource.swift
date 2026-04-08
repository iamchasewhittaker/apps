import Foundation
import SwiftData

// MARK: - IncomeFrequency

enum IncomeFrequency: String, CaseIterable, Identifiable {
    case monthly
    case biweekly

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .monthly:   return "Monthly"
        case .biweekly:  return "Biweekly (every 2 weeks)"
        }
    }
}

// MARK: - IncomeSource

@Model
final class IncomeSource {
    var id: UUID
    var name: String
    /// Whole cents — avoids floating-point rounding for currency.
    var amountCents: Int
    /// Raw value of IncomeFrequency.
    var frequencyRaw: String
    /// The next expected pay date; used as the anchor for projecting future occurrences.
    var nextPayDate: Date
    var sortOrder: Int

    init(
        name: String,
        amountCents: Int,
        frequency: IncomeFrequency,
        nextPayDate: Date,
        sortOrder: Int = 0
    ) {
        self.id = UUID()
        self.name = name
        self.amountCents = amountCents
        self.frequencyRaw = frequency.rawValue
        self.nextPayDate = nextPayDate
        self.sortOrder = sortOrder
    }
}

extension IncomeSource {
    var frequency: IncomeFrequency {
        get { IncomeFrequency(rawValue: frequencyRaw) ?? .monthly }
        set { frequencyRaw = newValue.rawValue }
    }

    var amountDollars: Double { Double(amountCents) / 100.0 }

    /// Returns the expected pay dates within the given calendar month.
    func occurrencesInMonth(_ month: Date, calendar: Calendar = .current) -> [Date] {
        let components = calendar.dateComponents([.year, .month], from: month)
        guard
            let monthStart = calendar.date(from: components),
            let monthRange = calendar.range(of: .day, in: .month, for: monthStart),
            let monthEnd = calendar.date(byAdding: DateComponents(day: monthRange.count - 1), to: monthStart)
        else { return [] }

        switch frequency {
        case .monthly:
            // Emit the same day-of-month as nextPayDate, clamped to the month's length.
            let payDay = calendar.component(.day, from: nextPayDate)
            let clampedDay = min(payDay, monthRange.count)
            var dc = components
            dc.day = clampedDay
            if let d = calendar.date(from: dc) { return [d] }
            return []

        case .biweekly:
            // Walk from nextPayDate in 14-day steps and collect dates inside this month.
            var dates: [Date] = []
            // Walk backward to find the earliest occurrence at-or-before monthStart
            var anchor = nextPayDate
            while anchor > monthStart {
                anchor = calendar.date(byAdding: .day, value: -14, to: anchor)!
            }
            // Walk forward collecting dates inside [monthStart, monthEnd]
            var current = anchor
            while current <= monthEnd {
                if current >= monthStart {
                    dates.append(current)
                }
                current = calendar.date(byAdding: .day, value: 14, to: current)!
            }
            return dates
        }
    }
}
