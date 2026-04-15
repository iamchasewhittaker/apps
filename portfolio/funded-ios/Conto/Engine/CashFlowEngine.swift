import Foundation

// MARK: - CashFlowEvent

struct CashFlowEvent: Identifiable {
    enum Kind {
        case paycheck
        case bill
        case mortgageCoveredMarker
        case todayMarker
    }

    let id = UUID()
    let date: Date
    let kind: Kind
    let label: String
    /// Positive for paycheck, positive for bill target amount.
    let amount: Double
    /// Running sum of income received so far in the month (set after sorting).
    var cumulativeIncome: Double = 0
    /// totalRequired at the time this was computed — for displaying "X / Y funded".
    var totalRequired: Double = 0
    /// Coverage status for bill events (true = fully funded).
    var isCovered: Bool = false
    /// Shortfall amount for bill events.
    var shortfall: Double = 0
}

extension CashFlowEvent {
    var fundingFraction: Double {
        guard totalRequired > 0 else { return 1.0 }
        return min(1.0, cumulativeIncome / totalRequired)
    }
}

// MARK: - CashFlowEngine

enum CashFlowEngine {

    /// Build a chronological timeline of income and bill events for `month`.
    /// Bill due dates come from `CategoryBalance.dueDay`; defaults to day 1 (mortgage) or 5 (other)
    /// when the user hasn't set one.
    static func buildTimeline(
        sources: [IncomeSource],
        balances: [CategoryBalance],
        month: Date,
        calendar: Calendar = .current
    ) -> [CashFlowEvent] {
        let required = MetricsEngine.totalRequired(balances)
        var events: [CashFlowEvent] = []

        // Income events
        for source in sources {
            for date in source.occurrencesInMonth(month, calendar: calendar) {
                events.append(CashFlowEvent(
                    date: date,
                    kind: .paycheck,
                    label: source.name,
                    amount: source.amountDollars
                ))
            }
        }

        let monthComps = calendar.dateComponents([.year, .month], from: month)
        for balance in balances where balance.role == .mortgage || balance.role == .bill || balance.role == .essential {
            let dueDay = balance.dueDay > 0 ? balance.dueDay : (balance.role == .mortgage ? 1 : 5)
            var dc = monthComps
            dc.day = dueDay
            if let dueDate = calendar.date(from: dc) {
                var event = CashFlowEvent(
                    date: dueDate,
                    kind: .bill,
                    label: balance.name,
                    amount: balance.monthlyTarget
                )
                event.isCovered = balance.isCovered
                event.shortfall = balance.shortfall
                events.append(event)
            }
        }

        // Sort chronologically; paychecks before bills on the same day
        events.sort {
            if $0.date != $1.date { return $0.date < $1.date }
            if $0.kind == .paycheck && $1.kind == .bill { return true }
            return false
        }

        // Compute running cumulative income and inject mortgage-covered marker
        var cumulativeIncome = 0.0
        let mortgageTarget = balances.filter { $0.role == .mortgage }.reduce(0) { $0 + $1.monthlyTarget }
        var mortgageMarkerInserted = false
        var result: [CashFlowEvent] = []

        for var event in events {
            if event.kind == .paycheck {
                cumulativeIncome += event.amount

                // Insert mortgage-covered marker immediately after this paycheck if threshold is crossed
                if !mortgageMarkerInserted && mortgageTarget > 0 && cumulativeIncome >= mortgageTarget {
                    mortgageMarkerInserted = true
                    var marker = CashFlowEvent(
                        date: event.date,
                        kind: .mortgageCoveredMarker,
                        label: "Mortgage fully funded after this paycheck",
                        amount: 0
                    )
                    marker.cumulativeIncome = cumulativeIncome
                    marker.totalRequired = required
                    event.cumulativeIncome = cumulativeIncome
                    event.totalRequired = required
                    result.append(event)
                    result.append(marker)
                    continue
                }
            }
            event.cumulativeIncome = cumulativeIncome
            event.totalRequired = required
            result.append(event)
        }

        // Insert a "Today" marker at the current date
        let today = calendar.startOfDay(for: Date())
        let todayComps = calendar.dateComponents([.year, .month], from: today)
        if todayComps.year == monthComps.year && todayComps.month == monthComps.month {
            var marker = CashFlowEvent(
                date: today,
                kind: .todayMarker,
                label: "Today",
                amount: 0
            )
            marker.totalRequired = required
            if let idx = result.firstIndex(where: { $0.date > today }) {
                marker.cumulativeIncome = idx > 0 ? result[idx - 1].cumulativeIncome : 0
                result.insert(marker, at: idx)
            } else {
                marker.cumulativeIncome = result.last?.cumulativeIncome ?? 0
                result.append(marker)
            }
        }

        return result
    }
}
