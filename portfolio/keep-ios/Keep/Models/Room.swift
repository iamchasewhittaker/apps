import Foundation

struct Room: Codable, Identifiable {
    var id: UUID
    var name: String
    var emoji: String
    var createdAt: Date

    init(name: String, emoji: String = "📦") {
        self.id = UUID()
        self.name = name
        self.emoji = emoji
        self.createdAt = Date()
    }
}

extension Room {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(UUID.self, forKey: .id) ?? UUID()
        name = try c.decode(String.self, forKey: .name)
        emoji = try c.decodeIfPresent(String.self, forKey: .emoji) ?? "📦"
        createdAt = try c.decodeIfPresent(Date.self, forKey: .createdAt) ?? Date()
    }
}
