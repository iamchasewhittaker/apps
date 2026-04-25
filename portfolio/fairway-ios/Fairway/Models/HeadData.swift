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
    var latitude: Double? = nil
    var longitude: Double? = nil
    var startBearingDegrees: Int? = nil
    var photoPaths: [String] = []

    var hasCoordinates: Bool {
        latitude != nil && longitude != nil
    }
}

extension HeadData {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(UUID.self, forKey: .id) ?? UUID()
        label = try c.decode(String.self, forKey: .label)
        headType = try c.decode(String.self, forKey: .headType)
        nozzle = try c.decode(String.self, forKey: .nozzle)
        arcDegrees = try c.decode(Int.self, forKey: .arcDegrees)
        radiusFeet = try c.decodeIfPresent(Double.self, forKey: .radiusFeet) ?? 0
        gpm = try c.decodeIfPresent(Double.self, forKey: .gpm) ?? 0
        location = try c.decode(String.self, forKey: .location)
        notes = try c.decodeIfPresent(String.self, forKey: .notes) ?? ""
        isConfirmed = try c.decodeIfPresent(Bool.self, forKey: .isConfirmed) ?? true
        confirmedBySeasonTest = try c.decodeIfPresent(Bool.self, forKey: .confirmedBySeasonTest) ?? false
        photoAttached = try c.decodeIfPresent(Bool.self, forKey: .photoAttached) ?? false
        installDate = try c.decodeIfPresent(Date.self, forKey: .installDate)
        lastServiced = try c.decodeIfPresent(Date.self, forKey: .lastServiced)
        issues = try c.decodeIfPresent([HeadIssue].self, forKey: .issues) ?? []
        latitude = try c.decodeIfPresent(Double.self, forKey: .latitude)
        longitude = try c.decodeIfPresent(Double.self, forKey: .longitude)
        startBearingDegrees = try c.decodeIfPresent(Int.self, forKey: .startBearingDegrees)
        photoPaths = try c.decodeIfPresent([String].self, forKey: .photoPaths) ?? []
    }
}
