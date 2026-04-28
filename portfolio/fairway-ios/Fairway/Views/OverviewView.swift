import SwiftUI
import Charts

/// First tab. Single scroll of weather + alerts + status. Reads from
/// `FairwayStore` and the derived helpers in `OverviewDerived.swift`.
@MainActor
struct OverviewView: View {
    @Environment(FairwayStore.self) private var store
    @State private var quickLog: QuickLogTarget? = nil

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                WeatherCard()
                QuickLogRow(quickLog: $quickLog)

                let alerts = store.blob.alertItems()
                if !alerts.isEmpty {
                    sectionHeader("Needs your attention")
                    ForEach(alerts) { alert in
                        AlertRow(alert: alert)
                    }
                }

                if store.blob.preEmergentTask != nil {
                    PreEmergentSoilTempCard()
                    PreEmergentCountdownCard()
                }

                let auditSummary = store.blob.auditSummary
                if !auditSummary.isComplete {
                    AuditProgressCard(summary: auditSummary)
                }

                sectionHeader("Status")

                if store.rachioIsConnected {
                    RachioStatusCard()
                    if store.blob.weather != nil {
                        ScheduleSanityCard()
                    }
                }

                if store.blob.lastMow != nil {
                    MowStreakCard()
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .scrollContentBackground(.hidden)
        .background(FairwayTheme.backgroundPrimary)
        .navigationDestination(for: AlertItem.Destination.self) { dest in
            AlertDestinationView(destination: dest)
        }
        .navigationTitle("Overview")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button {
                    Task { await store.refreshWeather(force: true) }
                } label: {
                    if store.weatherFetching {
                        ProgressView().controlSize(.small)
                    } else {
                        Image(systemName: "arrow.clockwise")
                    }
                }
                .accessibilityLabel("Refresh weather")
                .foregroundStyle(FairwayTheme.accentGold)
            }
        }
        .task {
            await store.refreshWeather()
        }
        .sheet(item: $quickLog) { target in
            switch target {
            case .mow:         AddMowSheet()
            case .water:       AddWaterRunSheet()
            case .fert:        AddFertAppSheet()
            case .observation: AddObservationSheet()
            }
        }
    }

    @ViewBuilder
    private func sectionHeader(_ title: String) -> some View {
        Text(title.uppercased())
            .font(.caption.bold())
            .tracking(1.2)
            .foregroundStyle(FairwayTheme.textSecondary)
            .padding(.top, 6)
    }
}

// MARK: - Quick log

private enum QuickLogTarget: String, Identifiable {
    case mow, water, fert, observation
    var id: String { rawValue }
}

@MainActor
private struct QuickLogRow: View {
    @Binding var quickLog: QuickLogTarget?

    var body: some View {
        HStack(spacing: 8) {
            quickLogButton(.mow, label: "Mow", systemImage: "scissors")
            quickLogButton(.water, label: "Water", systemImage: "drop.fill")
            quickLogButton(.fert, label: "Fert", systemImage: "leaf.fill")
            quickLogButton(.observation, label: "Note", systemImage: "eye.fill")
        }
    }

    @ViewBuilder
    private func quickLogButton(_ target: QuickLogTarget, label: String, systemImage: String) -> some View {
        Button {
            quickLog = target
        } label: {
            VStack(spacing: 4) {
                Image(systemName: systemImage)
                    .font(.title3)
                Text(label)
                    .font(.caption.bold())
            }
            .frame(maxWidth: .infinity, minHeight: 60)
            .padding(.vertical, 8)
            .background(FairwayTheme.backgroundSurface)
            .foregroundStyle(FairwayTheme.accentGold)
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .stroke(FairwayTheme.backgroundElevated, lineWidth: 1)
            )
        }
        .accessibilityLabel("Log \(label.lowercased())")
    }
}

// MARK: - Weather

@MainActor
private struct WeatherCard: View {
    @Environment(FairwayStore.self) private var store

