import SwiftUI

struct MowLogView: View {
    @Environment(FairwayStore.self) private var store
    @State private var showAdd = false

    @MainActor private var sorted: [MowEntry] {
        store.blob.mowLog.sorted { $0.date > $1.date }
    }

    @MainActor private var lastMow: MowEntry? { sorted.first }

    var body: some View {
        ScrollView {
            VStack(spacing: 12) {
                headerCard
                if sorted.isEmpty {
                    emptyState
                } else {
                    VStack(spacing: 8) {
                        ForEach(sorted) { entry in
                            MowRow(entry: entry)
                                .swipeActions {
                                    Button(role: .destructive) {
                                        store.deleteMowEntry(id: entry.id)
                                    } label: {
                                        Label("Delete", systemImage: "trash")
                                    }
                                }
                        }
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(FairwayTheme.backgroundPrimary)
        .navigationTitle("Mow Log")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button { showAdd = true } label: { Image(systemName: "plus") }
            }
        }
        .sheet(isPresented: $showAdd) { AddMowSheet() }
    }

    @MainActor private var headerCard: some View {
        FairwayCard {
            HStack {
                Image(systemName: "scissors")
                    .foregroundStyle(FairwayTheme.accentGold)
                VStack(alignment: .leading, spacing: 2) {
                    if let last = lastMow {
                        let days = Calendar.current.dateComponents([.day], from: last.date, to: Date()).day ?? 0
                        Text("Last mowed \(days) day\(days == 1 ? "" : "s") ago")
                            .font(.headline)
                            .foregroundStyle(FairwayTheme.textPrimary)
                        Text("\(last.bladeHeightInches, specifier: "%.2f") in blade")
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.textSecondary)
                    } else {
                        Text("No mows logged").font(.headline).foregroundStyle(FairwayTheme.textPrimary)
                        Text("Tap + to log your first mow").font(.caption).foregroundStyle(FairwayTheme.textSecondary)
                    }
                }
                Spacer()
            }
        }
    }

    private var emptyState: some View {
        FairwayCard {
            VStack(spacing: 8) {
                Image(systemName: "scissors")
                    .font(.system(size: 32))
                    .foregroundStyle(FairwayTheme.textSecondary)
                Text("No entries yet")
                    .font(.subheadline.bold())
                    .foregroundStyle(FairwayTheme.textPrimary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
        }
    }
}

private struct MowRow: View {
    let entry: MowEntry

    var body: some View {
        FairwayCard {
            HStack(alignment: .top, spacing: 12) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(entry.date, style: .date)
                        .font(.subheadline.bold())
                        .foregroundStyle(FairwayTheme.textPrimary)
                    HStack(spacing: 10) {
                        Label("\(entry.bladeHeightInches, specifier: "%.2f") in", systemImage: "ruler")
                        if !entry.stripeDirection.isEmpty {
                            Label(entry.stripeDirection, systemImage: "arrow.up.right")
                        }
                        if entry.durationMinutes > 0 {
                            Label("\(entry.durationMinutes) min", systemImage: "clock")
                        }
                    }
                    .font(.caption)
                    .foregroundStyle(FairwayTheme.textSecondary)
                    if !entry.notes.isEmpty {
                        Text(entry.notes).font(.caption).foregroundStyle(FairwayTheme.textSecondary)
                    }
                }
                Spacer()
            }
        }
    }
}

struct AddMowSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss

    @State private var date = Date()
    @State private var bladeHeight: Double = 3.0
    @State private var directionPick: MowDirectionPick = .preset(.northSouth)
    @State private var customDirection = ""
    @State private var duration: Int = 30
    @State private var notes = ""

    private let heights = stride(from: 2.5, through: 4.5, by: 0.25).map { $0 }

    private var stripeDirectionValue: String {
        switch directionPick {
        case .preset(let d): return d.rawString
        case .custom: return customDirection
        }
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("When") {
                    DatePicker("Date", selection: $date, displayedComponents: .date)
                    Picker("Blade height", selection: $bladeHeight) {
                        ForEach(heights, id: \.self) { h in
                            Text("\(h, specifier: "%.2f") in").tag(h)
                        }
                    }
                }
                Section("Details") {
                    Picker("Stripe direction", selection: $directionPick) {
                        ForEach(MowDirection.presets, id: \.self) { preset in
                            Text(preset.displayLabel).tag(MowDirectionPick.preset(preset))
                        }
                        Text("Custom…").tag(MowDirectionPick.custom)
                    }
                    if case .custom = directionPick {
                        TextField("Describe direction", text: $customDirection)
                    }
                    Stepper("Duration: \(duration) min", value: $duration, in: 5...180, step: 5)
                    TextField("Notes", text: $notes, axis: .vertical).lineLimit(2...4)
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Log Mow")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        store.addMowEntry(MowEntry(
                            date: date,
                            bladeHeightInches: bladeHeight,
                            stripeDirection: stripeDirectionValue,
                            durationMinutes: duration,
                            notes: notes
                        ))
                        dismiss()
                    }
                    .bold()
                }
            }
        }
    }
}

private enum MowDirectionPick: Hashable {
    case preset(MowDirection)
    case custom
}
