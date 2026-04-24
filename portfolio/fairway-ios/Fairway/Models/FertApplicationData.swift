import Foundation

struct FertApplication: Codable, Identifiable {
    var id: UUID = UUID()
    var date: Date = Date()
    var inventoryItemID: UUID? = nil
    var productName: String = ""
    var zoneNumbers: [Int] = []
    var amountLbs: Double = 0
    var notes: String = ""
}
