import SwiftUI

struct OverviewConsoleView: View {
    var tasks: [ChecklistTaskItem]
    var ledger: [ProfitLedgerEntry]
    @Binding var selectedTab: Int
    @Binding var attractionsStatusFocus: AttractionStatus?
    @Binding var attractionsZoneFilter: ParkZone?
    var readableFonts: Bool
    var onAddAttraction: () -> Void
    var onSettings: () -> Void

    @State private var showGuide = false
    @State private var visibleThoughts: [String] = []
    @State private var thoughtTimer: Timer?

    private var ratingPct: Int {
        GameFlavor.parkRatingPercent(tasks: tasks)
    }

    private var profitToday: Int {
        ParkFinance.profitToday(entries: ledger)
    }

    private var alerts: [GameFlavor.ParkAlert] {
        GameFlavor.parkAlerts(tasks: tasks, ratingPercent: ratingPct)
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 10) {
                headerMetrics
                parkStatusCard
                guestThoughtBanner
                HStack(alignment: .top, spacing: 10) {
                    priorityCard
                    alertsCard
                }
                quickActions
                Spacer(minLength: 0)
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(ParkTheme.parkBackground.ignoresSafeArea())
            .navigationTitle("Park Operations")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(ParkTheme.woodLight.opacity(0.95), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.light, for: .navigationBar)
            .toolbar {
                ToolbarItemGroup(placement: .topBarTrailing) {
                    Button { showGuide = true } label: {
                        Image(systemName: "book.closed").foregroundStyle(ParkTheme.ink)
                    }
                    .accessibilityLabel("Park guide")
                    Button { onSettings() } label: {
                        Image(systemName: "gearshape").foregroundStyle(ParkTheme.ink)
                    }
                    .accessibilityLabel("Settings")
                }
            }
            .sheet(isPresented: $showGuide) {
                ParkGuideView(readableFonts: readableFonts)
            }
            .onAppear { startThoughtRotation() }
            .onDisappear { thoughtTimer?.invalidate(); thoughtTimer = nil }
        }
    }

    // MARK: - Header

    private var headerMetrics: some View {
        HStack(spacing: 10) {
            metricChip(title: "Rating", value: "\(ratingPct)%", emoji: "⭐")
            metricChip(title: "Profit", value: "$\(profitToday)", emoji: "💰")
            metricChip(title: "Guests", value: "\(GameFlavor.guestCount(tasks: tasks))", emoji: "🧍")
            metricChip(title: "Alerts", value: "\(alerts.count)", emoji: "🔔")
        }
        .font(ParkTheme.captionFont(readable: readableFonts).weight(.semibold))
        .parkPanel(readable: readableFonts)
    }

    private func metricChip(title: String, value: String, emoji: String) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text("\(emoji) \(title)")
                .foregroundStyle(ParkTheme.ink.opacity(0.75))
            Text(value)
                .foregroundStyle(ParkTheme.ink)
                .monospacedDigit()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    // MARK: - Park Status

    private var parkStatusCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Park status")
                .font(ParkTheme.titleFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
            Text("Park rating: \(ratingPct)%")
                .font(ParkTheme.bodyFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
            HStack {
                statPill("Open", tasks.filter { $0.status == .open }.count)
                statPill("Testing", tasks.filter { $0.status == .testing }.count)
                statPill("Broken", tasks.filter { $0.status == .brokenDown }.count)
            }
            Text("Closed today: \(GameFlavor.closedTodayCount(tasks: tasks))")
                .font(ParkTheme.bodyFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
            Text("Active (Open + Testing): \(tasks.filter(\.isActive).count)")
                .font(ParkTheme.captionFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink.opacity(0.8))
        }
        .parkPanel(readable: readableFonts)
    }

    private func statPill(_ label: String, _ value: Int) -> some View {
        VStack(spacing: 2) {
            Text("\(value)")
                .font(ParkTheme.bodyFont(readable: readableFonts).weight(.bold))
            Text(label)
                .font(ParkTheme.captionFont(readable: readableFonts))
        }
        .foregroundStyle(ParkTheme.ink)
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(ParkTheme.plaque.opacity(0.65))
        .clipShape(RoundedRectangle(cornerRadius: 8))
        .overlay(RoundedRectangle(cornerRadius: 8).stroke(ParkTheme.wood.opacity(0.35), lineWidth: 1))
    }

    // MARK: - Guest Thoughts (rotating banner)

    private var guestThoughtBanner: some View {
        Text(visibleThoughts.first.map { "\u{201C}\($0)\u{201D}" } ?? "")
            .font(ParkTheme.bodyFont(readable: readableFonts).italic())
            .foregroundStyle(ParkTheme.ink.opacity(0.85))
            .multilineTextAlignment(.center)
            .lineLimit(2)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 8)
            .padding(.horizontal, 12)
            .background(ParkTheme.plaque.opacity(0.6))
            .clipShape(RoundedRectangle(cornerRadius: 8))
    }

    private func startThoughtRotation() {
        visibleThoughts = GameFlavor.guestThoughts(tasks: tasks)
        thoughtTimer?.invalidate()
        thoughtTimer = Timer.scheduledTimer(withTimeInterval: 10, repeats: true) { _ in
            withAnimation(.easeInOut(duration: 0.4)) {
                visibleThoughts = GameFlavor.guestThoughts(tasks: tasks)
            }
        }
    }

    // MARK: - Priority Attractions

    private var priorityCard: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Priority")
                .font(ParkTheme.titleFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
            let top = GameFlavor.priorityAttractions(tasks: tasks, limit: 2)
            if top.isEmpty {
                Text("All clear.")
                    .font(ParkTheme.captionFont(readable: readableFonts))
                    .foregroundStyle(ParkTheme.ink.opacity(0.75))
            } else {
                ForEach(Array(top.enumerated()), id: \.offset) { idx, t in
                    Text("\(idx + 1). \(t.staffRole.emoji) \(t.text)")
                        .font(ParkTheme.captionFont(readable: readableFonts))
                        .foregroundStyle(ParkTheme.ink)
                        .lineLimit(2)
                }
            }
            Spacer(minLength: 0)
        }
        .frame(maxWidth: .infinity, minHeight: 90, alignment: .topLeading)
        .parkPanel(readable: readableFonts)
    }

    // MARK: - Alerts

    private var alertsCard: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Alerts")
                .font(ParkTheme.titleFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.alertRed)
            if alerts.isEmpty {
                Text("No incidents.")
                    .font(ParkTheme.captionFont(readable: readableFonts))
                    .foregroundStyle(ParkTheme.ink.opacity(0.75))
            } else {
                ForEach(Array(alerts.prefix(2).enumerated()), id: \.offset) { _, a in
                    Text("• \(a.message)")
                        .font(ParkTheme.captionFont(readable: readableFonts))
                        .foregroundStyle(ParkTheme.ink)
                        .lineLimit(2)
                }
            }
            Spacer(minLength: 0)
        }
        .frame(maxWidth: .infinity, minHeight: 90, alignment: .topLeading)
        .parkPanel(readable: readableFonts)
    }

    // MARK: - Quick Actions

    private var quickActions: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Quick actions")
                .font(ParkTheme.titleFont(readable: readableFonts))
                .foregroundStyle(ParkTheme.ink)
            HStack(spacing: 8) {
                qaButton("Add") { onAddAttraction() }
                qaButton("Testing") {
                    attractionsZoneFilter = nil
                    attractionsStatusFocus = .testing
                    selectedTab = 1
                }
            }
            HStack(spacing: 8) {
                qaButton("Repair") {
                    attractionsZoneFilter = nil
                    attractionsStatusFocus = .brokenDown
                    selectedTab = 1
                }
                qaButton("All open") {
                    attractionsZoneFilter = nil
                    attractionsStatusFocus = .open
                    selectedTab = 1
                }
            }
        }
        .parkPanel(readable: readableFonts)
    }

    private func qaButton(_ title: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title)
                .font(ParkTheme.bodyFont(readable: readableFonts).weight(.bold))
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .background(ParkTheme.wood)
                .foregroundStyle(ParkTheme.plaque)
                .clipShape(RoundedRectangle(cornerRadius: 8))
                .overlay(RoundedRectangle(cornerRadius: 8).stroke(ParkTheme.ink.opacity(0.15), lineWidth: 1))
        }
        .buttonStyle(.plain)
    }
}
