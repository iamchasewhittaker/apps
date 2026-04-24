import Foundation

enum MaintenanceCategory: String, Codable, CaseIterable, Identifiable {
    case irrigation = "Irrigation"
    case mowing = "Mowing"
    case weedControl = "Weed Control"
    case aeration = "Aeration"
    case seasonal = "Seasonal"
    case inspection = "Inspection"
    case shrubBeds = "Shrub Beds"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .irrigation: return "drop.fill"
        case .mowing: return "scissors"
        case .weedControl: return "leaf.arrow.circlepath"
        case .aeration: return "circle.grid.3x3.fill"
        case .seasonal: return "calendar"
        case .inspection: return "magnifyingglass"
        case .shrubBeds: return "leaf.fill"
        }
    }
}

struct MaintenanceTask: Codable, Identifiable {
    var id: UUID = UUID()
    var title: String
    var category: MaintenanceCategory
    var targetDate: Date? = nil
    var completedDate: Date? = nil
    var isCompleted: Bool = false
    var isRecurring: Bool = false
    var recurrenceNote: String = ""
    var notes: String = ""
    var zoneNumber: Int? = nil
    var reminderEnabled: Bool = false
}

struct MowEntry: Codable, Identifiable {
    var id: UUID = UUID()
    var date: Date
    var bladeHeightInches: Double
    var stripeDirection: String = ""
    var durationMinutes: Int = 0
    var notes: String = ""
}

enum MowDirection: Equatable, Hashable {
    case northSouth
    case eastWest
    case diagonalNESW
    case diagonalNWSE
    case checkerboard
    case other(String)

    static let presets: [MowDirection] = [
        .northSouth, .eastWest, .diagonalNESW, .diagonalNWSE, .checkerboard
    ]

    var displayLabel: String {
        switch self {
        case .northSouth: return "N–S"
        case .eastWest: return "E–W"
        case .diagonalNESW: return "Diagonal NE-SW"
        case .diagonalNWSE: return "Diagonal NW-SE"
        case .checkerboard: return "Checkerboard"
        case .other(let s): return s.isEmpty ? "Other" : s
        }
    }

    var rawString: String {
        switch self {
        case .northSouth: return "N–S"
        case .eastWest: return "E–W"
        case .diagonalNESW: return "Diagonal NE-SW"
        case .diagonalNWSE: return "Diagonal NW-SE"
        case .checkerboard: return "Checkerboard"
        case .other(let s): return s
        }
    }

    init(rawString: String) {
        let trimmed = rawString.trimmingCharacters(in: .whitespaces)
        switch trimmed {
        case MowDirection.northSouth.rawString, "N-S", "NS":
            self = .northSouth
        case MowDirection.eastWest.rawString, "E-W", "EW":
            self = .eastWest
        case MowDirection.diagonalNESW.rawString, "NE-SW", "Diagonal NE–SW":
            self = .diagonalNESW
        case MowDirection.diagonalNWSE.rawString, "NW-SE", "Diagonal NW–SE":
            self = .diagonalNWSE
        case MowDirection.checkerboard.rawString:
            self = .checkerboard
        default:
            self = .other(trimmed)
        }
    }
}
