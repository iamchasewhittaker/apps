import SwiftUI

enum FairwayFont {
    static func wordmark(size: CGFloat) -> Font {
        .custom("CormorantGaramond-LightItalic", size: size)
    }

    static func serif(size: CGFloat) -> Font {
        .custom("CormorantGaramond-Italic", size: size)
    }
}