    var body: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 12) {
                if let weather = store.blob.weather {
                    currentRow(weather: weather)
                    Divider().background(FairwayTheme.backgroundElevated)
                    forecastRow(weather: weather)
                    Divider().background(FairwayTheme.backgroundElevated)
                    rainHistoryRow(weather: weather)
                } else if let error = store.weatherLastError {
                    errorState(error: error)
                } else if store.weatherFetching {
                    loadingState
                } else {
                    loadingState
                }
            }
        }
    }

    private func currentRow(weather: WeatherSnapshot) -> some View {
        HStack(alignment: .firstTextBaseline, spacing: 16) {
            Image(systemName: weatherSymbol(forCode: weather.current.weatherCode))
                .font(.system(size: 44))
                .foregroundStyle(FairwayTheme.accentGold)
                .accessibilityHidden(true)
            VStack(alignment: .leading, spacing: 2) {
                Text("\(Int(weather.current.tempF.rounded()))°F")
                    .font(.system(size: 40, weight: .semibold, design: .rounded))
                    .foregroundStyle(FairwayTheme.textPrimary)
                Text(weatherLabel(forCode: weather.current.weatherCode))
                    .font(.subheadline)
                    .foregroundStyle(FairwayTheme.textSecondary)
                Text("Soil 6 cm: \(Int(weather.current.soilTemp6cmF.rounded()))°F")
                    .font(.caption)
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
            Spacer()
            VStack(alignment: .trailing, spacing: 4) {
                Text("Today")
                    .font(.caption.bold())
                    .tracking(1)
                    .foregroundStyle(FairwayTheme.textSecondary)
                Text(String(format: "%.2f\" rain", weather.current.precipInchesToday))
                    .font(.subheadline.bold())
                    .foregroundStyle(FairwayTheme.textPrimary)
            }
        }
    }

    private func forecastRow(weather: WeatherSnapshot) -> some View {
        let forecastSlice = Array(weather.dailyForecast.prefix(7))
        let maxRain = max(0.05, forecastSlice.map(\.precipInches).max() ?? 0)
        return VStack(alignment: .leading, spacing: 8) {
            Text("7-DAY FORECAST")
                .font(.caption.bold())
                .tracking(1.2)
                .foregroundStyle(FairwayTheme.textSecondary)

            HStack(alignment: .top, spacing: 6) {
                ForEach(forecastSlice) { day in
                    forecastColumn(day: day, maxRain: maxRain)
                }
            }
        }
    }

    @ViewBuilder
    private func forecastColumn(day: DailyWeather, maxRain: Double) -> some View {
        let dayLabel: String = {
            let f = DateFormatter()
            f.dateFormat = "E"
            return f.string(from: day.date)
        }()
        VStack(spacing: 4) {
            Text(dayLabel)
                .font(.caption2.bold())
                .foregroundStyle(FairwayTheme.textSecondary)
            // Rain bar (0-1 scale, capped)
            ZStack(alignment: .bottom) {
                RoundedRectangle(cornerRadius: 3, style: .continuous)
                    .fill(FairwayTheme.backgroundElevated)
                    .frame(height: 28)
                if day.precipInches > 0 {
                    RoundedRectangle(cornerRadius: 3, style: .continuous)
                        .fill(FairwayTheme.waterNeedColor(.medium))
                        .frame(height: max(2, CGFloat(day.precipInches / maxRain) * 28))
                }
            }
            .frame(width: 24)
            Text("\(Int(day.highF.rounded()))°")
                .font(.caption.bold())
                .foregroundStyle(FairwayTheme.textPrimary)
            Text("\(Int(day.lowF.rounded()))°")
                .font(.caption2)
                .foregroundStyle(FairwayTheme.textSecondary)
            Text(day.precipInches > 0 ? String(format: "%.2f\"", day.precipInches) : "—")
                .font(.caption2)
                .foregroundStyle(day.precipInches > 0 ? FairwayTheme.waterNeedColor(.medium) : FairwayTheme.textSecondary)
        }
        .frame(maxWidth: .infinity)
    }

    private func rainHistoryRow(weather: WeatherSnapshot) -> some View {
        HStack {
            Label("Last 7 days", systemImage: "drop.fill")
                .font(.caption)
                .foregroundStyle(FairwayTheme.textSecondary)
            Spacer()
            Text(String(format: "%.2f\" rain", weather.rainInchesLast7Days))
                .font(.subheadline.bold())
                .foregroundStyle(FairwayTheme.waterNeedColor(.medium))
        }
    }

    private var loadingState: some View {
        HStack(spacing: 12) {
            ProgressView().controlSize(.small)
            Text("Loading weather…")
                .font(.subheadline)
                .foregroundStyle(FairwayTheme.textSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .center)
        .frame(minHeight: 80)
    }

    private func errorState(error: String) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Label("Couldn't load weather", systemImage: "exclamationmark.triangle.fill")
                .font(.subheadline.bold())
                .foregroundStyle(FairwayTheme.statusAttention)
            Text(error)
                .font(.caption)
                .foregroundStyle(FairwayTheme.textSecondary)
        }
    }
}

