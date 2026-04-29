import Foundation

enum Microclimate: String, Codable, CaseIterable {
    case standard = "Standard"
    case parkStrip = "Park Strip"
    case slope = "Slope"
    case shade = "Shade"
}

struct GrassSubZone: Codable, Identifiable, Hashable, Equatable {
    var id: UUID = UUID()
    var label: String
    var squareFootage: Int
    var microclimate: Microclimate = .standard
    var headIDs: [UUID] = []
    var targetRunMinutes: Int? = nil
    var precipRateInPerHour: Double? = nil
    var notes: String = ""
}

extension GrassSubZone {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(UUID.self, forKey: .id) ?? UUID()
        label = try c.decode(String.self, forKey: .label)
        squareFootage = try c.decode(Int.self, forKey: .squareFootage)
        microclimate = try c.decodeIfPresent(Microclimate.self, forKey: .microclimate) ?? .standard
        headIDs = try c.decodeIfPresent([UUID].self, forKey: .headIDs) ?? []
        targetRunMinutes = try c.decodeIfPresent(Int.self, forKey: .targetRunMinutes)
        precipRateInPerHour = try c.decodeIfPresent(Double.self, forKey: .precipRateInPerHour)
        notes = try c.decodeIfPresent(String.self, forKey: .notes) ?? ""
    }
}
