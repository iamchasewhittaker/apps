import Foundation

struct WaterRun: Codable, Identifiable {
    var id: UUID = UUID()
    var date: Date = Date()
    var zoneNumber: Int
    var durationMinutes: Int
    var notes: String = ""
}
