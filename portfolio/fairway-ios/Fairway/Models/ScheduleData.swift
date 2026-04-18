import Foundation

struct ScheduleData: Codable {
    var mode: String = "Flex Daily"
    var cycleMinutes: Int
    var soakMinutes: Int
    var cycles: Int
    var startTime: String = "5:00 AM"
    var precipitationRate: Double
    var grassType: String = ""
    var nozzleType: String = ""
    var notes: String = ""

    var totalRunMinutes: Int { cycleMinutes * cycles }
    var summary: String {
        "Run \(cycleMinutes) min → Soak \(soakMinutes) min × \(cycles) cycles"
    }
}
