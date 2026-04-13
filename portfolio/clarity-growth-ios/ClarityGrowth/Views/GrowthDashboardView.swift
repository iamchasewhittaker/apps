import SwiftUI
import ClarityUI

@MainActor
struct GrowthDashboardView: View {
    @Environment(GrowthStore.self) private var store
    @State private var logPresented = false
    @State private var logPrefillAreaId: String?

    var body: some View {
        List {
            if let quote = growthQuotes.todaysQuote {
                Section {
                    QuoteBanner(quote: quote)
                        .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 0))
                        .listRowBackground(Color.clear)
                }
            }

            Section {
                statsRow
            } header: {
                Text("Overview")
            }

            Section {
                weekChart
            } header: {
                Text("This week")
            }

            Section {
                Button {
                    logPrefillAreaId = nil
                    logPresented = true
                } label: {
                    Label("Log session", systemImage: "plus.circle.fill")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 0))
            }

            Section {
                LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                    ForEach(GrowthCatalog.areas) { area in
                        GrowthAreaTile(area: area) {
                            logPrefillAreaId = area.id
                            logPresented = true
                        }
                    }
                }
                .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 0))
            } header: {
                Text("Areas")
            }
        }
        .navigationTitle("Growth")
        .scrollContentBackground(.hidden)
        .background(ClarityPalette.bg)
        .sheet(isPresented: $logPresented) {
            NavigationStack {
                GrowthLogSheet(initialAreaId: logPrefillAreaId)
            }
            .presentationDetents([.large])
        }
    }

    private var statsRow: some View {
        let totalSessions = store.blob.sessions.count
        let hours = Double(store.blob.totalMinutes(areaId: nil)) / 60.0
        let activeStreaks = store.activeStreakAreasCount(minimumDays: 2)
        return HStack(spacing: 8) {
            statCell(title: "Sessions", value: "\(totalSessions)", subtitle: "all time")
            statCell(title: "Hours", value: String(format: "%.1f", hours), subtitle: "all time")
            statCell(title: "Streaks", value: "\(activeStreaks)", subtitle: "2+ days")
        }
        .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 0))
    }

    private func statCell(title: String, value: String, subtitle: String) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(title.uppercased())
                .font(ClarityTypography.caption)
                .foregroundStyle(ClarityPalette.muted)
            Text(value)
                .font(ClarityTypography.headline)
                .foregroundStyle(ClarityPalette.text)
            Text(subtitle)
                .font(ClarityTypography.caption)
                .foregroundStyle(ClarityPalette.muted)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(12)
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: ClarityMetrics.cornerRadius, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: ClarityMetrics.cornerRadius, style: .continuous)
                .stroke(ClarityPalette.border, lineWidth: ClarityMetrics.borderWidth)
        )
    }

    private var weekChart: some View {
        let rows = store.blob.minutesByDayLastSeven()
        let maxM = max(1, rows.map(\.minutes).max() ?? 1)
        return HStack(alignment: .bottom, spacing: 6) {
            ForEach(Array(rows.enumerated()), id: \.offset) { _, row in
                let h = max(4, CGFloat(row.minutes) / CGFloat(maxM) * 44)
                let dow = weekdayLetter(for: row.day)
                VStack(spacing: 6) {
                    RoundedRectangle(cornerRadius: 3, style: .continuous)
                        .fill(row.minutes > 0 ? ClarityPalette.accent : ClarityPalette.surface)
                        .frame(height: h)
                    Text(dow)
                        .font(ClarityTypography.caption)
                        .foregroundStyle(ClarityPalette.muted)
                }
                .frame(maxWidth: .infinity)
            }
        }
        .frame(height: 72)
        .listRowInsets(EdgeInsets(top: 8, leading: 0, bottom: 8, trailing: 0))
    }

    private func weekdayLetter(for day: String) -> String {
        guard let d = DateHelpers.date(from: day) else { return "?" }
        let symbols = Calendar.current.shortWeekdaySymbols
        let idx = Calendar.current.component(.weekday, from: d) - 1
        guard symbols.indices.contains(idx) else { return "?" }
        return String(symbols[idx].prefix(2))
    }
}

// MARK: - Area tile

@MainActor
private struct GrowthAreaTile: View {
    let area: GrowthAreaModel
    let onTap: () -> Void

    @Environment(GrowthStore.self) private var store

