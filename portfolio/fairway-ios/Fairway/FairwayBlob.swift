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
