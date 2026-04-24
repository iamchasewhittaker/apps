import SwiftUI

struct ScheduleView: View {
    @Environment(FairwayStore.self) private var store
    let zoneID: UUID
    @State private var editing = false
    @State private var draft: ScheduleData?

    @MainActor private var zone: ZoneData? { store.zone(withID: zoneID) }
    @MainActor private var schedule: ScheduleData? { zone?.schedule }

    var body: some View {
        VStack(spacing: 12) {
            if let schedule = draft ?? schedule {
                summaryCard(schedule: schedule)
                if editing {
                    editForm()
                } else {
                    paramsCard(schedule: schedule)
                }
            } else {
                emptyState
            }

            rachioMirrorCard

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
                InfoLine(label: "Cycle length", value: "\(schedule.cycleMinutes) min")
                InfoLine(label: "Soak between", value: "\(schedule.soakMinutes) min")
                InfoLine(label: "Cycles", value: "\(schedule.cycles)")
                InfoLine(label: "Precip rate", value: String(format: "%.2f", schedule.precipitationRate) + " in/hr")
                InfoLine(label: "Grass", value: schedule.grassType.isEmpty ? "—" : schedule.grassType)
                InfoLine(label: "Nozzle", value: schedule.nozzleType.isEmpty ? "—" : schedule.nozzleType)
                if !schedule.notes.isEmpty {
                    Divider().background(FairwayTheme.textSecondary.opacity(0.3))
                    Text(schedule.notes)
                        .font(.footnote)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
            }
        }
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

    @MainActor @ViewBuilder
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

    private func statusBackground(_ rule: RachioScheduleSnapshot) -> Color {
        if !rule.enabled { return FairwayTheme.statusAttention }
        if rule.rainDelay { return FairwayTheme.sunAmber }
        return FairwayTheme.statusHealthy
    }
}
