import Foundation

/// Migrates `UserDefaults` keys from the Park Checklist naming to RollerTask Tycoon (one-time).
enum PreferencesMigration {
    static let cashKey = "chase_roller_task_tycoon_ios_cash"
    static let readableKey = "chase_roller_task_tycoon_ios_readable"

    private static let oldCashKey = "chase_park_checklist_ios_cash"
    private static let oldReadableKey = "chase_park_checklist_ios_readable"

    static func runIfNeeded() {
        let d = UserDefaults.standard
        if d.object(forKey: cashKey) == nil, d.object(forKey: oldCashKey) != nil {
            d.set(d.integer(forKey: oldCashKey), forKey: cashKey)
            d.removeObject(forKey: oldCashKey)
        }
        if d.object(forKey: readableKey) == nil, d.object(forKey: oldReadableKey) != nil {
            d.set(d.bool(forKey: oldReadableKey), forKey: readableKey)
            d.removeObject(forKey: oldReadableKey)
        }
    }
}
