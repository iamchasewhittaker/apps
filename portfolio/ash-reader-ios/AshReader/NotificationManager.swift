import UserNotifications

final class NotificationManager {
    static let shared = NotificationManager()
    private let center = UNUserNotificationCenter.current()
    private let idPrefix = "ash_reader_reminder_"

    private init() {}

    func requestPermission() async -> Bool {
        let settings = await center.notificationSettings()
        if settings.authorizationStatus == .authorized { return true }
        return (try? await center.requestAuthorization(options: [.alert, .sound])) ?? false
    }

    func scheduleReminders(enabled: Bool, hour: Int, minute: Int, weekdays: Set<Int>) {
        center.removePendingNotificationRequests(withIdentifiers: (1...7).map { "\(idPrefix)\($0)" })
        guard enabled && !weekdays.isEmpty else { return }

        let content = UNMutableNotificationContent()
        content.title = "Ash Reader"
        content.body = "Your reading session awaits."
        content.sound = .default

        for weekday in weekdays {
            var comps = DateComponents()
            comps.weekday = weekday
            comps.hour = hour
            comps.minute = minute
            let trigger = UNCalendarNotificationTrigger(dateMatching: comps, repeats: true)
            let request = UNNotificationRequest(
                identifier: "\(idPrefix)\(weekday)",
                content: content,
                trigger: trigger
            )
            center.add(request)
        }
    }

    func cancelAll() {
        center.removePendingNotificationRequests(withIdentifiers: (1...7).map { "\(idPrefix)\($0)" })
    }
}
