import Foundation

enum ZoneType: String, Codable, CaseIterable {
    case shrubs = "Shrubs/Bubblers"
    case coolSeasonGrass = "Cool Season Grass"
}

struct ZoneData: Codable, Identifiable {
    var id: UUID = UUID()
    var number: Int
    var name: String
    var type: ZoneType
    var squareFootage: Int
    var headType: String
    var notes: String = ""
    var heads: [HeadData] = []
    var problemAreas: [ProblemData] = []
    var schedule: ScheduleData? = nil
    var shrubBeds: [ShrubBed] = []

    var subZones: [GrassSubZone] = []

    var openProblemCount: Int { problemAreas.filter { !$0.isResolved }.count }
    var confirmedHeadCount: Int { heads.filter { $0.isConfirmed }.count }
    var preSeasonHeadCount: Int { heads.filter { !$0.isConfirmed }.count }

    var statusColor: String {
        let criticalProblems = problemAreas.filter { !$0.isResolved && $0.severity == .high }.count
        if criticalProblems > 0 { return "statusAction" }
        if openProblemCount > 0 { return "statusAttention" }
        return "statusHealthy"
    }
}

extension ZoneData {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(UUID.self, forKey: .id) ?? UUID()
        number = try c.decode(Int.self, forKey: .number)
        name = try c.decode(String.self, forKey: .name)
        type = try c.decode(ZoneType.self, forKey: .type)
        squareFootage = try c.decode(Int.self, forKey: .squareFootage)
        headType = try c.decode(String.self, forKey: .headType)
        notes = try c.decodeIfPresent(String.self, forKey: .notes) ?? ""
        heads = try c.decodeIfPresent([HeadData].self, forKey: .heads) ?? []
        problemAreas = try c.decodeIfPresent([ProblemData].self, forKey: .problemAreas) ?? []
        schedule = try c.decodeIfPresent(ScheduleData.self, forKey: .schedule)
        shrubBeds = try c.decodeIfPresent([ShrubBed].self, forKey: .shrubBeds) ?? []
        subZones = try c.decodeIfPresent([GrassSubZone].self, forKey: .subZones) ?? []
    }
}

struct ShrubBed: Codable, Identifiable {
    var id: UUID = UUID()
    var label: String
    var description: String
    var plants: [PlantEntry] = []
    var notes: String = ""
    var lastUpkeepDate: Date? = nil
    var upkeepTasks: [BedUpkeepTask] = []
}

struct PlantEntry: Codable, Identifiable {
    var id: UUID = UUID()
    var name: String
    var count: Int
    var waterNeeds: WaterNeed
    var notes: String = ""
}

enum WaterNeed: String, Codable, CaseIterable {
    case low = "Low"
    case medium = "Medium"
    case high = "High"
}

struct BedUpkeepTask: Codable, Identifiable {
    var id: UUID = UUID()
    var title: String
    var dueDate: Date? = nil
    var isCompleted: Bool = false
    var completedDate: Date? = nil
    var reminderEnabled: Bool = false
    var notes: String = ""
}
