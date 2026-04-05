import SwiftUI

struct StaffPanelView: View {
    var tasks: [ChecklistTaskItem]
    var readableFonts: Bool

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 12) {
                    Text("Choose a mode — staff cards surface the next assignment for each role.")
                        .font(ParkTheme.bodyFont(readable: readableFonts))
                        .foregroundStyle(ParkTheme.ink.opacity(0.85))
                        .padding(.horizontal, 14)

                    ForEach(StaffRole.allCases) { role in
                        staffCard(role)
                    }
                    .padding(.horizontal, 14)
                    .padding(.bottom, 16)
                }
                .padding(.top, 12)
            }
            .background(ParkTheme.parkBackground.ignoresSafeArea())
            .navigationTitle("Staff")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(ParkTheme.woodLight.opacity(0.95), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.light, for: .navigationBar)
        }
    }

    private func staffCard(_ role: StaffRole) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("\(role.emoji) \(role.displayTitle)")
                .font(ParkTheme.titleFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
            Text(role.tagline)
                .font(ParkTheme.captionFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink.opacity(0.75))
            Text("Status: \(roleStatus(role))")
                .font(ParkTheme.bodyFont(readable: readableFonts).weight(.semibold))
                .foregroundStyle(ParkTheme.ink)
            Text("Assigned: \(assignedTitle(role))")
                .font(ParkTheme.bodyFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
        }
        .parkPanel(readable: readableFonts)
    }

    private func pool(for role: StaffRole) -> [ChecklistTaskItem] {
        tasks.filter { $0.staffRole == role && $0.status != .closed }
    }

    private func assignedTitle(_ role: StaffRole) -> String {
        let sorted = pool(for: role).sorted { a, b in
            if a.isOverdue() != b.isOverdue() { return a.isOverdue() && !b.isOverdue() }
            if a.priority.sortRank != b.priority.sortRank { return a.priority.sortRank < b.priority.sortRank }
            if a.status != b.status {
                if a.status == .open { return true }
                if b.status == .open { return false }
            }
            return a.createdAt > b.createdAt
        }
        return sorted.first?.text ?? "—"
    }

    private func roleStatus(_ role: StaffRole) -> String {
        let p = pool(for: role)
        if p.isEmpty { return "Idle" }
        if p.contains(where: { $0.isOverdue() && $0.priority == .high }) { return "Urgent" }
        if p.contains(where: { $0.status == .testing }) { return "Active" }
        return "Needed"
    }
}

struct FinancesView: View {
    var tasks: [ChecklistTaskItem]
    var ledger: [ProfitLedgerEntry]
    var readableFonts: Bool

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 14) {
                    financeBlock("Today’s profit", "$\(ParkFinance.profitToday(entries: ledger))")
                    financeBlock("Weekly profit", "$\(ParkFinance.profitThisWeek(entries: ledger))")

                    VStack(alignment: .leading, spacing: 8) {
                        Text("Top earning attractions")
                            .font(ParkTheme.titleFont(readable: readableFonts))
                            .foregroundStyle(ParkTheme.ink)
                        let top = ParkFinance.topEarners(entries: ledger, tasks: tasks, limit: 8)
                        if top.isEmpty {
                            Text("Close attractions to see earnings here.")
                                .font(ParkTheme.bodyFont(readable: readableFonts))
                                .foregroundStyle(ParkTheme.ink.opacity(0.75))
                        } else {
                            ForEach(Array(top.enumerated()), id: \.offset) { _, row in
                                HStack {
                                    Text(row.title)
                                        .font(ParkTheme.bodyFont(readable: readableFonts))
                                        .foregroundStyle(ParkTheme.ink)
                                    Spacer()
                                    Text("$\(row.amount)")
                                        .font(ParkTheme.bodyFont(readable: readableFonts).weight(.bold))
                                        .foregroundStyle(ParkTheme.gold)
                                        .monospacedDigit()
                                }
                            }
                        }
                    }
                    .parkPanel(readable: readableFonts)

                    VStack(alignment: .leading, spacing: 6) {
                        Text("Ideas for later")
                            .font(ParkTheme.titleFont(readable: readableFonts))
                            .foregroundStyle(ParkTheme.ink.opacity(0.8))
                        Text("Spending leaks (avoided work as maintenance cost) aren’t tracked in v1 — see product docs.")
                            .font(ParkTheme.captionFont(readable: readableFonts))
                            .foregroundStyle(ParkTheme.ink.opacity(0.75))
                    }
                    .parkPanel(readable: readableFonts)
                }
                .padding(14)
            }
            .background(ParkTheme.parkBackground.ignoresSafeArea())
            .navigationTitle("Finances")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(ParkTheme.woodLight.opacity(0.95), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.light, for: .navigationBar)
        }
    }

    private func financeBlock(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(ParkTheme.titleFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
            Text(value)
                .font(ParkTheme.displayFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.gold)
                .monospacedDigit()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .parkPanel(readable: readableFonts)
    }
}

struct ParkMapZonesView: View {
    var tasks: [ChecklistTaskItem]
    @Binding var selectedTab: Int
    @Binding var attractionsZoneFilter: ParkZone?
    var readableFonts: Bool

    var body: some View {
        NavigationStack {
            List {
                ForEach(ParkZone.allCases) { zone in
                    Button {
                        attractionsZoneFilter = zone
                        selectedTab = 1
                    } label: {
                        HStack {
                            Text("\(zone.emoji) \(zone.displayTitle)")
                                .font(ParkTheme.bodyFont(readable: readableFonts).weight(.semibold))
                                .foregroundStyle(ParkTheme.ink)
                            Spacer()
                            Text("\(tasks.filter { $0.zone == zone && $0.status != .closed }.count) open")
                                .font(ParkTheme.captionFont(readable: readableFonts))
                                .foregroundStyle(ParkTheme.ink.opacity(0.75))
                        }
                    }
                }
            }
            .listStyle(.plain)
            .scrollContentBackground(.hidden)
            .background(ParkTheme.parkBackground.ignoresSafeArea())
            .navigationTitle("Park zones")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(ParkTheme.woodLight.opacity(0.95), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.light, for: .navigationBar)
        }
    }
}