// MARK: - Alerts

@MainActor
private struct AlertRow: View {
    let alert: AlertItem

    var body: some View {
        NavigationLink(value: alert.destination) {
            FairwayCard {
                HStack(alignment: .top, spacing: 12) {
                    severityDot
                        .padding(.top, 4)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(alert.title)
                            .font(.subheadline.bold())
                            .foregroundStyle(FairwayTheme.textPrimary)
                        Text(alert.detail)
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.textSecondary)
                            .lineLimit(2)
                    }
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.caption.bold())
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
            }
        }
        .buttonStyle(.plain)
    }

    private var severityDot: some View {
        Circle()
            .fill(severityColor)
            .frame(width: 10, height: 10)
            .overlay(Circle().stroke(severityColor.opacity(0.35), lineWidth: 3).scaleEffect(1.4))
    }

    private var severityColor: Color {
        switch alert.severity {
        case .high:   return FairwayTheme.statusAction
        case .medium: return FairwayTheme.statusAttention
        case .low:    return FairwayTheme.textSecondary
        }
    }
}

@MainActor
private struct AlertDestinationView: View {
    @Environment(FairwayStore.self) private var store
    let destination: AlertItem.Destination

    var body: some View {
        switch destination {
        case .maintenance: MaintenanceView()
        case .fertilizer:  FertilizerView()
        case .inventory:   InventoryView()
        case .audit:       PreSeasonAuditView()
        case .schedule:    RachioHistoryView()
        case .zone(let n):
            if let zone = store.blob.zones.first(where: { $0.number == n }) {
                ZoneDetailView(zoneID: zone.id, initialTab: .problems)
            } else {
                Text("Zone \(n) not found").foregroundStyle(FairwayTheme.textSecondary)
            }
        }
    }
}

// MARK: - Pre-emergent

@MainActor
private struct PreEmergentSoilTempCard: View {
    @Environment(FairwayStore.self) private var store

