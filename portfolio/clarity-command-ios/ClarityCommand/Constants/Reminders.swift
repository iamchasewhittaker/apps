import Foundation

enum ReminderBank {

    static let base: [Reminder] = [
        Reminder(text: "You have a little family counting on you.", area: "general"),
        Reminder(text: "I need you to look for a job with urgency.", area: "jobs"),
        Reminder(text: "You can do better. Please, work hard at finding a job.", area: "jobs"),
        Reminder(text: "I can\u{2019}t carry the weight of everything anymore.", area: "general"),
        Reminder(text: "Please do more.", area: "general"),
        Reminder(text: "Stop making excuses and feeling sorry for yourself. It\u{2019}s not fair.", area: "general"),
        Reminder(text: "You are wasting time.", area: "time"),
        Reminder(text: "This isn\u{2019}t what I want our life to be like. We can do better.", area: "general"),
        Reminder(text: "I need you to go back to work.", area: "jobs"),
        Reminder(text: "Put your best foot forward instead of being \u{2018}too tired\u{2019} or \u{2018}too busy\u{2019} to do anything.", area: "jobs"),
        Reminder(text: "I don\u{2019}t want to stress about buying our kids a pair of shoes or having enough money for groceries.", area: "budget"),
        Reminder(text: "When we first got married you were optimistic and confident and looked forward to the future. I need that person back.", area: "wellness"),
        Reminder(text: "Stop making everything harder than it needs to be.", area: "general"),
        Reminder(text: "You are great with Reese and Buzz, but I need you to be more than that.", area: "general"),
        Reminder(text: "Please, work hard. You can find a job.", area: "jobs"),
    ]

    static func todayReminder(custom: [Reminder] = []) -> Reminder {
        let all = base + custom
        guard !all.isEmpty else { return base[0] }
        let dayOfYear = Calendar.current.ordinality(of: .day, in: .year, for: .now) ?? 1
        return all[dayOfYear % all.count]
    }

    static func reminderForArea(_ area: String, custom: [Reminder] = []) -> Reminder {
        let all = base + custom
        let matches = all.filter { $0.area == area || $0.area == "general" }
        guard !matches.isEmpty else { return base[0] }
        let dayOfYear = Calendar.current.ordinality(of: .day, in: .year, for: .now) ?? 1
        return matches[dayOfYear % matches.count]
    }
}
