import SwiftUI

struct ShipRowView: View {
    let ship: Ship

    var body: some View {
        HStack(alignment: .center, spacing: 12) {
            VStack(alignment: .leading, spacing: 6) {
                Text(ship.name)
                    .font(.shipyardDisplay(20))
                    .foregroundStyle(Palette.white)
                    .tracking(0.5)

                HStack(spacing: 8) {
                    Text(NauticalLabels.label(for: ship.mvp_step_actual))
                        .font(.shipyardMono(11))
                        .foregroundStyle(Palette.dim)
                        .tracking(1)

                    if let days = ship.days_since_commit {
                        Text("·")
                            .foregroundStyle(Palette.dim.opacity(0.5))
                        Text(daysAgoLabel(days))
                            .font(.shipyardMono(11).monospacedDigit())
                            .foregroundStyle(days > 30 ? Palette.gold : Palette.dim)
                    }
                }
            }

            Spacer()

            statusChip
        }
        .padding(.vertical, 6)
    }

    private var statusChip: some View {
        Text(ship.status.chipLabel.uppercased())
            .font(.shipyardMono(10))
            .tracking(1)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(ship.status.chipColor.opacity(0.18))
            .foregroundStyle(ship.status.chipColor)
            .clipShape(Capsule())
    }

    private func daysAgoLabel(_ days: Int) -> String {
        switch days {
        case 0: return "TODAY"
        case 1: return "YESTERDAY"
        default: return "\(days)D AGO"
        }
    }
}

#Preview {
    List {
        ShipRowView(ship: FleetStore.mockFleet[0])
        ShipRowView(ship: FleetStore.mockFleet[3])
    }
    .listRowBackground(Palette.surface)
    .scrollContentBackground(.hidden)
    .background(Palette.bg)
}
