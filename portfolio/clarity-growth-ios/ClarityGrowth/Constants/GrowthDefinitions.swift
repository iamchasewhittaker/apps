import Foundation

/// One of seven growth areas (legacy Growth Tracker / Wellness Growth tab).
struct GrowthAreaModel: Identifiable, Equatable {
    let id: String
    let icon: String
    let name: String
    let tag: String
    let milestones: [String]
}

enum GrowthCatalog {
    /// Same ids as Wellness `GrowthTab.jsx` (`gmat`, `job`, …).
    static let areas: [GrowthAreaModel] = [
        GrowthAreaModel(
            id: "gmat",
            icon: "📐",
            name: "GMAT prep",
            tag: "Test prep",
            milestones: [
                "Quant practice", "Verbal practice", "Data insights section", "Full practice test",
                "Error log reviewed", "New concept mastered", "OG problems done",
            ]
        ),
        GrowthAreaModel(
            id: "job",
            icon: "💼",
            name: "Job search",
            tag: "Career",
            milestones: [
                "Application submitted", "Networking outreach", "Phone / video interview", "Interview prep",
                "LinkedIn updated", "Referral conversation", "Company / role researched",
            ]
        ),
        GrowthAreaModel(
            id: "ai",
            icon: "🤖",
            name: "AI learning",
            tag: "Learning",
            milestones: [
                "Course lesson done", "Built something", "Read article / paper", "Watched tutorial",
                "Applied to a project", "Shared a learning",
            ]
        ),
        GrowthAreaModel(
            id: "pm",
            icon: "📋",
            name: "Project mgmt (PMP)",
            tag: "Learning",
            milestones: [
                "Course lesson done", "Case study reviewed", "Framework practiced", "Quiz or assessment",
                "Notes reviewed", "Applied to real scenario",
            ]
        ),
        GrowthAreaModel(
            id: "claude",
            icon: "⚡",
            name: "Learning Claude",
            tag: "AI / Tools",
            milestones: [
                "Prompt engineering practiced", "Built or improved an artifact", "Learned a new capability",
                "Read docs / release notes", "Used Claude in a real workflow", "Explored a new use case",
            ]
        ),
        GrowthAreaModel(
            id: "bom",
            icon: "📖",
            name: "Book of Mormon",
            tag: "Scripture",
            milestones: [
                "Read at least one verse", "Read a full chapter", "Read multiple chapters", "Pondered / journaled",
                "Marked a meaningful passage", "Prayed about what I read",
            ]
        ),
        GrowthAreaModel(
            id: "cfm",
            icon: "🙏",
            name: "Come Follow Me",
            tag: "Scripture",
            milestones: [
                "Read this week's lesson", "Read companion scriptures", "Pondered / journaled", "Family study done",
                "Personal prayer after", "Shared insight with family",
            ]
        ),
    ]

    static func area(id: String) -> GrowthAreaModel? {
        areas.first { $0.id == id }
    }

    static let backgroundOptions: [(id: String, label: String)] = [
        ("quiet", "🤫 Quiet"),
        ("music", "🎵 Music"),
        ("endel", "🌿 Endel"),
        ("podcast", "🎙 Podcast"),
        ("youtube", "▶️ YouTube"),
        ("other", "🔊 Other"),
    ]
}