    var body: some View {
        Button(action: onTap) {
            VStack(alignment: .leading, spacing: 6) {
                Text(area.tag.uppercased())
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
                Text("\(area.icon) \(area.name)")
                    .font(ClarityTypography.support)
                    .foregroundStyle(ClarityPalette.text)
                    .multilineTextAlignment(.leading)
                Text("\(store.blob.sessionCount(areaId: area.id)) sessions · \(hoursString(for: area.id))")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
                Text(streakLabel(store.streak(for: area.id)))
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.accent)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(12)
            .background(ClarityPalette.surface)
            .clipShape(RoundedRectangle(cornerRadius: ClarityMetrics.cornerRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: ClarityMetrics.cornerRadius, style: .continuous)
                    .stroke(
                        store.blob.hasLoggedToday(areaId: area.id, today: DateHelpers.todayString)
                            ? ClarityPalette.accent
                            : ClarityPalette.border,
                        lineWidth: store.blob.hasLoggedToday(areaId: area.id, today: DateHelpers.todayString) ? 2 : ClarityMetrics.borderWidth
                    )
            )
        }
        .buttonStyle(.plain)
        .accessibilityHint("Opens log session for this area")
    }

    private func hoursString(for areaId: String) -> String {
        let h = Double(store.blob.totalMinutes(areaId: areaId)) / 60.0
        return String(format: "%.1fh", h)
    }

    private func streakLabel(_ n: Int) -> String {
        if n == 0 { return "No streak" }
        if n < 3 { return "\(n) day streak" }
        if n < 7 { return "\(n) day streak 🔥" }
        return "\(n) day streak ⚡"
    }
}

// MARK: - Log sheet

@MainActor
private struct GrowthLogSheet: View {
    let initialAreaId: String?

    @Environment(GrowthStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var areaId: String = GrowthCatalog.areas[0].id
    @State private var mins: Double = 30
    @State private var note: String = ""
    @State private var selectedMilestones: Set<String> = []
    @State private var selectedBackgrounds: Set<String> = []

    var body: some View {
        Form {
            Section("Area") {
                Picker("Area", selection: $areaId) {
                    ForEach(GrowthCatalog.areas) { area in
                        Text("\(area.icon) \(area.name)").tag(area.id)
                    }
                }
            }

            Section("Minutes") {
                HStack(spacing: 12) {
                    Slider(value: $mins, in: 5...180, step: 5)
                        .tint(ClarityPalette.accent)
                    Text("\(Int(mins))m")
                        .font(ClarityTypography.support)
                        .foregroundStyle(ClarityPalette.text)
                        .monospacedDigit()
                        .frame(width: 48, alignment: .trailing)
                }
            }

            if let area = GrowthCatalog.area(id: areaId) {
                Section("What did you do? (optional)") {
                    FlowLayout(spacing: 8) {
                        ForEach(area.milestones, id: \.self) { milestone in
                            ClarityMultiChip(milestone, isSelected: selectedMilestones.contains(milestone)) {
                                toggleMilestone(milestone)
                            }
                        }
                    }
                    .padding(.vertical, 6)
                }
            }

            Section("Background (optional)") {
                FlowLayout(spacing: 8) {
                    ForEach(GrowthCatalog.backgroundOptions, id: \.id) { option in
                        ClarityMultiChip(option.label, isSelected: selectedBackgrounds.contains(option.id)) {
                            if selectedBackgrounds.contains(option.id) {
                                selectedBackgrounds.remove(option.id)
                            } else {
                                selectedBackgrounds.insert(option.id)
                            }
                        }
                    }
                }
                .padding(.vertical, 6)
            }

            Section("Note (optional)") {
                TextField("What did you cover or learn?", text: $note, axis: .vertical)
                    .lineLimit(2...5)
            }
        }
        .scrollContentBackground(.hidden)
        .background(ClarityPalette.bg)
        .navigationTitle("Log Session")
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button("Cancel") { dismiss() }
            }
            ToolbarItem(placement: .confirmationAction) {
                Button("Save") {
                    store.addSession(
                        area: areaId,
                        mins: Int(mins),
                        note: note,
                        milestones: Array(selectedMilestones).sorted(),
                        backgrounds: Array(selectedBackgrounds).sorted()
                    )
                    dismiss()
                }
            }
        }
        .onAppear {
            if let initialAreaId, GrowthCatalog.area(id: initialAreaId) != nil {
                areaId = initialAreaId
            }
        }
        .onChange(of: areaId) { _, _ in
            selectedMilestones.removeAll()
        }
    }

    private func toggleMilestone(_ value: String) {
        if selectedMilestones.contains(value) {
            selectedMilestones.remove(value)
        } else {
            selectedMilestones.insert(value)
        }
    }
}
