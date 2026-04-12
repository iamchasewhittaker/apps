import Foundation

// MARK: - Enums (persisted as String on `ChecklistTaskItem`)

enum AttractionStatus: String, CaseIterable, Identifiable {
    case open
    case testing
    case brokenDown
    case closed

    var id: String { rawValue }

    var displayTitle: String {
        switch self {
        case .open: return "Open"
        case .testing: return "Testing"
        case .brokenDown: return "Broken Down"
        case .closed: return "Closed"
        }
    }

    var emoji: String {
        switch self {
        case .open: return "🟢"
        case .testing: return "🟡"
        case .brokenDown: return "🔴"
        case .closed: return "⚫"
        }
    }
}

enum ParkZone: String, CaseIterable, Identifiable {
    case home
    case career
    case family
    case growth
    case health
    case errands

    var id: String { rawValue }

    var displayTitle: String {
        switch self {
        case .home: return "Home"
        case .career: return "Career"
        case .family: return "Family"
        case .growth: return "Growth"
        case .health: return "Health"
        case .errands: return "Errands"
        }
    }

    var emoji: String {
        switch self {
        case .home: return "🏠"
        case .career: return "💼"
        case .family: return "❤️"
        case .growth: return "🧠"
        case .health: return "💪"
        case .errands: return "🛒"
        }
    }
}

enum StaffRole: String, CaseIterable, Identifiable {
    case operatorRole = "operator"
    case janitor
    case mechanic
    case entertainer

    var id: String { rawValue }

    var displayTitle: String {
        switch self {
        case .operatorRole: return "Operator"
        case .janitor: return "Janitor"
        case .mechanic: return "Mechanic"
        case .entertainer: return "Entertainer"
        }
    }

    var emoji: String {
        switch self {
        case .operatorRole: return "🎢"
        case .janitor: return "🧹"
        case .mechanic: return "🔧"
        case .entertainer: return "🎤"
        }
    }

    var tagline: String {
        switch self {
        case .operatorRole: return "Deep work"
        case .janitor: return "Quick chores"
        case .mechanic: return "Fixes & admin"
        case .entertainer: return "Social & family"
        }
    }
}

enum TaskPriority: String, CaseIterable, Identifiable {
    case low
    case medium
    case high

    var id: String { rawValue }

    var displayTitle: String {
        rawValue.capitalized
    }

    var sortRank: Int {
        switch self {
        case .high: return 0
        case .medium: return 1
        case .low: return 2
        }
    }
}

// MARK: - ChecklistTaskItem accessors

extension ChecklistTaskItem {
    var status: AttractionStatus {
        get { AttractionStatus(rawValue: statusRaw) ?? .open }
        set { statusRaw = newValue.rawValue }
    }

    var zone: ParkZone {
        get { ParkZone(rawValue: zoneRaw) ?? .home }
        set { zoneRaw = newValue.rawValue }
    }

    var staffRole: StaffRole {
        get { StaffRole(rawValue: staffTypeRaw) ?? .janitor }
        set { staffTypeRaw = newValue.rawValue }
    }

    var priority: TaskPriority {
        get { TaskPriority(rawValue: priorityRaw) ?? .medium }
        set { priorityRaw = newValue.rawValue }
    }

    var isActive: Bool {
        status == .open || status == .testing
    }

    func isOverdue(now: Date = Date(), calendar: Calendar = .current) -> Bool {
        guard let due = dueDate else { return false }
        return status != .closed && due < calendar.startOfDay(for: now)
    }
}

extension ChecklistTaskItem {
    func dueDateLabel(calendar: Calendar = .current, now: Date = Date()) -> String {
        guard let due = dueDate else { return "None" }
        if calendar.isDateInToday(due) { return "Today" }
        if calendar.isDateInTomorrow(due) { return "Tomorrow" }
        let f = DateFormatter()
        f.dateStyle = .medium
        f.timeStyle = .none
        return f.string(from: due)
    }
}
