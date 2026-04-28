import Foundation

// MARK: - Alert items

struct AlertItem: Identifiable, Equatable {
    enum Severity: Int, Comparable {
        case high, medium, low
        static func < (lhs: Severity, rhs: Severity) -> Bool { lhs.rawValue < rhs.rawValue }
    }
    enum Destination: Equatable {
        case maintenance
        case fertilizer
        case inventory
        case zone(Int)
        case audit
        case schedule
    }

    let id: String
    let title: String
    let detail: String
    let severity: Severity
    let destination: Destination
}

// MARK: - Audit summary

struct AuditSummary: Equatable {
    let confirmed: Int
    let total: Int
    let needsFieldwork: Int
    let lowConfidence: Int

    var isComplete: Bool { total > 0 && confirmed == total }
    var fractionComplete: Double {
        guard total > 0 else { return 0 }
        return Double(confirmed) / Double(total)
    }
}

// MARK: - Water balance

enum WaterBalance: Equatable {
    case overWatered
    case aboutRight
    case underWatered
    case unknown

    var label: String {
        switch self {
        case .overWatered:  return "Over-watered"
        case .aboutRight:   return "About right"
        case .underWatered: return "Under-watered"
        case .unknown:      return "Not enough data"
        }
    }

    var colorName: String {
        switch self {
        case .overWatered:  return "stockEmpty"
        case .aboutRight:   return "stockGood"
        case .underWatered: return "stockLow"
        case .unknown:      return "statusAttention"
        }
    }
}

// MARK: - Rachio next-run

struct ScheduledRunInfo: Equatable {
    let scheduleName: String
    let nextRunAt: Date
    let durationMinutes: Int
    let zoneCount: Int
}

// MARK: - Pre-emergent meta

/// Soil-temp threshold the spring pre-emergent barrier protects (the temp at
/// which crabgrass germinates in northern Utah). Hardcoded for v1.
let preEmergentSoilThresholdF: Double = 55.0

/// How many days of mowing cadence we use before flagging "next mow due".
let defaultMowCadenceDays: Int = 5

// MARK: - Schedule sanity heuristic constants

/// Thresholds for `weeklyWaterBalance`. Tuned against Utah cool-season grass +
/// Rachio's typical cycle/soak run. Re-tune as data accumulates.
private let underWaterMinutes = 60
private let overWaterMinutes = 180
private let lightRainInches = 0.3
private let heavyRainInches = 1.0

// MARK: - Blob extensions

extension FairwayBlob {

    // ---- Mow ----

    var lastMow: MowEntry? {
        mowLog.max(by: { $0.date < $1.date })
    }

    func daysSinceLastMow(now: Date = Date()) -> Int? {
        guard let last = lastMow else { return nil }
        let interval = now.timeIntervalSince(last.date)
        return max(0, Int(interval / 86_400))
    }

    func nextMowDueDate(cadenceDays: Int = defaultMowCadenceDays) -> Date? {
        guard let last = lastMow else { return nil }
        return Calendar.current.date(byAdding: .day, value: cadenceDays, to: last.date)
    }

    // ---- Audit ----

    /// Counts pre-season audit progress across irrigation zones (skips Z1 which
    /// has bubblers/drip, not heads).
    var auditSummary: AuditSummary {
        let irrigationZones = zones.filter { $0.number != 1 }
        let allHeads = irrigationZones.flatMap { $0.heads }
        let confirmed = allHeads.filter { $0.preSeasonChecked }.count
        let needsFieldwork = allHeads.filter { $0.auditNeedsFieldWork && !$0.preSeasonChecked }.count
        let lowConfidence = allHeads.filter { $0.auditConfidence == "low" && !$0.preSeasonChecked }.count
        return AuditSummary(
            confirmed: confirmed,
            total: allHeads.count,
            needsFieldwork: needsFieldwork,
            lowConfidence: lowConfidence
        )
    }

    // ---- Maintenance / fertilizer / inventory ----

    func overdueMaintenance(now: Date = Date()) -> [MaintenanceTask] {
        maintenanceTasks
            .filter { !$0.isCompleted }
            .filter {
                guard let due = $0.targetDate else { return false }
                return due < now
            }
            .sorted { ($0.targetDate ?? .distantPast) < ($1.targetDate ?? .distantPast) }
    }

