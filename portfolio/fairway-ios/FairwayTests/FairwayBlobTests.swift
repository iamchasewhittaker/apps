import XCTest
@testable import Fairway

@MainActor
final class FairwayBlobTests: XCTestCase {

    private func freshStore() -> FairwayStore {
        // Use a unique UserDefaults key via a local store; since load() pulls from
        // UserDefaults, tests that don't call load() operate purely on in-memory blob.
        let store = FairwayStore()
        store.blob = PreviewData.seededBlob()
        return store
    }

    func testBlobEncodeDecodeRoundTrip() throws {
        let original = PreviewData.seededBlob()
        let data = try JSONEncoder().encode(original)
        let decoded = try JSONDecoder().decode(FairwayBlob.self, from: data)

        XCTAssertEqual(decoded.zones.count, original.zones.count)
        XCTAssertEqual(decoded.fertilizerPlan.count, original.fertilizerPlan.count)
        XCTAssertEqual(decoded.maintenanceTasks.count, original.maintenanceTasks.count)
        XCTAssertEqual(decoded.inventory.count, original.inventory.count)
        XCTAssertEqual(decoded.soilTest?.ph, original.soilTest?.ph)
        XCTAssertEqual(decoded.seeded, original.seeded)
    }

    func testSeedProducesAllZones() {
        let blob = PreviewData.seededBlob()
        XCTAssertEqual(blob.zones.count, 4)
        XCTAssertEqual(blob.zones.map(\.number).sorted(), [1, 2, 3, 4])
    }

    func testZone1HasShrubBeds() {
        let blob = PreviewData.seededBlob()
        let zone1 = blob.zones.first(where: { $0.number == 1 })
        XCTAssertNotNil(zone1)
        XCTAssertEqual(zone1?.shrubBeds.count, 3)
        XCTAssertEqual(zone1?.shrubBeds.map(\.label).sorted(), ["Bed A", "Bed B", "Bed C"])
    }

    func testSoilTestSeeded() {
        let blob = PreviewData.seededBlob()
        XCTAssertNotNil(blob.soilTest)
        XCTAssertEqual(blob.soilTest?.nutrients.count, 13)
        XCTAssertEqual(blob.soilTest?.ph, 6.75)
    }

    func testFertilizerPlanSeeded() {
        let blob = PreviewData.seededBlob()
        XCTAssertEqual(blob.fertilizerPlan.count, 6)
    }

    func testInventorySeeded() {
        let blob = PreviewData.seededBlob()
        XCTAssertFalse(blob.inventory.isEmpty)
        XCTAssertTrue(blob.inventory.contains(where: { $0.name.contains("Spyker HHS100") }))
    }

    func testPreSeasonFlagsCorrect() {
        let blob = PreviewData.seededBlob()
        let zone4 = blob.zones.first(where: { $0.number == 4 })
        XCTAssertNotNil(zone4)
        let overspray = zone4?.problemAreas.first(where: { $0.title.contains("H4-1 overspray") })
        XCTAssertNotNil(overspray)
        XCTAssertEqual(overspray?.isPreSeason, false, "H4-1 overspray should be confirmed, not pre-season")
    }

    func testHeadDataRoundTrip() throws {
        let head = HeadData(
            label: "H9-9",
            headType: "Hunter Pro-Spray",
            nozzle: "MP Rotator 10-30",
            arcDegrees: 180,
            radiusFeet: 10,
            gpm: 0.5,
            location: "Test corner",
            issues: [.overspray, .misdirected]
        )
        let data = try JSONEncoder().encode(head)
        let decoded = try JSONDecoder().decode(HeadData.self, from: data)
        XCTAssertEqual(decoded.label, head.label)
        XCTAssertEqual(decoded.arcDegrees, head.arcDegrees)
        XCTAssertEqual(decoded.issues.count, 2)
    }

    func testStoreAddHead() {
        let store = freshStore()
        let zone2 = store.blob.zones.first(where: { $0.number == 2 })!
        let initialCount = zone2.heads.count
        let newHead = HeadData(label: "H2-NEW", headType: "Hunter", nozzle: "MP", arcDegrees: 90, location: "Test")
        store.addHead(newHead, to: zone2.id)
        let updatedZone = store.zone(withID: zone2.id)
        XCTAssertEqual(updatedZone?.heads.count, initialCount + 1)
        XCTAssertTrue(updatedZone?.heads.contains(where: { $0.label == "H2-NEW" }) ?? false)
    }

    func testStockStatusCalculation() {
        // currentStockLbs=5, rate=4 → oneLot = (2737/1000) * 4 = 10.948 lbs
        // 5 < 10.948 → .low
        let lowItem = InventoryItem(
            name: "Test Low",
            category: .fertilizer,
            defaultRatePer1000SqFt: 4,
            currentStockLbs: 5
        )
        XCTAssertEqual(lowItem.stockStatus, .low)

        // Plenty of stock
        let goodItem = InventoryItem(
            name: "Test Good",
            category: .fertilizer,
            defaultRatePer1000SqFt: 4,
            currentStockLbs: 50
        )
        XCTAssertEqual(goodItem.stockStatus, .good)

        // Empty
        let emptyItem = InventoryItem(
            name: "Test Empty",
            category: .fertilizer,
            defaultRatePer1000SqFt: 4,
            currentStockLbs: 0
        )
        XCTAssertEqual(emptyItem.stockStatus, .empty)

        // Unknown (no stock tracked)
        let unknownItem = InventoryItem(name: "Test Unknown", category: .fertilizer)
        XCTAssertEqual(unknownItem.stockStatus, .unknown)
    }
}

// Allow XCTAssertEqual on StockStatus
extension StockStatus: Equatable {
    public static func == (lhs: StockStatus, rhs: StockStatus) -> Bool {
        switch (lhs, rhs) {
        case (.good, .good), (.low, .low), (.empty, .empty), (.unknown, .unknown):
            return true
        default:
            return false
        }
    }
}
