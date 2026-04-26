import Foundation

enum Severity: String, Codable, CaseIterable, Identifiable {
    case low = "Low"
    case medium = "Medium"
    case high = "High"

    var id: String { rawValue }
}

struct ProblemData: Codable, Identifiable {
    var id: UUID = UUID()
    var title: String
    var description: String = ""
    var severity: Severity
    var isPreSeason: Bool
    var isResolved: Bool = false
    var dateLogged: Date = Date()
    var resolvedDate: Date? = nil
    var notes: String = ""
    var actions: [String] = []
}

extension ProblemData {
    enum CodingKeys: String, CodingKey {
        case id, title, description, severity, isPreSeason, isResolved, dateLogged, resolvedDate, notes, actions
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(UUID.self, forKey: .id) ?? UUID()
        title = try c.decode(String.self, forKey: .title)
        description = try c.decodeIfPresent(String.self, forKey: .description) ?? ""
        severity = try c.decode(Severity.self, forKey: .severity)
        isPreSeason = try c.decode(Bool.self, forKey: .isPreSeason)
        isResolved = try c.decodeIfPresent(Bool.self, forKey: .isResolved) ?? false
        dateLogged = try c.decodeIfPresent(Date.self, forKey: .dateLogged) ?? Date()
        resolvedDate = try c.decodeIfPresent(Date.self, forKey: .resolvedDate)
        notes = try c.decodeIfPresent(String.self, forKey: .notes) ?? ""
        actions = try c.decodeIfPresent([String].self, forKey: .actions) ?? []
    }
}
