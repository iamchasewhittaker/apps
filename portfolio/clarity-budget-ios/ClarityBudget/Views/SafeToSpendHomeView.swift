import SwiftUI
import ClarityUI

@MainActor
struct SafeToSpendHomeView: View {
    @Environment(BudgetStore.self) private var store
    @State private var showYNABSheet = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {
                header

                if let snap = store.ynabDashboardCache.snapshot {
                    metricsGrid(snap)
                    if snap.obligationsShortfall > 0.01 {
                        shortfallStrip(snap.obligationsShortfall)
                    }
                } else if store.isRefreshingYNABSnapshot {
                    ProgressView("Syncing with YNAB…")
                        .tint(ClarityPalette.accent)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 32)
                } else {
                    emptyConnect
                }

                if let err = store.ynabDashboardCache.lastError, !err.isEmpty {
                    Text(err)
                        .font(.footnote)
                        .foregroundStyle(ClarityPalette.danger)
                        .padding(12)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(ClarityPalette.surface)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }

                if let t = store.ynabDashboardCache.fetchedAt {
                    Text("Updated \(t.formatted(date: .abbreviated, time: .shortened))")
                        .font(.caption)
                        .foregroundStyle(ClarityPalette.muted)
                }
            }
            .padding(20)
        }
        .scrollIndicators(.hidden)
        .background(ClarityPalette.bg)
        .navigationTitle("Today")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    showYNABSheet = true
                } label: {
                    Image(systemName: "link.circle.fill")
                }
                .accessibilityLabel("Quick YNAB settings")
            }
        }
        .sheet(isPresented: $showYNABSheet) {
            BudgetYNABSettingsView(isPresented: $showYNABSheet)
        }
        .refreshable {
            await store.refreshYNABSnapshot()
        }
        .task {
            await store.refreshYNABSnapshot()
        }
    }

    private var header: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Safe to spend")
                .font(.title2.weight(.semibold))
                .foregroundStyle(ClarityPalette.text)
            Text("From your YNAB categories and Ready to Assign, after bills and essentials.")
                .font(.subheadline)
                .foregroundStyle(ClarityPalette.muted)
        }
    }

    private func metricsGrid(_ snap: YNABDashboardSnapshot) -> some View {
        VStack(spacing: 12) {
            heroCard(
                title: "This month",
                subtitle: "Full pool",
                amount: snap.safeMonthly,
                accent: ClarityPalette.safe
            )
            HStack(spacing: 12) {
                compactCard(
                    title: "This week",
                    amount: snap.safeWeek,
                    caption: "~7 days at today’s pace"
                )
                compactCard(
                    title: "Today",
                    amount: snap.safeToday,
                    caption: "Per day left in month"
                )
            }
        }
    }

    private func heroCard(title: String, subtitle: String, amount: Double, accent: Color) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title.uppercased())
                .font(.caption.weight(.semibold))
                .foregroundStyle(ClarityPalette.muted)
            Text(subtitle)
                .font(.subheadline)
                .foregroundStyle(ClarityPalette.muted)
            Text(BudgetMoneyFormat.string(fromDollars: amount))
                .font(.system(size: 40, weight: .bold, design: .rounded))
                .foregroundStyle(accent)
                .minimumScaleFactor(0.5)
                .lineLimit(1)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 20)
                .fill(ClarityPalette.surface)
                .overlay(
                    RoundedRectangle(cornerRadius: 20)
                        .stroke(ClarityPalette.border, lineWidth: 1)
                )
        )
    }

    private func compactCard(title: String, amount: Double, caption: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title.uppercased())
                .font(.caption2.weight(.semibold))
                .foregroundStyle(ClarityPalette.muted)
            Text(BudgetMoneyFormat.string(fromDollars: amount))
                .font(.title3.weight(.bold))
                .foregroundStyle(ClarityPalette.text)
                .minimumScaleFactor(0.6)
                .lineLimit(1)
            Text(caption)
                .font(.caption2)
                .foregroundStyle(ClarityPalette.muted)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(ClarityPalette.surface)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(ClarityPalette.border, lineWidth: 1)
                )
        )
    }

    private func shortfallStrip(_ shortfall: Double) -> some View {
        HStack {
            Image(systemName: "exclamationmark.triangle.fill")
                .foregroundStyle(ClarityPalette.caution)
            VStack(alignment: .leading, spacing: 2) {
                Text("Obligations gap")
                    .font(.subheadline.weight(.semibold))
                Text("About \(BudgetMoneyFormat.string(fromDollars: shortfall)) still needed for mortgage, bills, and essentials this month.")
                    .font(.caption)
                    .foregroundStyle(ClarityPalette.muted)
            }
        }
        .padding(14)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 14)
                .fill(ClarityPalette.surface)
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(ClarityPalette.caution.opacity(0.35), lineWidth: 1)
                )
        )
    }

    private var emptyConnect: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Connect YNAB to see live safe-to-spend.")
                .font(.body.weight(.medium))
            Text("Add a personal access token and pick a budget on the Settings tab, or open quick settings here.")
                .font(.footnote)
                .foregroundStyle(ClarityPalette.muted)
            Button {
                showYNABSheet = true
            } label: {
                Text("Open YNAB settings")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
            }
            .buttonStyle(.borderedProminent)
            .tint(ClarityPalette.accent)
        }
        .padding(20)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 18)
                .fill(ClarityPalette.surface)
                .overlay(
                    RoundedRectangle(cornerRadius: 18)
                        .stroke(ClarityPalette.border, lineWidth: 1)
                )
        )
    }
}
