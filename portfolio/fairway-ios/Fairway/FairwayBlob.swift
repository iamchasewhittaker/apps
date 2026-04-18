import Foundation

struct FairwayBlob: Codable {
    var zones: [ZoneData] = []
    var soilTest: SoilTestData? = nil
    var fertilizerPlan: [FertilizerEntry] = []
    var maintenanceTasks: [MaintenanceTask] = []
    var mowLog: [MowEntry] = []
    var inventory: [InventoryItem] = []
    var _syncAt: Double? = nil
    var seeded: Bool = false
}
