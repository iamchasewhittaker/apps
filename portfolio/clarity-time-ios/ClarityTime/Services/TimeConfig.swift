import Foundation

/// UserDefaults keys and constants for Clarity Time.
/// Never change `storeKey` once data is on a real device.
enum TimeConfig {
    static let storeKey = "chase_time_ios_v1"

    static let bundleID = "com.chasewhittaker.ClarityTime"
    static let appVersion = "0.1"

    static let categories = ["deep", "work", "spiritual", "health", "other"]
    static let categoryLabels: [String: String] = [
        "deep": "Deep work",
        "work": "Work",
        "spiritual": "Spiritual",
        "health": "Health",
        "other": "Other"
    ]
}