    var body: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Label("Soil temp · pre-emergent watch", systemImage: "thermometer.medium")
                        .font(.caption.bold())
                        .tracking(1.1)
                        .foregroundStyle(FairwayTheme.textSecondary)
                    Spacer()
                    if let now = store.blob.weather?.current.soilTemp6cmF {
                        Text("\(Int(now.rounded()))°F now")
                            .font(.caption.bold())
                            .foregroundStyle(FairwayTheme.textPrimary)
                    }
                }
                if let forecast = forecastSlice, !forecast.isEmpty {
                    chart(forecast: forecast)
                    Text("Threshold: \(Int(preEmergentSoilThresholdF))°F (crabgrass germination)")
                        .font(.caption2)
                        .foregroundStyle(FairwayTheme.textSecondary)
                } else {
                    Text("Soil temp forecast unavailable.")
                        .font(.caption)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
            }
        }
    }

    private var forecastSlice: [HourlySoil]? {
        guard let all = store.blob.weather?.soilTempForecast else { return nil }
        return Array(all.prefix(120)) // ~5 days at hourly resolution
    }

    @ViewBuilder
    private func chart(forecast: [HourlySoil]) -> some View {
        let temps = forecast.map(\.tempF)
        let lowerBound = max(30, (temps.min() ?? 50) - 5)
        let upperBound = max(preEmergentSoilThresholdF + 5, (temps.max() ?? 60) + 5)

        Chart {
            ForEach(forecast) { sample in
                LineMark(
                    x: .value("Time", sample.date),
                    y: .value("°F", sample.tempF)
                )
                .interpolationMethod(.catmullRom)
                .foregroundStyle(FairwayTheme.accentGold)
            }
            RuleMark(y: .value("Threshold", preEmergentSoilThresholdF))
                .foregroundStyle(FairwayTheme.statusAction.opacity(0.6))
                .lineStyle(StrokeStyle(lineWidth: 1, dash: [4, 4]))
                .annotation(position: .topTrailing) {
                    Text("55°F")
                        .font(.caption2.bold())
                        .foregroundStyle(FairwayTheme.statusAction)
                }
        }
        .chartYScale(domain: lowerBound...upperBound)
        .chartYAxis {
            AxisMarks(position: .leading, values: .automatic(desiredCount: 3)) { _ in
                AxisGridLine().foregroundStyle(FairwayTheme.backgroundElevated)
                AxisValueLabel().foregroundStyle(FairwayTheme.textSecondary)
            }
        }
        .chartXAxis {
            AxisMarks(values: .stride(by: .day)) { value in
                AxisGridLine().foregroundStyle(FairwayTheme.backgroundElevated)
                AxisValueLabel(format: .dateTime.weekday(.abbreviated))
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
        }
        .frame(height: 140)
    }
}

@MainActor
private struct PreEmergentCountdownCard: View {
    @Environment(FairwayStore.self) private var store

    var body: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("PRE-EMERGENT WINDOW")
                    .font(.caption.bold())
                    .tracking(1.2)
                    .foregroundStyle(FairwayTheme.textSecondary)

                if let task = store.blob.preEmergentTask {
                    if let due = task.targetDate {
                        countdownRow(label: "Days until task date", date: due)
                    }
                    if let crossing = store.blob.daysUntilSoilTempCrossing() {
                        Divider().background(FairwayTheme.backgroundElevated)
                        HStack(alignment: .firstTextBaseline) {
                            Text("\(crossing)")
                                .font(.system(size: 40, weight: .semibold, design: .rounded))
                                .foregroundStyle(FairwayTheme.accentGold)
                            Text("days until soil hits 55°F")
                                .font(.subheadline)
                                .foregroundStyle(FairwayTheme.textSecondary)
                        }
                    }
                    Text(task.title)
                        .font(.caption)
                        .foregroundStyle(FairwayTheme.textPrimary)
                        .lineLimit(2)
                }
            }
        }
    }

    private func countdownRow(label: String, date: Date) -> some View {
        let days = Int(date.timeIntervalSinceNow / 86_400)
        return HStack(alignment: .firstTextBaseline) {
            Text(days < 0 ? "OVERDUE" : "\(days)")
                .font(.system(size: 40, weight: .semibold, design: .rounded))
                .foregroundStyle(days < 0 ? FairwayTheme.statusAction : FairwayTheme.accentGold)
            Text(days < 0 ? label.lowercased() : "\(label.lowercased())")
                .font(.subheadline)
                .foregroundStyle(FairwayTheme.textSecondary)
        }
    }
}

// MARK: - Audit

@MainActor
private struct AuditProgressCard: View {
    let summary: AuditSummary

