import Foundation

struct LawnObservation: Codable, Identifiable {
    var id: UUID = UUID()
    var date: Date = Date()
    var zoneNumber: Int? = nil
    var text: String = ""
    var photoID: UUID? = nil
    var latitude: Double? = nil
    var longitude: Double? = nil
}
