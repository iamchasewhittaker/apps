import Foundation

// MARK: - CashFlowEvent

struct CashFlowEvent: Identifiable {
    enum Kind {
        case paycheck
        case bill
        case mortgageCoveredMarker
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
    ///
    /// Phase 1 limitation: bill due dates default to day 1 (mortgage) or day 5 (other required).
    /// When `CategoryMapping.dueDay` is added in a future schema migration, this method will
    /// read that value instead of the hardcoded defaults.
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

        // Bill due-date events (Phase 1: hardcoded due days)
        let monthComps = calendar.dateComponents([.year, .month], from: month)
        for balance in balances where balance.role == .mortgage || balance.role == .bill || balance.role == .essential {
            let dueDay = balance.role == .mortgage ? 1 : 5
            var dc = monthComps
            dc.day = dueDay
            if let dueDate = calendar.date(from: dc) {
                events.append(CashFlowEvent(
                    date: dueDate,
                    kind: .bill,
                    label: balance.name,
                    amount: balance.monthlyTarget
                ))
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

        return result
    }
}
