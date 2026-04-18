import SwiftUI

// Nautical palette — see docs/BRANDING.md.
enum Palette {
    static let navy = Color(red: 0.039, green: 0.118, blue: 0.247)       // #0A1E3F
    static let deepSea = Color(red: 0.075, green: 0.169, blue: 0.353)    // #132B5A
    static let gold = Color(red: 0.831, green: 0.659, blue: 0.294)       // #D4A84B
    static let sailCream = Color(red: 0.957, green: 0.918, blue: 0.835)  // #F4EAD5
    static let mist = Color(red: 0.608, green: 0.690, blue: 0.784)       // #9BB0C8
    static let storm = Color(red: 0.898, green: 0.420, blue: 0.306)      // #E56B4E
}

extension ShipStatus {
    var chipColor: Color {
        switch self {
        case .active: return Palette.gold
        case .stalled: return Palette.storm
        case .frozen: return Palette.mist
        case .archived: return Palette.mist
        }
    }

    var chipLabel: String {
        switch self {
        case .active: return "Active"
        case .stalled: return "Drydock"
        case .frozen: return "Frozen"
        case .archived: return "Archived"
        }
    }
}
