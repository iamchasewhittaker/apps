import SwiftUI

extension Color {
    init(hex: String) {
        var hex = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if hex.hasPrefix("#") { hex.removeFirst() }

        var rgb: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&rgb)

        let r, g, b, a: Double
        switch hex.count {
        case 6:
            r = Double((rgb & 0xFF0000) >> 16) / 255.0
            g = Double((rgb & 0x00FF00) >> 8) / 255.0
            b = Double(rgb & 0x0000FF) / 255.0
            a = 1.0
        case 8:
            r = Double((rgb & 0xFF000000) >> 24) / 255.0
            g = Double((rgb & 0x00FF0000) >> 16) / 255.0
            b = Double((rgb & 0x0000FF00) >> 8) / 255.0
            a = Double(rgb & 0x000000FF) / 255.0
        default:
            r = 1; g = 1; b = 1; a = 1
        }

        self.init(.sRGB, red: r, green: g, blue: b, opacity: a)
    }
}

enum KeepTheme {
    // Backgrounds — warm dark
    static let backgroundPrimary = Color(hex: "#0f0e0d")
    static let backgroundSurface = Color(hex: "#1a1816")
    static let backgroundElevated = Color(hex: "#252220")

    // Accent — warm amber/honey
    static let accent = Color(hex: "#d4a055")
    static let accentSubtle = Color(hex: "#8a6a3a")

    // Text
    static let textPrimary = Color(hex: "#ede8e0")
    static let textSecondary = Color(hex: "#8a8279")
    static let textMuted = Color(hex: "#5a554e")

    // Triage status colors
    static let statusKeep = Color(hex: "#4ade80")
    static let statusDonate = Color(hex: "#60a5fa")
    static let statusToss = Color(hex: "#f87171")
    static let statusUnsure = Color(hex: "#fbbf24")
    static let statusUnsorted = Color(hex: "#6b7280")

    // Progress
    static let progressTrack = Color(hex: "#2a2725")
    static let progressFill = Color(hex: "#d4a055")

    static func statusColor(for status: TriageStatus) -> Color {
        switch status {
        case .keep: return statusKeep
        case .donate: return statusDonate
        case .toss: return statusToss
        case .unsure: return statusUnsure
        case .unsorted: return statusUnsorted
        }
    }
}

// MARK: - Card modifier

struct KeepCardModifier: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(16)
            .background(KeepTheme.backgroundSurface)
            .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

extension View {
    func keepCard() -> some View {
        modifier(KeepCardModifier())
    }
}
