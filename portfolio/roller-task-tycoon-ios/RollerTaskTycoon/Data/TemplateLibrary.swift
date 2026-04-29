import Foundation

struct AttractionTemplate: Identifiable {
    let id = UUID()
    let text: String
    let zone: ParkZone
    let staffRole: StaffRole
    let priority: TaskPriority
    let rewardDollars: Int
    let details: String

    func makeItem() -> ChecklistTaskItem {
        let item = ChecklistTaskItem(text: text)
        item.zone = zone
        item.staffRole = staffRole
        item.priority = priority
        item.rewardDollars = rewardDollars
        item.details = details
        return item
    }
}

enum TemplateLibrary {
    static let all: [AttractionTemplate] = home + career + family + growth + health + errands

    static let home: [AttractionTemplate] = [
        AttractionTemplate(text: "Deep clean kitchen", zone: .home, staffRole: .janitor, priority: .medium, rewardDollars: 8, details: "Counters, stovetop, sink, and microwave."),
        AttractionTemplate(text: "Mow the lawn", zone: .home, staffRole: .mechanic, priority: .medium, rewardDollars: 10, details: "Front and back yard. Edge the sidewalk."),
        AttractionTemplate(text: "Laundry cycle", zone: .home, staffRole: .janitor, priority: .low, rewardDollars: 5, details: "Wash, dry, fold, and put away."),
        AttractionTemplate(text: "Fix dripping faucet", zone: .home, staffRole: .mechanic, priority: .high, rewardDollars: 15, details: "Replace washer or cartridge."),
    ]

    static let career: [AttractionTemplate] = [
        AttractionTemplate(text: "Update resume", zone: .career, staffRole: .operatorRole, priority: .high, rewardDollars: 20, details: "Tailor for target role. Check dates and metrics."),
        AttractionTemplate(text: "Send follow-up email", zone: .career, staffRole: .entertainer, priority: .high, rewardDollars: 10, details: "Thank you or status check after interview."),
        AttractionTemplate(text: "Research target company", zone: .career, staffRole: .operatorRole, priority: .medium, rewardDollars: 12, details: "Product, team, recent news, values."),
        AttractionTemplate(text: "Practice interview answers", zone: .career, staffRole: .operatorRole, priority: .medium, rewardDollars: 10, details: "STAR format: situation, task, action, result."),
    ]

    static let family: [AttractionTemplate] = [
        AttractionTemplate(text: "Family dinner — no screens", zone: .family, staffRole: .entertainer, priority: .high, rewardDollars: 15, details: "Sit together, talk about the day."),
        AttractionTemplate(text: "Read with the kids", zone: .family, staffRole: .entertainer, priority: .medium, rewardDollars: 8, details: "30 minutes. Let them pick the book."),
        AttractionTemplate(text: "Date night plan", zone: .family, staffRole: .entertainer, priority: .medium, rewardDollars: 20, details: "Pick activity, arrange childcare, confirm."),
        AttractionTemplate(text: "Call a parent or sibling", zone: .family, staffRole: .entertainer, priority: .low, rewardDollars: 5, details: "Check in, no agenda."),
    ]

    static let growth: [AttractionTemplate] = [
        AttractionTemplate(text: "Read for 20 minutes", zone: .growth, staffRole: .operatorRole, priority: .low, rewardDollars: 5, details: "Non-fiction or scripture."),
        AttractionTemplate(text: "Scripture study", zone: .growth, staffRole: .operatorRole, priority: .high, rewardDollars: 8, details: "Read, mark, ponder one passage."),
        AttractionTemplate(text: "Write in journal", zone: .growth, staffRole: .operatorRole, priority: .medium, rewardDollars: 6, details: "Gratitude, what I learned, what I'll do differently."),
        AttractionTemplate(text: "Learn one new skill", zone: .growth, staffRole: .operatorRole, priority: .medium, rewardDollars: 15, details: "Pick a tutorial, complete one full session."),
    ]

    static let health: [AttractionTemplate] = [
        AttractionTemplate(text: "30-minute walk", zone: .health, staffRole: .mechanic, priority: .medium, rewardDollars: 8, details: "Outside. No phone — just walk."),
        AttractionTemplate(text: "Drink 8 glasses of water", zone: .health, staffRole: .janitor, priority: .low, rewardDollars: 4, details: "Track throughout the day."),
        AttractionTemplate(text: "Prep healthy lunches for the week", zone: .health, staffRole: .janitor, priority: .medium, rewardDollars: 12, details: "Batch cook, portion, refrigerate."),
        AttractionTemplate(text: "Schedule doctor appointment", zone: .health, staffRole: .mechanic, priority: .high, rewardDollars: 10, details: "Annual physical or specific concern."),
    ]

    static let errands: [AttractionTemplate] = [
        AttractionTemplate(text: "Grocery run", zone: .errands, staffRole: .janitor, priority: .medium, rewardDollars: 8, details: "Check pantry first. Bring the list."),
        AttractionTemplate(text: "Pay bills", zone: .errands, staffRole: .mechanic, priority: .high, rewardDollars: 10, details: "Utilities, subscriptions, any overdue."),
        AttractionTemplate(text: "Car maintenance check", zone: .errands, staffRole: .mechanic, priority: .medium, rewardDollars: 12, details: "Oil, tire pressure, wiper fluid."),
        AttractionTemplate(text: "Post office drop-off", zone: .errands, staffRole: .janitor, priority: .low, rewardDollars: 4, details: "Package returns, letters, renewal forms."),
    ]
}
