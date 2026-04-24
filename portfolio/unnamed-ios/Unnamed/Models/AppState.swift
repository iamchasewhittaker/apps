import Foundation

enum Lane: String, Codable, CaseIterable {
    case regulation, maintenance, support, future, inbox
}

enum ItemStatus: String, Codable {
    case active, done, skipped
}

struct Item: Codable, Identifiable {
    var id: UUID
    var text: String
    var lane: Lane
    var status: ItemStatus
    var createdAt: Date
    var completedAt: Date?

    init(text: String) {
        self.id = UUID()
        self.text = text
        self.lane = .inbox
        self.status = .active
        self.createdAt = Date()
        self.completedAt = nil
    }
}

struct DailyLock: Codable {
    var date: String
    var lanes: [Lane]

    init(date: String, lanes: [Lane]) {
        self.date = date
        self.lanes = lanes
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        date = try container.decode(String.self, forKey: .date)
        if let lanes = try? container.decode([Lane].self, forKey: .lanes) {
            self.lanes = lanes
        } else {
            let lane1 = try container.decode(Lane.self, forKey: .lane1)
            let lane2 = try container.decode(Lane.self, forKey: .lane2)
            self.lanes = [lane1, lane2]
        }
    }

    enum CodingKeys: String, CodingKey {
        case date, lanes, lane1, lane2
    }
}

struct DailyCheck: Codable {
    var date: String
    var produced: Bool
    var stayedInLanes: Bool
}

struct AppState: Codable {
    var items: [Item]
    var locks: [DailyLock]
    var checks: [DailyCheck]

    init() {
        self.items = []
        self.locks = []
        self.checks = []
    }
}
