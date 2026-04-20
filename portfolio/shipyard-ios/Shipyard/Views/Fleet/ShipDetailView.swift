import SwiftUI

struct ShipDetailView: View {
    let ship: Ship

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {

                HStack(spacing: 8) {
                    StatusBadge(status: ship.status)
                    TypeBadge(type: ship.type)
                    if let step = ship.mvp_step_actual {
                        StepBadge(step: step)
                    }
                }

                if let days = ship.days_since_commit {
                    DetailRow(label: "LAST COMMIT") {
                        Text(days == 0 ? "Today" : "\(days)d ago")
                            .foregroundStyle(freshColor(days: days))
                    }
                }

                if let stack = ship.tech_stack {
                    DetailRow(label: "STACK") {
                        Text(stack)
                            .foregroundStyle(Palette.white)
                    }
                }

                DetailRow(label: "COMPLIANCE") {
                    let score = ship.compliance_score
                    Text("\(score) / 7")
                        .foregroundStyle(score >= 6 ? Palette.steel : score >= 4 ? Palette.gold : Color.red)
                }

                if ship.has_live_url, let urlStr = ship.live_url, let url = URL(string: urlStr) {
                    DetailRow(label: "LIVE URL") {
                        Link(urlStr, destination: url)
                            .font(.shipyardMono(12))
                            .foregroundStyle(Palette.steel)
                            .lineLimit(1)
                    }
                }

                Spacer(minLength: 40)
            }
            .padding()
        }
        .background(Palette.bg.ignoresSafeArea())
        .navigationTitle(ship.name)
        .navigationBarTitleDisplayMode(.large)
        .toolbarBackground(Palette.bg, for: .navigationBar)
        .toolbarBackground(.visible, for: .navigationBar)
        .toolbarColorScheme(.dark, for: .navigationBar)
    }

    private func freshColor(days: Int) -> Color {
        days <= 7 ? Palette.steel : days <= 30 ? Palette.gold : Color.red
    }
}

private struct DetailRow<Content: View>: View {
    let label: String
    @ViewBuilder let content: () -> Content

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(.shipyardMono(11))
                .tracking(2)
                .foregroundStyle(Palette.dim)
            content()
                .font(.shipyardBody(15))
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Palette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(Palette.dimmer, lineWidth: 1)
        )
    }
}

private struct StatusBadge: View {
    let status: ShipStatus
    var body: some View {
        Text(status.chipLabel.uppercased())
            .font(.shipyardMono(10))
            .tracking(1.5)
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(status.chipColor.opacity(0.2))
            .foregroundStyle(status.chipColor)
            .clipShape(Capsule())
            .overlay(Capsule().stroke(status.chipColor.opacity(0.4), lineWidth: 1))
    }
}

private struct TypeBadge: View {
    let type: ShipType
    var body: some View {
        Text(type.rawValue.uppercased())
            .font(.shipyardMono(10))
            .tracking(1.5)
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(Palette.steel.opacity(0.15))
            .foregroundStyle(Palette.steel)
            .clipShape(Capsule())
            .overlay(Capsule().stroke(Palette.steel.opacity(0.3), lineWidth: 1))
    }
}

private struct StepBadge: View {
    let step: Int
    var body: some View {
        Text("STEP \(step)")
            .font(.shipyardMono(10))
            .tracking(1.5)
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(Palette.gold.opacity(0.15))
            .foregroundStyle(Palette.gold)
            .clipShape(Capsule())
            .overlay(Capsule().stroke(Palette.gold.opacity(0.3), lineWidth: 1))
    }
}

#Preview {
    NavigationStack {
        ShipDetailView(ship: FleetStore.mockFleet[0])
    }
    .environment(FleetStore())
}
