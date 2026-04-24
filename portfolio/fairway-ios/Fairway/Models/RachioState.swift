import Foundation

/// Persisted snapshot of the Rachio world. Lives as an optional field on FairwayBlob
/// so existing stored blobs decode unchanged (nil = not connected).
struct RachioState: Codable, Equatable {
    var personId: String
    var deviceId: String
    var deviceName: String
    var lastSyncAt: Date
    var zones: [RachioZoneSnapshot] = []
    var scheduleRules: [RachioScheduleSnapshot] = []
    var flexScheduleRules: [RachioScheduleSnapshot] = []
    var recentEvents: [RachioEventSnapshot] = []
    /// Maps Fairway zone number (1/2/3/4) → Rachio zone id.
    var zoneLinks: [String: String] = [:]

    var allScheduleRules: [RachioScheduleSnapshot] { scheduleRules + flexScheduleRules }

    func rachioZoneId(forFairwayZone number: Int) -> String? {
        zoneLinks["\(number)"]
    }

    func scheduleRules(forRachioZoneId zoneId: String) -> [RachioScheduleSnapshot] {
        allScheduleRules.filter { $0.zoneIds.contains(zoneId) }
    }
}

struct RachioZoneSnapshot: Codable, Identifiable, Equatable {
    let id: String
    var zoneNumber: Int
    var name: String
    var enabled: Bool
    var lastWateredDate: Date?
}

struct RachioScheduleSnapshot: Codable, Identifiable, Equatable {
    let id: String
    var name: String
    var enabled: Bool
    var rainDelay: Bool
    var scheduleType: String
    var zoneIds: [String] = []
    var totalDurationSeconds: Int
    var startHour: Int
    var startMinute: Int

    var totalDurationMinutes: Int { totalDurationSeconds / 60 }

    var startTimeLabel: String {
        let h = startHour % 12 == 0 ? 12 : startHour % 12
        let suffix = startHour < 12 ? "AM" : "PM"
        return String(format: "%d:%02d %@", h, startMinute, suffix)
    }

    var statusLabel: String {
        if !enabled { return "Paused" }
        if rainDelay { return "Rain delay" }
        return "Active"
    }
}

struct RachioEventSnapshot: Codable, Identifiable, Equatable {
    let id: String
    var date: Date
    var category: String
    var subType: String
    var summary: String
    var zoneId: String?
    var zoneNumber: Int?
    var durationSeconds: Int?

    var dayKey: String {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        return f.string(from: date)
    }
}
