import Foundation

/// Mirrors web `DAILY_BLOCKS` in [`job-search-hq/src/constants.js`](../../../job-search-hq/src/constants.js) — v1 read-only in Focus tab.
struct DailyFocusBlock: Identifiable, Sendable {
    let id: String
    let emoji: String
    let title: String
    let time: String
    let tag: String
    let tagColorHex: String
    let steps: [String]
    let adhd: String
}

enum DailyFocusBlocks {
    static let all: [DailyFocusBlock] = [
        DailyFocusBlock(
            id: "research",
            emoji: "🔍",
            title: "Research block",
            time: "20 min",
            tag: "Any role",
            tagColorHex: "#3b82f6",
            steps: [
                "Pick 1 company from your pipeline (status: Interested)",
                "Read their careers page + 1 LinkedIn post about them (5 min)",
                "Write 2 sentences: \"I want to work here because ___. My relevant experience is ___\"",
                "Update the pipeline card's Next Step field",
            ],
            adhd: "Open the Pipeline tab first. Find one company. Close everything else."
        ),
        DailyFocusBlock(
            id: "apply",
            emoji: "📝",
            title: "Application block",
            time: "30–45 min",
            tag: "High impact",
            tagColorHex: "#10b981",
            steps: [
                "Open a job posting you've already researched",
                "Tailor resume using web Job Search HQ → AI Tools (on desktop)",
                "Apply on their careers page or LinkedIn Easy Apply",
                "Add to Pipeline immediately — set follow-up date to +7 days",
            ],
            adhd: "Set a timer for 45 min. One application only. Done is better than perfect."
        ),
        DailyFocusBlock(
            id: "network",
            emoji: "🤝",
            title: "Networking block",
            time: "15–20 min",
            tag: "Highest ROI",
            tagColorHex: "#8b5cf6",
            steps: [
                "Search LinkedIn for 1 person at a target company",
                "Draft a connection note (web AI Tools when needed)",
                "Send the connection request",
                "Log or update the contact in the Contacts tab",
            ],
            adhd: "One person. One message. Log the contact before you close the app."
        ),
    ]
}
