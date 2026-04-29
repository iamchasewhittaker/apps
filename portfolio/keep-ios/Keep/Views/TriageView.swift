import SwiftUI

@MainActor
struct TriageView: View {
    @Environment(KeepStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let roomID: UUID

    @State private var currentIndex = 0
    @State private var showSpotPicker = false
    @State private var showCoach = false
    @State private var unsureStreak = 0
    @State private var sessionTriaged = 0

    private var items: [Item] { store.blob.triageableItems(for: roomID) }
    private var currentItem: Item? { currentIndex < items.count ? items[currentIndex] : nil }
    private var room: Room? { store.blob.rooms.first { $0.id == roomID } }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                progressBar
                if let item = currentItem {
                    itemCard(item)
                    triageButtons(item)
                } else {
                    doneView
                }
            }
            .background(KeepTheme.backgroundPrimary)
            .navigationTitle("Triage")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Done") { dismiss() }
                }
                ToolbarItem(placement: .principal) {
                    if !items.isEmpty {
                        Text("\(min(currentIndex + 1, items.count)) of \(items.count)")
                            .font(.subheadline)
                            .foregroundStyle(KeepTheme.textSecondary)
                    }
                }
            }
            .sheet(isPresented: $showSpotPicker) {
                if let item = currentItem {
                    SpotPickerSheet(roomID: roomID, itemID: item.id) {
                        advance()
                    }
                }
            }
            .sheet(isPresented: $showCoach) {
                if let item = currentItem {
                    CoachSheet(item: item) { decision in
                        showCoach = false
                        applyDecision(item: item, status: decision)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var progressBar: some View {
        let total = items.count
        let progress = total > 0 ? Double(currentIndex) / Double(total) : 1.0
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                Rectangle()
                    .fill(KeepTheme.progressTrack)
                Rectangle()
                    .fill(KeepTheme.progressFill)
                    .frame(width: geo.size.width * progress)
            }
        }
        .frame(height: 4)
    }

    @ViewBuilder
    private func itemCard(_ item: Item) -> some View {
        VStack(spacing: 16) {
            Spacer()

            if let photoID = item.photoID,
               let image = store.photos.load(id: photoID) {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFit()
                    .frame(maxHeight: 280)
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .shadow(color: .black.opacity(0.3), radius: 8)
            } else {
                RoundedRectangle(cornerRadius: 16)
                    .fill(KeepTheme.backgroundSurface)
                    .frame(height: 200)
                    .overlay {
                        Image(systemName: "cube.box.fill")
                            .font(.system(size: 48))
                            .foregroundStyle(KeepTheme.textMuted)
                    }
            }

            Text(item.name)
                .font(.title2.bold())
                .foregroundStyle(KeepTheme.textPrimary)
                .multilineTextAlignment(.center)

            if item.status == .unsure {
                Text("Previously marked unsure")
                    .font(.caption)
                    .foregroundStyle(KeepTheme.statusUnsure)
            }

            Spacer()
        }
        .padding(.horizontal)
    }

    @ViewBuilder
    private func triageButtons(_ item: Item) -> some View {
        VStack(spacing: 12) {
            HStack(spacing: 12) {
                triageButton("Keep", systemImage: "checkmark.circle.fill", color: KeepTheme.statusKeep) {
                    applyDecision(item: item, status: .keep)
                }
                triageButton("Donate", systemImage: "heart.circle.fill", color: KeepTheme.statusDonate) {
                    applyDecision(item: item, status: .donate)
                }
            }
            HStack(spacing: 12) {
                triageButton("Toss", systemImage: "trash.circle.fill", color: KeepTheme.statusToss) {
                    applyDecision(item: item, status: .toss)
                }
                triageButton("Unsure", systemImage: "pause.circle.fill", color: KeepTheme.statusUnsure) {
                    unsureStreak += 1
                    if unsureStreak >= KeepConfig.coachThreshold {
                        showCoach = true
                    } else {
                        applyDecision(item: item, status: .unsure)
                    }
                }
            }
        }
        .padding()
        .padding(.bottom, 8)
    }

    private func triageButton(_ label: String, systemImage: String, color: Color, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            VStack(spacing: 4) {
                Image(systemName: systemImage)
                    .font(.title)
                Text(label)
                    .font(.subheadline.bold())
            }
            .foregroundStyle(color)
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(color.opacity(0.12))
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
    }

    @ViewBuilder
    private var doneView: some View {
        VStack(spacing: 16) {
            Spacer()
            Image(systemName: "checkmark.seal.fill")
                .font(.system(size: 64))
                .foregroundStyle(KeepTheme.statusKeep)
            Text("All caught up!")
                .font(.title2.bold())
                .foregroundStyle(KeepTheme.textPrimary)
            Text("You triaged \(sessionTriaged) item\(sessionTriaged == 1 ? "" : "s") this session.")
                .foregroundStyle(KeepTheme.textSecondary)
            Button("Done") { dismiss() }
                .buttonStyle(.borderedProminent)
                .tint(KeepTheme.accent)
            Spacer()
        }
    }

    private func applyDecision(item: Item, status: TriageStatus) {
        if status == .keep {
            let spots = store.blob.spots(for: roomID)
            if spots.isEmpty {
                store.triageItem(item.id, status: .keep, spotID: nil)
                advance()
            } else {
                showSpotPicker = true
            }
        } else {
            store.triageItem(item.id, status: status, spotID: nil)
            if status != .unsure {
                unsureStreak = 0
            }
            advance()
        }
    }

    private func advance() {
        sessionTriaged += 1
        // Items array is re-computed from blob, so we stay at currentIndex
        // unless we've reached the end
        if currentIndex >= items.count {
            currentIndex = max(0, items.count - 1)
        }
    }
}

