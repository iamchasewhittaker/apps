import XCTest
@testable import Keep

final class KeepBlobTests: XCTestCase {

    // MARK: - Backward-compat: decode blob without new fields

    func testEmptyJSONDecodesToDefaults() throws {
        let json = "{}".data(using: .utf8)!
        let blob = try JSONDecoder().decode(KeepBlob.self, from: json)
        XCTAssertTrue(blob.rooms.isEmpty)
        XCTAssertTrue(blob.spots.isEmpty)
        XCTAssertTrue(blob.items.isEmpty)
        XCTAssertEqual(blob.donationBags, 0)
        XCTAssertNil(blob._syncAt)
    }

    func testRoomDecodesWithoutEmoji() throws {
        let json = """
        {"id":"00000000-0000-0000-0000-000000000001","name":"Garage","createdAt":0}
        """.data(using: .utf8)!
        let room = try JSONDecoder().decode(Room.self, from: json)
        XCTAssertEqual(room.name, "Garage")
        XCTAssertEqual(room.emoji, "📦")
    }

    func testItemDecodesWithoutOptionalFields() throws {
        let json = """
        {"name":"Camping stove","roomID":"00000000-0000-0000-0000-000000000001"}
        """.data(using: .utf8)!
        let item = try JSONDecoder().decode(Item.self, from: json)
        XCTAssertEqual(item.name, "Camping stove")
        XCTAssertEqual(item.status, .unsorted)
        XCTAssertNil(item.photoID)
        XCTAssertNil(item.spotID)
        XCTAssertNil(item.triageDate)
    }

    func testSpotDecodesWithoutCreatedAt() throws {
        let json = """
        {"name":"Shelf A","roomID":"00000000-0000-0000-0000-000000000001"}
        """.data(using: .utf8)!
        let spot = try JSONDecoder().decode(Spot.self, from: json)
        XCTAssertEqual(spot.name, "Shelf A")
    }

    // MARK: - Roundtrip

    func testBlobRoundtrip() throws {
        var blob = KeepBlob()
        let room = Room(name: "Garage", emoji: "🚗")
        blob.rooms.append(room)
        let spot = Spot(name: "Shelf A", roomID: room.id)
        blob.spots.append(spot)
        var item = Item(name: "Drill", roomID: room.id)
        item.status = .keep
        item.spotID = spot.id
        blob.items.append(item)
        blob.donationBags = 3

        let data = try JSONEncoder().encode(blob)
        let decoded = try JSONDecoder().decode(KeepBlob.self, from: data)

        XCTAssertEqual(decoded.rooms.count, 1)
        XCTAssertEqual(decoded.rooms[0].name, "Garage")
        XCTAssertEqual(decoded.spots.count, 1)
        XCTAssertEqual(decoded.items.count, 1)
        XCTAssertEqual(decoded.items[0].status, .keep)
        XCTAssertEqual(decoded.items[0].spotID, spot.id)
        XCTAssertEqual(decoded.donationBags, 3)
    }

    // MARK: - Computed helpers

    func testTriageProgress() {
        var blob = KeepBlob()
        let room = Room(name: "Test")
        blob.rooms.append(room)

        // Empty room = 100%
        XCTAssertEqual(blob.triageProgress(for: room.id), 1.0)

        // 2 unsorted = 0%
        blob.items.append(Item(name: "A", roomID: room.id))
        blob.items.append(Item(name: "B", roomID: room.id))
        XCTAssertEqual(blob.triageProgress(for: room.id), 0.0)

        // Triage one = 50%
        blob.items[0].status = .keep
        XCTAssertEqual(blob.triageProgress(for: room.id), 0.5)
    }

    func testFilterHelpers() {
        var blob = KeepBlob()
        let room = Room(name: "Test")
        let spot = Spot(name: "Shelf", roomID: room.id)
        blob.rooms.append(room)
        blob.spots.append(spot)

        var kept = Item(name: "Kept", roomID: room.id)
        kept.status = .keep
        kept.spotID = spot.id

        var donated = Item(name: "Donated", roomID: room.id)
        donated.status = .donate

        let unsorted = Item(name: "Unsorted", roomID: room.id)

        blob.items = [kept, donated, unsorted]

        XCTAssertEqual(blob.keptItems(for: room.id).count, 1)
        XCTAssertEqual(blob.unsortedItems(for: room.id).count, 1)
        XCTAssertEqual(blob.itemsInSpot(spot.id).count, 1)
        XCTAssertEqual(blob.keptCount, 1)
        XCTAssertEqual(blob.donateCount, 1)
        XCTAssertEqual(blob.unsortedCount, 1)
    }
}
