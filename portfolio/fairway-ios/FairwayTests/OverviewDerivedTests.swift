import XCTest
@testable import Fairway

@MainActor
final class OverviewDerivedTests: XCTestCase {

    // MARK: - Mow

    func testDaysSinceLastMowAndNextDue() {
        let now = makeDate(2026, 4, 27)
        let mowDate = makeDate(2026, 4, 23)

        var blob = FairwayBlob()
        blob.mowLog = [
            MowEntry(date: mowDate, bladeHeightInches: 3.5)
        ]

        XCTAssertEqual(blob.lastMow?.date, mowDate)
        XCTAssertEqual(blob.daysSinceLastMow(now: now), 4)
        XCTAssertNotNil(blob.nextMowDueDate())
        // 5-day cadence default → 4/23 + 5 = 4/28
        XCTAssertEqual(blob.nextMowDueDate(), makeDate(2026, 4, 28))
    }

    func testDaysSinceLastMowReturnsNilWhenLogEmpty() {
        let blob = FairwayBlob()
        XCTAssertNil(blob.lastMow)
        XCTAssertNil(blob.daysSinceLastMow())
        XCTAssertNil(blob.nextMowDueDate())
    }

    // MARK: - Audit

    func testAuditSummaryCountsConfirmedFieldworkAndLow() {
        let blob = makeBlobWithAuditFixture()
        let summary = blob.auditSummary
        // Fixture: zone 2 has 4 heads — 1 confirmed, 1 low confidence (needs fieldwork),
        // 1 blocked (needs fieldwork), 1 high confidence (not yet confirmed).
        XCTAssertEqual(summary.total, 4)
        XCTAssertEqual(summary.confirmed, 1)
        XCTAssertEqual(summary.needsFieldwork, 2)
        XCTAssertEqual(summary.lowConfidence, 1)
        XCTAssertFalse(summary.isComplete)
        XCTAssertEqual(summary.fractionComplete, 0.25, accuracy: 0.001)
    }

    func testAuditSummarySkipsZone1() {
        // Zone 1 = bubblers/drip; should not be counted in head audit.
        var blob = FairwayBlob()
        blob.zones = [
            ZoneData(number: 1, name: "Zone 1", type: .shrubs, squareFootage: 100, headType: "Bubbler",
                     heads: [HeadData(label: "Z1-S1", headType: "Bubbler", nozzle: "—", arcDegrees: 0, location: "Bed")])
        ]
        XCTAssertEqual(blob.auditSummary.total, 0)
        XCTAssertTrue(blob.auditSummary.isComplete == false || blob.auditSummary.total == 0)
    }

    // MARK: - Maintenance / fertilizer

    func testOverdueMaintenanceFiltersFutureAndCompleted() {
        let now = makeDate(2026, 4, 27)
        var blob = FairwayBlob()
        blob.maintenanceTasks = [
            MaintenanceTask(title: "Yesterday overdue", category: .irrigation,
                            targetDate: makeDate(2026, 4, 26)),
            MaintenanceTask(title: "Tomorrow upcoming", category: .irrigation,
                            targetDate: makeDate(2026, 4, 28)),
            MaintenanceTask(title: "Past completed", category: .irrigation,
                            targetDate: makeDate(2026, 4, 20),
                            isCompleted: true),
            MaintenanceTask(title: "No date", category: .seasonal)
        ]
        let overdue = blob.overdueMaintenance(now: now)
        XCTAssertEqual(overdue.count, 1)
        XCTAssertEqual(overdue.first?.title, "Yesterday overdue")
    }

    func testMissedFertilizerWindowsExcludesCompletedAndCurrent() {
        let now = makeDate(2026, 4, 27)
        var blob = FairwayBlob()
        blob.fertilizerPlan = [
            FertilizerEntry(
                season: .earlySpring,
                product: "Missed",
                ratePerThousandSqFt: 4,
                windowStart: makeDate(2026, 3, 1),
                windowEnd: makeDate(2026, 4, 15)
            ),
            FertilizerEntry(
                season: .lateSpring,
                product: "In window now",
                ratePerThousandSqFt: 4,
                windowStart: makeDate(2026, 4, 20),
                windowEnd: makeDate(2026, 5, 15)
            ),
            FertilizerEntry(
                season: .summer,
                product: "Done",
                ratePerThousandSqFt: 4,
                windowStart: makeDate(2026, 1, 1),
                windowEnd: makeDate(2026, 1, 15),
                isCompleted: true
            )
        ]
        let missed = blob.missedFertilizerWindows(now: now)
        XCTAssertEqual(missed.count, 1)
        XCTAssertEqual(missed.first?.product, "Missed")
    }

    // MARK: - Alerts

