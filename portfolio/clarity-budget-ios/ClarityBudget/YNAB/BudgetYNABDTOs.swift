import Foundation

// MARK: - Category role (aligned with YNAB Clarity iOS)

enum CategoryRole: String, Codable, CaseIterable, Identifiable {
    case mortgage
    case bill
    case essential
    case flexible
    case ignore

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .mortgage: return "Mortgage / Housing"
        case .bill: return "Fixed Bill"
        case .essential: return "Essential Variable"
        case .flexible: return "Flexible Spending"
        case .ignore: return "Ignore"
        }
    }
}

/// Persisted category → role mapping (Codable; replaces SwiftData `CategoryMapping` from YNAB Clarity).
struct YNABCategoryMapping: Codable, Equatable, Identifiable {
    var ynabCategoryID: String
    var ynabCategoryName: String
    var ynabGroupName: String
    var roleRaw: String
    var dueDay: Int

    var id: String { ynabCategoryID }

    var role: CategoryRole {
        get { CategoryRole(rawValue: roleRaw) ?? .ignore }
        set { roleRaw = newValue.rawValue }
    }

    init(
        ynabCategoryID: String,
        ynabCategoryName: String,
        ynabGroupName: String = "",
        role: CategoryRole = .ignore,
        dueDay: Int = 0
    ) {
        self.ynabCategoryID = ynabCategoryID
        self.ynabCategoryName = ynabCategoryName
        self.ynabGroupName = ynabGroupName
        self.roleRaw = role.rawValue
        self.dueDay = dueDay
    }
}

// MARK: - Income (aligned with YNAB Clarity iOS)

enum IncomeFrequency: String, Codable, CaseIterable, Identifiable {
    case monthly
    case semimonthly
    case biweekly

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .monthly: return "Monthly"
        case .semimonthly: return "Twice a month (semi-monthly)"
        case .biweekly: return "Biweekly (every 2 weeks)"
        }
    }
}

struct YNABIncomeSource: Codable, Equatable, Identifiable {
    var id: UUID
    var name: String
    var amountCents: Int
    var frequencyRaw: String
    var nextPayDate: Date
    var secondPayDay: Int
    var sortOrder: Int

    var frequency: IncomeFrequency {
        get { IncomeFrequency(rawValue: frequencyRaw) ?? .monthly }
        set { frequencyRaw = newValue.rawValue }
    }

    var amountDollars: Double { Double(amountCents) / 100.0 }

    init(
        id: UUID = UUID(),
        name: String,
        amountCents: Int,
        frequency: IncomeFrequency,
        nextPayDate: Date,
        secondPayDay: Int = 20,
        sortOrder: Int = 0
    ) {
        self.id = id
        self.name = name
        self.amountCents = amountCents
        self.frequencyRaw = frequency.rawValue
        self.nextPayDate = nextPayDate
        self.secondPayDay = secondPayDay
        self.sortOrder = sortOrder
    }

    /// Expected pay dates within the given calendar month (same logic as YNAB Clarity `IncomeSource`).
    func occurrencesInMonth(_ month: Date, calendar: Calendar = .current) -> [Date] {
        let components = calendar.dateComponents([.year, .month], from: month)
        guard
            let monthStart = calendar.date(from: components),
            let monthRange = calendar.range(of: .day, in: .month, for: monthStart),
            let monthEnd = calendar.date(byAdding: DateComponents(day: monthRange.count - 1), to: monthStart)
        else { return [] }

        switch frequency {
        case .monthly:
            let payDay = calendar.component(.day, from: nextPayDate)
            let clampedDay = min(payDay, monthRange.count)
            var dc = components
            dc.day = clampedDay
            if let d = calendar.date(from: dc) { return [d] }
            return []

        case .semimonthly:
            let day1 = calendar.component(.day, from: nextPayDate)
            let daysInMonth = monthRange.count
            var result: [Date] = []
            for day in [day1, secondPayDay] {
                let clamped = min(day, daysInMonth)
                var dc = components
                dc.day = clamped
                if let d = calendar.date(from: dc) { result.append(d) }
            }
            return result.sorted()

        case .biweekly:
            var dates: [Date] = []
            var anchor = nextPayDate
            while anchor > monthStart {
                anchor = calendar.date(byAdding: .day, value: -14, to: anchor)!
            }
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
