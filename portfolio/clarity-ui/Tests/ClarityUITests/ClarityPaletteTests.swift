import XCTest
import SwiftUI
@testable import ClarityUI

final class ClarityPaletteTests: XCTestCase {

    func testPaletteColorsExist() {
        // Verify all semantic colors are defined (not nil/clear)
        _ = ClarityPalette.bg
        _ = ClarityPalette.surface
        _ = ClarityPalette.border
        _ = ClarityPalette.text
        _ = ClarityPalette.muted
        _ = ClarityPalette.accent
        _ = ClarityPalette.safe
        _ = ClarityPalette.caution
        _ = ClarityPalette.danger
        _ = ClarityPalette.purple
    }

    func testProgressColorThresholds() {
        XCTAssertEqual(ClarityPalette.progressColor(fraction: 1.0), ClarityPalette.safe)
        XCTAssertEqual(ClarityPalette.progressColor(fraction: 0.85), ClarityPalette.safe)
        XCTAssertEqual(ClarityPalette.progressColor(fraction: 0.84), ClarityPalette.caution)
        XCTAssertEqual(ClarityPalette.progressColor(fraction: 0.50), ClarityPalette.caution)
        XCTAssertEqual(ClarityPalette.progressColor(fraction: 0.49), ClarityPalette.danger)
        XCTAssertEqual(ClarityPalette.progressColor(fraction: 0.0), ClarityPalette.danger)
    }

    func testClampedFraction() {
        XCTAssertEqual(ClarityPalette.clampedFraction(-0.5), 0.0)
        XCTAssertEqual(ClarityPalette.clampedFraction(1.5), 1.0)
        XCTAssertEqual(ClarityPalette.clampedFraction(0.5), 0.5)
        XCTAssertEqual(ClarityPalette.clampedFraction(.nan), 0.0)
        XCTAssertEqual(ClarityPalette.clampedFraction(.infinity), 1.0)
    }
}