    func testAlertItemsPriorityOrder() {
        let now = makeDate(2026, 4, 27)
        var blob = FairwayBlob()

        // High: open high-severity problem.
        var z2 = ZoneData(number: 2, name: "Front", type: .coolSeasonGrass, squareFootage: 1000, headType: "Hunter")
        z2.problemAreas = [
            ProblemData(title: "Major leak", severity: .high, isPreSeason: false)
        ]
        blob.zones = [z2]

        // High: overdue task.
        blob.maintenanceTasks = [
            MaintenanceTask(title: "Old water-in", category: .irrigation,
                            targetDate: makeDate(2026, 4, 24))
        ]

        // Medium: missed fert window.
        blob.fertilizerPlan = [
            FertilizerEntry(
                season: .earlySpring,
                product: "March pre-em",
                ratePerThousandSqFt: 4,
                windowStart: makeDate(2026, 3, 1),
                windowEnd: makeDate(2026, 4, 15)
            )
        ]

        // Low: low-stock item.
        blob.inventory = [
            InventoryItem(
                name: "Test product",
                category: .fertilizer,
                defaultRatePer1000SqFt: 4,
                currentStockLbs: 5
            )
        ]

        let items = blob.alertItems(now: now)
        XCTAssertGreaterThanOrEqual(items.count, 4)
        // First two are high severity, in any order between them.
        let firstTwo = Set(items.prefix(2).map { $0.severity })
        XCTAssertEqual(firstTwo, [AlertItem.Severity.high])
        // Last item should not be high severity.
        XCTAssertNotEqual(items.last?.severity, .high)
    }

    // MARK: - Water balance

    func testWeeklyWaterBalanceUnknownWithoutWeatherOrRachio() {
        let blob = FairwayBlob()
        XCTAssertEqual(blob.weeklyWaterBalance(), .unknown)
    }

    func testWeeklyWaterBalanceClassifiesOverWatering() {
        let now = makeDate(2026, 4, 27)
        var blob = FairwayBlob()
        // Heavy rain + lots of Rachio minutes = over-watered.
        blob.weather = makeWeatherWithHistoryRain(inches: 1.5, now: now)
        blob.rachio = makeRachioWithMinutesLast7(225, now: now)
        XCTAssertEqual(blob.weeklyWaterBalance(now: now), .overWatered)
    }

    func testWeeklyWaterBalanceClassifiesUnderWatering() {
        let now = makeDate(2026, 4, 27)
        var blob = FairwayBlob()
        // Light rain but barely any Rachio runtime → under-watered.
        blob.weather = makeWeatherWithHistoryRain(inches: 0.4, now: now)
        blob.rachio = makeRachioWithMinutesLast7(20, now: now)
        XCTAssertEqual(blob.weeklyWaterBalance(now: now), .underWatered)
    }

    // MARK: - Pre-emergent

    func testPreEmergentTaskMatchesByTitle() {
        var blob = FairwayBlob()
        blob.maintenanceTasks = [
            MaintenanceTask(title: "Mow lawn", category: .mowing),
            MaintenanceTask(title: "Pre-emergent active — no aerate",
                            category: .weedControl,
                            targetDate: makeDate(2026, 7, 16))
        ]
        XCTAssertEqual(blob.preEmergentTask?.title, "Pre-emergent active — no aerate")
    }

    func testSoilTempCrossingDateNilWhenAlreadyAbove() {
        var blob = FairwayBlob()
        let now = makeDate(2026, 4, 27)
        blob.weather = WeatherSnapshot(
            fetchedAt: now,
            latitude: 40, longitude: -111,
            current: CurrentConditions(tempF: 70, precipInchesToday: 0, weatherCode: 0, soilTemp6cmF: 60),
            dailyForecast: [], dailyHistory: [],
            soilTempForecast: [
                HourlySoil(date: now, tempF: 60),
                HourlySoil(date: now.addingTimeInterval(3600), tempF: 61)
            ]
        )
        XCTAssertNil(blob.soilTempCrossingDate())
    }

    func testSoilTempCrossingDateFindsFirstSampleAt55() {
        var blob = FairwayBlob()
        let now = makeDate(2026, 4, 27)
        let crossing = now.addingTimeInterval(3 * 86_400)
        blob.weather = WeatherSnapshot(
            fetchedAt: now,
            latitude: 40, longitude: -111,
            current: CurrentConditions(tempF: 60, precipInchesToday: 0, weatherCode: 0, soilTemp6cmF: 48),
            dailyForecast: [], dailyHistory: [],
            soilTempForecast: [
                HourlySoil(date: now, tempF: 48),
                HourlySoil(date: now.addingTimeInterval(86_400), tempF: 50),
                HourlySoil(date: now.addingTimeInterval(2 * 86_400), tempF: 52),
                HourlySoil(date: crossing, tempF: 55),
                HourlySoil(date: crossing.addingTimeInterval(3600), tempF: 57)
            ]
        )
        XCTAssertEqual(blob.soilTempCrossingDate(), crossing)
        XCTAssertEqual(blob.daysUntilSoilTempCrossing(now: now), 3)
    }

