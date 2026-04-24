import Foundation

struct PropertySettings: Codable {
    var address: String
    var latitude: Double
    var longitude: Double
    var geocodedAt: Date = Date()
}
