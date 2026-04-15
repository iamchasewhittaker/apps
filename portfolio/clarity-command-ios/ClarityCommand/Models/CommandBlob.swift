import Foundation

// MARK: - Top-level blob

struct CommandBlob: Codable {
    var layoffDate: String = ""
    var scriptures: [Scripture] = []
    var reminders: [Reminder] = []
    var targets: Targets = .init()
    var dailyLogs: [DailyLog] = []
    var syncAt: Int64 = 0
}

// MARK: - Targets

struct Targets: Codable {
    var jobActions: Int = 5
    var productiveHours: Int = 6
    var budgetCheckin: Int = 1
    var scriptureMinutes: Int = 15
}

// MARK: - Daily Log

struct DailyLog: Codable, Identifiable {
    var id: String { date }
    var date: String
    var committed: Bool = false
    var jobActions: [JobAction] = []
    var areas: Areas = .init()
    var excuses: String = ""
    var notes: String = ""
    var top3Tomorrow: [String] = ["", "", ""]
}

// MARK: - Areas

struct Areas: Codable {
    var jobs: Int = 0
    var time: Int = 0
    var budget: Bool = false
    var scripture: Int = 0
    var prayer: PrayerStatus = .init()
    var wellness: WellnessStatus = .init()
}

struct PrayerStatus: Codable {
    var morning: Bool = false
    var evening: Bool = false
}

struct WellnessStatus: Codable {
    var morning: Bool = false
    var evening: Bool = false
    var activity: Bool = false
}

// MARK: - Job Action

struct JobAction: Codable, Identifiable {
    var id: Int64 = Int64(Date().timeIntervalSince1970 * 1000)
    var type: String
    var note: String = ""
    var time: String = ""
}

// MARK: - Scripture

struct Scripture: Codable {
    var ref: String
    var text: String
    var theme: String = "custom"
    var convictionMsg: String = ""
}

// MARK: - Reminder

struct Reminder: Codable {
    var text: String
    var area: String = "general"
}

// MARK: - Day Status

enum DayStatus {
    case met, partial, missed

    static func compute(log: DailyLog?, targets: Targets) -> DayStatus {
        guard let log else { return .missed }
        let a = log.areas
        let checks: [Bool] = [
            log.jobActions.count >= targets.jobActions,
            a.time >= targets.productiveHours,
            a.budget,
            a.scripture >= targets.scriptureMinutes,
            a.prayer.morning && a.prayer.evening,
            a.wellness.activity,
        ]
        let metCount = checks.filter { $0 }.count
        if metCount == checks.count { return .met }
        if metCount > 0 { return .partial }
        return .missed
    }
}
