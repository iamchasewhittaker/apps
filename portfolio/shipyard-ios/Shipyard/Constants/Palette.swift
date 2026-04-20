import SwiftUI

// Shipyard theme tokens — see design/DESIGN-HANDOFF.md.
enum Palette {
    static let bg = Color(hex: 0x07101E)
    static let surface = Color(hex: 0x0C1A34)
    static let white = Color(hex: 0xF2EEE6)
    static let steel = Color(hex: 0x4A90DE)
    static let gold = Color(hex: 0xD7AA3A)
    static let dim = Color(hex: 0x346090)
    static let dimmer = Color(hex: 0x141A4C)
    static let ghost = Color(hex: 0x0D1A34)
}

extension Color {
    init(hex: UInt32) {
        let r = Double((hex >> 16) & 0xFF) / 255.0
        let g = Double((hex >> 8) & 0xFF) / 255.0
        let b = Double(hex & 0xFF) / 255.0
        self.init(red: r, green: g, blue: b)
    }
}

extension ShipStatus {
    var chipColor: Color {
        switch self {
        case .active: return Palette.steel
        case .stalled: return Palette.gold
        case .frozen: return Palette.dim
        case .archived: return Palette.dimmer
        }
    }

    var chipLabel: String {
        switch self {
        case .active: return "Under Way"
        case .stalled: return "In Drydock"
        case .frozen: return "Frozen"
        case .archived: return "Archived"
        }
    }
}
