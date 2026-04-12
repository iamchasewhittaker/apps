import Foundation

enum ParkFinance {
    static func profitToday(entries: [ProfitLedgerEntry], now: Date = Date(), calendar: Calendar = .current) -> Int {
        entries.filter { calendar.isDate($0.createdAt, inSameDayAs: now) }.reduce(0) { $0 + $1.amount }
    }

    static func profitThisWeek(entries: [ProfitLedgerEntry], now: Date = Date(), calendar: Calendar = .current) -> Int {
        guard let weekStart = calendar.date(from: calendar.dateComponents([.yearForWeekOfYear, .weekOfYear], from: now)) else {
            return 0
        }
        return entries.filter { $0.createdAt >= weekStart }.reduce(0) { $0 + $1.amount }
    }

    /// Top task-titled earners in the last 7 days by summed ledger amount.
    static func topEarners(entries: [ProfitLedgerEntry], tasks: [ChecklistTaskItem], limit: Int = 5, now: Date = Date(), calendar: Calendar = .current) -> [(title: String, amount: Int)] {
        guard let start = calendar.date(byAdding: .day, value: -7, to: now) else { return [] }
        let recent = entries.filter { $0.createdAt >= start && $0.taskId != nil }
        var byTask: [String: Int] = [:]
        for e in recent {
            guard let tid = e.taskId else { continue }
            byTask[tid, default: 0] += e.amount
        }
        let taskById = Dictionary(uniqueKeysWithValues: tasks.map { ($0.id.uuidString, $0) })
        return byTask
            .sorted { $0.value > $1.value }
            .prefix(limit)
            .compactMap { key, amt in
                guard let t = taskById[key] else { return (key, amt) }
                return (t.text, amt)
            }
    }
}
