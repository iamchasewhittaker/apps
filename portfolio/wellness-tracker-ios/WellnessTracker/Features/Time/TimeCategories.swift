import SwiftUI

struct TimeCategory: Identifiable, Hashable {
    let id: String
    let label: String
    let icon: String
    let color: Color
}

enum TimeCategories {
    static let all: [TimeCategory] = [
        TimeCategory(id: "kids",      label: "Kid Care",        icon: "👶", color: WellnessTheme.purple),
        TimeCategory(id: "work",      label: "Meaningful Work", icon: "💼", color: WellnessTheme.blue),
        TimeCategory(id: "house",     label: "Household",       icon: "🏠", color: WellnessTheme.warn),
        TimeCategory(id: "move",      label: "Movement",        icon: "🏃", color: WellnessTheme.accent),
        TimeCategory(id: "scripture", label: "Scripture",       icon: "📖", color: Color(red: 0.769, green: 0.384, blue: 0.176)),
        TimeCategory(id: "church",    label: "Church",          icon: "⛪", color: WellnessTheme.blue),
        TimeCategory(id: "rest",      label: "Rest",            icon: "😴", color: WellnessTheme.muted),
        TimeCategory(id: "social",    label: "Social",          icon: "🤝", color: WellnessTheme.yellow),
        TimeCategory(id: "winddown",  label: "Wind-Down",       icon: "🌙", color: WellnessTheme.purple),
        TimeCategory(id: "tv",        label: "TV / Screen",     icon: "📺", color: WellnessTheme.red),
        TimeCategory(id: "untracked", label: "Untracked",       icon: "❓", color: WellnessTheme.border),
    ]

    static func find(_ id: String) -> TimeCategory? {
        all.first { $0.id == id }
    }
}
