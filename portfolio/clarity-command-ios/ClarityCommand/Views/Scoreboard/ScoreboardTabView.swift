import SwiftUI
import ClarityUI

struct ScoreboardTabView: View {
    @Environment(CommandStore.self) private var store

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                StatsRow()

                ClaritySectionLabel( "This Week")
                    .padding(.horizontal)
                WeekGridView()
                    .padding(.horizontal)

                ClaritySectionLabel( "Area Streaks")
                    .padding(.horizontal)
                AreaStreaksView()
                    .padding(.horizontal)

                ClaritySectionLabel( "Monthly View")
                    .padding(.horizontal)
                MonthCalendarView()
                    .padding(.horizontal)
            }
            .padding(.vertical)
        }
        .background(ClarityPalette.bg.ignoresSafeArea())
        .navigationTitle("Scoreboard")
        .toolbarColorScheme(.dark, for: .navigationBar)
    }
}
