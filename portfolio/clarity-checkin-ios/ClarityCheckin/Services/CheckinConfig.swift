import Foundation

/// UserDefaults keys for Clarity Check-in.
/// Never change these once data is on a real device.
enum CheckinConfig {
    static let storeKey = "chase_checkin_ios_v1"
    static let draftKey = "chase_checkin_ios_draft_v1"
    static let medsKey  = "chase_checkin_ios_meds_v1"

    static let defaultMeds = ["Sertraline", "Adderall", "Wellbutrin", "Buspar", "Trazodone"]

    static let bundleID = "com.chasewhittaker.ClarityCheckin"
    static let appVersion = "0.1"
}
