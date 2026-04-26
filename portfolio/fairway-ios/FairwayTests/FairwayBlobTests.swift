import XCTest
import SwiftUI
@testable import Fairway

@MainActor
final class FairwayBlobTests: XCTestCase {

    func testAccentGoldHex() {
        // Guards against accidental palette drift.
        // #d4af37 = (212/255, 175/255, 55/255) = (0.831, 0.686, 0.216)
        let cg = FairwayTheme.accentGold.cgColor
        guard let comps = cg?.components, comps.count >= 3 else {
            return XCTFail("accentGold has no RGB components")
        }
        XCTAssertEqual(Double(comps[0]), 212.0 / 255.0, accuracy: 0.002)
        XCTAssertEqual(Double(comps[1]), 175.0 / 255.0, accuracy: 0.002)
        XCTAssertEqual(Double(comps[2]), 55.0 / 255.0, accuracy: 0.002)
    }


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
        // After the 2026-04-25 KML reimport, Zone 4 was renamed from "East Side"
        // to "Back Yard" and re-seeded with 12 KML-sourced heads. All Z4 problems
        // are now pre-season stubs until field-confirmed during the season test.
        let blob = PreviewData.seededBlob()
        let zone4 = blob.zones.first(where: { $0.number == 4 })
        XCTAssertNotNil(zone4)
        XCTAssertEqual(zone4?.name, "Back Yard")
        XCTAssertFalse(zone4?.problemAreas.isEmpty ?? true)
        XCTAssertTrue(
            zone4?.problemAreas.allSatisfy { $0.isPreSeason } ?? false,
            "All Z4 problems should be pre-season stubs after the 2026-04-25 reseed"
        )
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

    // MARK: - v2 migration

    func testV1BlobDecodesIntoV2WithDefaults() throws {
        // v1 blob: only the original 7 fields. New optional/array fields must default to empty/nil.
        let v1Json = """
        {
            "zones": [],
            "fertilizerPlan": [],
            "maintenanceTasks": [],
            "mowLog": [],
            "inventory": [],
            "seeded": true
        }
        """.data(using: .utf8)!
        let decoded = try JSONDecoder().decode(FairwayBlob.self, from: v1Json)

        XCTAssertTrue(decoded.seeded)
        XCTAssertTrue(decoded.observations.isEmpty)
        XCTAssertTrue(decoded.waterRuns.isEmpty)
        XCTAssertTrue(decoded.fertApplications.isEmpty)
        XCTAssertNil(decoded.property)
    }

    func testV2BlobRoundTripsWithNewFields() throws {
        var blob = FairwayBlob()
        blob.observations = [LawnObservation(text: "Dry patch near H2-3")]
        blob.waterRuns = [WaterRun(zoneNumber: 2, durationMinutes: 20)]
        blob.fertApplications = [FertApplication(productName: "Milorganite", zoneNumbers: [2, 3], amountLbs: 25)]
        blob.property = PropertySettings(
            address: "345 E 170 N, Vineyard, UT 84059",
            latitude: 40.333,
            longitude: -111.755
        )

        let data = try JSONEncoder().encode(blob)
        let decoded = try JSONDecoder().decode(FairwayBlob.self, from: data)

        XCTAssertEqual(decoded.observations.count, 1)
        XCTAssertEqual(decoded.observations.first?.text, "Dry patch near H2-3")
        XCTAssertEqual(decoded.waterRuns.first?.zoneNumber, 2)
        XCTAssertEqual(decoded.fertApplications.first?.productName, "Milorganite")
        XCTAssertEqual(decoded.property?.address, "345 E 170 N, Vineyard, UT 84059")
        XCTAssertEqual(decoded.property?.latitude ?? 0, 40.333, accuracy: 0.0001)
    }

    func testHeadDataGeoFieldsRoundTrip() throws {
        var head = HeadData(
            label: "H1-1",
            headType: "Hunter MP",
            nozzle: "MP 3000",
            arcDegrees: 180,
            location: "NW corner"
        )
        head.latitude = 40.333
        head.longitude = -111.755
        head.startBearingDegrees = 45
        head.radiusFeet = 18

        let data = try JSONEncoder().encode(head)
        let decoded = try JSONDecoder().decode(HeadData.self, from: data)

        XCTAssertEqual(decoded.latitude ?? 0, 40.333, accuracy: 0.0001)
        XCTAssertEqual(decoded.longitude ?? 0, -111.755, accuracy: 0.0001)
        XCTAssertEqual(decoded.startBearingDegrees, 45)
        XCTAssertTrue(decoded.hasCoordinates)
    }

