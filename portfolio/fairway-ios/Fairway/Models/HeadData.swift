import Foundation

enum HeadIssue: String, Codable, CaseIterable, Identifiable {
    case stuckRotor = "Stuck Rotor"
    case cloggedNozzle = "Clogged Nozzle"
    case tiltedHead = "Tilted Head"
    case overspray = "Overspray onto Hardscape"
    case coverageGap = "Coverage Gap"
    case misdirected = "Misdirected"
    case lowPressure = "Low Pressure"

    var id: String { rawValue }
}

struct HeadData: Codable, Identifiable {
    var id: UUID = UUID()
    var label: String
    var headType: String
    var nozzle: String
    var arcDegrees: Int
    var radiusFeet: Double = 0
    var gpm: Double = 0
    var location: String
    var notes: String = ""
    var isConfirmed: Bool = true
    var confirmedBySeasonTest: Bool = false
    var photoAttached: Bool = false
    var installDate: Date? = nil
    var lastServiced: Date? = nil
    var issues: [HeadIssue] = []
}
