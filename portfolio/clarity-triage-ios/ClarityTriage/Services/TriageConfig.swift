import Foundation

/// UserDefaults keys and constants for Clarity Triage.
/// Never change these once data is on a real device.
enum TriageConfig {
    static let storeKey = "chase_triage_ios_v1"

    static let bundleID = "com.chasewhittaker.ClarityTriage"
    static let appVersion = "0.1"

    static let categories = ["job", "home", "health", "financial", "other"]
    static let categoryLabels: [String: String] = [
        "job": "Job Search",
        "home": "Home & Family",
        "health": "Health",
        "financial": "Financial",
        "other": "Other"
    ]

    static let sizes = ["quick", "short", "medium"]
    static let sizeLabels: [String: String] = [
        "quick": "Quick (≤15m)",
        "short": "Short (≤45m)",
        "medium": "Medium (≤2h)"
    ]

    static let winCategories = ["task", "ocd", "present", "health", "brave", "job", "calm", "other"]
    static let winCategoryLabels: [String: String] = [
        "task": "Task",
        "ocd": "OCD",
        "present": "Present",
        "health": "Health",
        "brave": "Brave",
        "job": "Job",
        "calm": "Calm",
        "other": "Other"
    ]

    static let stageLabels = ["Capture", "Pressure Test", "Explore"]

    static func slots(for capacity: Int) -> Int {
        switch capacity {
        case 1: return 1
        case 2: return 2
        case 3: return 3
        case 4: return 5
        default: return 0
        }
    }
}
