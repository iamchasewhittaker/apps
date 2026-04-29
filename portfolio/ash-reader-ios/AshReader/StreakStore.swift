import Foundation

final class StreakStore: ObservableObject {
    static let shared = StreakStore()

    private let key = "ash_reader_ios_streak_dates"
    private let formatter: DateFormatter = {
        let f = DateFormatter()
        f.dateFormat = "yyyy-MM-dd"
        f.locale = Locale(identifier: "en_US_POSIX")
        return f
    }()

    @Published var currentStreak: Int = 0
    @Published var longestStreak: Int = 0

    private init() {
        compute()
        NotificationCenter.default.addObserver(
            forName: .iCloudSyncDidChange,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            self?.compute()
        }
    }

    func recordActivity() {
        let today = formatter.string(from: Date())
        var stored = loadDates()
        guard !stored.contains(today) else { return }
        stored.append(today)
        saveDates(stored)
        compute()
    }

    // MARK: - Test helpers (internal via @testable import)

    func setDatesForTesting(_ dates: [String]) {
        saveDates(dates)
        compute()
    }

    func loadDatesForTesting() -> [String] {
        loadDates()
    }

    // MARK: - Private

    private func loadDates() -> [String] {
        // Stored as a single comma-separated string to fit SyncedStore's string API
        let raw = SyncedStore.shared.string(forKey: key) ?? ""
        return raw.isEmpty ? [] : raw.components(separatedBy: ",")
    }

    private func saveDates(_ dates: [String]) {
        SyncedStore.shared.setString(dates.joined(separator: ","), forKey: key)
    }

    private func compute() {
        let dates = loadDates().compactMap { formatter.date(from: $0) }
        guard !dates.isEmpty else {
            currentStreak = 0
            longestStreak = 0
            return
        }

        let cal = Calendar.current
        let today = cal.startOfDay(for: Date())
        let yesterday = cal.date(byAdding: .day, value: -1, to: today)!

        let sorted = dates.map { cal.startOfDay(for: $0) }.sorted()

        // Current streak: walk backwards from today
        var current = 0
        var anchor = sorted.last!
        if anchor == today || anchor == yesterday {
            current = 1
            var prev = anchor
            for date in sorted.dropLast().reversed() {
                let expected = cal.date(byAdding: .day, value: -1, to: prev)!
                if date == expected {
                    current += 1
                    prev = date
                } else {
                    break
                }
            }
        }

        // Longest streak: scan all consecutive windows
        var longest = 1
        var run = 1
        for i in 1..<sorted.count {
            let expected = cal.date(byAdding: .day, value: 1, to: sorted[i - 1])!
            if sorted[i] == expected {
                run += 1
                longest = max(longest, run)
            } else {
                run = 1
            }
        }

        currentStreak = current
        longestStreak = max(longest, current)
    }
}