    func testHeadDataPhotoPathsRoundTrip() throws {
        var head = HeadData(
            label: "Z2-S99",
            headType: "Hunter Pro-Spray",
            nozzle: "Test nozzle",
            arcDegrees: 180,
            location: "Test location"
        )
        head.photoPaths = [
            "heads/Z2-S99/photo-1.jpg",
            "heads/Z2-S99/photo-2.jpg",
            "heads/Z2-S99/photo-3.jpg"
        ]

        let data = try JSONEncoder().encode(head)
        let decoded = try JSONDecoder().decode(HeadData.self, from: data)

        XCTAssertEqual(decoded.photoPaths.count, 3)
        XCTAssertEqual(decoded.photoPaths, head.photoPaths)
    }

    func testZone2HasEighteenSeededHeads() {
        XCTAssertEqual(PreviewData.phase0Z2Heads().count, 18)

        // Spot-check the structural invariants the seed promises:
        let heads = PreviewData.phase0Z2Heads()
        let labels = heads.map(\.label)
        XCTAssertEqual(labels.first, "Z2-S1")
        XCTAssertEqual(labels.last, "Z2-S18")
        XCTAssertTrue(heads.allSatisfy { $0.hasCoordinates }, "All Z2 heads should have lat/lon after KML ingestion")
        XCTAssertTrue(heads.allSatisfy { !$0.photoPaths.isEmpty }, "All Z2 heads should have at least one photo path")
    }

    // MARK: - 2026-04-25 KML reimport: Z3 expansion + Z4 Back Yard

