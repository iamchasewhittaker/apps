import SwiftUI

enum ParkTheme {
    static let grassTop = Color(red: 0.35, green: 0.62, blue: 0.32)
    static let grassBottom = Color(red: 0.22, green: 0.45, blue: 0.24)
    static let wood = Color(red: 0.55, green: 0.38, blue: 0.22)
    static let woodLight = Color(red: 0.72, green: 0.55, blue: 0.35)
    static let plaque = Color(red: 0.94, green: 0.88, blue: 0.72)
    static let ink = Color(red: 0.15, green: 0.12, blue: 0.1)
    static let accent = Color(red: 0.2, green: 0.45, blue: 0.85)
    static let gold = Color(red: 0.85, green: 0.65, blue: 0.18)
    static let alertRed = Color(red: 0.78, green: 0.2, blue: 0.18)
    static let water = Color(red: 0.22, green: 0.42, blue: 0.72)

    static var parkBackground: LinearGradient {
        LinearGradient(
            colors: [grassTop, grassBottom],
            startPoint: .top,
            endPoint: .bottom
        )
    }

    /// Headers / control-panel labels — monospaced when “park” fonts are on.
    static func displayFont(readable: Bool) -> Font {
        if readable {
            return .headline.weight(.bold)
        }
        return .system(.title3, design: .monospaced).weight(.bold)
    }

    static func titleFont(readable: Bool) -> Font {
        if readable {
            return .headline.weight(.bold)
        }
        return .system(.headline, design: .rounded).weight(.heavy)
    }

    static func bodyFont(readable: Bool) -> Font {
        if readable {
            return .body
        }
        return .system(.body, design: .rounded)
    }

    static func captionFont(readable: Bool) -> Font {
        if readable {
            return .caption
        }
        return .system(.caption, design: .rounded)
    }
}

struct ParkPanelCard: ViewModifier {
    var readable: Bool

    func body(content: Content) -> some View {
        content
            .padding(14)
            .background(ParkTheme.plaque.opacity(0.94))
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(ParkTheme.wood.opacity(0.55), lineWidth: 2)
            )
            .shadow(color: .black.opacity(0.08), radius: 4, y: 2)
    }
}

extension View {
    func parkPanel(readable: Bool) -> some View {
        modifier(ParkPanelCard(readable: readable))
    }
}
