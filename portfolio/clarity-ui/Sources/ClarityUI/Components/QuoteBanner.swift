import SwiftUI

/// Daily quote banner shown on each app's home/dashboard screen.
/// Quotes rotate daily based on the day-of-year. VoiceOver reads the full quote + author.
public struct QuoteBanner: View {
    public let quote: ClarityQuote

    public init(quote: ClarityQuote) {
        self.quote = quote
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("\u{201C}\(quote.text)\u{201D}")
                .font(ClarityTypography.support)
                .foregroundStyle(ClarityPalette.text)
                .fixedSize(horizontal: false, vertical: true)

            if let author = quote.author {
                Text("— \(author)")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .clarityCard()
        .accessibilityElement(children: .ignore)
        .accessibilityLabel(quoteAccessibilityLabel)
    }

    private var quoteAccessibilityLabel: String {
        if let author = quote.author {
            return "\u{201C}\(quote.text)\u{201D} — \(author)"
        }
        return "\u{201C}\(quote.text)\u{201D}"
    }
}

// MARK: - Quote model

public struct ClarityQuote {
    public let text: String
    public let author: String?
    public let tags: [String]

    public init(text: String, author: String? = nil, tags: [String] = []) {
        self.text = text
        self.author = author
        self.tags = tags
    }
}

// MARK: - Daily rotation helper

public extension Array where Element == ClarityQuote {
    /// Returns today's quote by seeding with the day-of-year.
    var todaysQuote: ClarityQuote? {
        guard !isEmpty else { return nil }
        let dayOfYear = Calendar.current.ordinality(of: .day, in: .era, for: .now) ?? 1
        return self[dayOfYear % count]
    }
}