    func test_phase1ZoneMigration_renamesH3toZ3S_andSeedsZ4BackYard() throws {
        // 1. Build a blob with the OLD shape — 5 H3-* heads with custom data,
        //    Zone 4 = "East Side" with 3 H4-* placeholders. Mark seeded so
        //    load() doesn't re-seed over it.
        var blob = PreviewData.seededBlob()
        blob.seeded = true

        guard let z3Idx = blob.zones.firstIndex(where: { $0.number == 3 }),
              let z4Idx = blob.zones.firstIndex(where: { $0.number == 4 }) else {
            return XCTFail("seeded blob missing zone 3 or 4")
        }

        blob.zones[z3Idx].heads = [
            HeadData(label: "H3-1", headType: "Hunter", nozzle: "USER NOZZLE 1",
                     arcDegrees: 90, location: "USER LOC 1", notes: "USER NOTE H3-1",
                     isConfirmed: true,
                     latitude: 40.30045489168911, longitude: -111.7457086814581,
                     photoPaths: ["heads/H3-1/photo-1.jpg", "heads/H3-1/photo-2.jpg"]),
            HeadData(label: "H3-2", headType: "Hunter", nozzle: "USER NOZZLE 2",
                     arcDegrees: 180, location: "USER LOC 2", notes: "USER NOTE H3-2",
                     isConfirmed: true,
                     latitude: 40.30044324011, longitude: -111.7456786858868,
                     photoPaths: ["heads/H3-2/photo-1.jpg"]),
            HeadData(label: "H3-3", headType: "Hunter", nozzle: "USER NOZZLE 3",
                     arcDegrees: 180, location: "USER LOC 3", notes: "USER NOTE H3-3",
                     isConfirmed: true,
                     latitude: 40.30039406539294, longitude: -111.7456939001862,
                     photoPaths: []),
            HeadData(label: "H3-4", headType: "Hunter", nozzle: "USER NOZZLE 4",
                     arcDegrees: 180, location: "USER LOC 4", notes: "USER NOTE H3-4",
                     isConfirmed: true,
                     latitude: 40.3003882496641, longitude: -111.745666648806,
                     photoPaths: ["heads/H3-4/photo-1.jpg", "heads/H3-4/photo-2.jpg"]),
            HeadData(label: "H3-5", headType: "Hunter", nozzle: "USER NOZZLE 5",
                     arcDegrees: 90, location: "USER LOC 5", notes: "USER NOTE H3-5",
                     isConfirmed: false,
                     latitude: 40.30036387431078, longitude: -111.7456811868022,
                     photoPaths: ["heads/H3-5/photo-1.jpg", "heads/H3-5/photo-2.jpg", "heads/H3-5/photo-3.jpg"])
        ]

        blob.zones[z4Idx].name = "East Side"
        blob.zones[z4Idx].heads = [
            HeadData(label: "H4-1", headType: "Hunter Pro-Spray", nozzle: "Fixed spray 15A",
                     arcDegrees: 90, radiusFeet: 15, gpm: 1.85, location: "Patio edge",
                     isConfirmed: true, issues: [.overspray]),
            HeadData(label: "H4-2", headType: "Hunter Pro-Spray", nozzle: "Fixed spray 15F",
                     arcDegrees: 360, radiusFeet: 15, gpm: 3.70, location: "Center strip",
                     isConfirmed: true),
            HeadData(label: "H4-3", headType: "Hunter Pro-Spray", nozzle: "Fixed spray 15H",
                     arcDegrees: 180, radiusFeet: 15, gpm: 1.85, location: "East fence",
                     isConfirmed: true)
        ]

        // 2. Inject into UserDefaults, run load() (Phase 0 then Phase 1).
        let key = FairwayConfig.storeKey
        UserDefaults.standard.set(try JSONEncoder().encode(blob), forKey: key)
        defer { UserDefaults.standard.removeObject(forKey: key) }

        let store = FairwayStore()
        store.load()

        // 3. Zone 3: 11 heads, labels Z3-S1..Z3-S11; user data preserved on Z3-S7..Z3-S11.
        guard let z3 = store.blob.zones.first(where: { $0.number == 3 }) else {
            return XCTFail("zone 3 missing after migration")
        }
        XCTAssertEqual(z3.heads.count, 11, "zone 3 should have 11 heads after Phase 1")
        XCTAssertEqual(Set(z3.heads.map(\.label)), Set((1...11).map { "Z3-S\($0)" }))
        XCTAssertFalse(z3.heads.contains(where: { $0.label.hasPrefix("H3-") }), "no H3-* labels should remain")

        // Original H3-1 lives at Z3-S7 with notes/isConfirmed/nozzle preserved
        // and photoPaths rewritten in place (count preserved).
        guard let z3s7 = z3.heads.first(where: { $0.label == "Z3-S7" }) else {
            return XCTFail("Z3-S7 missing")
        }
        XCTAssertEqual(z3s7.notes, "USER NOTE H3-1")
        XCTAssertEqual(z3s7.nozzle, "USER NOZZLE 1")
        XCTAssertEqual(z3s7.location, "USER LOC 1")
        XCTAssertTrue(z3s7.isConfirmed)
        XCTAssertEqual(z3s7.photoPaths, ["heads/Z3-S7/photo-1.jpg", "heads/Z3-S7/photo-2.jpg"])

        // H3-3 had 0 photoPaths — Z3-S9 should still have 0.
        guard let z3s9 = z3.heads.first(where: { $0.label == "Z3-S9" }) else {
            return XCTFail("Z3-S9 missing")
        }
        XCTAssertEqual(z3s9.notes, "USER NOTE H3-3")
        XCTAssertTrue(z3s9.photoPaths.isEmpty)

        // Original H3-5 lives at Z3-S11 with isConfirmed=false preserved.
        guard let z3s11 = z3.heads.first(where: { $0.label == "Z3-S11" }) else {
            return XCTFail("Z3-S11 missing")
        }
        XCTAssertEqual(z3s11.notes, "USER NOTE H3-5")
        XCTAssertFalse(z3s11.isConfirmed)
        XCTAssertEqual(z3s11.photoPaths, [
            "heads/Z3-S11/photo-1.jpg",
            "heads/Z3-S11/photo-2.jpg",
            "heads/Z3-S11/photo-3.jpg"
        ])

        // New Z3-S1..Z3-S6 came from PreviewData (not customized, isConfirmed=false).
        guard let z3s1 = z3.heads.first(where: { $0.label == "Z3-S1" }) else {
            return XCTFail("Z3-S1 missing")
        }
        XCTAssertFalse(z3s1.isConfirmed)
        XCTAssertEqual(z3s1.notes, "KML pin: b yellow.")

        // 4. Zone 4: name → "Back Yard", 12 heads Z4-S1..Z4-S12.
        guard let z4 = store.blob.zones.first(where: { $0.number == 4 }) else {
            return XCTFail("zone 4 missing after migration")
        }
        XCTAssertEqual(z4.name, "Back Yard")
        XCTAssertEqual(z4.heads.count, 12, "zone 4 should have 12 heads after Phase 1")
        XCTAssertEqual(Set(z4.heads.map(\.label)), Set((1...12).map { "Z4-S\($0)" }))
        XCTAssertFalse(z4.heads.contains(where: { $0.label.hasPrefix("H4-") }), "no H4-* labels should remain")
        XCTAssertTrue(
            z4.problemAreas.allSatisfy { $0.isPreSeason },
            "Z4 problem areas should all be pre-season after reseed"
        )

        // 5. Idempotency: a second load() must be a no-op.
        let snapshotZ3Count = z3.heads.count
        let snapshotZ4Count = z4.heads.count
        store.load()
        XCTAssertEqual(store.blob.zones.first(where: { $0.number == 3 })?.heads.count, snapshotZ3Count)
        XCTAssertEqual(store.blob.zones.first(where: { $0.number == 4 })?.heads.count, snapshotZ4Count)
    }

