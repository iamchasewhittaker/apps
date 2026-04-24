import Foundation

/// Internal Codable response types mirroring Rachio v1 JSON shapes.
/// Kept separate from the persisted `RachioState` models so upstream API
/// changes don't ripple into stored data.
enum RachioDTO {

    struct PersonInfoResponse: Decodable {
        let id: String
    }

    struct PersonResponse: Decodable {
        let id: String
        let devices: [Device]

        struct Device: Decodable {
            let id: String
            let name: String?
            let zones: [Zone]?
            let scheduleRules: [ScheduleRule]?
            let flexScheduleRules: [ScheduleRule]?
        }

        struct Zone: Decodable {
            let id: String
            let zoneNumber: Int
            let name: String?
            let enabled: Bool?
            let lastWateredDate: Int64?   // millis
        }

        struct ScheduleRule: Decodable {
            let id: String
            let name: String?
            let enabled: Bool?
            let rainDelay: Bool?
            let scheduleType: String?
            let zones: [ScheduleZone]?
            let totalDuration: Int?       // seconds
            let startHour: Int?
            let startMinute: Int?
        }

        struct ScheduleZone: Decodable {
            let zoneId: String
            let duration: Int?
            let sortOrder: Int?
        }
    }

    struct EventResponse: Decodable {
        let id: String?
        let eventDate: Int64?             // millis
        let category: String?
        let subType: String?
        let summary: String?
        let eventParameters: [String: String]?
    }
}

// MARK: - Mapping DTO → persisted snapshot

extension RachioDTO.PersonResponse.Zone {
    func toSnapshot() -> RachioZoneSnapshot {
        RachioZoneSnapshot(
            id: id,
            zoneNumber: zoneNumber,
            name: name ?? "Zone \(zoneNumber)",
            enabled: enabled ?? true,
            lastWateredDate: lastWateredDate.flatMap { Date(timeIntervalSince1970: Double($0) / 1000) }
        )
    }
}

extension RachioDTO.PersonResponse.ScheduleRule {
    func toSnapshot() -> RachioScheduleSnapshot {
        RachioScheduleSnapshot(
            id: id,
            name: name ?? "Schedule",
            enabled: enabled ?? true,
            rainDelay: rainDelay ?? false,
            scheduleType: scheduleType ?? "UNKNOWN",
            zoneIds: (zones ?? []).map { $0.zoneId },
            totalDurationSeconds: totalDuration ?? 0,
            startHour: startHour ?? 0,
            startMinute: startMinute ?? 0
        )
    }
}

extension RachioDTO.EventResponse {
    func toSnapshot(fallbackId: String) -> RachioEventSnapshot? {
        guard let dateMillis = eventDate else { return nil }
        let params = eventParameters ?? [:]
        let zoneNumber: Int? = params["zoneNumber"].flatMap { Int($0) }
        let duration: Int? = params["duration"].flatMap { Int($0) }
        return RachioEventSnapshot(
            id: id ?? fallbackId,
            date: Date(timeIntervalSince1970: Double(dateMillis) / 1000),
            category: category ?? "UNKNOWN",
            subType: subType ?? "",
            summary: summary ?? "",
            zoneId: params["zoneId"],
            zoneNumber: zoneNumber,
            durationSeconds: duration
        )
    }
}