    // MARK: - Rachio next run

    func testRachioNextRunPicksClosestEnabledNonRainDelayedSchedule() {
        let now = makeDate(2026, 4, 27, hour: 10)
        var blob = FairwayBlob()
        blob.rachio = RachioState(
            personId: "p1",
            deviceId: "d1",
            deviceName: "Test",
            lastSyncAt: now,
            zones: [],
            scheduleRules: [
                // Rule that fires at 6am (already past) → next firing tomorrow 6am.
                RachioScheduleSnapshot(
                    id: "s1", name: "Morning", enabled: true, rainDelay: false,
                    scheduleType: "FIXED", zoneIds: ["z1"], totalDurationSeconds: 1200,
                    startHour: 6, startMinute: 0
                ),
                // Rule that fires at 18:00 (still ahead today) → fires today.
                RachioScheduleSnapshot(
                    id: "s2", name: "Evening", enabled: true, rainDelay: false,
                    scheduleType: "FIXED", zoneIds: ["z2"], totalDurationSeconds: 900,
                    startHour: 18, startMinute: 0
                ),
                // Rain-delayed → ignored.
                RachioScheduleSnapshot(
                    id: "s3", name: "Disabled", enabled: true, rainDelay: true,
                    scheduleType: "FIXED", zoneIds: ["z3"], totalDurationSeconds: 600,
                    startHour: 12, startMinute: 0
                )
            ]
        )
        let next = blob.rachioNextRun(now: now)
        XCTAssertEqual(next?.scheduleName, "Evening")
        XCTAssertEqual(next?.durationMinutes, 15)
    }

    // MARK: - Helpers

    private func makeDate(_ y: Int, _ m: Int, _ d: Int, hour: Int = 12) -> Date {
        var cal = Calendar(identifier: .gregorian)
        cal.timeZone = TimeZone(identifier: "America/Denver")!
        return cal.date(from: DateComponents(year: y, month: m, day: d, hour: hour))!
    }

    private func makeBlobWithAuditFixture() -> FairwayBlob {
        var blob = FairwayBlob()
        var z2 = ZoneData(number: 2, name: "Front", type: .coolSeasonGrass, squareFootage: 1500, headType: "Hunter")
        z2.heads = [
            // 1 confirmed
            HeadData(label: "A", headType: "Hunter", nozzle: "MP", arcDegrees: 90,
                     location: "L", preSeasonChecked: true),
            // 1 low confidence (also counts as needs fieldwork)
            HeadData(label: "B", headType: "Hunter", nozzle: "MP", arcDegrees: 90,
                     location: "L", auditConfidence: "low", preSeasonChecked: false),
            // 1 blocked (counts as needs fieldwork only)
            HeadData(label: "C", headType: "Hunter", nozzle: "MP", arcDegrees: 90,
                     location: "L", auditConfidence: "blocked", preSeasonChecked: false),
            // 1 high confidence not yet confirmed
            HeadData(label: "D", headType: "Hunter", nozzle: "MP", arcDegrees: 90,
                     location: "L", auditConfidence: "high", preSeasonChecked: false)
        ]
        blob.zones = [z2]
        return blob
    }

    private func makeWeatherWithHistoryRain(inches: Double, now: Date) -> WeatherSnapshot {
        WeatherSnapshot(
            fetchedAt: now,
            latitude: 40, longitude: -111,
            current: CurrentConditions(tempF: 60, precipInchesToday: 0, weatherCode: 0, soilTemp6cmF: 50),
            dailyForecast: [],
            dailyHistory: [
                DailyWeather(date: now.addingTimeInterval(-86_400), highF: 60, lowF: 40, precipInches: inches)
            ],
            soilTempForecast: []
        )
    }

    private func makeRachioWithMinutesLast7(_ minutes: Int, now: Date) -> RachioState {
        let seconds = minutes * 60
        return RachioState(
            personId: "p1",
            deviceId: "d1",
            deviceName: "Test",
            lastSyncAt: now,
            zones: [],
            scheduleRules: [],
            recentEvents: [
                RachioEventSnapshot(
                    id: "e1",
                    date: now.addingTimeInterval(-86_400),
                    category: "WATERING",
                    subType: "RUN",
                    summary: "Test run",
                    zoneId: "z1",
                    zoneNumber: 2,
                    durationSeconds: seconds
                )
            ]
        )
    }
}
