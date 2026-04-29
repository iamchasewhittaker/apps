import SwiftUI

@MainActor
struct StatsView: View {
    @Environment(KeepStore.self) private var store

    private var blob: KeepBlob { store.blob }

    var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                overviewCard
                breakdownCard
                roomProgressCards
                donationBagsCard
            }
            .padding()
        }
        .background(KeepTheme.backgroundPrimary)
        .navigationTitle("Stats")
    }

    @ViewBuilder
    private var overviewCard: some View {
        VStack(spacing: 12) {
            Text("Overview")
                .font(.headline)
                .foregroundStyle(KeepTheme.textPrimary)
                .frame(maxWidth: .infinity, alignment: .leading)

            HStack(spacing: 0) {
                overviewStat("\(blob.totalItems)", label: "Total Items")
                overviewStat("\(blob.triagedCount)", label: "Triaged")
                overviewStat("\(blob.rooms.count)", label: "Rooms")
                overviewStat("\(blob.spots.count)", label: "Spots")
            }

            if blob.totalItems > 0 {
                let progress = Double(blob.triagedCount) / Double(blob.totalItems)
                VStack(spacing: 4) {
                    ProgressView(value: progress)
                        .tint(KeepTheme.progressFill)
                    Text("\(Int(progress * 100))% triaged")
                        .font(.caption)
                        .foregroundStyle(KeepTheme.textSecondary)
                }
            }
        }
        .keepCard()
    }

    private func overviewStat(_ value: String, label: String) -> some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.title.bold())
                .foregroundStyle(KeepTheme.accent)
            Text(label)
                .font(.caption2)
                .foregroundStyle(KeepTheme.textSecondary)
        }
        .frame(maxWidth: .infinity)
    }

    @ViewBuilder
    private var breakdownCard: some View {
        if blob.triagedCount > 0 {
            VStack(spacing: 12) {
                Text("Decisions")
                    .font(.headline)
                    .foregroundStyle(KeepTheme.textPrimary)
                    .frame(maxWidth: .infinity, alignment: .leading)

                breakdownRow("Kept", count: blob.keptCount, color: KeepTheme.statusKeep, icon: "checkmark.circle.fill")
                breakdownRow("Donate", count: blob.donateCount, color: KeepTheme.statusDonate, icon: "heart.circle.fill")
                breakdownRow("Toss", count: blob.tossCount, color: KeepTheme.statusToss, icon: "trash.circle.fill")
                breakdownRow("Unsure", count: blob.unsureCount, color: KeepTheme.statusUnsure, icon: "pause.circle.fill")
            }
            .keepCard()
        }
    }

    private func breakdownRow(_ label: String, count: Int, color: Color, icon: String) -> some View {
        HStack {
            Image(systemName: icon)
                .foregroundStyle(color)
            Text(label)
                .foregroundStyle(KeepTheme.textPrimary)
            Spacer()
            Text("\(count)")
                .font(.title3.bold())
                .foregroundStyle(color)

            if blob.triagedCount > 0 {
                Text("(\(Int(Double(count) / Double(blob.triagedCount) * 100))%)")
                    .font(.caption)
                    .foregroundStyle(KeepTheme.textMuted)
                    .frame(width: 40, alignment: .trailing)
            }
        }
    }

    @ViewBuilder
    private var roomProgressCards: some View {
        if !blob.rooms.isEmpty {
            VStack(spacing: 12) {
                Text("Rooms")
                    .font(.headline)
                    .foregroundStyle(KeepTheme.textPrimary)
                    .frame(maxWidth: .infinity, alignment: .leading)

                ForEach(blob.rooms) { room in
                    let items = blob.itemsInRoom(room.id)
                    let progress = blob.triageProgress(for: room.id)

                    HStack {
                        Text(room.emoji)
                        Text(room.name)
                            .foregroundStyle(KeepTheme.textPrimary)
                        Spacer()
                        Text("\(items.count) items")
                            .font(.caption)
                            .foregroundStyle(KeepTheme.textSecondary)
                    }

                    ProgressView(value: progress)
                        .tint(progress >= 1.0 ? KeepTheme.statusKeep : KeepTheme.progressFill)
                }
            }
            .keepCard()
        }
    }

    @ViewBuilder
    private var donationBagsCard: some View {
        VStack(spacing: 12) {
            HStack {
                Image(systemName: "bag.fill")
                    .foregroundStyle(KeepTheme.statusDonate)
                Text("Donation Bags")
                    .font(.headline)
                    .foregroundStyle(KeepTheme.textPrimary)
                Spacer()
                Text("\(blob.donationBags)")
                    .font(.title.bold())
                    .foregroundStyle(KeepTheme.statusDonate)
            }

            Button {
                store.incrementDonationBags()
            } label: {
                Label("Filled a bag!", systemImage: "plus.circle")
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(KeepTheme.statusDonate)
        }
        .keepCard()
    }
}
