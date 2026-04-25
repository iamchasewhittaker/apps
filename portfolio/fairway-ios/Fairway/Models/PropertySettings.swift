import Foundation

struct PropertySettings: Codable, Equatable {
    var address: String
    var latitude: Double
    var longitude: Double
    var geocodedAt: Date = Date()

    var hasValidCoordinates: Bool {
        abs(latitude) > 0.0001 &&
        abs(longitude) > 0.0001 &&
        abs(latitude) <= 90 &&
        abs(longitude) <= 180
    }
}
