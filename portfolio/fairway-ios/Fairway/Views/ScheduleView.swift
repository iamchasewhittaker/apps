import SwiftUI

@MainActor
struct ScheduleView: View {
    @Environment(FairwayStore.self) private var store
    let zoneID: UUID
    @State private var editing = false
    @State private var draft: ScheduleData?
    @State private var infoPopover: ParameterInfo? = nil

    private var zone: ZoneData? { store.zone(withID: zoneID) }
    private var schedule: ScheduleData? { zone?.schedule }

    var body: some View {
        VStack(spacing: 12) {
            readOnlyBanner

            if let schedule = draft ?? schedule {
                summaryCard(schedule: schedule)
                if editing {
                    editForm()
                } else {
                    paramsCard(schedule: schedule)
                    if let z = zone, !z.subZones.isEmpty {
                        subZoneRuntimeCard(zone: z, schedule: schedule)
                    }
                }
            } else {
                emptyState
            }

            rachioMirrorCard
            recentFertilizerCard

            HStack {
                Spacer()
                if editing {
                    Button("Save") {
                        if let d = draft {
                            store.updateSchedule(d, for: zoneID)
                        }
                        editing = false
                        draft = nil
                    }
                    .font(.subheadline.bold())
                    .padding(.horizontal, 16).padding(.vertical, 8)
                    .background(FairwayTheme.accentGreen)
                    .foregroundStyle(FairwayTheme.textPrimary)
                    .clipShape(Capsule())
                } else {
                    Button(schedule == nil ? "Create Schedule" : "Edit") {
                        draft = schedule ?? ScheduleData(cycleMinutes: 4, soakMinutes: 40, cycles: 3, precipitationRate: 0.4)
                        editing = true
                    }
                    .font(.subheadline.bold())
                    .padding(.horizontal, 16).padding(.vertical, 8)
                    .background(FairwayTheme.backgroundElevated)
                    .foregroundStyle(FairwayTheme.textPrimary)
                    .clipShape(Capsule())
                }
            }
        }
        .sheet(item: $infoPopover) { info in
            ParameterInfoSheet(info: info)
        }
    }

