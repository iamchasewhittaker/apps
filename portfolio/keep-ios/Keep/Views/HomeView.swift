import SwiftUI

@MainActor
struct HomeView: View {
    @Environment(KeepStore.self) private var store
    @State private var showAddRoom = false

    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                statsBanner
                roomsList
            }
            .padding()
        }
        .background(KeepTheme.backgroundPrimary)
        .navigationTitle("Keep")
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Button { showAddRoom = true } label: {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(isPresented: $showAddRoom) {
            AddRoomSheet()
        }
    }

    @ViewBuilder
    private var statsBanner: some View {
        if store.blob.totalItems > 0 {
            HStack(spacing: 16) {
                statPill(count: store.blob.keptCount, label: "Kept", color: KeepTheme.statusKeep)
                statPill(count: store.blob.donateCount, label: "Donate", color: KeepTheme.statusDonate)
                statPill(count: store.blob.tossCount, label: "Toss", color: KeepTheme.statusToss)
                statPill(count: store.blob.unsortedCount, label: "Unsorted", color: KeepTheme.statusUnsorted)
            }
            .keepCard()
        }
    }

    private func statPill(count: Int, label: String, color: Color) -> some View {
        VStack(spacing: 4) {
            Text("\(count)")
                .font(.title2.bold())
                .foregroundStyle(color)
            Text(label)
                .font(.caption)
                .foregroundStyle(KeepTheme.textSecondary)
        }
        .frame(maxWidth: .infinity)
    }

    @ViewBuilder
    private var roomsList: some View {
        if store.blob.rooms.isEmpty {
            VStack(spacing: 12) {
                Image(systemName: "house")
                    .font(.system(size: 48))
                    .foregroundStyle(KeepTheme.textMuted)
                Text("No rooms yet")
                    .font(.title3)
                    .foregroundStyle(KeepTheme.textSecondary)
                Text("Tap + to add your first room")
                    .font(.subheadline)
                    .foregroundStyle(KeepTheme.textMuted)
                Button("Add Room") { showAddRoom = true }
                    .buttonStyle(.borderedProminent)
                    .tint(KeepTheme.accent)
            }
            .padding(.top, 60)
        } else {
            ForEach(store.blob.rooms) { room in
                NavigationLink {
                    RoomDetailView(roomID: room.id)
                } label: {
                    RoomCard(room: room)
                }
                .buttonStyle(.plain)
            }
        }
    }
}

// MARK: - Room Card

@MainActor
private struct RoomCard: View {
    @Environment(KeepStore.self) private var store
    let room: Room

    private var itemCount: Int { store.blob.itemsInRoom(room.id).count }
    private var progress: Double { store.blob.triageProgress(for: room.id) }
    private var spotCount: Int { store.blob.spots(for: room.id).count }

    var body: some View {
        HStack(spacing: 14) {
            Text(room.emoji)
                .font(.system(size: 32))

            VStack(alignment: .leading, spacing: 6) {
                Text(room.name)
                    .font(.title3.bold())
                    .foregroundStyle(KeepTheme.textPrimary)

                HStack(spacing: 12) {
                    Label("\(itemCount) items", systemImage: "cube.box")
                    Label("\(spotCount) spots", systemImage: "mappin.circle")
                }
                .font(.caption)
                .foregroundStyle(KeepTheme.textSecondary)

                if itemCount > 0 {
                    ProgressView(value: progress)
                        .tint(KeepTheme.progressFill)
                        .background(KeepTheme.progressTrack)
                }
            }

            Spacer()

            Image(systemName: "chevron.right")
                .foregroundStyle(KeepTheme.textMuted)
        }
        .keepCard()
    }
}

// MARK: - Add Room Sheet

@MainActor
struct AddRoomSheet: View {
    @Environment(KeepStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var emoji = "📦"

    private let emojiOptions = ["📦", "🏠", "🚗", "👕", "🍳", "🛁", "🛏️", "🧹", "🧰", "🎄", "📚", "🧸"]

    var body: some View {
        NavigationStack {
            Form {
                Section("Room Name") {
                    TextField("e.g. Garage, Guest Closet", text: $name)
                }

                Section("Icon") {
                    LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 6), spacing: 12) {
                        ForEach(emojiOptions, id: \.self) { e in
                            Button {
                                emoji = e
                            } label: {
                                Text(e)
                                    .font(.title)
                                    .padding(8)
                                    .background(emoji == e ? KeepTheme.accent.opacity(0.3) : Color.clear)
                                    .clipShape(RoundedRectangle(cornerRadius: 8))
                            }
                        }
                    }
                }
            }
            .navigationTitle("Add Room")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        let room = Room(name: name.trimmingCharacters(in: .whitespaces), emoji: emoji)
                        store.addRoom(room)
                        dismiss()
                    }
                    .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
        }
    }
}
