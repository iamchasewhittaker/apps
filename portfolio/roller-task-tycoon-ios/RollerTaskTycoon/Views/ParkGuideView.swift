import SwiftUI

struct ParkGuideView: View {
    var readableFonts: Bool
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    guideSection(
                        title: "What is this app?",
                        body: "RollerTask Tycoon turns your real-life tasks into park attractions. You are the park manager. Your to-do list is your park. Completing tasks earns profit. Keeping things running earns a high park rating."
                    )

                    guideSection(
                        title: "🎢 Attraction statuses",
                        rows: [
                            ("🟢 Open", "Ready to start. This attraction is on the schedule — it just hasn't begun yet."),
                            ("🟡 Testing", "In progress. You're actively working on this right now. Try to keep this list short (2–3 max)."),
                            ("🔴 Broken Down", "Blocked. Not failed — just stuck. Use this when something is waiting on someone else or you hit a wall."),
                            ("⚫ Closed", "Done. The attraction ran its course and earned its reward. Profit goes up, rating improves."),
                        ]
                    )

                    guideSection(
                        title: "🏠 Zones (life areas)",
                        rows: [
                            ("🏠 Home", "Household tasks — cleaning, laundry, repairs, groceries."),
                            ("💼 Career", "Work tasks — applications, projects, deadlines, admin."),
                            ("❤️ Family", "Family commitments — appointments, events, calls."),
                            ("🧠 Growth", "Personal development — learning, reading, side projects."),
                            ("💪 Health", "Physical and mental wellbeing — workouts, appointments, rest."),
                            ("🛒 Errands", "One-off tasks that don't fit anywhere else."),
                        ]
                    )

                    guideSection(
                        title: "🧍 Staff roles (work modes)",
                        rows: [
                            ("🎢 Operator", "Deep work — focus sessions, complex projects, creative work."),
                            ("🧹 Janitor", "Quick chores — anything that takes under 15 minutes."),
                            ("🔧 Mechanic", "Fixes and admin — email, paperwork, troubleshooting."),
                            ("🎤 Entertainer", "Social and family — calls, events, things with other people."),
                        ]
                    )

                    guideSection(
                        title: "⭐ Park rating",
                        body: "Your park rating (0–100%) reflects how well-managed your life park is. Closing attractions raises it. Broken Down and overdue attractions lower it. Aim for 70%+ to keep the guests happy."
                    )

                    guideSection(
                        title: "💰 Profit",
                        body: "Every attraction has a reward value in dollars. When you close an attraction, that amount is added to today's profit. Check the Finances tab for your daily and weekly totals."
                    )

                    guideSection(
                        title: "Best use tips",
                        rows: [
                            ("Keep Testing short", "No more than 2–3 attractions in Testing at once. If everything is Testing, nothing is really in progress."),
                            ("Broken Down ≠ failure", "Use Broken Down honestly for things that are genuinely stuck. It helps you see what's blocked at a glance."),
                            ("Reward honestly", "Set rewards based on effort — $5 for quick tasks, $25+ for major ones. The number makes completion feel tangible."),
                            ("Use zones to focus", "Filter by zone when you're in a specific mode — Career zone in work hours, Home zone on weekends."),
                            ("Check the dashboard first", "Open Overview each morning to see your Priority Attractions and Alerts before diving in."),
                        ]
                    )
                }
                .padding(16)
            }
            .background(ParkTheme.parkBackground.ignoresSafeArea())
            .navigationTitle("Park Guide")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(ParkTheme.woodLight.opacity(0.95), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.light, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }

    private func guideSection(title: String, body: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(ParkTheme.titleFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
            Text(body)
                .font(ParkTheme.bodyFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
        }
        .parkPanel(readable: readableFonts)
    }

    private func guideSection(title: String, rows: [(String, String)]) -> some View {
        VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(ParkTheme.titleFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
            ForEach(rows, id: \.0) { label, detail in
                VStack(alignment: .leading, spacing: 3) {
                    Text(label)
                        .font(ParkTheme.bodyFont(readable: readableFonts).weight(.semibold))
                        .foregroundStyle(ParkTheme.ink)
                    Text(detail)
                        .font(ParkTheme.captionFont(readable: readableFonts))
                        .foregroundStyle(ParkTheme.ink.opacity(0.8))
                }
            }
        }
        .parkPanel(readable: readableFonts)
    }
}
