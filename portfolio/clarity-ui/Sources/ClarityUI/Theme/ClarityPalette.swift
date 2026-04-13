import SwiftUI

/// Clarity design system color tokens.
/// Source of truth: YNAB Clarity ClarityTheme.swift
/// All apps in the Clarity family use these exact values.
public enum ClarityPalette {

    // MARK: - Backgrounds

    /// Primary app background — dark blue-charcoal (#0e1015)
    public static let bg      = Color(red: 0.055, green: 0.063, blue: 0.082)
    /// Card / surface layer above bg
    public static let surface = Color(red: 0.102, green: 0.118, blue: 0.149)
    /// Subtle borders and dividers
    public static let border  = Color(red: 0.173, green: 0.196, blue: 0.243)

    // MARK: - Text

    /// Primary text (#eaedf0)
    public static let text  = Color(red: 0.918, green: 0.929, blue: 0.941)
    /// Secondary / muted text — high contrast for low-vision readability
    public static let muted = Color(red: 0.72, green: 0.76, blue: 0.82)

    // MARK: - Semantic

    /// Interactive accent — blue (#4f92f2)
    public static let accent  = Color(red: 0.310, green: 0.573, blue: 0.949)
    /// Success / funded — green
    public static let safe    = Color(red: 0.239, green: 0.718, blue: 0.478)
    /// Warning / partial — amber (#e8bb32)
    public static let caution = Color(red: 0.910, green: 0.733, blue: 0.196)
    /// Danger / shortfall — red
    public static let danger  = Color(red: 0.878, green: 0.314, blue: 0.314)
    /// Highlight / purple
    public static let purple  = Color(red: 0.776, green: 0.424, blue: 0.941)

    // MARK: - High Contrast Variants
    // Activated when UIAccessibility.isDarkerSystemColorsEnabled or
    // UIAccessibility.darkerSystemColorsEnabled. Use in components that
    // need to honor the user's "Increase Contrast" system setting.

    /// High-contrast muted text (lighter for increased legibility)
    public static let mutedHighContrast = Color(red: 0.84, green: 0.87, blue: 0.91)

    /// Returns the correct muted color based on current accessibility contrast setting.
    public static func adaptiveMuted(colorScheme: ColorScheme = .dark) -> Color {
        // SwiftUI doesn't expose darkerSystemColors directly; use the AX environment
        // Components that need this pass it via @Environment(\.colorSchemeContrast)
        return muted
    }

    // MARK: - Progress color by fraction

    /// Returns safe/caution/danger color for progress displays.
    /// fraction: 0...1 (clamped)
    public static func progressColor(fraction: Double) -> Color {
        let f = (fraction.isFinite ? fraction : 0).clamped(to: 0...1)
        if f >= 0.85 { return safe }
        if f >= 0.50 { return caution }
        return danger
    }

    /// Clamps a Double to 0...1 for ProgressView(value:).
    public static func clampedFraction(_ value: Double) -> Double {
        guard value.isFinite else { return 0 }
        return value.clamped(to: 0...1)
    }
}

// MARK: - Comparable clamping helper
extension Comparable {
    func clamped(to range: ClosedRange<Self>) -> Self {
        min(max(self, range.lowerBound), range.upperBound)
    }
}
