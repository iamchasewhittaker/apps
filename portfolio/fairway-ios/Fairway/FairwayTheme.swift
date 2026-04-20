import SwiftUI

// MARK: - Color hex init

extension Color {
    init(hex: String) {
        var hex = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if hex.hasPrefix("#") { hex.removeFirst() }

        var rgb: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&rgb)

        let r, g, b, a: Double
        switch hex.count {
        case 6:
            r = Double((rgb & 0xFF0000) >> 16) / 255.0
            g = Double((rgb & 0x00FF00) >> 8) / 255.0
            b = Double(rgb & 0x0000FF) / 255.0
            a = 1.0
        case 8:
            r = Double((rgb & 0xFF000000) >> 24) / 255.0
            g = Double((rgb & 0x00FF0000) >> 16) / 255.0
            b = Double((rgb & 0x0000FF00) >> 8) / 255.0
            a = Double(rgb & 0x000000FF) / 255.0
        default:
            r = 1; g = 1; b = 1; a = 1
        }

        self.init(.sRGB, red: r, green: g, blue: b, opacity: a)
    }
}

// MARK: - Fairway theme tokens

enum FairwayTheme {
    static let backgroundPrimary = Color(hex: "#0a1a0d")
    static let backgroundSurface = Color(hex: "#0f2214")
    static let backgroundElevated = Color(hex: "#152d1a")

    static let accentGreen = Color(hex: "#036635")
    static let accentGold = Color(hex: "#d4af37")

    static let fairwayMid = Color(hex: "#024e28")
    static let fairwayDeep = Color(hex: "#013a1c")
    static let sunAmber = Color(hex: "#e8a030")

    static let statusHealthy = Color(hex: "#22C55E")
    static let statusAttention = Color(hex: "#F59E0B")
    static let statusAction = Color(hex: "#EF4444")

    static let badgePreSeason = Color(hex: "#F59E0B")
    static let badgeConfirmed = Color(hex: "#EF4444")

    static let textPrimary = Color(hex: "#e8dfc8")
    static let textSecondary = Color(hex: "#5a7a5a")

    static let stockGood = Color(hex: "#22C55E")
    static let stockLow = Color(hex: "#F59E0B")
    static let stockEmpty = Color(hex: "#EF4444")

    static func color(named name: String) -> Color {
        switch name {
        case "statusHealthy": return statusHealthy
        case "statusAttention": return statusAttention
        case "statusAction": return statusAction
        case "stockGood": return stockGood
        case "stockLow": return stockLow
        case "stockEmpty": return stockEmpty
        default: return textSecondary
        }
    }

    static func severityColor(_ severity: Severity) -> Color {
        switch severity {
        case .low: return statusAttention
        case .medium: return statusAction
        case .high: return statusAction
        }
    }

    static func waterNeedColor(_ need: WaterNeed) -> Color {
        switch need {
        case .low: return Color(hex: "#8FA98F")
        case .medium: return Color(hex: "#3B82F6")
        case .high: return Color(hex: "#0EA5E9")
        }
    }
}

// MARK: - Badges

struct PreSeasonBadge: View {
    var body: some View {
        Text("PRE-SEASON")
            .font(.caption2).bold()
            .padding(.horizontal, 8).padding(.vertical, 3)
            .background(FairwayTheme.badgePreSeason.opacity(0.18))
            .foregroundStyle(FairwayTheme.badgePreSeason)
            .clipShape(Capsule())
            .overlay(Capsule().stroke(FairwayTheme.badgePreSeason.opacity(0.6), lineWidth: 0.5))
    }
}

struct ConfirmedBadge: View {
    var body: some View {
        Text("CONFIRMED")
            .font(.caption2).bold()
            .padding(.horizontal, 8).padding(.vertical, 3)
            .background(FairwayTheme.badgeConfirmed.opacity(0.18))
            .foregroundStyle(FairwayTheme.badgeConfirmed)
            .clipShape(Capsule())
            .overlay(Capsule().stroke(FairwayTheme.badgeConfirmed.opacity(0.6), lineWidth: 0.5))
    }
}

struct ProblemBadge: View {
    let isPreSeason: Bool
    var body: some View {
        if isPreSeason {
            PreSeasonBadge()
        } else {
            ConfirmedBadge()
        }
    }
}

struct SeverityBadge: View {
    let severity: Severity
    var body: some View {
        Text(severity.rawValue.uppercased())
            .font(.caption2).bold()
            .padding(.horizontal, 8).padding(.vertical, 3)
            .background(FairwayTheme.severityColor(severity).opacity(0.18))
            .foregroundStyle(FairwayTheme.severityColor(severity))
            .clipShape(Capsule())
    }
}

struct ZoneStatusDot: View {
    let colorName: String
    var size: CGFloat = 12
    var body: some View {
        Circle()
            .fill(FairwayTheme.color(named: colorName))
            .frame(width: size, height: size)
            .overlay(
                Circle()
                    .stroke(FairwayTheme.color(named: colorName).opacity(0.35), lineWidth: 3)
                    .scaleEffect(1.3)
            )
    }
}

struct StockBadge: View {
    let currentLbs: Double?
    let onApplicationLbs: Double?

    private var status: StockStatus {
        guard let current = currentLbs else { return .unknown }
        guard let lot = onApplicationLbs, lot > 0 else { return current > 0 ? .good : .empty }
        if current <= 0 { return .empty }
        if current < lot { return .low }
        return .good
    }

    var body: some View {
        HStack(spacing: 6) {
            Circle()
                .fill(FairwayTheme.color(named: status.colorName))
                .frame(width: 8, height: 8)
            Text(status.label)
                .font(.caption)
                .foregroundStyle(FairwayTheme.color(named: status.colorName))
        }
    }
}

struct ZoneNumberBadge: View {
    let number: Int
    var body: some View {
        ZStack {
            Circle().fill(FairwayTheme.accentGreen)
            Text("\(number)")
                .font(.headline.bold())
                .foregroundStyle(FairwayTheme.textPrimary)
        }
        .frame(width: 40, height: 40)
    }
}

// MARK: - Reusable card container

struct FairwayCard<Content: View>: View {
    let content: Content
    init(@ViewBuilder content: () -> Content) { self.content = content() }

    var body: some View {
        content
            .padding(16)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(FairwayTheme.backgroundSurface)
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .stroke(FairwayTheme.backgroundElevated, lineWidth: 1)
            )
    }
}