    private var readOnlyBanner: some View {
        FairwayCard {
            HStack(alignment: .top, spacing: 10) {
                Image(systemName: "info.circle.fill")
                    .foregroundStyle(FairwayTheme.accentGold)
                VStack(alignment: .leading, spacing: 4) {
                    Text("Read-only mirror")
                        .font(.caption.bold())
                        .foregroundStyle(FairwayTheme.textPrimary)
                    Text("Set the schedule in the Rachio app — Fairway plans, Rachio runs. Cycle & Soak is recommended for Vineyard's clay soil.")
                        .font(.caption)
                        .foregroundStyle(FairwayTheme.textSecondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
        }
    }

    private func summaryCard(schedule: ScheduleData) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Label("Cycle & Soak", systemImage: "timer")
                        .font(.caption.bold())
                        .foregroundStyle(FairwayTheme.accentGold)
                        .textCase(.uppercase)
                    Spacer()
                    Text(schedule.mode)
                        .font(.caption)
                        .padding(.horizontal, 8).padding(.vertical, 3)
                        .background(FairwayTheme.accentGreen.opacity(0.25))
                        .clipShape(Capsule())
                        .foregroundStyle(FairwayTheme.textPrimary)
                }

                Text(schedule.summary)
                    .font(.title3.bold())
                    .foregroundStyle(FairwayTheme.textPrimary)

                // Visual cycle strip
                HStack(spacing: 4) {
                    ForEach(0..<schedule.cycles, id: \.self) { i in
                        HStack(spacing: 2) {
                            Rectangle()
                                .fill(FairwayTheme.accentGreen)
                                .frame(width: 24, height: 10)
                                .clipShape(RoundedRectangle(cornerRadius: 3))
                            if i < schedule.cycles - 1 {
                                Rectangle()
                                    .fill(FairwayTheme.textSecondary.opacity(0.4))
                                    .frame(width: 36, height: 4)
                                    .clipShape(RoundedRectangle(cornerRadius: 2))
                            }
                        }
                    }
                }
                .padding(.vertical, 4)

                HStack {
                    Text("Total run: \(schedule.totalRunMinutes) min")
                    Spacer()
                    Text("Start: \(schedule.startTime)")
                }
                .font(.caption)
                .foregroundStyle(FairwayTheme.textSecondary)
            }
        }
    }

    private func paramsCard(schedule: ScheduleData) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Parameters").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                paramLine(.cycleLength, value: "\(schedule.cycleMinutes) min")
                paramLine(.soakBetween, value: "\(schedule.soakMinutes) min")
                paramLine(.cycles, value: "\(schedule.cycles)")
                paramLine(.precipRate, value: String(format: "%.2f", schedule.precipitationRate) + " in/hr")
                paramLine(.grassType, value: schedule.grassType.isEmpty ? "—" : schedule.grassType)
                paramLine(.nozzleType, value: schedule.nozzleType.isEmpty ? "—" : schedule.nozzleType)
                if !schedule.notes.isEmpty {
                    Divider().background(FairwayTheme.textSecondary.opacity(0.3))
                    Text(schedule.notes)
                        .font(.footnote)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
            }
        }
    }

    private func paramLine(_ info: ParameterInfo, value: String) -> some View {
        HStack {
            Text(info.label).foregroundStyle(FairwayTheme.textSecondary)
            Button {
                infoPopover = info
            } label: {
                Image(systemName: "questionmark.circle")
                    .font(.caption)
                    .foregroundStyle(FairwayTheme.accentGold)
            }
            .buttonStyle(.plain)
            .accessibilityLabel("About \(info.label)")
            Spacer()
            Text(value).foregroundStyle(FairwayTheme.textPrimary)
        }
        .font(.footnote)
    }

    @ViewBuilder
    private func editForm() -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("Edit Schedule").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                labeledStepper("Cycle minutes", value: Binding(
                    get: { draft?.cycleMinutes ?? 0 },
                    set: { draft?.cycleMinutes = $0 }
                ), range: 1...60)
                labeledStepper("Soak minutes", value: Binding(
                    get: { draft?.soakMinutes ?? 0 },
                    set: { draft?.soakMinutes = $0 }
                ), range: 5...90)
                labeledStepper("Cycles", value: Binding(
                    get: { draft?.cycles ?? 0 },
                    set: { draft?.cycles = $0 }
                ), range: 1...6)

                HStack {
                    Text("Start time"); Spacer()
                    TextField("5:00 AM", text: Binding(
                        get: { draft?.startTime ?? "" },
                        set: { draft?.startTime = $0 }
                    ))
                    .multilineTextAlignment(.trailing)
                }
                .font(.footnote)

                HStack {
                    Text("Precip rate (in/hr)"); Spacer()
                    TextField("0.4", value: Binding(
                        get: { draft?.precipitationRate ?? 0 },
                        set: { draft?.precipitationRate = $0 }
                    ), format: .number)
                    .keyboardType(.decimalPad)
                    .multilineTextAlignment(.trailing)
                }
                .font(.footnote)

                HStack {
                    Text("Grass type"); Spacer()
                    TextField("KBG", text: Binding(
                        get: { draft?.grassType ?? "" },
                        set: { draft?.grassType = $0 }
                    ))
                    .multilineTextAlignment(.trailing)
                }
                .font(.footnote)

                HStack {
                    Text("Nozzle type"); Spacer()
                    TextField("MP Rotator", text: Binding(
                        get: { draft?.nozzleType ?? "" },
                        set: { draft?.nozzleType = $0 }
                    ))
                    .multilineTextAlignment(.trailing)
                }
                .font(.footnote)
            }
        }
    }

    private func labeledStepper(_ label: String, value: Binding<Int>, range: ClosedRange<Int>) -> some View {
        Stepper(value: value, in: range) {
            HStack {
                Text(label)
                Spacer()
                Text("\(value.wrappedValue)")
                    .foregroundStyle(FairwayTheme.accentGold)
                    .bold()
            }
        }
        .font(.footnote)
    }

    private var emptyState: some View {
        FairwayCard {
            VStack(spacing: 8) {
                Image(systemName: "timer")
                    .font(.system(size: 32))
                    .foregroundStyle(FairwayTheme.textSecondary)
                Text("No schedule yet")
                    .font(.subheadline.bold())
                    .foregroundStyle(FairwayTheme.textPrimary)
                Text("Create one to track cycle & soak.")
                    .font(.caption)
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
        }
    }

    private func subZoneRuntimeCard(zone: ZoneData, schedule: ScheduleData) -> some View {
        let effectiveMinutes = zone.subZones.compactMap(\.targetRunMinutes).max() ?? schedule.totalRunMinutes
        return FairwayCard {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Label("Sub-zone runtimes", systemImage: "square.split.2x1")
                        .font(.caption.bold())
                        .foregroundStyle(FairwayTheme.textSecondary)
                        .textCase(.uppercase)
                    Spacer()
                    Text("Valve: \(effectiveMinutes) min total")
                        .font(.caption2)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }

                ForEach(zone.subZones) { sub in
                    let target = sub.targetRunMinutes ?? schedule.totalRunMinutes
                    let isLimiting = target == effectiveMinutes
                    let overWatered = sub.targetRunMinutes.map { $0 < effectiveMinutes } ?? false
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(sub.label)
                                .font(.subheadline.bold())
                                .foregroundStyle(FairwayTheme.textPrimary)
                            Text("\(sub.squareFootage) sq ft · \(sub.microclimate.rawValue)")
                                .font(.caption2)
                                .foregroundStyle(FairwayTheme.textSecondary)
                        }
                        Spacer()
                        VStack(alignment: .trailing, spacing: 2) {
                            Text("\(target) min")
                                .font(.subheadline.bold())
                                .foregroundStyle(isLimiting ? FairwayTheme.accentGold : FairwayTheme.textPrimary)
                            if overWatered {
                                Text("over-watered \(effectiveMinutes - target) min")
                                    .font(.caption2.bold())
                                    .foregroundStyle(FairwayTheme.sunAmber)
                            }
                        }
                    }
                }

                Text("Valve runs the longest sub-zone. Shorter sub-zones receive extra water.")
                    .font(.caption2)
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
        }
    }

    @ViewBuilder
    private var rachioMirrorCard: some View {
        if let state = store.blob.rachio,
           let zone,
           let rachioZoneId = state.rachioZoneId(forFairwayZone: zone.number) {
            let rules = state.scheduleRules(forRachioZoneId: rachioZoneId)
            FairwayCard {
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        Label("Rachio says", systemImage: "dot.radiowaves.left.and.right")
                            .font(.caption.bold())
                            .foregroundStyle(FairwayTheme.accentGold)
                            .textCase(.uppercase)
                        Spacer()
                        Text(state.deviceName)
                            .font(.caption2)
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }

                    if rules.isEmpty {
                        Text("No schedule rules include this zone.")
                            .font(.footnote)
                            .foregroundStyle(FairwayTheme.textSecondary)
                    } else {
                        ForEach(rules) { rule in
                            VStack(alignment: .leading, spacing: 4) {
                                HStack {
                                    Text(rule.name)
                                        .font(.subheadline.bold())
                                        .foregroundStyle(FairwayTheme.textPrimary)
                                    Spacer()
                                    Text(rule.statusLabel)
                                        .font(.caption2.bold())
                                        .padding(.horizontal, 8).padding(.vertical, 2)
                                        .background(statusBackground(rule).opacity(0.25))
                                        .foregroundStyle(statusBackground(rule))
                                        .clipShape(Capsule())
                                }
                                HStack {
                                    Text("Start: \(rule.startTimeLabel)")
                                    Spacer()
                                    Text("Runs \(rule.totalDurationMinutes) min")
                                }
                                .font(.caption)
                                .foregroundStyle(FairwayTheme.textSecondary)
                                Text(rule.scheduleType)
                                    .font(.caption2)
                                    .foregroundStyle(FairwayTheme.textSecondary)
                            }
                            if rule.id != rules.last?.id {
                                Divider().background(FairwayTheme.backgroundElevated)
                            }
                        }
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var recentFertilizerCard: some View {
        if let zone {
            let cutoff = Calendar.current.date(byAdding: .day, value: -7, to: Date()) ?? Date()
            let recent = store.blob.fertApplications
                .filter { $0.date >= cutoff && $0.zoneNumbers.contains(zone.number) }
                .sorted { $0.date > $1.date }
            if let last = recent.first {
                let daysAgo = max(0, Calendar.current.dateComponents([.day], from: last.date, to: Date()).day ?? 0)
                FairwayCard {
                    VStack(alignment: .leading, spacing: 6) {
                        HStack {
                            Label("Recent fertilizer", systemImage: "leaf.fill")
                                .font(.caption.bold())
                                .foregroundStyle(FairwayTheme.statusHealthy)
                                .textCase(.uppercase)
                            Spacer()
                            Text(daysAgoLabel(daysAgo))
                                .font(.caption2)
                                .foregroundStyle(FairwayTheme.textSecondary)
                        }
                        Text(last.productName.isEmpty ? "Fertilizer applied" : last.productName)
                            .font(.subheadline.bold())
                            .foregroundStyle(FairwayTheme.textPrimary)
                        Text(waterInStatus(daysAgo: daysAgo))
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.textSecondary)
                            .fixedSize(horizontal: false, vertical: true)
                    }
                }
            }
        }
    }

    private func daysAgoLabel(_ d: Int) -> String {
        d == 0 ? "today" : (d == 1 ? "1 day ago" : "\(d) days ago")
    }

    private func waterInStatus(daysAgo d: Int) -> String {
        switch d {
        case 0...1:  return "Water-in window: water 0.25–0.5″ within 24–48 hours."
        case 2:      return "Water-in still useful — apply if you haven't yet."
        default:     return "Water-in window has passed. Granules should have activated."
        }
    }

    private func statusBackground(_ rule: RachioScheduleSnapshot) -> Color {
        if !rule.enabled { return FairwayTheme.statusAttention }
        if rule.rainDelay { return FairwayTheme.sunAmber }
        return FairwayTheme.statusHealthy
    }
}

enum ParameterInfo: String, Identifiable {
    case cycleLength, soakBetween, cycles, precipRate, grassType, nozzleType

    var id: String { rawValue }

    var label: String {
        switch self {
        case .cycleLength: return "Cycle length"
        case .soakBetween: return "Soak between"
        case .cycles:      return "Cycles"
        case .precipRate:  return "Precip rate"
        case .grassType:   return "Grass"
        case .nozzleType:  return "Nozzle"
        }
    }

    var explanation: String {
        switch self {
        case .cycleLength:
            return "How long the zone runs in one burst, in minutes. Set short enough that applied water is no more than the soil can absorb before runoff. Vineyard's clay soil tolerates ~3–5 min for spray nozzles, ~10–15 min for MP Rotators."
        case .soakBetween:
            return "Wait time between cycles, in minutes. Lets surface water move down out of the top inch before the next burst. Typical: 30–60 min."
        case .cycles:
            return "Number of burst+soak iterations per watering day. Total run time = cycle minutes × cycles. Three cycles is usually enough for KBG."
        case .precipRate:
            return "How fast the zone applies water, in inches per hour. This is the most important number to get right — it drives total run time for a target depth.\n\nTypical precip rates:\n• Fixed spray ~1.5 in/hr\n• Rotor ~0.5 in/hr\n• MP Rotator ~0.4 in/hr\n\nIt's set by the nozzle, not the controller. To measure: tuna-can audit (4–6 cans across the zone, 15-min run, average depth × 4)."
        case .grassType:
            return "Cool-season grass like KBG (Kentucky Bluegrass) needs ~1.0–1.5 in/wk peak summer in Vineyard. Warm-season grasses (rare here) need less. Drives the weekly water budget."
        case .nozzleType:
            return "The dominant nozzle family in this zone. Should match HeadData.nozzle for most heads. Drives the precipitation rate, which drives the run time. Mixed nozzle families on a single zone are bad — see the mixed-precip rule."
        }
    }
}

private struct ParameterInfoSheet: View {
    let info: ParameterInfo
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                Text(info.explanation)
                    .font(.body)
                    .foregroundStyle(FairwayTheme.textPrimary)
                    .padding(20)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle(info.label)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }.bold()
                }
            }
        }
        .presentationDetents([.medium, .large])
    }
}
