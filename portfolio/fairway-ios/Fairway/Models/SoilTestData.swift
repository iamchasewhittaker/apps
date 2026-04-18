import Foundation

enum NutrientRating: String, Codable {
    case low = "Low"
    case optimal = "Optimal"
    case high = "High"
}

struct NutrientReading: Codable, Identifiable {
    var id: UUID = UUID()
    var name: String
    var symbol: String
    var result: Double
    var optimalMin: Double
    var optimalMax: Double
    var rating: NutrientRating

    var fractionOfOptimal: Double {
        let mid = (optimalMin + optimalMax) / 2
        guard mid > 0 else { return 0 }
        return min(result / mid, 2.0)
    }
}

struct SoilTestData: Codable {
    var testedBy: String = "Jimmy Lewis"
    var consultantURL: String = "jimmylewismows.com"
    var dateReceived: Date
    var ph: Double
    var nutrients: [NutrientReading]
    var keyFindings: [String]
    var recommendations: [String]
}
