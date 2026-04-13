import XCTest
@testable import ClarityUI

final class StorageHelpersTests: XCTestCase {

    struct Dummy: Codable, Equatable {
        var name: String
        var count: Int
    }

    let testKey = "clarity_ui_test_key"

    override func tearDown() {
        StorageHelpers.remove(key: testKey)
    }

    func testSaveAndLoad() {
        let original = Dummy(name: "Test", count: 42)
        let saved = StorageHelpers.save(original, key: testKey)
        XCTAssertTrue(saved)

        let loaded = StorageHelpers.load(Dummy.self, key: testKey)
        XCTAssertEqual(loaded, original)
    }

    func testLoadMissingKeyReturnsNil() {
        let result = StorageHelpers.load(Dummy.self, key: "nonexistent_key_xyz")
        XCTAssertNil(result)
    }

    func testRemove() {
        StorageHelpers.save(Dummy(name: "x", count: 1), key: testKey)
        XCTAssertTrue(StorageHelpers.exists(key: testKey))
        StorageHelpers.remove(key: testKey)
        XCTAssertFalse(StorageHelpers.exists(key: testKey))
    }

    func testOverwrite() {
        StorageHelpers.save(Dummy(name: "first", count: 1), key: testKey)
        StorageHelpers.save(Dummy(name: "second", count: 2), key: testKey)
        let loaded = StorageHelpers.load(Dummy.self, key: testKey)
        XCTAssertEqual(loaded?.name, "second")
    }
}
