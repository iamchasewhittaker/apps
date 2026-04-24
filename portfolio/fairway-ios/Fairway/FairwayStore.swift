import Foundation
import Observation

@Observable
@MainActor
final class FairwayStore {
    var blob: FairwayBlob = FairwayBlob()
    let photos = PhotoStore()

    nonisolated init() {}

    func load() {
        guard let data = UserDefaults.standard.data(forKey: FairwayConfig.storeKey),
              let decoded = try? JSONDecoder().decode(FairwayBlob.self, from: data) else {
            seedIfNeeded()
            return
        }
        blob = decoded
        if !blob.seeded { seedIfNeeded() }
    }

    func save() {
        blob._syncAt = Date().timeIntervalSince1970 * 1000
        guard let data = try? JSONEncoder().encode(blob) else { return }
        UserDefaults.standard.set(data, forKey: FairwayConfig.storeKey)
    }

    // MARK: - Zone mutations
    func updateZone(_ zone: ZoneData) {
        if let idx = blob.zones.firstIndex(where: { $0.id == zone.id }) {
            blob.zones[idx] = zone
            save()
        }
    }

    func addHead(_ head: HeadData, to zoneID: UUID) {
        guard let idx = blob.zones.firstIndex(where: { $0.id == zoneID }) else { return }
        blob.zones[idx].heads.append(head)
        save()
    }

    func updateHead(_ head: HeadData, in zoneID: UUID) {
        guard let zi = blob.zones.firstIndex(where: { $0.id == zoneID }),
              let hi = blob.zones[zi].heads.firstIndex(where: { $0.id == head.id }) else { return }
        blob.zones[zi].heads[hi] = head
        save()
    }

    func deleteHead(id: UUID, from zoneID: UUID) {
        guard let zi = blob.zones.firstIndex(where: { $0.id == zoneID }) else { return }
        blob.zones[zi].heads.removeAll { $0.id == id }
        save()
    }

    func addProblem(_ problem: ProblemData, to zoneID: UUID) {
        guard let idx = blob.zones.firstIndex(where: { $0.id == zoneID }) else { return }
        blob.zones[idx].problemAreas.append(problem)
        save()
    }

    func updateProblem(_ problem: ProblemData, in zoneID: UUID) {
        guard let zi = blob.zones.firstIndex(where: { $0.id == zoneID }),
              let pi = blob.zones[zi].problemAreas.firstIndex(where: { $0.id == problem.id }) else { return }
        blob.zones[zi].problemAreas[pi] = problem
        save()
    }

    func deleteProblem(id: UUID, from zoneID: UUID) {
        guard let zi = blob.zones.firstIndex(where: { $0.id == zoneID }) else { return }
        blob.zones[zi].problemAreas.removeAll { $0.id == id }
        save()
    }

    func updateSchedule(_ schedule: ScheduleData, for zoneID: UUID) {
        guard let idx = blob.zones.firstIndex(where: { $0.id == zoneID }) else { return }
        blob.zones[idx].schedule = schedule
        save()
    }

    // MARK: - Bed mutations
    func updateBed(_ bed: ShrubBed, in zoneID: UUID) {
        guard let zi = blob.zones.firstIndex(where: { $0.id == zoneID }),
              let bi = blob.zones[zi].shrubBeds.firstIndex(where: { $0.id == bed.id }) else { return }
        blob.zones[zi].shrubBeds[bi] = bed
        save()
    }

    // MARK: - Fertilizer mutations
    func markFertilizerComplete(id: UUID, date: Date = Date()) {
        guard let idx = blob.fertilizerPlan.firstIndex(where: { $0.id == id }) else { return }
        blob.fertilizerPlan[idx].isCompleted = true
        blob.fertilizerPlan[idx].applicationDate = date
        save()
    }

    func unmarkFertilizerComplete(id: UUID) {
        guard let idx = blob.fertilizerPlan.firstIndex(where: { $0.id == id }) else { return }
        blob.fertilizerPlan[idx].isCompleted = false
        blob.fertilizerPlan[idx].applicationDate = nil
        save()
    }

    // MARK: - Maintenance mutations
    func addMaintenanceTask(_ task: MaintenanceTask) {
        blob.maintenanceTasks.append(task)
        save()
    }

    func updateMaintenanceTask(_ task: MaintenanceTask) {
        guard let idx = blob.maintenanceTasks.firstIndex(where: { $0.id == task.id }) else { return }
        blob.maintenanceTasks[idx] = task
        save()
    }

