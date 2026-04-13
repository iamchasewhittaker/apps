import SwiftUI

// MARK: - Card ViewModifier

/// Applies the standard Clarity card styling: surface background, rounded corners, border.
/// Port of ClarityTheme's `ClarityCard` ViewModifier from YNAB Clarity.
///
/// Usage:
///   VStack { ... }.clarityCard()
public struct ClarityCardModifier: ViewModifier {
    public func body(content: Content) -> some View {
        content
            .padding(ClarityMetrics.cardPadding)
            .background(ClarityPalette.surface)
            .clipShape(RoundedRectangle(cornerRadius: ClarityMetrics.cornerRadius))
            .overlay(
                RoundedRectangle(cornerRadius: ClarityMetrics.cornerRadius)
                    .stroke(ClarityPalette.border, lineWidth: ClarityMetrics.borderWidth)
            )
    }
}

public extension View {
    func clarityCard() -> some View {
        modifier(ClarityCardModifier())
    }
}