    func upcomingMaintenance(within days: Int = 7, now: Date = Date()) -> [MaintenanceTask] {
        let cutoff = Calendar.current.date(byAdding: .day, value: days, to: now) ?? now
        return maintenanceTasks
            .filter { !$0.isCompleted }
            .filter {
                guard let due = $0.targetDate else { return false }
                return due >= now && due <= cutoff
            }
            .sorted { ($0.targetDate ?? .distantFuture) < ($1.targetDate ?? .distantFuture) }
    }

    func missedFertilizerWindows(now: Date = Date()) -> [FertilizerEntry] {
        fertilizerPlan
            .filter { !$0.isCompleted }
            .filter { $0.windowEnd < now }
            .sorted { $0.windowEnd < $1.windowEnd }
    }

    func currentFertilizerWindow(now: Date = Date()) -> FertilizerEntry? {
        fertilizerPlan
            .filter { !$0.isCompleted }
            .filter { $0.windowStart <= now && now <= $0.windowEnd }
            .min(by: { $0.windowEnd < $1.windowEnd })
    }

    func nextFertilizerWindow(now: Date = Date()) -> FertilizerEntry? {
        fertilizerPlan
            .filter { !$0.isCompleted }
            .filter { $0.windowStart > now }
            .min(by: { $0.windowStart < $1.windowStart })
    }

    var lowStockItems: [InventoryItem] {
        inventory.filter { $0.stockStatus == .low || $0.stockStatus == .empty }
    }

    var openHighSeverityProblems: [(zone: ZoneData, problem: ProblemData)] {
        var out: [(ZoneData, ProblemData)] = []
        for zone in zones {
            for problem in zone.problemAreas where !problem.isResolved && problem.severity == .high {
                out.append((zone, problem))
            }
        }
        return out
    }

    // ---- Alerts feed (priority sorted) ----

    func alertItems(now: Date = Date()) -> [AlertItem] {
        var items: [AlertItem] = []

        for problem in openHighSeverityProblems {
            items.append(AlertItem(
                id: "problem-\(problem.problem.id)",
                title: "Z\(problem.zone.number): \(problem.problem.title)",
                detail: problem.problem.description.isEmpty
                    ? "High severity, unresolved"
                    : problem.problem.description,
                severity: .high,
                destination: .zone(problem.zone.number)
            ))
        }

        for task in overdueMaintenance(now: now) {
            let daysLate = max(1, Int(now.timeIntervalSince(task.targetDate ?? now) / 86_400))
            items.append(AlertItem(
                id: "task-\(task.id)",
                title: task.title,
                detail: "Overdue by \(daysLate) day\(daysLate == 1 ? "" : "s") · \(task.category.rawValue)",
                severity: .high,
                destination: .maintenance
            ))
        }

        for entry in missedFertilizerWindows(now: now) {
            items.append(AlertItem(
                id: "fert-\(entry.id)",
                title: "Missed: \(entry.season.rawValue) — \(entry.product)",
                detail: "Window closed \(daysAgoLabel(entry.windowEnd, now: now))",
                severity: .medium,
                destination: .fertilizer
            ))
        }

        let summary = auditSummary
        if !summary.isComplete && (summary.needsFieldwork > 0 || summary.lowConfidence > 0) {
            let detailParts: [String] = [
                summary.needsFieldwork > 0 ? "\(summary.needsFieldwork) need field work" : nil,
                summary.lowConfidence > 0 ? "\(summary.lowConfidence) low confidence" : nil
            ].compactMap { $0 }
            items.append(AlertItem(
                id: "audit-progress",
                title: "Sprinkler audit incomplete",
                detail: detailParts.joined(separator: " · "),
                severity: .medium,
                destination: .audit
            ))
        }

        for item in lowStockItems {
            let label = item.stockStatus == .empty ? "Empty" : "Running low"
            items.append(AlertItem(
                id: "stock-\(item.id)",
                title: "\(label): \(item.name)",
                detail: "\(item.category.rawValue) · check before next application",
                severity: item.stockStatus == .empty ? .medium : .low,
                destination: .inventory
            ))
        }

        // Stable sort by severity then title.
        return items.sorted {
            if $0.severity != $1.severity { return $0.severity < $1.severity }
            return $0.title < $1.title
        }
    }

    // ---- Rachio ----

    var rachioLastRun: RachioEventSnapshot? {
        guard let rachio = rachio else { return nil }
        let now = Date()
        return rachio.recentEvents
            .filter { $0.date <= now && $0.durationSeconds != nil && ($0.durationSeconds ?? 0) > 0 }
            .max(by: { $0.date < $1.date })
    }

