import SwiftUI

enum ClarityTheme {
    // MARK: - Background palette (dark, blue-tinted)
    static let bg      = Color(red: 0.055, green: 0.063, blue: 0.082)
    static let surface = Color(red: 0.102, green: 0.118, blue: 0.149)
    static let border  = Color(red: 0.173, green: 0.196, blue: 0.243)
    static let text    = Color(red: 0.918, green: 0.929, blue: 0.941)
    static let muted   = Color(red: 0.420, green: 0.443, blue: 0.490)

    // MARK: - Semantic status colors
    static let safe     = Color(red: 0.239, green: 0.718, blue: 0.478)  // green — funded
    static let caution  = Color(red: 0.910, green: 0.733, blue: 0.196)  // amber — partial
    static let danger   = Color(red: 0.878, green: 0.314, blue: 0.314)  // red — shortfall
    static let accent   = Color(red: 0.310, green: 0.573, blue: 0.949)  // blue — interactive
    static let mortgage = Color(red: 0.776, green: 0.424, blue: 0.941)  // purple — mortgage

    // MARK: - Typography
    static let displayFont  : Font = .system(.largeTitle,  design: .rounded).weight(.bold)
    static let titleFont    : Font = .system(.title3,      design: .rounded).weight(.semibold)
    static let headlineFont : Font = .system(.headline,    design: .rounded)
    static let bodyFont     : Font = .system(.body,        design: .default)
    static let captionFont  : Font = .system(.caption,     design: .default)
    static let monoFont     : Font = .system(.body,        design: .monospaced)

    // MARK: - Progress color by coverage fraction
    static func progressColor(fraction: Double) -> Color {
        if fraction >= 0.85 { return safe }
        if fraction >= 0.50 { return caution }
        return danger
    }

    // MARK: - Currency formatting
    static func currency(_ value: Double) -> String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = "USD"
        formatter.maximumFractionDigits = 0
        return formatter.string(from: NSNumber(value: value)) ?? "$\(Int(value))"
    }
}

// MARK: - Card ViewModifier
struct ClarityCard: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(16)
            .background(ClarityTheme.surface)
            .clipShape(RoundedRectangle(cornerRadius: 14))
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(ClarityTheme.border, lineWidth: 1)
            )
    }
}

extension View {
    func clarityCard() -> some View {
        modifier(ClarityCard())
    }
}
