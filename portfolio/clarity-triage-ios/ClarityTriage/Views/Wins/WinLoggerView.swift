import SwiftUI
import ClarityUI

@MainActor
struct WinLoggerView: View {
    @Environment(TriageStore.self) private var store
    @State private var showAddWin: Bool = false

    var body: some View {
        ScrollView {
            VStack(spacing: ClarityMetrics.cardSpacing) {
                winCategoryLegend
                todayWinsCard
            }
            .padding(ClarityMetrics.pagePadding)
        }
        .background(ClarityPalette.bg.ignoresSafeArea())
        .navigationTitle("Wins")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    showAddWin = true
                } label: {
                    Label("Log Win", systemImage: "plus")
                }
                .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
            }
        }
        .sheet(isPresented: $showAddWin) {
            AddWinView()
        }
    }

    private var winCategoryLegend: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Win Categories")
                .font(ClarityTypography.title)
            FlowLayout(spacing: 8) {
                ForEach(TriageConfig.winCategories, id: \.self) { value in
                    Text(TriageConfig.winCategoryLabels[value] ?? value)
                        .font(ClarityTypography.caption)
                        .foregroundStyle(ClarityPalette.text)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(ClarityPalette.surface)
                        .clipShape(Capsule())
                        .overlay(
                            Capsule()
                                .stroke(ClarityPalette.border, lineWidth: ClarityMetrics.borderWidth)
                        )
                }
            }
        }
        .clarityCard()
    }

    private var todayWinsCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Today's Wins")
                .font(ClarityTypography.title)
            if store.todaysWins.isEmpty {
                Text("No wins logged yet today.")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
            } else {
                ForEach(store.todaysWins) { win in
                    HStack(alignment: .top, spacing: 10) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(TriageConfig.winCategoryLabels[win.category] ?? win.category)
                                .font(ClarityTypography.headline)
                            if !win.note.isEmpty {
                                Text(win.note)
                                    .font(ClarityTypography.caption)
                                    .foregroundStyle(ClarityPalette.muted)
                            }
                        }
                        Spacer()
                        Button(role: .destructive) {
                            store.deleteWin(win.id)
                        } label: {
                            Image(systemName: "trash")
                        }
                        .buttonStyle(.plain)
                        .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                    }
                    .padding(.vertical, 4)
                }
            }
        }
        .clarityCard()
    }
}
