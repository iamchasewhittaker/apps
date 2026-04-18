import XCTest
@testable import Shipyard

@MainActor
final class FleetStoreTests: XCTestCase {

    // MARK: - Mock fleet

    func testMockFleetLoads() {
        let store = FleetStore()
        XCTAssertTrue(store.ships.isEmpty)
        store.loadMockFleet()
        XCTAssertGreaterThanOrEqual(store.ships.count, 5)
    }

    func testMockFleetCoversEveryBucket() {
        let store = FleetStore()
        store.loadMockFleet()
        let groups = store.groupedByBucket()
        let buckets = Set(groups.map { $0.bucket })
        // Every FleetBucket should appear at least once in the mock fleet.
        for bucket in FleetBucket.allCases {
            XCTAssertTrue(buckets.contains(bucket), "Mock fleet missing bucket: \(bucket.rawValue)")
        }
    }

    // MARK: - Grouping

    func testGroupingOrdersByDaysSinceCommit() {
        let store = FleetStore()
        store.loadMockFleet()
        for group in store.groupedByBucket() {
            let days = group.ships.compactMap(\.days_since_commit)
            XCTAssertEqual(days, days.sorted(), "Group \(group.bucket.rawValue) not sorted asc by days_since_commit")
        }
    }

    func testFleetBucketMembership() {
        let active = Ship(slug: "a", name: "A", type: .web, family: .portfolio, status: .active,
                          tech_stack: nil, mvp_step_actual: 3, last_commit_date: nil,
                          days_since_commit: 1, has_live_url: false, live_url: nil, compliance_score: 5)
        XCTAssertTrue(FleetBucket.underConstruction.contains(active))
        XCTAssertFalse(FleetBucket.launched.contains(active))

        let launched = Ship(slug: "b", name: "B", type: .web, family: .portfolio, status: .active,
                            tech_stack: nil, mvp_step_actual: 5, last_commit_date: nil,
                            days_since_commit: 1, has_live_url: true, live_url: nil, compliance_score: 7)
        XCTAssertTrue(FleetBucket.launched.contains(launched))
        XCTAssertFalse(FleetBucket.underConstruction.contains(launched))

        let drydock = Ship(slug: "c", name: "C", type: .cli, family: .standalone, status: .stalled,
                           tech_stack: nil, mvp_step_actual: 3, last_commit_date: nil,
                           days_since_commit: 50, has_live_url: false, live_url: nil, compliance_score: 3)
        XCTAssertTrue(FleetBucket.drydock.contains(drydock))

        let archived = Ship(slug: "d", name: "D", type: .web, family: .archived, status: .archived,
                            tech_stack: nil, mvp_step_actual: 6, last_commit_date: nil,
                            days_since_commit: 200, has_live_url: false, live_url: nil, compliance_score: 4)
        XCTAssertTrue(FleetBucket.archived.contains(archived))
    }

    // MARK: - Model round-trip

    func testShipCodableRoundTrip() throws {
        let original = FleetStore.mockFleet[0]
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        let data = try encoder.encode(original)

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        let decoded = try decoder.decode(Ship.self, from: data)

        XCTAssertEqual(decoded.slug, original.slug)
        XCTAssertEqual(decoded.name, original.name)
        XCTAssertEqual(decoded.type, original.type)
        XCTAssertEqual(decoded.status, original.status)
        XCTAssertEqual(decoded.mvp_step_actual, original.mvp_step_actual)
    }

    // MARK: - Nautical labels

    func testNauticalLabelKnown() {
        XCTAssertEqual(NauticalLabels.label(for: 4), "Under Construction")
        XCTAssertEqual(NauticalLabels.label(for: 5), "Launched")
    }

    func testNauticalLabelUnknown() {
        XCTAssertEqual(NauticalLabels.label(for: nil), "Unknown")
        XCTAssertEqual(NauticalLabels.label(for: 99), "Step 99")
    }
}
