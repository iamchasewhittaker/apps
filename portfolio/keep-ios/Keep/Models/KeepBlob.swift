import Foundation

struct KeepBlob: Codable {
    var rooms: [Room] = []
    var spots: [Spot] = []
    var items: [Item] = []
    var donationBags: Int = 0
    var _syncAt: Double? = nil
}

extension KeepBlob {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        rooms = try c.decodeIfPresent([Room].self, forKey: .rooms) ?? []
        spots = try c.decodeIfPresent([Spot].self, forKey: .spots) ?? []
        items = try c.decodeIfPresent([Item].self, forKey: .items) ?? []
        donationBags = try c.decodeIfPresent(Int.self, forKey: .donationBags) ?? 0
        _syncAt = try c.decodeIfPresent(Double.self, forKey: ._syncAt)
    }
}

// MARK: - Computed helpers

extension KeepBlob {
    func spots(for roomID: UUID) -> [Spot] {
        spots.filter { $0.roomID == roomID }
    }

    func itemsInRoom(_ roomID: UUID) -> [Item] {
        items.filter { $0.roomID == roomID }
    }

    func itemsInSpot(_ spotID: UUID) -> [Item] {
        items.filter { $0.spotID == spotID }
    }

    func unsortedItems(for roomID: UUID) -> [Item] {
        items.filter { $0.roomID == roomID && $0.status == .unsorted }
    }

    func triageableItems(for roomID: UUID) -> [Item] {
        items.filter { $0.roomID == roomID && ($0.status == .unsorted || $0.status == .unsure) }
    }

    func keptItems(for roomID: UUID) -> [Item] {
        items.filter { $0.roomID == roomID && $0.status == .keep }
    }

    var totalItems: Int { items.count }
    var keptCount: Int { items.filter { $0.status == .keep }.count }
    var donateCount: Int { items.filter { $0.status == .donate }.count }
    var tossCount: Int { items.filter { $0.status == .toss }.count }
    var unsureCount: Int { items.filter { $0.status == .unsure }.count }
    var unsortedCount: Int { items.filter { $0.status == .unsorted }.count }
    var triagedCount: Int { items.filter { $0.status != .unsorted }.count }

    func triageProgress(for roomID: UUID) -> Double {
        let roomItems = itemsInRoom(roomID)
        guard !roomItems.isEmpty else { return 1.0 }
        let triaged = roomItems.filter { $0.status != .unsorted }.count
        return Double(triaged) / Double(roomItems.count)
    }
}
