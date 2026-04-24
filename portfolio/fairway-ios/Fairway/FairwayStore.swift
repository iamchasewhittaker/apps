import Foundation
import Observation

struct RachioConnectPreview {
    let personId: String
    let devices: [RachioDTO.PersonResponse.Device]
}

@MainActor
@Observable
final class FairwayStore {
    var blob: FairwayBlob
    let photos: PhotoStore

    // MARK: - Rachio observable state
    var rachioSyncing: Bool
    var rachioLastError: String?

    private let rachioAPI = RachioAPI()

    init() {
        blob = FairwayBlob()
        photos = PhotoStore()
        rachioSyncing = false
        rachioLastError = nil
    }

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

    // MARK: - Rachio

    var hasRachioToken: Bool { RachioKeychain.hasToken() }
    var rachioIsConnected: Bool { blob.rachio != nil && hasRachioToken }

    /// Validate the token and fetch available devices — does NOT persist anything.
    func verifyRachioToken(_ token: String) async throws -> RachioConnectPreview {
        rachioLastError = nil
        let info = try await rachioAPI.fetchPersonInfo(token: token)
        let person = try await rachioAPI.fetchPerson(id: info.id, token: token)
        guard !person.devices.isEmpty else { throw RachioError.noDevices }
        return RachioConnectPreview(personId: info.id, devices: person.devices)
    }

    /// Finalize connection: persist token in Keychain, seed `blob.rachio` from the
    /// chosen device, then run an initial sync (events + snapshot).
    func completeRachioConnection(token: String, personId: String, device: RachioDTO.PersonResponse.Device) async {
        rachioSyncing = true
        defer { rachioSyncing = false }
        rachioLastError = nil
        _ = RachioKeychain.saveToken(token)

        let zoneSnapshots = (device.zones ?? [])
            .sorted { $0.zoneNumber < $1.zoneNumber }
            .map { $0.toSnapshot() }
        let scheduleSnapshots = (device.scheduleRules ?? []).map { $0.toSnapshot() }
        let flexSnapshots = (device.flexScheduleRules ?? []).map { $0.toSnapshot() }

        // Auto-link Fairway zones to Rachio zones by zone number (1/2/3/4).
        var links: [String: String] = [:]
        for fairwayZone in blob.zones {
            if let match = zoneSnapshots.first(where: { $0.zoneNumber == fairwayZone.number }) {
                links["\(fairwayZone.number)"] = match.id
            }
        }

        blob.rachio = RachioState(
            personId: personId,
            deviceId: device.id,
            deviceName: device.name ?? "Rachio",
            lastSyncAt: Date(),
            zones: zoneSnapshots,
            scheduleRules: scheduleSnapshots,
            flexScheduleRules: flexSnapshots,
            recentEvents: [],
            zoneLinks: links
        )
        save()

        // Initial event backfill.
        await pullRachioEvents(windowDays: FairwayConfig.rachioInitialHistoryDays, token: token)
    }

    /// Refresh the device snapshot + pull any new events since lastSyncAt.
    func syncRachio() async {
        guard var state = blob.rachio else {
            rachioLastError = "Not connected to Rachio."
            return
        }
        guard let token = RachioKeychain.readToken() else {
            rachioLastError = RachioError.missingToken.localizedDescription
            return
        }
        rachioSyncing = true
        defer { rachioSyncing = false }
        rachioLastError = nil

        do {
            let person = try await rachioAPI.fetchPerson(id: state.personId, token: token)
            guard let device = person.devices.first(where: { $0.id == state.deviceId }) else {
                rachioLastError = "Previously-linked device is no longer on the account."
                return
            }
            state.zones = (device.zones ?? [])
                .sorted { $0.zoneNumber < $1.zoneNumber }
                .map { $0.toSnapshot() }
            state.scheduleRules = (device.scheduleRules ?? []).map { $0.toSnapshot() }
            state.flexScheduleRules = (device.flexScheduleRules ?? []).map { $0.toSnapshot() }
            state.lastSyncAt = Date()
            blob.rachio = state
            save()
        } catch let err as RachioError {
            handleRachioError(err)
            return
        } catch {
            rachioLastError = error.localizedDescription
            return
        }

        // Pull events since lastSyncAt (with 1-day overlap to catch any drift).
        let from = blob.rachio?.lastSyncAt.addingTimeInterval(-86_400) ?? Date().addingTimeInterval(-86_400)
        await pullRachioEvents(windowStart: from, token: token)
    }

    func disconnectRachio() {
        RachioKeychain.deleteToken()
        blob.rachio = nil
        rachioLastError = nil
        save()
    }

    /// Override the auto-detected link for a Fairway zone.
    func setRachioZoneLink(fairwayZoneNumber: Int, rachioZoneId: String?) {
        guard var state = blob.rachio else { return }
        if let id = rachioZoneId {
            state.zoneLinks["\(fairwayZoneNumber)"] = id
        } else {
            state.zoneLinks.removeValue(forKey: "\(fairwayZoneNumber)")
        }
        blob.rachio = state
        save()
    }

    // MARK: - Rachio helpers

    private func pullRachioEvents(windowDays: Int, token: String) async {
        let from = Date().addingTimeInterval(-Double(windowDays) * 86_400)
        await pullRachioEvents(windowStart: from, token: token)
    }

    private func pullRachioEvents(windowStart: Date, token: String) async {
        guard let deviceId = blob.rachio?.deviceId else { return }
        do {
            let events = try await rachioAPI.fetchEvents(
                deviceId: deviceId,
                from: windowStart,
                to: Date(),
                token: token
            )
            mergeRachioEvents(events)
        } catch let err as RachioError {
            handleRachioError(err)
        } catch {
            rachioLastError = error.localizedDescription
        }
    }

    private func mergeRachioEvents(_ incoming: [RachioDTO.EventResponse]) {
        guard var state = blob.rachio else { return }
        var bucket = state.recentEvents
        var seen = Set(bucket.map { $0.id })
        for (idx, raw) in incoming.enumerated() {
            let fallback = "\(raw.eventDate ?? 0)-\(idx)"
            guard let snap = raw.toSnapshot(fallbackId: fallback), !seen.contains(snap.id) else { continue }
            bucket.append(snap)
            seen.insert(snap.id)
        }
        bucket.sort { $0.date > $1.date }
        if bucket.count > FairwayConfig.rachioMaxStoredEvents {
            bucket = Array(bucket.prefix(FairwayConfig.rachioMaxStoredEvents))
        }
        state.recentEvents = bucket
        blob.rachio = state
        save()
    }

    private func handleRachioError(_ err: RachioError) {
        rachioLastError = err.errorDescription
        if case .unauthorized = err {
            RachioKeychain.deleteToken()
            // Keep the last-known snapshot so the UI can still render stale data
            // while telling the user to reconnect.
        }
    }
}
