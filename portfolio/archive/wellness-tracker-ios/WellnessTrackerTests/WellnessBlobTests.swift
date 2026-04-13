import XCTest
@testable import WellnessTracker

final class WellnessBlobTests: XCTestCase {
    private var suiteName: String!
    private var defaults: UserDefaults!

    override func setUp() {
        super.setUp()
        suiteName = "WellnessBlobTests.\(UUID().uuidString)"
        defaults = UserDefaults(suiteName: suiteName)
        defaults.removePersistentDomain(forName: suiteName)
    }

    override func tearDown() {
        defaults.removePersistentDomain(forName: suiteName)
        defaults = nil
        suiteName = nil
        super.tearDown()
    }

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

    @MainActor
    func testDraftLoadsForToday() {
        let store = WellnessStore(defaults: defaults)
        store.setSectionField(section: "sleep", key: "quality", value: 8)
        store.sectionIdx = 1
        store.checkinMode = .morning
        store.saveDraft()

        let reloaded = WellnessStore(defaults: defaults)
        XCTAssertEqual(reloaded.sectionIdx, 1)
        XCTAssertEqual(reloaded.checkinMode, .morning)
        XCTAssertEqual((reloaded.formData["sleep"]?["quality"] as? Int), 8)
    }

    @MainActor
    func testStaleDraftGetsDiscarded() throws {
        let staleDate = WellnessBlob.jsToDateString(Date().addingTimeInterval(-86400))
        let payload: [String: Any] = [
            "formData": ["sleep": ["quality": 4]],
            "sectionIdx": 1,
            "checkinMode": CheckinMode.morning.rawValue,
            "date": staleDate,
        ]
        let data = try JSONSerialization.data(withJSONObject: payload)
        defaults.set(data, forKey: WellnessConfig.draftStoreKey)

        let store = WellnessStore(defaults: defaults)
        XCTAssertTrue(store.formData.isEmpty)
        XCTAssertEqual(store.sectionIdx, 0)
        XCTAssertNil(defaults.data(forKey: WellnessConfig.draftStoreKey))
    }

    @MainActor
    func testSectionNavigationRespectsBoundsAndWritesDraft() {
        let store = WellnessStore(defaults: defaults)
        store.checkinMode = .morning
        store.sectionIdx = 0
        store.setSectionField(section: "sleep", key: "quality", value: 7)

        store.goToPreviousSection()
        XCTAssertEqual(store.sectionIdx, 0)

        store.goToNextSection()
        XCTAssertEqual(store.sectionIdx, 1)
        XCTAssertNotNil(defaults.data(forKey: WellnessConfig.draftStoreKey))

        store.goToNextSection()
        XCTAssertEqual(store.sectionIdx, 1)
    }
}
