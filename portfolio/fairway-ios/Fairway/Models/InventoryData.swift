import Foundation

enum InventoryCategory: String, Codable, CaseIterable, Identifiable {
    case fertilizer = "Fertilizer"
    case herbicide = "Herbicide"
    case seed = "Seed"
    case soilAmendment = "Soil Amendment"
    case pestControl = "Pest Control"
    case equipment = "Equipment"
    case tool = "Tool"
    case other = "Other"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .fertilizer: return "leaf.fill"
        case .herbicide: return "xmark.circle.fill"
        case .seed: return "circle.dotted"
        case .soilAmendment: return "drop.fill"
        case .pestControl: return "ant.fill"
        case .equipment: return "wrench.fill"
        case .tool: return "hammer.fill"
        case .other: return "shippingbox.fill"
        }
    }
}

struct SpreaderSetting: Codable, Identifiable {
    var id: UUID = UUID()
    var spreaderModel: String
    var setting: String
    var notes: String = ""
}

struct ServiceRecord: Codable, Identifiable {
    var id: UUID = UUID()
    var date: Date
    var description: String
    var cost: Double? = nil
    var notes: String = ""
}

struct UsageEntry: Codable, Identifiable {
    var id: UUID = UUID()
    var date: Date
    var amountLbs: Double
    var zonesApplied: [Int] = []
    var notes: String = ""
}

struct InventoryItem: Codable, Identifiable {
    var id: UUID = UUID()
    var name: String
    var category: InventoryCategory
    var brand: String = ""
    var purchaseDate: Date? = nil
    var cost: Double? = nil
    var productURL: String? = nil
    var productSource: String? = nil
    var notes: String = ""
    var lastUsedDate: Date? = nil
    var serviceHistory: [ServiceRecord] = []
    var spreaderSettings: [SpreaderSetting] = []
    var defaultRatePer1000SqFt: Double? = nil
    var bagSizeLbs: Double? = nil
    var spreaderCapacityLbs: Double? = nil
    var currentStockLbs: Double? = nil
    var lastStockUpdateDate: Date? = nil
    var usageLog: [UsageEntry] = []
    var storageLocation: String = ""
    var storageNotes: String = ""

    var stockStatus: StockStatus {
        guard let stock = currentStockLbs else { return .unknown }
        guard let rate = defaultRatePer1000SqFt else { return stock > 0 ? .good : .empty }
        let oneLot = (2737.0 / 1000.0) * rate
        if stock <= 0 { return .empty }
        if stock < oneLot { return .low }
        return .good
    }
}

enum StockStatus {
    case good, low, empty, unknown

    var label: String {
        switch self {
        case .good: return "In Stock"
        case .low: return "Running Low"
        case .empty: return "Empty"
        case .unknown: return "Unknown"
        }
    }

    var colorName: String {
        switch self {
        case .good: return "stockGood"
        case .low: return "stockLow"
        case .empty, .unknown: return "stockEmpty"
        }
    }
}
