import XCTest
import UIKit
@testable import Fairway

final class PhotoStoreTests: XCTestCase {

    func testWriteReadDeleteRoundTrip() throws {
        let temp = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString)
        let store = PhotoStore(root: temp)

        let img = makeImage(size: CGSize(width: 100, height: 100), color: .green)

        guard let id = store.save(image: img) else {
            return XCTFail("save() returned nil for small image")
        }

        XCTAssertNotNil(store.load(id: id), "load should return image after save")

        store.delete(id: id)
        XCTAssertNil(store.load(id: id), "load should return nil after delete")

        try FileManager.default.removeItem(at: temp)
    }

    func testLargeImageCompressesUnder500KB() throws {
        let temp = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString)
        let store = PhotoStore(root: temp)

        let img = makeImage(size: CGSize(width: 2000, height: 2000), color: .white)

        guard let id = store.save(image: img) else {
            return XCTFail("save() returned nil — compression failed")
        }

        let url = temp.appendingPathComponent("\(id.uuidString).jpg")
        let data = try Data(contentsOf: url)
        XCTAssertLessThanOrEqual(data.count, 500_000, "saved JPEG must be ≤500 KB")

        try FileManager.default.removeItem(at: temp)
    }

    func testDeleteNonexistentIsNoop() {
        let temp = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString)
        let store = PhotoStore(root: temp)
        store.delete(id: UUID()) // must not crash
    }

    func testLoadNonexistentReturnsNil() {
        let temp = FileManager.default.temporaryDirectory
            .appendingPathComponent(UUID().uuidString)
        let store = PhotoStore(root: temp)
        XCTAssertNil(store.load(id: UUID()))
    }

    // MARK: - Helpers

    private func makeImage(size: CGSize, color: UIColor) -> UIImage {
        UIGraphicsImageRenderer(size: size).image { ctx in
            color.setFill()
            ctx.fill(CGRect(origin: .zero, size: size))
        }
    }
}
