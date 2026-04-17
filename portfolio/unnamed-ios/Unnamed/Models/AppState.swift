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
    var lane1: Lane
    var lane2: Lane
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
