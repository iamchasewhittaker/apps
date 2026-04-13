import XCTest
@testable import ClarityGrowth

final class GrowthBlobTests: XCTestCase {

    func testBlobEncodeDecodeRoundTrip() throws {
        let blob = GrowthBlob(sessions: [
            GrowthSessionEntry(
                id: "1",
                area: "gmat",
                mins: 45,
                note: "Quant set",
                milestones: ["Quant practice"],
                backgrounds: ["quiet"],
                date: "2026-04-12",
                timestampMs: 1000
            ),
            GrowthSessionEntry(
                id: "2",
                area: "claude",
                mins: 30,
                note: "",
                milestones: [],
                backgrounds: [],
                date: "2026-04-13",
                timestampMs: 2000
            ),
        ])

        let data = try JSONEncoder().encode(blob)
        let decoded = try JSONDecoder().decode(GrowthBlob.self, from: data)
        XCTAssertEqual(decoded.sessions.count, 2)
        XCTAssertEqual(decoded.sessions[0].area, "gmat")
        XCTAssertEqual(decoded.sessions[1].mins, 30)
    }

    func testTotalsAndStreakMath() {
        let blob = GrowthBlob(sessions: [
            .init(id: "a", area: "gmat", mins: 20, note: "", milestones: [], backgrounds: [], date: "2026-04-11", timestampMs: 1),
            .init(id: "b", area: "gmat", mins: 25, note: "", milestones: [], backgrounds: [], date: "2026-04-12", timestampMs: 2),
            .init(id: "c", area: "gmat", mins: 15, note: "", milestones: [], backgrounds: [], date: "2026-04-13", timestampMs: 3),
            .init(id: "d", area: "ai", mins: 40, note: "", milestones: [], backgrounds: [], date: "2026-04-12", timestampMs: 4),
        ])

        XCTAssertEqual(blob.totalMinutes(areaId: nil), 100)
        XCTAssertEqual(blob.totalMinutes(areaId: "gmat"), 60)
        XCTAssertEqual(blob.sessionCount(areaId: "gmat"), 3)
        XCTAssertEqual(blob.streakCount(for: "gmat", today: "2026-04-13"), 3)
        XCTAssertEqual(blob.streakCount(for: "ai", today: "2026-04-13"), 1)
    }

    func testLastSevenDaysBucketsAlwaysReturnSevenRows() {
        let blob = GrowthBlob()
        let rows = blob.minutesByDayLastSeven(reference: Date(timeIntervalSince1970: 1_700_000_000))
        XCTAssertEqual(rows.count, 7)
    }
}
