import Foundation

enum DateHelpers {
    private static let formatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        f.locale = Locale.current
        return f
    }()

    static var todayString: String {
        formatter.string(from: Date())
    }

    static func isToday(_ dateString: String) -> Bool {
        dateString == todayString
    }
}