// MARK: - Spot Picker Sheet

@MainActor
struct SpotPickerSheet: View {
    @Environment(KeepStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let roomID: UUID
    let itemID: UUID
    let onPicked: () -> Void

    var body: some View {
        NavigationStack {
            List {
                Section("Assign to a spot") {
                    ForEach(store.blob.spots(for: roomID)) { spot in
                        Button {
                            store.triageItem(itemID, status: .keep, spotID: spot.id)
                            dismiss()
                            onPicked()
                        } label: {
                            HStack {
                                Image(systemName: "mappin.circle.fill")
                                    .foregroundStyle(KeepTheme.accent)
                                Text(spot.name)
                            }
                        }
                    }
                }

                Section {
                    Button {
                        store.triageItem(itemID, status: .keep, spotID: nil)
                        dismiss()
                        onPicked()
                    } label: {
                        HStack {
                            Image(systemName: "questionmark.circle")
                                .foregroundStyle(KeepTheme.textMuted)
                            Text("No spot (assign later)")
                        }
                    }
                }
            }
            .navigationTitle("Where does it go?")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }
}

// MARK: - Coach Sheet

@MainActor
struct CoachSheet: View {
    let item: Item
    let onDecision: (TriageStatus) -> Void

    @State private var step = 0

    private let questions = [
        "Have you used this in the past year?",
        "Would you buy this again today?",
        "Does it serve a purpose or bring you joy?"
    ]

    @State private var answers: [Bool?] = [nil, nil, nil]

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                Text("Let's think through this")
                    .font(.title3.bold())
                    .foregroundStyle(KeepTheme.textPrimary)

                Text(item.name)
                    .font(.headline)
                    .foregroundStyle(KeepTheme.accent)

                if step < questions.count {
                    questionView
                } else {
                    resultView
                }

                Spacer()
            }
            .padding()
            .background(KeepTheme.backgroundPrimary)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Skip") {
                        onDecision(.unsure)
                    }
                }
            }
        }
    }

    @ViewBuilder
    private var questionView: some View {
        VStack(spacing: 16) {
            Text(questions[step])
                .font(.title3)
                .foregroundStyle(KeepTheme.textPrimary)
                .multilineTextAlignment(.center)

            HStack(spacing: 16) {
                Button {
                    answers[step] = true
                    step += 1
                } label: {
                    Text("Yes")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(KeepTheme.statusKeep.opacity(0.15))
                        .foregroundStyle(KeepTheme.statusKeep)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }

                Button {
                    answers[step] = false
                    step += 1
                } label: {
                    Text("No")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(KeepTheme.statusToss.opacity(0.15))
                        .foregroundStyle(KeepTheme.statusToss)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }
            }
        }
    }

    @ViewBuilder
    private var resultView: some View {
        let yesCount = answers.compactMap { $0 }.filter { $0 }.count
        let suggestion: TriageStatus = yesCount >= 2 ? .keep : .donate

        VStack(spacing: 16) {
            Image(systemName: suggestion == .keep ? "checkmark.circle.fill" : "heart.circle.fill")
                .font(.system(size: 48))
                .foregroundStyle(KeepTheme.statusColor(for: suggestion))

            Text(suggestion == .keep
                 ? "This sounds worth keeping."
                 : "This might be ready to let go.")
                .font(.title3)
                .foregroundStyle(KeepTheme.textPrimary)
                .multilineTextAlignment(.center)

            Text("You decide — this is just a nudge.")
                .font(.subheadline)
                .foregroundStyle(KeepTheme.textSecondary)

            HStack(spacing: 12) {
                Button {
                    onDecision(.keep)
                } label: {
                    Label("Keep", systemImage: "checkmark.circle.fill")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(KeepTheme.statusKeep.opacity(0.15))
                        .foregroundStyle(KeepTheme.statusKeep)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }

                Button {
                    onDecision(.donate)
                } label: {
                    Label("Let Go", systemImage: "heart.circle.fill")
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(KeepTheme.statusDonate.opacity(0.15))
                        .foregroundStyle(KeepTheme.statusDonate)
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }
            }
        }
    }
}
