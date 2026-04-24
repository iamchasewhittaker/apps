import XCTest
@testable import Fairway

final class RachioDecodeTests: XCTestCase {

    // MARK: - PersonInfoResponse

    func testPersonInfoDecodes() throws {
        let json = #"{"id":"4c17a0db-9b82-4e7f-b2b1-abc123"}"#.data(using: .utf8)!
        let decoded = try JSONDecoder().decode(RachioDTO.PersonInfoResponse.self, from: json)
        XCTAssertEqual(decoded.id, "4c17a0db-9b82-4e7f-b2b1-abc123")
    }

    // MARK: - PersonResponse (device tree)

    func testPersonResponseDecodesDeviceTree() throws {
        let json = """
        {
          "id": "person-1",
          "devices": [{
            "id": "device-1",
            "name": "Backyard Controller",
            "zones": [
              {"id": "z-1", "zoneNumber": 1, "name": "Flower Beds", "enabled": true, "lastWateredDate": 1713571200000},
              {"id": "z-2", "zoneNumber": 2, "name": "Front Yard",  "enabled": true},
              {"id": "z-3", "zoneNumber": 3, "name": "Back Lawn",   "enabled": false}
            ],
            "scheduleRules": [{
              "id": "rule-1",
              "name": "Morning Cycle",
              "enabled": true,
              "rainDelay": false,
              "scheduleType": "AUTOMATIC",
              "totalDuration": 1800,
              "startHour": 5,
              "startMinute": 15,
              "zones": [
                {"zoneId": "z-2", "duration": 600, "sortOrder": 1},
                {"zoneId": "z-3", "duration": 1200, "sortOrder": 2}
              ]
            }],
            "flexScheduleRules": []
          }]
        }
        """.data(using: .utf8)!

        let decoded = try JSONDecoder().decode(RachioDTO.PersonResponse.self, from: json)
        XCTAssertEqual(decoded.id, "person-1")
        XCTAssertEqual(decoded.devices.count, 1)

        let device = decoded.devices[0]
        XCTAssertEqual(device.name, "Backyard Controller")
        XCTAssertEqual(device.zones?.count, 3)

        let zones = (device.zones ?? []).map { $0.toSnapshot() }
        XCTAssertEqual(zones[0].name, "Flower Beds")
        XCTAssertEqual(zones[0].zoneNumber, 1)
        XCTAssertNotNil(zones[0].lastWateredDate)
        XCTAssertFalse(zones[2].enabled)

        let rule = (device.scheduleRules ?? [])[0].toSnapshot()
        XCTAssertEqual(rule.id, "rule-1")
        XCTAssertEqual(rule.totalDurationSeconds, 1800)
        XCTAssertEqual(rule.totalDurationMinutes, 30)
        XCTAssertEqual(rule.startTimeLabel, "5:15 AM")
        XCTAssertEqual(rule.statusLabel, "Active")
        XCTAssertEqual(rule.zoneIds, ["z-2", "z-3"])
    }

    func testScheduleStatusLabels() {
        var rule = RachioScheduleSnapshot(
            id: "r", name: "n", enabled: true, rainDelay: false,
            scheduleType: "AUTOMATIC", zoneIds: [], totalDurationSeconds: 0,
            startHour: 13, startMinute: 5
        )
        XCTAssertEqual(rule.statusLabel, "Active")
        XCTAssertEqual(rule.startTimeLabel, "1:05 PM")

        rule.rainDelay = true
        XCTAssertEqual(rule.statusLabel, "Rain delay")

        rule.enabled = false
        XCTAssertEqual(rule.statusLabel, "Paused")
    }

    // MARK: - EventResponse

    func testEventResponseDecodesAndMapsParameters() throws {
        let json = """
        [{
          "id": "evt-1",
          "eventDate": 1713574800000,
          "category": "SCHEDULE",
          "subType": "ZONE_STARTED",
          "summary": "Zone 2 - Front Yard - Started",
          "eventParameters": {
            "zoneId": "z-2",
            "zoneNumber": "2",
            "duration": "600"
          }
        }]
        """.data(using: .utf8)!

        let decoded = try JSONDecoder().decode([RachioDTO.EventResponse].self, from: json)
        XCTAssertEqual(decoded.count, 1)

        let snap = decoded[0].toSnapshot(fallbackId: "fb")
        XCTAssertEqual(snap?.id, "evt-1")
        XCTAssertEqual(snap?.zoneNumber, 2)
        XCTAssertEqual(snap?.zoneId, "z-2")
        XCTAssertEqual(snap?.durationSeconds, 600)
        XCTAssertEqual(snap?.subType, "ZONE_STARTED")
        XCTAssertEqual(snap?.category, "SCHEDULE")
    }

    func testEventFallbackIdWhenMissing() throws {
        let json = """
        [{
          "eventDate": 1713574800000,
          "category": "SCHEDULE",
          "subType": "ZONE_COMPLETED",
          "summary": "Done"
        }]
        """.data(using: .utf8)!
        let decoded = try JSONDecoder().decode([RachioDTO.EventResponse].self, from: json)
        let snap = decoded[0].toSnapshot(fallbackId: "fb-42")
        XCTAssertEqual(snap?.id, "fb-42")
    }

    // MARK: - Blob migration

    func testLegacyBlobWithoutRachioFieldStillDecodes() throws {
        // Mimic a blob written by an older build that didn't know about `rachio`.
        let legacy = """
        {
          "zones": [],
          "fertilizerPlan": [],
          "maintenanceTasks": [],
          "mowLog": [],
          "inventory": [],
          "observations": [],
          "waterRuns": [],
          "fertApplications": [],
          "seeded": true
        }
        """.data(using: .utf8)!

        let blob = try JSONDecoder().decode(FairwayBlob.self, from: legacy)
        XCTAssertNil(blob.rachio)
        XCTAssertTrue(blob.seeded)
    }

    // MARK: - RachioState zone-link lookup

    func testZoneLinkLookup() {
        let state = RachioState(
            personId: "p", deviceId: "d", deviceName: "Controller",
            lastSyncAt: Date(),
            zones: [
                RachioZoneSnapshot(id: "z-1", zoneNumber: 1, name: "Beds", enabled: true, lastWateredDate: nil),
                RachioZoneSnapshot(id: "z-2", zoneNumber: 2, name: "Front", enabled: true, lastWateredDate: nil),
            ],
            scheduleRules: [
                RachioScheduleSnapshot(
                    id: "rule-a", name: "AM", enabled: true, rainDelay: false,
                    scheduleType: "AUTOMATIC", zoneIds: ["z-2"],
                    totalDurationSeconds: 900, startHour: 5, startMinute: 0
                )
            ],
            flexScheduleRules: [],
            recentEvents: [],
            zoneLinks: ["1": "z-1", "2": "z-2"]
        )

        XCTAssertEqual(state.rachioZoneId(forFairwayZone: 2), "z-2")
        XCTAssertNil(state.rachioZoneId(forFairwayZone: 3))
        XCTAssertEqual(state.scheduleRules(forRachioZoneId: "z-2").count, 1)
        XCTAssertEqual(state.scheduleRules(forRachioZoneId: "z-1").count, 0)
    }
}
