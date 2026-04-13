import Foundation

// MARK: - Top-level blob

/// The complete data model for Clarity Triage.
/// Stored as JSON in UserDefaults under `TriageConfig.storeKey`.
struct TriageBlob: Codable {
    var capacity: Int = 0
    var capacityDate: String = ""
    var tasks: [TriageTask] = []
    var ideas: [TriageIdea] = []
    var wins: [TriageWin] = []
}

// MARK: - Task

struct TriageTask: Codable, Identifiable {
    var id: String = UUID().uuidString
    var title: String
    var category: String
    var size: String
    var isComplete: Bool = false
    var createdDate: String
}

// MARK: - Idea

struct TriageIdea: Codable, Identifiable {
    var id: String = UUID().uuidString
    var title: String
    var stage: Int = 0
    var note: String = ""
    var createdDate: String
}

// MARK: - Win

struct TriageWin: Codable, Identifiable {
    var id: String = UUID().uuidString
    var category: String
    var note: String = ""
    var date: String
    var timestamp: Int64
}
