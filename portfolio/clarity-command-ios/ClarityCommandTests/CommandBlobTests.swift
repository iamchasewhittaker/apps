import XCTest
@testable import ClarityCommand

final class CommandBlobTests: XCTestCase {

    // MARK: - Encode/decode round trip

    func testBlobRoundTrip() throws {
        var blob = CommandBlob()
        blob.layoffDate = "2025-01-15"
        blob.targets.jobActions = 7
        blob.dailyLogs = [DailyLog(date: "2026-04-14", committed: true)]

        let data = try JSONEncoder().encode(blob)
        let decoded = try JSONDecoder().decode(CommandBlob.self, from: data)

        XCTAssertEqual(decoded.layoffDate, "2025-01-15")
        XCTAssertEqual(decoded.targets.jobActions, 7)
        XCTAssertEqual(decoded.dailyLogs.count, 1)
        XCTAssertTrue(decoded.dailyLogs[0].committed)
    }

    // MARK: - DailyLog defaults

    func testDailyLogDefaults() {
        let log = DailyLog(date: "2026-04-14")
        XCTAssertFalse(log.committed)
        XCTAssertTrue(log.jobActions.isEmpty)
        XCTAssertEqual(log.areas.jobs, 0)
        XCTAssertEqual(log.areas.time, 0)
        XCTAssertFalse(log.areas.budget)
        XCTAssertEqual(log.areas.scripture, 0)
        XCTAssertFalse(log.areas.prayer.morning)
        XCTAssertFalse(log.areas.wellness.activity)
        XCTAssertEqual(log.top3Tomorrow.count, 3)
    }

    // MARK: - Day status

    func testDayStatusMet() {
        let targets = Targets()
        var log = DailyLog(date: "2026-04-14")
        log.jobActions = (0..<5).map { JobAction(id: Int64($0), type: "Application") }
        log.areas = Areas(
            jobs: 5, time: 6, budget: true, scripture: 15,
            prayer: PrayerStatus(morning: true, evening: true),
            wellness: WellnessStatus(morning: true, evening: true, activity: true)
        )
        XCTAssertEqual(DayStatus.compute(log: log, targets: targets), .met)
    }

    func testDayStatusPartial() {
        let targets = Targets()
        var log = DailyLog(date: "2026-04-14")
        log.areas.budget = true
        XCTAssertEqual(DayStatus.compute(log: log, targets: targets), .partial)
    }

    func testDayStatusMissed() {
        let targets = Targets()
        let log = DailyLog(date: "2026-04-14")
        XCTAssertEqual(DayStatus.compute(log: log, targets: targets), .missed)
    }

    func testDayStatusNilLog() {
        let targets = Targets()
        XCTAssertEqual(DayStatus.compute(log: nil, targets: targets), .missed)
    }

    // MARK: - Scripture rotation

    func testScriptureRotation() {
        let s1 = ScriptureBank.todayScripture()
        let s2 = ScriptureBank.todayScripture()
        // Same day = same scripture
        XCTAssertEqual(s1.ref, s2.ref)
        // Must return a valid scripture
        XCTAssertFalse(s1.ref.isEmpty)
        XCTAssertFalse(s1.text.isEmpty)
    }

    func testScriptureBaseCount() {
        XCTAssertEqual(ScriptureBank.base.count, 15)
    }

    // MARK: - Reminder rotation

    func testReminderRotation() {
        let r1 = ReminderBank.todayReminder()
        let r2 = ReminderBank.todayReminder()
        XCTAssertEqual(r1.text, r2.text)
        XCTAssertFalse(r1.text.isEmpty)
    }

    func testReminderBaseCount() {
        XCTAssertEqual(ReminderBank.base.count, 15)
    }

    func testReminderForArea() {
        let r = ReminderBank.reminderForArea("jobs")
        // Must return a reminder relevant to jobs or general
        XCTAssertTrue(r.area == "jobs" || r.area == "general")
    }

    // MARK: - JobAction round trip

    func testJobActionRoundTrip() throws {
        let action = JobAction(id: 12345, type: "Application", note: "FAANG role", time: "09:30")
        let data = try JSONEncoder().encode(action)
        let decoded = try JSONDecoder().decode(JobAction.self, from: data)
        XCTAssertEqual(decoded.id, 12345)
        XCTAssertEqual(decoded.type, "Application")
        XCTAssertEqual(decoded.note, "FAANG role")
        XCTAssertEqual(decoded.time, "09:30")
    }

    // MARK: - Config defaults

    func testConfigDefaults() {
        XCTAssertEqual(CommandConfig.storeKey, "chase_command_ios_v1")
        XCTAssertEqual(CommandConfig.jobActionTypes.count, 6)
        XCTAssertTrue(CommandConfig.jobActionTypes.contains("Application"))
    }

    // MARK: - Targets defaults

    func testTargetDefaults() {
        let t = Targets()
        XCTAssertEqual(t.jobActions, 5)
        XCTAssertEqual(t.productiveHours, 6)
        XCTAssertEqual(t.budgetCheckin, 1)
        XCTAssertEqual(t.scriptureMinutes, 15)
    }
}
