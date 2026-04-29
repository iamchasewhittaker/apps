import SwiftUI

@MainActor
struct RoomDetailView: View {
    @Environment(KeepStore.self) private var store
    let roomID: UUID

    @State private var showAddSpot = false
    @State private var showAddItem = false
    @State private var showTriage = false

    private var room: Room? { store.blob.rooms.first { $0.id == roomID } }
    private var spots: [Spot] { store.blob.spots(for: roomID) }
    private var unsorted: [Item] { store.blob.unsortedItems(for: roomID) }
    private var triageable: [Item] { store.blob.triageableItems(for: roomID) }
    private var allItems: [Item] { store.blob.itemsInRoom(roomID) }

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                actionButtons
                unsortedSection
                spotsSection
            }
            .padding()
        }
        .background(KeepTheme.backgroundPrimary)
        .navigationTitle(room.map { "\($0.emoji) \($0.name)" } ?? "Room")
        .toolbar {
            ToolbarItem(placement: .primaryAction) {
                Menu {
                    Button { showAddItem = true } label: {
                        Label("Add Items", systemImage: "plus.circle")
                    }
                    Button { showAddSpot = true } label: {
                        Label("Add Spot", systemImage: "mappin.circle")
                    }
                } label: {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(isPresented: $showAddSpot) {
            AddSpotSheet(roomID: roomID)
        }
        .sheet(isPresented: $showAddItem) {
            AddItemView(roomID: roomID)
        }
        .fullScreenCover(isPresented: $showTriage) {
            TriageView(roomID: roomID)
        }
    }

    @ViewBuilder
    private var actionButtons: some View {
        HStack(spacing: 12) {
            Button {
                showAddItem = true
            } label: {
                Label("Add Items", systemImage: "camera.fill")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(KeepTheme.accent)

            if !triageable.isEmpty {
                Button {
                    showTriage = true
                } label: {
                    Label("Triage (\(triageable.count))", systemImage: "arrow.left.arrow.right")
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .tint(KeepTheme.statusKeep)
            }
        }
    }

    @ViewBuilder
    private var unsortedSection: some View {
        if !unsorted.isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                Text("Unsorted (\(unsorted.count))")
                    .font(.headline)
                    .foregroundStyle(KeepTheme.textPrimary)

                ForEach(unsorted) { item in
                    ItemRow(item: item)
                }
            }
        }
    }

    @ViewBuilder
    private var spotsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Spots")
                    .font(.headline)
                    .foregroundStyle(KeepTheme.textPrimary)
                Spacer()
                Button { showAddSpot = true } label: {
                    Label("Add", systemImage: "plus.circle")
                        .font(.subheadline)
                }
            }

            if spots.isEmpty {
                Text("No spots defined yet. Add spots like \"Shelf A\" or \"Under workbench\" to assign items a home.")
                    .font(.subheadline)
                    .foregroundStyle(KeepTheme.textMuted)
                    .padding(.vertical, 8)
            } else {
                ForEach(spots) { spot in
                    SpotCard(spot: spot)
                }
            }

            // Unassigned kept items
            let unassigned = store.blob.keptItems(for: roomID).filter { $0.spotID == nil }
            if !unassigned.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Kept — no spot assigned")
                        .font(.subheadline.bold())
                        .foregroundStyle(KeepTheme.statusUnsure)

                    ForEach(unassigned) { item in
                        ItemRow(item: item)
                    }
                }
            }
        }
    }
}

// MARK: - Spot Card

@MainActor
private struct SpotCard: View {
    @Environment(KeepStore.self) private var store
    let spot: Spot

    private var items: [Item] { store.blob.itemsInSpot(spot.id) }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: "mappin.circle.fill")
                    .foregroundStyle(KeepTheme.accent)
                Text(spot.name)
                    .font(.subheadline.bold())
                    .foregroundStyle(KeepTheme.textPrimary)
                Spacer()
                Text("\(items.count)")
                    .font(.caption)
                    .foregroundStyle(KeepTheme.textSecondary)
            }

            if !items.isEmpty {
                ForEach(items) { item in
                    ItemRow(item: item)
                }
            }
        }
        .keepCard()
    }
}

// MARK: - Item Row

@MainActor
private struct ItemRow: View {
    @Environment(KeepStore.self) private var store
    let item: Item

    var body: some View {
        HStack(spacing: 10) {
            if let photoID = item.photoID,
               let image = store.photos.load(id: photoID) {
                Image(uiImage: image)
                    .resizable()
                    .scaledToFill()
                    .frame(width: 40, height: 40)
                    .clipShape(RoundedRectangle(cornerRadius: 6))
            } else {
                RoundedRectangle(cornerRadius: 6)
                    .fill(KeepTheme.backgroundElevated)
                    .frame(width: 40, height: 40)
                    .overlay {
                        Image(systemName: "cube.box")
                            .foregroundStyle(KeepTheme.textMuted)
                    }
            }

            Text(item.name)
                .font(.subheadline)
                .foregroundStyle(KeepTheme.textPrimary)

            Spacer()

            Image(systemName: item.status.systemImage)
                .foregroundStyle(KeepTheme.statusColor(for: item.status))
        }
        .padding(.vertical, 2)
    }
}

// MARK: - Add Spot Sheet

@MainActor
struct AddSpotSheet: View {
    @Environment(KeepStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let roomID: UUID
    @State private var name = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Spot Name") {
                    TextField("e.g. Shelf A, Under workbench, Corner", text: $name)
                }

                Section {
                    Text("A spot is a specific location within this room where items live.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Add Spot")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        let spot = Spot(name: name.trimmingCharacters(in: .whitespaces), roomID: roomID)
                        store.addSpot(spot)
                        dismiss()
                    }
                    .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
        }
    }
}
