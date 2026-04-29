import Foundation

enum TriageStatus: String, Codable, CaseIterable {
    case unsorted
    case keep
    case donate
    case toss
    case unsure

    var label: String {
        switch self {
        case .unsorted: return "Unsorted"
        case .keep: return "Keep"
        case .donate: return "Donate"
        case .toss: return "Toss"
        case .unsure: return "Unsure"
        }
    }

    var systemImage: String {
        switch self {
        case .unsorted: return "questionmark.circle"
        case .keep: return "checkmark.circle.fill"
        case .donate: return "heart.circle.fill"
        case .toss: return "trash.circle.fill"
        case .unsure: return "pause.circle.fill"
        }
    }
}

struct Item: Codable, Identifiable {
    var id: UUID
    var name: String
    var photoID: UUID?
    var status: TriageStatus
    var roomID: UUID
    var spotID: UUID?
    var triageDate: Date?
    var createdAt: Date

    init(name: String, roomID: UUID) {
        self.id = UUID()
        self.name = name
        self.photoID = nil
        self.status = .unsorted
        self.roomID = roomID
        self.spotID = nil
        self.triageDate = nil
        self.createdAt = Date()
    }
}

extension Item {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(UUID.self, forKey: .id) ?? UUID()
        name = try c.decode(String.self, forKey: .name)
        photoID = try c.decodeIfPresent(UUID.self, forKey: .photoID)
        status = try c.decodeIfPresent(TriageStatus.self, forKey: .status) ?? .unsorted
        roomID = try c.decode(UUID.self, forKey: .roomID)
        spotID = try c.decodeIfPresent(UUID.self, forKey: .spotID)
        triageDate = try c.decodeIfPresent(Date.self, forKey: .triageDate)
        createdAt = try c.decodeIfPresent(Date.self, forKey: .createdAt) ?? Date()
    }
}
