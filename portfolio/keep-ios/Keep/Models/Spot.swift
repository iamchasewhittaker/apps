import Foundation

struct Spot: Codable, Identifiable {
    var id: UUID
    var name: String
    var roomID: UUID
    var createdAt: Date

    init(name: String, roomID: UUID) {
        self.id = UUID()
        self.name = name
        self.roomID = roomID
        self.createdAt = Date()
    }
}

extension Spot {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(UUID.self, forKey: .id) ?? UUID()
        name = try c.decode(String.self, forKey: .name)
        roomID = try c.decode(UUID.self, forKey: .roomID)
        createdAt = try c.decodeIfPresent(Date.self, forKey: .createdAt) ?? Date()
    }
}
