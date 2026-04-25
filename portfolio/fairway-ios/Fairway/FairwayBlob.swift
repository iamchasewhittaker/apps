import Foundation

struct FairwayBlob: Codable {
    var zones: [ZoneData] = []
    var soilTest: SoilTestData? = nil
    var fertilizerPlan: [FertilizerEntry] = []
    var maintenanceTasks: [MaintenanceTask] = []
    var mowLog: [MowEntry] = []
    var inventory: [InventoryItem] = []
    var observations: [LawnObservation] = []
    var waterRuns: [WaterRun] = []
    var fertApplications: [FertApplication] = []
    var property: PropertySettings? = nil
    var rachio: RachioState? = nil
    var _syncAt: Double? = nil
    var seeded: Bool = false
}

extension FairwayBlob {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        zones = try c.decodeIfPresent([ZoneData].self, forKey: .zones) ?? []
        soilTest = try c.decodeIfPresent(SoilTestData.self, forKey: .soilTest)
        fertilizerPlan = try c.decodeIfPresent([FertilizerEntry].self, forKey: .fertilizerPlan) ?? []
        maintenanceTasks = try c.decodeIfPresent([MaintenanceTask].self, forKey: .maintenanceTasks) ?? []
        mowLog = try c.decodeIfPresent([MowEntry].self, forKey: .mowLog) ?? []
        inventory = try c.decodeIfPresent([InventoryItem].self, forKey: .inventory) ?? []
        observations = try c.decodeIfPresent([LawnObservation].self, forKey: .observations) ?? []
        waterRuns = try c.decodeIfPresent([WaterRun].self, forKey: .waterRuns) ?? []
        fertApplications = try c.decodeIfPresent([FertApplication].self, forKey: .fertApplications) ?? []
        property = try c.decodeIfPresent(PropertySettings.self, forKey: .property)
        rachio = try c.decodeIfPresent(RachioState.self, forKey: .rachio)
        _syncAt = try c.decodeIfPresent(Double.self, forKey: ._syncAt)
        seeded = try c.decodeIfPresent(Bool.self, forKey: .seeded) ?? false
    }
}