    var body: some View {
        NavigationLink {
            PreSeasonAuditView()
        } label: {
            FairwayCard {
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        Label("Sprinkler audit", systemImage: "scope")
                            .font(.subheadline.bold())
                            .foregroundStyle(FairwayTheme.textPrimary)
                        Spacer()
                        Text("\(summary.confirmed) / \(summary.total)")
                            .font(.headline)
                            .foregroundStyle(FairwayTheme.accentGold)
                    }
                    progressBar
                    HStack(spacing: 10) {
                        if summary.needsFieldwork > 0 {
                            badge(text: "\(summary.needsFieldwork) need field work", color: FairwayTheme.statusAction)
                        }
                        if summary.lowConfidence > 0 {
                            badge(text: "\(summary.lowConfidence) low confidence", color: FairwayTheme.statusAttention)
                        }
                    }
                    Text("Confirm sprinklers before trusting the schedule.")
                        .font(.caption)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
            }
        }
        .buttonStyle(.plain)
    }

    private var progressBar: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: 4, style: .continuous)
                    .fill(FairwayTheme.backgroundElevated)
                RoundedRectangle(cornerRadius: 4, style: .continuous)
                    .fill(FairwayTheme.accentGold)
                    .frame(width: max(4, geo.size.width * summary.fractionComplete))
            }
        }
        .frame(height: 8)
    }

    private func badge(text: String, color: Color) -> some View {
        Text(text)
            .font(.caption.bold())
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(color.opacity(0.18))
            .foregroundStyle(color)
            .clipShape(Capsule())
    }
}

// MARK: - Rachio status

@MainActor
private struct RachioStatusCard: View {
    @Environment(FairwayStore.self) private var store

    var body: some View {
        NavigationLink {
            RachioHistoryView()
        } label: {
            FairwayCard {
                VStack(alignment: .leading, spacing: 10) {
                    HStack {
                        Label("Rachio", systemImage: "drop.degreesign.fill")
                            .font(.subheadline.bold())
                            .foregroundStyle(FairwayTheme.textPrimary)
                        Spacer()
                        if store.blob.rachioActiveRainDelay {
                            Text("RAIN DELAY")
                                .font(.caption2.bold())
                                .padding(.horizontal, 8)
                                .padding(.vertical, 3)
                                .background(FairwayTheme.waterNeedColor(.medium).opacity(0.18))
                                .foregroundStyle(FairwayTheme.waterNeedColor(.medium))
                                .clipShape(Capsule())
                        }
                    }
                    rowLastRun
                    rowNextRun
                }
            }
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private var rowLastRun: some View {
        if let last = store.blob.rachioLastRun {
            row(
                title: "Last run",
                detail: lastRunDetail(last)
            )
        } else {
            row(title: "Last run", detail: "No recent runs")
        }
    }

    @ViewBuilder
    private var rowNextRun: some View {
        if let next = store.blob.rachioNextRun() {
            row(
                title: "Next run",
                detail: "\(next.scheduleName) · \(formatNext(next.nextRunAt)) · \(next.durationMinutes) min"
            )
        } else {
            row(title: "Next run", detail: store.blob.rachioActiveRainDelay ? "Held by rain delay" : "No upcoming run")
        }
    }

    private func row(title: String, detail: String) -> some View {
        HStack(alignment: .firstTextBaseline) {
            Text(title)
                .font(.caption.bold())
                .tracking(1)
                .foregroundStyle(FairwayTheme.textSecondary)
                .frame(width: 80, alignment: .leading)
            Text(detail)
                .font(.subheadline)
                .foregroundStyle(FairwayTheme.textPrimary)
            Spacer(minLength: 0)
        }
    }

    private func lastRunDetail(_ event: RachioEventSnapshot) -> String {
        let zoneLabel = event.zoneNumber.map { "Z\($0)" } ?? (event.summary.isEmpty ? "Run" : event.summary)
        let minutes = event.durationSeconds.map { $0 / 60 } ?? 0
        let when = formatRelative(event.date)
        if minutes > 0 {
            return "\(zoneLabel) · \(minutes) min · \(when)"
        }
        return "\(zoneLabel) · \(when)"
    }

    private func formatRelative(_ date: Date) -> String {
        let f = RelativeDateTimeFormatter()
        f.unitsStyle = .short
        return f.localizedString(for: date, relativeTo: Date())
    }

    private func formatNext(_ date: Date) -> String {
        let f = DateFormatter()
        f.dateStyle = .none
        f.timeStyle = .short
        let cal = Calendar.current
        if cal.isDateInToday(date) {
            return "today \(f.string(from: date))"
        }
        if cal.isDateInTomorrow(date) {
            return "tomorrow \(f.string(from: date))"
        }
        f.dateFormat = "EEE h:mm a"
        return f.string(from: date)
    }
}

// MARK: - Schedule sanity

@MainActor
private struct ScheduleSanityCard: View {
    @Environment(FairwayStore.self) private var store

    var body: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("SCHEDULE SANITY · LAST 7 DAYS")
                    .font(.caption.bold())
                    .tracking(1.2)
                    .foregroundStyle(FairwayTheme.textSecondary)

                let minutes = store.blob.rachioMinutesLast7Days()
                let rain = store.blob.rainfallInchesLast7Days
                let balance = store.blob.weeklyWaterBalance()

                HStack(alignment: .firstTextBaseline, spacing: 16) {
                    VStack(alignment: .leading) {
                        Text("\(minutes)")
                            .font(.system(size: 30, weight: .semibold, design: .rounded))
                            .foregroundStyle(FairwayTheme.textPrimary)
                        Text("Rachio min")
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }
                    VStack(alignment: .leading) {
                        Text(String(format: "%.2f\"", rain))
                            .font(.system(size: 30, weight: .semibold, design: .rounded))
                            .foregroundStyle(FairwayTheme.waterNeedColor(.medium))
                        Text("rainfall")
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }
                    Spacer()
                    Text(balance.label)
                        .font(.caption.bold())
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(FairwayTheme.color(named: balance.colorName).opacity(0.18))
                        .foregroundStyle(FairwayTheme.color(named: balance.colorName))
                        .clipShape(Capsule())
                }
            }
        }
    }
}