    func testProblemActionsBackwardCompat() throws {
        // v1 ProblemData blob: no `actions` key. Field must default to [].
        let oldJson = """
        {
            "id": "\(UUID().uuidString)",
            "title": "Legacy problem",
            "description": "Before actions were added",
            "severity": "Medium",
            "isPreSeason": true,
            "isResolved": false,
            "dateLogged": 776937600,
            "notes": ""
        }
        """.data(using: .utf8)!
        let decoded = try JSONDecoder().decode(ProblemData.self, from: oldJson)
        XCTAssertEqual(decoded.title, "Legacy problem")
        XCTAssertEqual(decoded.actions, [])
    }

    func testProblemActionsRoundTrip() throws {
        let original = ProblemData(
            title: "With actions",
            severity: .high,
            isPreSeason: false,
            actions: ["Step one", "Step two", "Step three"]
        )
        let data = try JSONEncoder().encode(original)
        let decoded = try JSONDecoder().decode(ProblemData.self, from: data)
        XCTAssertEqual(decoded.actions, ["Step one", "Step two", "Step three"])
    }

    func testNozzleShoppingListForZ2() {
        // Z2 schedule.nozzleType == "MP Rotator"; park-strip heads S1–S6 are
        // Rain Bird VAN/1555 fixed sprays at 4 ft radius → MP800 SR bucket.
        let store = freshStore()
        let z2 = store.blob.zones.first(where: { $0.number == 2 })!
        let list = store.recommendedNozzleShoppingList(for: z2.id)
        XCTAssertFalse(list.isEmpty, "Z2 should have at least one shopping bucket (mismatched nozzles)")
        let allLabels = list.flatMap(\.headLabels)
        XCTAssertTrue(allLabels.contains("Z2-S1"), "Z2-S1 (Rain Bird VAN yellow) should be flagged for swap")
    }

    func testHeadDataMissingGeoFieldsDecodes() throws {
        // Pre-v2 encoded HeadData (no geo fields) must decode with nil coords.
        let oldHeadJson = """
        {
            "id": "\(UUID().uuidString)",
            "label": "Legacy head",
            "headType": "Hunter",
            "nozzle": "MP",
            "arcDegrees": 90,
            "radiusFeet": 15,
            "gpm": 0.8,
            "location": "NW",
            "notes": "",
            "isConfirmed": true,
            "confirmedBySeasonTest": false,
            "photoAttached": false,
            "issues": []
        }
        """.data(using: .utf8)!
        let decoded = try JSONDecoder().decode(HeadData.self, from: oldHeadJson)
        XCTAssertNil(decoded.latitude)
        XCTAssertNil(decoded.longitude)
        XCTAssertNil(decoded.startBearingDegrees)
        XCTAssertFalse(decoded.hasCoordinates)
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
