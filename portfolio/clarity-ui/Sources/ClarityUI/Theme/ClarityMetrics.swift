import SwiftUI

/// Clarity spacing, sizing, and layout constants.
/// @ScaledMetric values grow with Dynamic Type — required for low-vision accessibility.
public enum ClarityMetrics {
    /// Standard card corner radius
    public static let cornerRadius: CGFloat = 14
    /// Inner card padding
    public static let cardPadding: CGFloat = 16
    /// Horizontal screen edge padding
    public static let pagePadding: CGFloat = 16
    /// Standard vertical gap between cards
    public static let cardSpacing: CGFloat = 12
    /// Minimum tap target size (44pt accessibility requirement)
    public static let minTapTarget: CGFloat = 44
    /// Standard icon size
    public static let iconSize: CGFloat = 20
    /// Border line width
    public static let borderWidth: CGFloat = 1
}

/// ScaledMetric wrappers for spacing values that should grow with Dynamic Type.
/// Embed one of these in a View struct to get auto-scaling.
///
/// Usage:
///   @ScaledMetric(relativeTo: .body) private var spacing = ClarityMetrics.cardSpacing
public extension ClarityMetrics {
    /// Returns a padded frame that guarantees the 44×44 minimum tap target.
    /// Usage: `.frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)`
    static var tapTargetFrame: some View {
        Rectangle().frame(minWidth: minTapTarget, minHeight: minTapTarget).hidden()
    }
}
