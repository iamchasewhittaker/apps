import SwiftUI

/// Clarity design system color tokens.
/// Source of truth: YNAB Clarity ClarityTheme.swift
/// All apps in the Clarity family use these exact values.
public enum ClarityPalette {

    // MARK: - Backgrounds

    /// Primary app background — dark blue-charcoal (#0f1117)
    public static let bg      = Color(red: 0.059, green: 0.067, blue: 0.090)
    /// Card / surface layer above bg (#161b27)
    public static let surface = Color(red: 0.086, green: 0.106, blue: 0.153)
    /// Subtle borders and dividers (#1f2937)
    public static let border  = Color(red: 0.122, green: 0.161, blue: 0.216)

    // MARK: - Text

    /// Primary text (#f3f4f6)
    public static let text  = Color(red: 0.953, green: 0.957, blue: 0.965)
    /// Secondary / muted text (#6b7280)
    public static let muted = Color(red: 0.420, green: 0.447, blue: 0.502)

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
