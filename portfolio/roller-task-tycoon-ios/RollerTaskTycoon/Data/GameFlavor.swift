import Foundation

enum GameFlavor {
    static let completeLines = [
        "A visitor just loved your park!",
        "New coaster design approved!",
        "Guest satisfaction is up!",
        "The maintenance crew got to work!",
        "Park inspector gave a thumbs up!",
        "Ride queue is getting shorter!",
        "Peep: 'This park is AMAZING!'",
    ]

    static let deleteLines = [
        "Task removed from park plans.",
        "Blueprint discarded.",
        "Maintenance request cancelled.",
    ]

    static func randomCompleteLine() -> String {
        completeLines.randomElement() ?? "Task complete!"
    }

    static func randomDeleteLine() -> String {
        deleteLines.randomElement() ?? "Removed."
    }

    struct Rating: Equatable {
        let label: String
        let emoji: String
    }

    static func rating(total: Int, done: Int) -> Rating {
        if total == 0 { return Rating(label: "--", emoji: "🎠") }
        let pct = Double(done) / Double(total)
        if pct >= 1 { return Rating(label: "Tycoon!", emoji: "🏆") }
        if pct >= 0.75 { return Rating(label: "Excellent", emoji: "⭐⭐⭐") }
        if pct >= 0.5 { return Rating(label: "Good", emoji: "⭐⭐") }
        if pct >= 0.25 { return Rating(label: "Average", emoji: "⭐") }
        return Rating(label: "Needs work", emoji: "😰")
    }

    // MARK: - Park Operations Console

    /// 0...100 score: completion base + zone-balance bonus + streak bonus − broken penalty − overdue penalty.
    static func parkRatingPercent(tasks: [ChecklistTaskItem], calendar: Calendar = .current, now: Date = Date()) -> Int {
        if tasks.isEmpty { return 72 }
        let total = tasks.count
        let closed = tasks.filter { $0.status == .closed }.count
        var score = Int(round(Double(closed) / Double(total) * 78))

        // Zone balance: +5% if every zone has at least 1 active (Open or Testing) attraction.
        let activeZones = Set(tasks.filter(\.isActive).map(\.zone))
        if activeZones.count == ParkZone.allCases.count {
            score += 5
        }

        // Streak: consecutive days closing at least one attraction, capped at +10%.
        score += ParkStreaks.ratingBonus

        let broken = tasks.filter { $0.status == .brokenDown }.count
        score -= min(24, broken * 4)
        let overdue = tasks.filter { $0.isOverdue(now: now, calendar: calendar) }.count
        score -= min(18, overdue * 3)
        return min(100, max(0, score))
    }

    /// Playful "guest count" — scales with open attractions.
    static func guestCount(tasks: [ChecklistTaskItem]) -> Int {
        let openCount = tasks.filter { $0.status == .open }.count
        return max(1, 1 + openCount)
    }

    struct ParkAlert: Identifiable, Hashable {
        let id: String
        let message: String
    }

    static func parkAlerts(tasks: [ChecklistTaskItem], ratingPercent: Int, calendar: Calendar = .current, now: Date = Date()) -> [ParkAlert] {
        var out: [ParkAlert] = []
        let broken = tasks.filter { $0.status == .brokenDown }.count
        if broken >= 2 {
            out.append(ParkAlert(id: "broken_many", message: "\(broken) attractions need maintenance"))
        } else if broken == 1 {
            out.append(ParkAlert(id: "broken_one", message: "1 ride needs maintenance"))
        }
        let overdueHigh = tasks.filter { $0.isOverdue(now: now, calendar: calendar) && $0.priority == .high }.count
        if overdueHigh > 0 {
            out.append(ParkAlert(id: "overdue_high", message: "\(overdueHigh) high-value attraction(s) overdue"))
        } else {
            let overdue = tasks.filter { $0.isOverdue(now: now, calendar: calendar) }.count
            if overdue > 0 {
                out.append(ParkAlert(id: "overdue", message: "\(overdue) attraction(s) overdue"))
            }
        }
        if ratingPercent < 45 {
            out.append(ParkAlert(id: "rating_low", message: "Park morale is dropping — check broken and overdue work"))
        }
        return out
    }

