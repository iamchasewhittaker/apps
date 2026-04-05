import XCTest
@testable import RollerTaskTycoon

final class BackupImporterTests: XCTestCase {
    func testDecodeValidEmptyTasksV1() throws {
        let json = """
        {"cash":100,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":1,"tasks":[]}
        """.data(using: .utf8)!
        let env = try BackupImporter.decodeAndValidate(data: json)
        XCTAssertEqual(env.cash, 100)
        XCTAssertTrue(env.tasks.isEmpty)
        XCTAssertEqual(env.schemaVersion, 1)
        XCTAssertNil(env.ledger)
    }

    func testDecodeValidTaskRowV1() throws {
        let json = """
        {"cash":0,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":1,"tasks":[{"createdAt":"2026-01-02T12:00:00Z","id":"AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE","isDone":true,"text":"Ride"}]}
        """.data(using: .utf8)!
        let env = try BackupImporter.decodeAndValidate(data: json)
        XCTAssertEqual(env.tasks.count, 1)
        XCTAssertEqual(env.tasks[0].text, "Ride")
        XCTAssertTrue(env.tasks[0].isDone ?? false)
    }

    func testDecodeValidEmptyV2() throws {
        let json = """
        {"cash":50,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":2,"tasks":[],"ledger":[]}
        """.data(using: .utf8)!
        let env = try BackupImporter.decodeAndValidate(data: json)
        XCTAssertEqual(env.schemaVersion, BackupFormat.schemaVersion)
        XCTAssertEqual(env.cash, 50)
        XCTAssertEqual(env.ledger?.count, 0)
    }

    func testDecodeV2TaskMinimal() throws {
        let json = #"""
        {"cash":0,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":2,"tasks":[{"id":"AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE","text":"Coaster","createdAt":"2026-01-02T12:00:00Z","statusRaw":"open","zoneRaw":"home","staffTypeRaw":"janitor","priorityRaw":"medium","rewardDollars":5,"details":"","subtasks":[]}],"ledger":[]}
        """#.data(using: .utf8)!
        let env = try BackupImporter.decodeAndValidate(data: json)
        XCTAssertEqual(env.tasks.count, 1)
        XCTAssertEqual(env.tasks[0].statusRaw, "open")
    }

    func testRejectInvalidJSON() {
        let data = Data("{".utf8)
        XCTAssertThrowsError(try BackupImporter.decodeAndValidate(data: data)) { err in
            XCTAssertEqual(err as? BackupImportError, .invalidJSON)
        }
    }

    func testRejectUnsupportedSchemaHigh() {
        let json = #"{"cash":0,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":99,"tasks":[]}"#.data(using: .utf8)!
        XCTAssertThrowsError(try BackupImporter.decodeAndValidate(data: json)) { err in
            guard let e = err as? BackupImportError, case .unsupportedSchema(99) = e else {
                return XCTFail("wrong error \(err)")
            }
        }
    }

    func testRejectUnsupportedSchemaZero() {
        let json = #"{"cash":0,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":0,"tasks":[]}"#.data(using: .utf8)!
        XCTAssertThrowsError(try BackupImporter.decodeAndValidate(data: json))
    }

    func testRejectBadTaskUUID() {
        let json = """
        {"cash":0,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":1,"tasks":[{"createdAt":"2026-01-02T12:00:00Z","id":"not-a-uuid","isDone":false,"text":"x"}]}
        """.data(using: .utf8)!
        XCTAssertThrowsError(try BackupImporter.decodeAndValidate(data: json)) { err in
            guard let e = err as? BackupImportError, case .invalidTaskUUID("not-a-uuid") = e else {
                return XCTFail("wrong error \(err)")
            }
        }
    }

    func testRejectBadTaskDate() {
        let json = """
        {"cash":0,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":1,"tasks":[{"createdAt":"yesterday","id":"AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE","isDone":false,"text":"x"}]}
        """.data(using: .utf8)!
        XCTAssertThrowsError(try BackupImporter.decodeAndValidate(data: json)) { err in
            guard let e = err as? BackupImportError, case .invalidTaskDate(let id) = e else {
                return XCTFail("wrong error \(err)")
            }
            XCTAssertEqual(id, "AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE")
        }
    }

    func testRejectV2MissingStatus() {
        let json = #"""
        {"cash":0,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":2,"tasks":[{"id":"AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE","text":"x","createdAt":"2026-01-02T12:00:00Z"}],"ledger":[]}
        """#.data(using: .utf8)!
        XCTAssertThrowsError(try BackupImporter.decodeAndValidate(data: json))
    }
}
