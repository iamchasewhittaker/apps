import SwiftUI

struct ShipRowView: View {
    let ship: Ship

    var body: some View {
        HStack(alignment: .center, spacing: 12) {
            VStack(alignment: .leading, spacing: 4) {
                Text(ship.name)
                    .font(.headline)
                    .foregroundStyle(Palette.sailCream)

                HStack(spacing: 8) {
                    Text(NauticalLabels.label(for: ship.mvp_step_actual))
                        .font(.caption)
                        .foregroundStyle(Palette.mist)

                    if let days = ship.days_since_commit {
                        Text("·")
                            .foregroundStyle(Palette.mist.opacity(0.5))
                        Text(daysAgoLabel(days))
                            .font(.caption.monospacedDigit())
                            .foregroundStyle(days > 30 ? Palette.storm : Palette.mist)
                    }
                }
            }

            Spacer()

            statusChip
        }
        .padding(.vertical, 4)
    }

    private var statusChip: some View {
        Text(ship.status.chipLabel)
            .font(.caption2.weight(.semibold))
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(ship.status.chipColor.opacity(0.18))
            .foregroundStyle(ship.status.chipColor)
            .clipShape(Capsule())
    }

    private func daysAgoLabel(_ days: Int) -> String {
        switch days {
        case 0: return "today"
        case 1: return "yesterday"
        default: return "\(days)d ago"
        }
    }
}

#Preview {
    List {
        ShipRowView(ship: FleetStore.mockFleet[0])
        ShipRowView(ship: FleetStore.mockFleet[3])
    }
    .listRowBackground(Palette.deepSea)
    .scrollContentBackground(.hidden)
    .background(Palette.navy)
}