// MARK: - Mow streak

@MainActor
private struct MowStreakCard: View {
    @Environment(FairwayStore.self) private var store

    var body: some View {
        NavigationLink {
            MowLogView()
        } label: {
            FairwayCard {
                HStack(alignment: .firstTextBaseline) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("MOW LOG")
                            .font(.caption.bold())
                            .tracking(1.2)
                            .foregroundStyle(FairwayTheme.textSecondary)
                        if let last = store.blob.lastMow {
                            let days = store.blob.daysSinceLastMow() ?? 0
                            Text("\(days == 0 ? "Today" : "\(days) day\(days == 1 ? "" : "s") ago")")
                                .font(.title3.bold())
                                .foregroundStyle(FairwayTheme.textPrimary)
                            Text("Blade \(String(format: "%.2f", last.bladeHeightInches))\"")
                                .font(.caption)
                                .foregroundStyle(FairwayTheme.textSecondary)
                        }
                    }
                    Spacer()
                    if let nextDue = store.blob.nextMowDueDate() {
                        VStack(alignment: .trailing, spacing: 4) {
                            Text("NEXT DUE")
                                .font(.caption2.bold())
                                .tracking(1)
                                .foregroundStyle(FairwayTheme.textSecondary)
                            Text(nextDueLabel(nextDue))
                                .font(.subheadline.bold())
                                .foregroundStyle(nextDueColor(nextDue))
                        }
                    }
                }
            }
        }
        .buttonStyle(.plain)
    }

    private func nextDueLabel(_ date: Date) -> String {
        let days = Int(date.timeIntervalSinceNow / 86_400)
        if days < 0 { return "\(-days)d overdue" }
        if days == 0 { return "today" }
        if days == 1 { return "tomorrow" }
        return "in \(days)d"
    }

    private func nextDueColor(_ date: Date) -> Color {
        let days = Int(date.timeIntervalSinceNow / 86_400)
        if days < 0 { return FairwayTheme.statusAction }
        if days <= 1 { return FairwayTheme.statusAttention }
        return FairwayTheme.textPrimary
    }
}

// MARK: - Hashable for navigationDestination

extension AlertItem.Destination: Hashable {
    func hash(into hasher: inout Hasher) {
        switch self {
        case .maintenance: hasher.combine("maintenance")
        case .fertilizer:  hasher.combine("fertilizer")
        case .inventory:   hasher.combine("inventory")
        case .audit:       hasher.combine("audit")
        case .schedule:    hasher.combine("schedule")
        case .zone(let n): hasher.combine("zone-\(n)")
        }
    }
}

#Preview {
    NavigationStack { OverviewView() }
        .environment(FairwayStore())
        .preferredColorScheme(.dark)
}
