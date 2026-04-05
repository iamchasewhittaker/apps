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

    static var parkBackground: LinearGradient {
        LinearGradient(
            colors: [grassTop, grassBottom],
            startPoint: .top,
            endPoint: .bottom
        )
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
}
