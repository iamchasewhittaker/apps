import XCTest
@testable import Fairway

@MainActor
final class MowDirectionTests: XCTestCase {

    func testPresetsRoundTrip() {
        for preset in MowDirection.presets {
            let raw = preset.rawString
            let parsed = MowDirection(rawString: raw)
            XCTAssertEqual(parsed, preset, "preset '\(preset.displayLabel)' must round-trip through its rawString")
        }
    }

    func testOtherPreservesArbitraryString() {
        let custom = MowDirection.other("zigzag pattern")
        let parsed = MowDirection(rawString: custom.rawString)
        XCTAssertEqual(parsed, custom)
    }

    func testEmptyStringMapsToEmptyOther() {
        let parsed = MowDirection(rawString: "")
        XCTAssertEqual(parsed, .other(""))
    }

    func testMigrationFromPlainNSString() {
        // Legacy free-text entries that used "N-S" or "NS" should land on .northSouth.
        XCTAssertEqual(MowDirection(rawString: "N-S"), .northSouth)
        XCTAssertEqual(MowDirection(rawString: "NS"), .northSouth)
        XCTAssertEqual(MowDirection(rawString: "E-W"), .eastWest)
    }

    func testUnrecognizedStringLandsInOther() {
        let parsed = MowDirection(rawString: "Some pattern I made up")
        XCTAssertEqual(parsed, .other("Some pattern I made up"))
    }

    func testMowEntryStripeDirectionStaysString() throws {
        // stripeDirection must remain a raw String on the model, so the enum is UI-only.
        var entry = MowEntry(date: Date(), bladeHeightInches: 3.5)
        entry.stripeDirection = MowDirection.diagonalNESW.rawString
        let data = try JSONEncoder().encode(entry)
        let decoded = try JSONDecoder().decode(MowEntry.self, from: data)
        XCTAssertEqual(decoded.stripeDirection, "Diagonal NE-SW")
        XCTAssertEqual(MowDirection(rawString: decoded.stripeDirection), .diagonalNESW)
    }
}
