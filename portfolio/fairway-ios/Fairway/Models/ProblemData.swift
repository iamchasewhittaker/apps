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
}
