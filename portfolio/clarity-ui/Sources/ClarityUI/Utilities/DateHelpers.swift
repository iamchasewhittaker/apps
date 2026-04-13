import Foundation

/// Shared date helpers used across all Clarity apps.
public enum DateHelpers {

    // MARK: - Formatters (lazy singletons for performance)

    public static let isoDateFormatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = .current
        return f
    }()

    public static let isoDateTimeFormatter: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()

    // MARK: - String conversions

    /// Today's date as "yyyy-MM-dd"
    public static var todayString: String {
        isoDateFormatter.string(from: .now)
    }

    /// Converts a Date to "yyyy-MM-dd"
    public static func dateString(from date: Date = .now) -> String {
        isoDateFormatter.string(from: date)
    }

    /// Parses "yyyy-MM-dd" → Date?
    public static func date(from string: String) -> Date? {
        isoDateFormatter.date(from: string)
    }

    /// Converts milliseconds-since-epoch (JS style) to Date
    public static func date(fromJsTimestamp ms: Int64) -> Date {
        Date(timeIntervalSince1970: TimeInterval(ms) / 1000)
    }

    // MARK: - Comparisons

    /// Returns true if the given date string is today's date.
    public static func isToday(_ dateString: String) -> Bool {
        dateString == todayString
    }

    /// Returns true if dateString is more than `hours` hours in the past.
    public static func isStale(_ dateString: String, hours: Double = 24) -> Bool {
        guard let d = date(from: dateString) else { return true }
        return Date().timeIntervalSince(d) > hours * 3600
    }

    // MARK: - Display formatting

    /// "April 12, 2026"
    public static func displayLong(from dateString: String) -> String {
        guard let d = date(from: dateString) else { return dateString }
        let f = DateFormatter()
        f.dateStyle = .long
        f.timeStyle = .none
        return f.string(from: d)
    }

    /// "Apr 12"
    public static func displayShort(from dateString: String) -> String {
        guard let d = date(from: dateString) else { return dateString }
        let f = DateFormatter()
        f.dateFormat = "MMM d"
        return f.string(from: d)
    }

    /// Returns true if it's morning (hour < 20).
    public static var isMorning: Bool {
        Calendar.current.component(.hour, from: .now) < 20
    }
}
