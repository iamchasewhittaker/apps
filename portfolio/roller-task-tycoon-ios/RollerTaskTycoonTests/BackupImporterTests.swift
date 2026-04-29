import XCTest
@testable import RollerTaskTycoon

final class BackupImporterTests: XCTestCase {
    func testDecodeValidEmptyV2() throws {
        let json = """
        {"cash":50,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":2,"tasks":[],"ledger":[]}
        """.data(using: .utf8)!
        let env = try BackupImporter.decodeAndValidate(data: json)
        XCTAssertEqual(env.schemaVersion, 2)
        XCTAssertEqual(env.cash, 50)
        XCTAssertEqual(env.ledger?.count, 0)
    }

    func testDecodeValidEmptyV3() throws {
        let json = """
        {"cash":100,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":3,"tasks":[],"ledger":[]}
        """.data(using: .utf8)!
        let env = try BackupImporter.decodeAndValidate(data: json)
        XCTAssertEqual(env.schemaVersion, BackupFormat.schemaVersion)
        XCTAssertEqual(env.cash, 100)
    }

    func testV3TaskWithSubtasks() throws {
        let json = #"""
        {"cash":0,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":3,"tasks":[{"id":"AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE","text":"Coaster","createdAt":"2026-01-02T12:00:00Z","statusRaw":"open","subtasks":[{"id":"11111111-2222-3333-4444-555555555555","text":"Check brakes","isDone":false,"sortOrder":0,"createdAt":"2026-01-02T12:00:00Z"}]}],"ledger":[]}
        """#.data(using: .utf8)!
        let env = try BackupImporter.decodeAndValidate(data: json)
        XCTAssertEqual(env.tasks[0].subtasks?.count, 1)
        XCTAssertEqual(env.tasks[0].subtasks?[0].text, "Check brakes")
    }

    func testDecodeV2TaskMinimal() throws {
        let json = #"""
        {"cash":0,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":2,"tasks":[{"id":"AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE","text":"Coaster","createdAt":"2026-01-02T12:00:00Z","statusRaw":"open","zoneRaw":"home","staffTypeRaw":"janitor","priorityRaw":"medium","rewardDollars":5,"details":""}],"ledger":[]}
        """#.data(using: .utf8)!
        let env = try BackupImporter.decodeAndValidate(data: json)
        XCTAssertEqual(env.tasks.count, 1)
        XCTAssertEqual(env.tasks[0].text, "Coaster")
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

    func testRejectSchemaV1() {
        let json = #"{"cash":0,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":1,"tasks":[]}"#.data(using: .utf8)!
        XCTAssertThrowsError(try BackupImporter.decodeAndValidate(data: json)) { err in
            guard let e = err as? BackupImportError, case .unsupportedSchema(1) = e else {
                return XCTFail("wrong error \(err)")
            }
        }
    }

    func testRejectUnsupportedSchemaZero() {
        let json = #"{"cash":0,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":0,"tasks":[]}"#.data(using: .utf8)!
        XCTAssertThrowsError(try BackupImporter.decodeAndValidate(data: json))
    }

    func testRejectBadTaskUUID() {
        let json = #"""
        {"cash":0,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":2,"tasks":[{"id":"not-a-uuid","text":"x","createdAt":"2026-01-02T12:00:00Z","statusRaw":"open"}],"ledger":[]}
        """#.data(using: .utf8)!
        XCTAssertThrowsError(try BackupImporter.decodeAndValidate(data: json)) { err in
            guard let e = err as? BackupImportError, case .invalidTaskUUID("not-a-uuid") = e else {
                return XCTFail("wrong error \(err)")
            }
        }
    }

    func testRejectBadTaskDate() {
        let json = #"""
        {"cash":0,"exportedAt":"2026-01-01T00:00:00Z","schemaVersion":2,"tasks":[{"id":"AAAAAAAA-BBBB-CCCC-DDDD-EEEEEEEEEEEE","text":"x","createdAt":"yesterday","statusRaw":"open"}],"ledger":[]}
        """#.data(using: .utf8)!
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
