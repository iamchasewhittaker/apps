import Foundation
import Observation
import UIKit

@MainActor
@Observable
final class KeepStore {
    var blob: KeepBlob
    let photos: PhotoStore

    init() {
        blob = KeepBlob()
        photos = PhotoStore()
    }

    func load() {
        guard let data = UserDefaults.standard.data(forKey: KeepConfig.storeKey),
              let decoded = try? JSONDecoder().decode(KeepBlob.self, from: data) else {
            return
        }
        blob = decoded
    }

    func save() {
        blob._syncAt = Date().timeIntervalSince1970 * 1000
        guard let data = try? JSONEncoder().encode(blob) else { return }
        UserDefaults.standard.set(data, forKey: KeepConfig.storeKey)
    }

    // MARK: - Room mutations

    func addRoom(_ room: Room) {
        blob.rooms.append(room)
        save()
    }

    func deleteRoom(_ roomID: UUID) {
        let itemPhotoIDs = blob.items.filter { $0.roomID == roomID }.compactMap { $0.photoID }
        for photoID in itemPhotoIDs { photos.delete(id: photoID) }
        blob.items.removeAll { $0.roomID == roomID }
        blob.spots.removeAll { $0.roomID == roomID }
        blob.rooms.removeAll { $0.id == roomID }
        save()
    }

    // MARK: - Spot mutations

    func addSpot(_ spot: Spot) {
        blob.spots.append(spot)
        save()
    }

    func deleteSpot(_ spotID: UUID) {
        blob.items.filter { $0.spotID == spotID }.indices.forEach {
            blob.items[$0].spotID = nil
        }
        blob.spots.removeAll { $0.id == spotID }
        save()
    }

    // MARK: - Item mutations

    func addItem(_ item: Item, photo: UIImage? = nil) {
        var newItem = item
        if let photo = photo {
            newItem.photoID = photos.save(image: photo)
        }
        blob.items.append(newItem)
        save()
    }

    func triageItem(_ itemID: UUID, status: TriageStatus, spotID: UUID? = nil) {
        guard let idx = blob.items.firstIndex(where: { $0.id == itemID }) else { return }
        blob.items[idx].status = status
        blob.items[idx].triageDate = Date()
        if status == .keep {
            blob.items[idx].spotID = spotID
        }
        save()
    }

    func deleteItem(_ itemID: UUID) {
        if let item = blob.items.first(where: { $0.id == itemID }),
           let photoID = item.photoID {
            photos.delete(id: photoID)
        }
        blob.items.removeAll { $0.id == itemID }
        save()
    }

    // MARK: - Stats

    func incrementDonationBags() {
        blob.donationBags += 1
        save()
    }

    func loadPhoto(for item: Item) -> UIImage? {
        guard let photoID = item.photoID else { return nil }
        return photos.load(id: photoID)
    }
}
