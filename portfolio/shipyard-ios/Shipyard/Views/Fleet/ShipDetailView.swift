import SwiftUI

struct ShipDetailView: View {
    let ship: Ship

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {

                // Status + type badges
                HStack(spacing: 8) {
                    StatusBadge(status: ship.status)
                    TypeBadge(type: ship.type)
                    if let step = ship.mvp_step_actual {
                        StepBadge(step: step)
                    }
                }

                // Commit freshness
                if let days = ship.days_since_commit {
                    DetailRow(label: "Last commit") {
                        Text(days == 0 ? "Today" : "\(days)d ago")
                            .foregroundStyle(freshColor(days: days))
                    }
                }

                // Tech stack
                if let stack = ship.tech_stack {
                    DetailRow(label: "Stack") {
                        Text(stack)
                            .foregroundStyle(.white)
                    }
                }

                // Compliance score
                DetailRow(label: "Compliance") {
                    let score = ship.compliance_score
                    Text("\(score) / 7")
                        .foregroundStyle(score >= 6 ? Color.green : score >= 4 ? Color.yellow : Color.red)
                }

                // Live URL
                if ship.has_live_url, let urlStr = ship.live_url, let url = URL(string: urlStr) {
                    DetailRow(label: "Live URL") {
                        Link(urlStr, destination: url)
                            .font(.caption)
                            .foregroundStyle(Palette.gold)
                            .lineLimit(1)
                    }
                }

                Spacer(minLength: 40)
            }
            .padding()
        }
        .background(Palette.navy.ignoresSafeArea())
        .navigationTitle(ship.name)
        .navigationBarTitleDisplayMode(.large)
        .toolbarBackground(Palette.navy, for: .navigationBar)
        .toolbarBackground(.visible, for: .navigationBar)
        .toolbarColorScheme(.dark, for: .navigationBar)
    }

    private func freshColor(days: Int) -> Color {
        days <= 7 ? .green : days <= 30 ? .yellow : .red
    }
}

// MARK: - Sub-components

private struct DetailRow<Content: View>: View {
    let label: String
    @ViewBuilder let content: () -> Content

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label.uppercased())
                .font(.caption.weight(.semibold))
                .foregroundStyle(Palette.mist)
            content()
                .font(.subheadline)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Palette.deepSea)
        .clipShape(RoundedRectangle(cornerRadius: 12))
    }
}

private struct StatusBadge: View {
    let status: ShipStatus
    var body: some View {
        Text(status.rawValue)
            .font(.caption.weight(.semibold))
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
            .background(statusColor.opacity(0.2))
            .foregroundStyle(statusColor)
            .clipShape(Capsule())
            .overlay(Capsule().stroke(statusColor.opacity(0.4), lineWidth: 1))
    }
    private var statusColor: Color {
        switch status {
        case .active:   return .green
        case .stalled:  return .yellow
        case .frozen:   return .cyan
        case .archived: return .gray
        }
    }
}

private struct TypeBadge: View {
    let type: ShipType
    var body: some View {
        Text(type.rawValue)
            .font(.caption.weight(.semibold))
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
            .background(Color.blue.opacity(0.15))
            .foregroundStyle(Color.blue)
            .clipShape(Capsule())
            .overlay(Capsule().stroke(Color.blue.opacity(0.3), lineWidth: 1))
    }
}

private struct StepBadge: View {
    let step: Int
    var body: some View {
        Text("Step \(step)")
            .font(.caption.weight(.semibold))
            .padding(.horizontal, 10)
            .padding(.vertical, 4)
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