    func completeMaintenanceTask(id: UUID) {
        guard let idx = blob.maintenanceTasks.firstIndex(where: { $0.id == id }) else { return }
        blob.maintenanceTasks[idx].isCompleted = true
        blob.maintenanceTasks[idx].completedDate = Date()
        save()
    }

    func deleteMaintenanceTask(id: UUID) {
        blob.maintenanceTasks.removeAll { $0.id == id }
        save()
    }

    func addMowEntry(_ entry: MowEntry) {
        blob.mowLog.append(entry)
        save()
    }

    func deleteMowEntry(id: UUID) {
        blob.mowLog.removeAll { $0.id == id }
        save()
    }

    // MARK: - Inventory mutations
    func addInventoryItem(_ item: InventoryItem) {
        blob.inventory.append(item)
        save()
    }

    func updateInventoryItem(_ item: InventoryItem) {
        guard let idx = blob.inventory.firstIndex(where: { $0.id == item.id }) else { return }
        blob.inventory[idx] = item
        save()
    }

    func deleteInventoryItem(id: UUID) {
        blob.inventory.removeAll { $0.id == id }
        save()
    }

    func logInventoryUse(id: UUID, amountLbs: Double, zones: [Int], notes: String = "") {
        guard let idx = blob.inventory.firstIndex(where: { $0.id == id }) else { return }
        let entry = UsageEntry(date: Date(), amountLbs: amountLbs, zonesApplied: zones, notes: notes)
        blob.inventory[idx].usageLog.append(entry)
        blob.inventory[idx].lastUsedDate = Date()
        if let current = blob.inventory[idx].currentStockLbs {
            blob.inventory[idx].currentStockLbs = max(0, current - amountLbs)
        }
        blob.inventory[idx].lastStockUpdateDate = Date()
        save()
    }

    func restockInventory(id: UUID, addLbs: Double) {
        guard let idx = blob.inventory.firstIndex(where: { $0.id == id }) else { return }
        blob.inventory[idx].currentStockLbs = (blob.inventory[idx].currentStockLbs ?? 0) + addLbs
        blob.inventory[idx].lastStockUpdateDate = Date()
        save()
    }

    func addServiceRecord(_ record: ServiceRecord, to itemID: UUID) {
        guard let idx = blob.inventory.firstIndex(where: { $0.id == itemID }) else { return }
        blob.inventory[idx].serviceHistory.append(record)
        save()
    }

    func addSpreaderSetting(_ setting: SpreaderSetting, to itemID: UUID) {
        guard let idx = blob.inventory.firstIndex(where: { $0.id == itemID }) else { return }
        blob.inventory[idx].spreaderSettings.append(setting)
        save()
    }

    // MARK: - Observation mutations

    func addObservation(_ obs: LawnObservation) {
        blob.observations.append(obs)
        save()
    }

    func deleteObservation(id: UUID) {
        if let obs = blob.observations.first(where: { $0.id == id }),
           let photoID = obs.photoID {
            photos.delete(id: photoID)
        }
        blob.observations.removeAll { $0.id == id }
        save()
    }

    // MARK: - Water run mutations

    func addWaterRun(_ run: WaterRun) {
        blob.waterRuns.append(run)
        save()
    }

    func deleteWaterRun(id: UUID) {
        blob.waterRuns.removeAll { $0.id == id }
        save()
    }

    // MARK: - Fertilizer application mutations

    func addFertApplication(_ app: FertApplication) {
        blob.fertApplications.append(app)
        save()
    }

    func deleteFertApplication(id: UUID) {
        blob.fertApplications.removeAll { $0.id == id }
        save()
    }

    // MARK: - Property mutations

    func setProperty(_ settings: PropertySettings) {
        blob.property = settings
        save()
    }

    func clearProperty() {
        blob.property = nil
        save()
    }

    func decrementInventory(id: UUID, by lbs: Double) {
        guard let idx = blob.inventory.firstIndex(where: { $0.id == id }) else { return }
        if let current = blob.inventory[idx].currentStockLbs {
            blob.inventory[idx].currentStockLbs = max(0, current - lbs)
            blob.inventory[idx].lastStockUpdateDate = Date()
        }
        save()
    }

    // MARK: - Seed
    func seedIfNeeded() {
        blob = PreviewData.seededBlob()
        blob.seeded = true
        save()
    }

    // MARK: - Convenience
    func zone(withNumber number: Int) -> ZoneData? {
        blob.zones.first { $0.number == number }
    }

    func zone(withID id: UUID) -> ZoneData? {
        blob.zones.first { $0.id == id }
    }
}
