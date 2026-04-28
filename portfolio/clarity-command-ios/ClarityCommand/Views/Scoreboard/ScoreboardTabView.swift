import SwiftUI
import ClarityUI

struct ScoreboardTabView: View {
    @Environment(CommandStore.self) private var store

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                StatsRow()

                if store.jobSearchDaily != nil || store.wellnessDaily != nil {
                    ClaritySectionLabel("Live App Data")
                        .padding(.horizontal)
                    LiveAppDataView(jobSearch: store.jobSearchDaily, wellness: store.wellnessDaily)
                        .padding(.horizontal)
                }

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
