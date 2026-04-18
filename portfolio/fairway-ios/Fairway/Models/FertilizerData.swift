import Foundation

enum FertilizerSeason: String, Codable, CaseIterable, Identifiable {
    case earlySpring = "Early Spring"
    case lateSpring = "Late Spring"
    case summer = "Summer"
    case earlyFall = "Early Fall"
    case lateFall = "Late Fall"
    case monthly = "Monthly (Summer)"

    var id: String { rawValue }
}

struct FertilizerEntry: Codable, Identifiable {
    var id: UUID = UUID()
    var season: FertilizerSeason
    var product: String
    var alternateProduct: String = ""
    var ratePerThousandSqFt: Double
    var unit: String = "lb"
    var windowStart: Date
    var windowEnd: Date
    var productURL: String? = nil
    var productSource: String? = nil
    var applicationDate: Date? = nil
    var isCompleted: Bool = false
    var notes: String = ""
}
