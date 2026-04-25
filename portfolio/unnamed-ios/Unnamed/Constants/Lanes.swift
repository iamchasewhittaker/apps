import SwiftUI

extension Lane: Identifiable {
    var id: Self { self }
}

extension Lane {
    var summary: String {
        switch self {
        case .regulation: "Your body and brain. Anything that keeps you regulated."
        case .maintenance: "The house and small stuff that keeps life from rotting."
        case .support: "Showing up for the people in your circle."
        case .future: "Building tomorrow. Job search, learning, projects."
        case .inbox: ""
        }
    }

    var examples: [String] {
        switch self {
        case .regulation: ["Sleep, naps, rest", "Eating, hydration, meds", "Walks, exercise, movement", "Decompression, breathing, alone time", "Therapy or doctor appts"]
        case .maintenance: ["Dishes, laundry, trash", "Cleaning, tidying, organizing", "Errands, bills, paperwork", "Car, yard, repairs", "Groceries"]
        case .support: ["Time with Reese, Buzz, or Kassie", "Helping family or friends", "Church and ministering", "Texts, calls, visits", "School and family events"]
        case .future: ["Job apps and interview prep", "GMAT and studying", "Portfolio apps, building", "Reading, courses, learning", "Planning, journaling"]
        case .inbox: []
        }
    }

    var rule: String {
        switch self {
        case .regulation: "If I skip this, my whole day falls apart."
        case .maintenance: "It's boring and it has to happen."
        case .support: "Someone else is the point of this."
        case .future: "This makes my future bigger."
        case .inbox: ""
        }
    }
}

extension Lane {
    var label: String {
        switch self {
        case .regulation: "Regulation"
        case .maintenance: "Maintenance"
        case .support: "Support Others"
        case .future: "Future"
        case .inbox: "Inbox"
        }
    }

    var laneDescription: String {
        switch self {
        case .regulation: "Sleep, food, water, meds, walks, rest"
        case .maintenance: "Dishes, laundry, cleaning, errands"
        case .support: "Kids, wife, church, family"
        case .future: "Job search, GMAT, building, planning"
        case .inbox: ""
        }
    }

    var color: Color {
        switch self {
        case .regulation: Color(hex: "#0ea5e9")
        case .maintenance: Color(hex: "#10b981")
        case .support: Color(hex: "#8b5cf6")
        case .future: Color(hex: "#f59e0b")
        case .inbox: Color(.systemGray)
        }
    }
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3:
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6:
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8:
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
