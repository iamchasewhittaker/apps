import Foundation

/// Tracks consecutive calendar days with at least one attraction closed.
enum ParkStreaks {
    private static let countKey = "chase_roller_task_tycoon_ios_streak_count"
    private static let dateKey  = "chase_roller_task_tycoon_ios_streak_date"

    static var count: Int {
        get { UserDefaults.standard.integer(forKey: countKey) }
        set { UserDefaults.standard.set(newValue, forKey: countKey) }
    }

    private static var lastClosedDate: Date? {
        get {
            let t = UserDefaults.standard.double(forKey: dateKey)
            return t > 0 ? Date(timeIntervalSince1970: t) : nil
        }
        set {
            UserDefaults.standard.set(newValue?.timeIntervalSince1970 ?? 0, forKey: dateKey)
        }
    }

    /// Call when any attraction is closed. Advances the streak if today is a new day.
    static func recordClose(calendar: Calendar = .current, now: Date = Date()) {
        if let last = lastClosedDate, calendar.isDate(last, inSameDayAs: now) {
            return
        }
        let yesterday = calendar.date(byAdding: .day, value: -1, to: now)!
        if let last = lastClosedDate, calendar.isDate(last, inSameDayAs: yesterday) {
            count += 1
        } else {
            count = 1
        }
        lastClosedDate = now
    }

    /// 1 day = +1%, capped at 10 days = +10%.
    static var ratingBonus: Int {
        min(10, count)
    }
}
