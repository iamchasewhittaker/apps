import SwiftUI

/// Job Search HQ web palette (see `docs/BRANDING.md`) — surfaces for iOS v1.
enum JSHQTheme {
    static let background = Color(red: 0x0f / 255, green: 0x11 / 255, blue: 0x17 / 255)
    static let surface = Color(red: 0x1a / 255, green: 0x1d / 255, blue: 0x27 / 255)
    static let border = Color(red: 0x2a / 255, green: 0x2d / 255, blue: 0x3a / 255)
    static let textPrimary = Color(red: 0xe5 / 255, green: 0xe7 / 255, blue: 0xeb / 255)
    static let textMuted = Color(red: 0x9c / 255, green: 0xa3 / 255, blue: 0xaf / 255)
    static let accentBlue = Color(red: 0x3b / 255, green: 0x82 / 255, blue: 0xf6 / 255)
    static let accentPurple = Color(red: 0x8b / 255, green: 0x5c / 255, blue: 0xf6 / 255)
    static let accentGreen = Color(red: 0x10 / 255, green: 0xb9 / 255, blue: 0x81 / 255)
    static let accentAmber = Color(red: 0xf5 / 255, green: 0x9e / 255, blue: 0x0b / 255)
    static let accentRed = Color(red: 0xef / 255, green: 0x44 / 255, blue: 0x44 / 255)

    /// Parses `#RRGGBB` from web branding. Falls back to clear on invalid input.
    static func color(hex: String) -> Color {
        var s = hex.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
        if s.hasPrefix("#") { s.removeFirst() }
        guard s.count == 6, let v = UInt64(s, radix: 16) else {
            return .clear
        }
        let r = Double((v >> 16) & 0xFF) / 255
        let g = Double((v >> 8) & 0xFF) / 255
        let b = Double(v & 0xFF) / 255
        return Color(red: r, green: g, blue: b)
    }
}