    func rachioNextRun(now: Date = Date()) -> ScheduledRunInfo? {
        guard let rachio = rachio else { return nil }
        let activeRules = rachio.allScheduleRules
            .filter { $0.enabled && !$0.rainDelay }
        guard !activeRules.isEmpty else { return nil }

        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = TimeZone.current

        var bestDate: Date?
        var bestRule: RachioScheduleSnapshot?
        for rule in activeRules {
            for offset in 0...7 {
                guard let dayStart = calendar.date(byAdding: .day, value: offset, to: calendar.startOfDay(for: now)),
                      let candidate = calendar.date(
                          bySettingHour: rule.startHour,
                          minute: rule.startMinute,
                          second: 0,
                          of: dayStart
                      ),
                      candidate > now else { continue }
                if bestDate == nil || candidate < (bestDate ?? .distantFuture) {
                    bestDate = candidate
                    bestRule = rule
                }
                break
            }
        }

        guard let date = bestDate, let rule = bestRule else { return nil }
        return ScheduledRunInfo(
            scheduleName: rule.name,
            nextRunAt: date,
            durationMinutes: rule.totalDurationMinutes,
            zoneCount: rule.zoneIds.count
        )
    }

    var rachioActiveRainDelay: Bool {
        guard let rachio = rachio else { return false }
        return rachio.allScheduleRules.contains { $0.enabled && $0.rainDelay }
    }

    // ---- Schedule sanity ----

    func rachioMinutesLast7Days(now: Date = Date()) -> Int {
        guard let rachio = rachio else { return 0 }
        let cutoff = now.addingTimeInterval(-7 * 86_400)
        let totalSeconds = rachio.recentEvents
            .filter { $0.date >= cutoff && $0.date <= now }
            .compactMap { $0.durationSeconds }
            .reduce(0, +)
        return totalSeconds / 60
    }

    var rainfallInchesLast7Days: Double {
        weather?.rainInchesLast7Days ?? 0
    }

    func weeklyWaterBalance(now: Date = Date()) -> WaterBalance {
        guard rachio != nil, weather != nil else { return .unknown }
        let minutes = rachioMinutesLast7Days(now: now)
        let rain = rainfallInchesLast7Days

        if rain >= heavyRainInches && minutes > overWaterMinutes { return .overWatered }
        if rain >= heavyRainInches && minutes >= underWaterMinutes { return .aboutRight }
        if rain >= heavyRainInches && minutes < underWaterMinutes { return .aboutRight }
        if rain >= lightRainInches && minutes > overWaterMinutes { return .overWatered }
        if rain >= lightRainInches && minutes < underWaterMinutes { return .underWatered }
        if rain >= lightRainInches { return .aboutRight }
        if minutes < underWaterMinutes { return .underWatered }
        if minutes > overWaterMinutes { return .aboutRight }
        return .aboutRight
    }

    // ---- Pre-emergent ----

    /// Closest non-completed maintenance task whose title mentions pre-emergent.
    /// Matches any active barrier task (including "Pre-emergent active — no
    /// aerate/dethatch" style tasks).
    var preEmergentTask: MaintenanceTask? {
        maintenanceTasks
            .filter { !$0.isCompleted }
            .filter { $0.title.localizedCaseInsensitiveContains("pre-emergent") }
            .sorted { ($0.targetDate ?? .distantFuture) < ($1.targetDate ?? .distantFuture) }
            .first
    }

    /// First moment in the soil-temp forecast that crosses the pre-emergent
    /// threshold (going up). Nil if forecast empty or already past it.
    func soilTempCrossingDate(threshold: Double = preEmergentSoilThresholdF) -> Date? {
        guard let forecast = weather?.soilTempForecast, !forecast.isEmpty else { return nil }
        let sorted = forecast.sorted { $0.date < $1.date }
        guard let first = sorted.first else { return nil }
        if first.tempF >= threshold { return nil }
        return sorted.first(where: { $0.tempF >= threshold })?.date
    }

    func daysUntilSoilTempCrossing(now: Date = Date()) -> Int? {
        guard let date = soilTempCrossingDate() else { return nil }
        let interval = date.timeIntervalSince(now)
        return max(0, Int(interval / 86_400))
    }
}

// MARK: - Helpers

private func daysAgoLabel(_ date: Date, now: Date) -> String {
    let days = Int(now.timeIntervalSince(date) / 86_400)
    if days <= 0 { return "today" }
    if days == 1 { return "1 day ago" }
    return "\(days) days ago"
}