    // MARK: - Guest Thoughts (expanded rotating pool)

    private static let thoughtsGeneral = [
        "This park is improving!",
        "Nice vibe today — keep it up!",
        "I could spend all afternoon here.",
        "Really well organised for a change.",
        "Management seems on top of things.",
        "The atmosphere is great today.",
        "I'm impressed — everything is running smoothly.",
        "This feels like a five-star park.",
        "Love the energy here today.",
        "The staff look busy — in a good way!",
    ]

    private static let thoughtsBrokenMany = [
        "Too many rides are broken down!",
        "I'm not coming back until things get fixed.",
        "Half the park seems closed today.",
        "Really? Three broken rides at once?",
        "Management needs to sort this out fast.",
    ]

    private static let thoughtsBrokenOne = [
        "I heard one of the rides is down today.",
        "Hope they fix that attraction soon.",
        "Minor hiccup — happens at every park.",
    ]

    private static let thoughtsOverdue = [
        "I'm getting overwhelmed…",
        "This park feels behind schedule.",
        "Things seem to be piling up here.",
        "A few rides have been 'coming soon' for too long.",
    ]

    private static let thoughtsTesting = [
        "Lots of rides are under construction today.",
        "Half the attractions are in testing — exciting!",
        "They've got big plans, I can tell.",
    ]

    private static let thoughtsAllClear = [
        "This park is really organised!",
        "Everything looks shipshape.",
        "Not a single thing out of place — impressive.",
        "Best managed park I've visited this year.",
    ]

    private static let thoughtsEmpty = [
        "Welcome to the park! Add your first attraction.",
        "The gates are open — what's the first ride?",
    ]

    /// Returns 2 rotating thoughts based on the current park state.
    static func guestThoughts(tasks: [ChecklistTaskItem], calendar: Calendar = .current, now: Date = Date()) -> [String] {
        if tasks.isEmpty {
            return Array(thoughtsEmpty.shuffled().prefix(1))
        }

        let broken = tasks.filter { $0.status == .brokenDown }.count
        let overdue = tasks.filter { $0.isOverdue(now: now, calendar: calendar) }.count
        let testing = tasks.filter { $0.status == .testing }.count
        let open = tasks.filter { $0.status == .open }.count

        var pool: [String] = []

        if broken >= 2 {
            pool += thoughtsBrokenMany
        } else if broken == 1 {
            pool += thoughtsBrokenOne
        }

        if overdue >= 3 {
            pool += thoughtsOverdue
        }

        if testing >= 4 {
            pool += thoughtsTesting
        }

        if open == 0, testing == 0, broken == 0 {
            pool += thoughtsAllClear
        }

        pool += thoughtsGeneral

        let shuffled = Array(Set(pool)).shuffled()
        return Array(shuffled.prefix(2))
    }

    static func priorityAttractions(tasks: [ChecklistTaskItem], limit: Int = 3, calendar: Calendar = .current, now: Date = Date()) -> [ChecklistTaskItem] {
        let active = tasks.filter { $0.status != .closed }
        let sorted = active.sorted { a, b in
            if a.isOverdue(now: now, calendar: calendar) != b.isOverdue(now: now, calendar: calendar) {
                return a.isOverdue(now: now, calendar: calendar) && !b.isOverdue(now: now, calendar: calendar)
            }
            if a.priority.sortRank != b.priority.sortRank {
                return a.priority.sortRank < b.priority.sortRank
            }
            if a.status != b.status {
                if a.status == .open { return true }
                if b.status == .open { return false }
            }
            return a.createdAt > b.createdAt
        }
        return Array(sorted.prefix(limit))
    }

    static func closedTodayCount(tasks: [ChecklistTaskItem], calendar: Calendar = .current, now: Date = Date()) -> Int {
        tasks.filter { item in
            guard item.status == .closed, let closed = item.closedAt else { return false }
            return calendar.isDate(closed, inSameDayAs: now)
        }.count
    }
}
