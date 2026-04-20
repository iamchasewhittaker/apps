import SwiftUI

extension Font {
    /// BigShoulders Bold — wordmark and display headings.
    static func shipyardDisplay(_ size: CGFloat) -> Font {
        .custom("BigShouldersDisplay-Bold", size: size)
    }

    /// DM Mono Regular — eyebrows, labels, technical metadata.
    static func shipyardMono(_ size: CGFloat) -> Font {
        .custom("DMMono-Regular", size: size)
    }

    /// Instrument Sans — body and UI copy.
    static func shipyardBody(_ size: CGFloat, bold: Bool = false) -> Font {
        .custom(bold ? "InstrumentSans-Bold" : "InstrumentSans-Regular", size: size)
    }
}
