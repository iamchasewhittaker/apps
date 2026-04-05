import Foundation

enum GameFlavor {
    static let completeLines = [
        "A visitor just loved your park!",
        "New coaster design approved!",
        "Guest satisfaction is up!",
        "The maintenance crew got to work!",
        "Park inspector gave a thumbs up!",
        "Ride queue is getting shorter!",
        "Peep: ‘This park is AMAZING!’",
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
}
