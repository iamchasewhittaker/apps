import SwiftUI

/// Clarity design system typography.
/// All fonts use semantic SwiftUI styles so Dynamic Type scales them automatically —
/// never hardcode point sizes. This is a low-vision accessibility requirement.
public enum ClarityTypography {

    // MARK: - Display / Headings (rounded design for warmth)

    /// Large screen title — hero numbers, dashboard totals
    public static let display  : Font = .system(.largeTitle,  design: .rounded, weight: .bold)
    /// Section / view title
    public static let title    : Font = .system(.title3,      design: .rounded, weight: .semibold)
    /// Card heading
    public static let headline : Font = .system(.headline,    design: .rounded, weight: .semibold)

    // MARK: - Body

    /// Primary reading text
    public static let body    : Font = .system(.body,     design: .default, weight: .regular)
    /// Explanatory copy — slightly smaller than body but larger than caption for readability
    public static let support : Font = .system(.subheadline, design: .default, weight: .regular)
    /// Labels, meta info
    public static let caption : Font = .system(.caption,  design: .default, weight: .regular)
    /// Monospaced — numbers, amounts
    public static let mono    : Font = .system(.body,     design: .monospaced, weight: .regular)

    // MARK: - Bold Text accessibility variant
    // When the user enables "Bold Text" in Accessibility settings, SwiftUI's
    // semantic fonts automatically gain weight. For custom weights, use:

    /// Use instead of `body` in contexts where bold-text compliance matters.
    public static func adaptiveBody(bold: Bool) -> Font {
        bold
            ? .system(.body, design: .default, weight: .semibold)
            : .system(.body, design: .default, weight: .regular)
    }
}
