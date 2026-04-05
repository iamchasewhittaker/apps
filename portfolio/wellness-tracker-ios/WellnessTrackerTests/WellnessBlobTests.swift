import XCTest
@testable import WellnessTracker

final class WellnessBlobTests: XCTestCase {
    func testSaveEntryMorningMergesIntoExistingDay() {
        let todayIso = ISO8601DateFormatter().string(from: Date())
        var base = WellnessBlob.emptyBlob()
        base["entries"] = [[
            "date": todayIso,
            "sleep": ["quality": 5],
            "morningDone": false,
            "eveningDone": false,
        ]]

        let form: [String: [String: Any]] = [
            "sleep": ["onset": "under_30", "quality": 8],
            "morning_start": ["morningFeel": "okay", "capacity": "average"],
        ]

        let out = WellnessBlob.saveEntry(
            blob: base,
            formData: form,
            checkinMode: .morning,
            morningSections: ["sleep", "morning_start"],
            eveningSections: ["med_checkin", "health_lifestyle", "end_of_day"]
        )

        let entries = out["entries"] as? [[String: Any]] ?? []
        XCTAssertEqual(entries.count, 1)
        let e = entries[0]
        XCTAssertEqual(e["morningDone"] as? Bool, true)
        XCTAssertEqual((e["sleep"] as? [String: Any])?["onset"] as? String, "under_30")
        XCTAssertEqual((e["morning_start"] as? [String: Any])?["morningFeel"] as? String, "okay")
    }

    func testNormalizeBlobPreservesExtraTopLevelKeys() {
        var remote = WellnessBlob.emptyBlob()
        remote["budget"] = ["foo": "bar"]
        remote["entries"] = [["date": "2026-01-01T00:00:00.000Z", "morningDone": true]]

        var combined = WellnessBlob.emptyBlob()
        for (k, v) in remote { combined[k] = v }
        let merged = WellnessBlob.normalizeBlob(combined)
        XCTAssertEqual((merged["budget"] as? [String: Any])?["foo"] as? String, "bar")
    }
}
