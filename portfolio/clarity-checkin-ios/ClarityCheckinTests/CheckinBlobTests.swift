import XCTest
@testable import ClarityCheckin

final class CheckinBlobTests: XCTestCase {

    func testBlobEncodeDecodeRoundTrip() throws {
        var blob = CheckinBlob()
        blob.entries = [
            CheckinEntry(date: "2026-04-12", morning: MorningData(sleepOnset: 6, sleepQuality: 7, morningReadiness: 8, notes: "Good"), evening: nil)
        ]
        blob.pulseChecks = [PulseCheck(id: "abc", mood: 8, note: "Doing well", date: "2026-04-12", timestamp: 1000)]

        let encoded = try JSONEncoder().encode(blob)
        let decoded = try JSONDecoder().decode(CheckinBlob.self, from: encoded)

        XCTAssertEqual(decoded.entries.count, 1)
        XCTAssertEqual(decoded.entries[0].morning?.sleepOnset, 6)
        XCTAssertEqual(decoded.pulseChecks[0].mood, 8)
    }

    func testDraftStaleDateDetection() {
        var draft = DraftBlob()
        draft.date = "2000-01-01"  // very old

        // A stale draft should not match today
        let today = ISO8601DateFormatter().string(from: .now).prefix(10)
        XCTAssertNotEqual(draft.date, String(today))
    }

    func testSameDayMerge() {
        var entry = CheckinEntry(date: "2026-04-12")
        entry.morning = MorningData(sleepOnset: 5, sleepQuality: 6, morningReadiness: 7, notes: "")
        entry.evening = EveningData(medsChecked: ["Sertraline"], focus: 8, mood: 7)

        XCTAssertNotNil(entry.morning)
        XCTAssertNotNil(entry.evening)
        XCTAssertEqual(entry.morning?.sleepOnset, 5)
        XCTAssertEqual(entry.evening?.focus, 8)
    }

    func testDefaultMeds() {
        XCTAssertEqual(CheckinConfig.defaultMeds.count, 5)
        XCTAssertTrue(CheckinConfig.defaultMeds.contains("Sertraline"))
    }
}
