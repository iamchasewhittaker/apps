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

    // MARK: - Live time-session (Phase 2 #6)

    func testNormalizeBlobFromOldShapeWithoutActiveTimeSession() {
        // Older blob: timeData has day + sessions but no `active` key.
        let old: [String: Any] = [
            "entries": [Any](),
            "timeData": [
                "day": WellnessBlob.jsToDateString(),
                "sessions": [[String: Any]](),
            ],
        ]
        let normalized = WellnessBlob.normalizeBlob(old)
        let td = normalized["timeData"] as? [String: Any]
        XCTAssertNotNil(td)
        XCTAssertNil(td?["active"]) // Missing, not crash.
    }

    @MainActor
    func testStartCategorySessionSetsActiveAndStampsToday() {
        let store = WellnessStore(defaults: defaults)
        XCTAssertNil(store.activeTimeSession)

        store.startCategorySession(categoryId: "scripture")

        let active = store.activeTimeSession
        XCTAssertNotNil(active)
        XCTAssertEqual(active?["catId"] as? String, "scripture")
        XCTAssertNotNil(active?["startTime"] as? Double)

        let td = store.blob["timeData"] as? [String: Any]
        XCTAssertEqual(td?["day"] as? String, WellnessBlob.jsToDateString())
    }

    @MainActor
    func testSwitchingCategoryClosesPreviousIntoSessions() {
        let store = WellnessStore(defaults: defaults)
        store.startCategorySession(categoryId: "scripture")
        store.startCategorySession(categoryId: "move")

        XCTAssertEqual(store.activeTimeSession?["catId"] as? String, "move")
        let sessions = (store.blob["timeData"] as? [String: Any])?["sessions"] as? [[String: Any]] ?? []
        XCTAssertEqual(sessions.count, 1)
        XCTAssertEqual(sessions.first?["catId"] as? String, "scripture")
        XCTAssertNotNil(sessions.first?["endTime"] as? Double)
        XCTAssertNotNil(sessions.first?["duration"] as? Double)
    }

    @MainActor
    func testStopActiveSessionIncrementsScriptureStreak() {
        let store = WellnessStore(defaults: defaults)
        store.startCategorySession(categoryId: "scripture")
        store.stopActiveSession()

        XCTAssertNil(store.activeTimeSession)

        let streak = store.blob["scriptureStreak"] as? [String: Any]
        XCTAssertEqual(streak?["count"] as? Int, 1)
        XCTAssertEqual(streak?["lastDate"] as? String, WellnessBlob.jsToDateString())

        // Same-day re-stop must not double-count.
        store.startCategorySession(categoryId: "scripture")
        store.stopActiveSession()
        let streak2 = store.blob["scriptureStreak"] as? [String: Any]
        XCTAssertEqual(streak2?["count"] as? Int, 1)
    }

    @MainActor
    func testStaleDayActiveSessionIsHidden() {
        let store = WellnessStore(defaults: defaults)
        // Plant a yesterday-stamped active session straight into the blob.
        var blob = store.blob
        let yesterday = WellnessBlob.jsToDateString(Date().addingTimeInterval(-86400))
        blob["timeData"] = [
            "day": yesterday,
            "sessions": [[String: Any]](),
            "active": [
                "id": 1,
                "catId": "scripture",
                "startTime": Date().addingTimeInterval(-3600).timeIntervalSince1970 * 1000,
                "day": yesterday,
            ] as [String: Any],
        ] as [String: Any]
        store.applyRemoteBlob(blob)

        XCTAssertNil(store.activeTimeSession, "Active session from a stale day must not surface today.")
    }

    func testTasksBlob_legacyBlobHasNoTriageOrOneThing() {
        var blob = WellnessBlob.emptyBlob()
        blob["tasks"] = ["active": [["id": "x", "title": "t", "done": false, "createdAt": ""]]]
        let tasks = blob["tasks"] as? [String: Any] ?? [:]
        XCTAssertNil(tasks["triage"], "Legacy blob must not have triage key")
        XCTAssertNil(tasks["oneThing"], "Legacy blob must not have oneThing key")
    }

    func testTriageDateKey_matchesToday() {
        let today = WellnessBlob.jsToDateString()
        let also = WellnessBlob.jsToDateString(Date())
        XCTAssertEqual(today, also)
        XCTAssertTrue(today.count > 8, "Date string should look like 'Mon Apr 28 2026'")
    }
}
