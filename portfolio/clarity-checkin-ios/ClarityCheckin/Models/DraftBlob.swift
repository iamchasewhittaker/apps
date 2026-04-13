import Foundation

/// In-progress check-in draft. Saved to `CheckinConfig.draftKey` on every field change.
/// Discarded if the draft date doesn't match today.
struct DraftBlob: Codable {
    var date: String = ""         // "yyyy-MM-dd" — used for stale-draft detection
    var isMorning: Bool = true
    var morning: MorningData = .init()
    var evening: EveningData = .init()
    var currentSection: Int = 0   // which wizard step the user was on
}
