import SwiftUI
import ClarityUI

struct ContentView: View {
    @Environment(CheckinStore.self) private var store

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: ClarityMetrics.cardSpacing) {
                    // Daily quote
                    if let quote = checkinQuotes.todaysQuote {
                        QuoteBanner(quote: quote)
                    }

                    // Today status card
                    TodayStatusCard()

                    // Past days
                    PastDaysSection()
                }
                .padding(ClarityMetrics.pagePadding)
            }
            .background(ClarityPalette.bg.ignoresSafeArea())
            .navigationTitle("Check-in")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    HStack(spacing: 16) {
                        Button {
                            store.isShowingPulseCheck = true
                        } label: {
                            Label("Pulse", systemImage: "heart.fill")
                                .foregroundStyle(ClarityPalette.caution)
                        }
                        .accessibilityLabel("Log pulse mood")
                        .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)

                        Button {
                            store.isShowingMedsEditor = true
                        } label: {
                            Label("Meds", systemImage: "pills.fill")
                                .foregroundStyle(ClarityPalette.accent)
                        }
                        .accessibilityLabel("Edit medications")
                        .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                    }
                }
            }
        }
        .sheet(isPresented: Bindable(store).isShowingPulseCheck) {
            PulseCheckView()
        }
        .sheet(isPresented: Bindable(store).isShowingMedsEditor) {
            MedsEditorView()
        }
        .preferredColorScheme(.dark)
    }
}
