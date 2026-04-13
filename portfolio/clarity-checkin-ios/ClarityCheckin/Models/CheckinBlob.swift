import Foundation

// MARK: - Top-level blob

/// The complete data model for Clarity Check-in.
/// Stored as JSON in UserDefaults under `CheckinConfig.storeKey`.
struct CheckinBlob: Codable {
    var entries: [CheckinEntry] = []
    var pulseChecks: [PulseCheck] = []
    var savedMorning: String? = nil   // date string of last saved morning
    var savedEvening: String? = nil   // date string of last saved evening
    var syncAt: Int64 = 0
}

// MARK: - Daily entry

struct CheckinEntry: Codable, Identifiable {
    var id: String { date }
    var date: String          // "yyyy-MM-dd"
    var morning: MorningData?
    var evening: EveningData?
}

// MARK: - Morning check-in

struct MorningData: Codable {
    var sleepOnset: Int = 5       // 1–10
    var sleepQuality: Int = 5     // 1–10
    var morningReadiness: Int = 5 // 1–10
    var notes: String = ""
    var savedAt: String = ""      // ISO timestamp
}

// MARK: - Evening check-in

struct EveningData: Codable {
    var medsChecked: [String] = []     // which meds were taken
    var focus: Int = 5                 // 1–10
    var mood: Int = 5                  // 1–10
    var adhdSymptoms: String? = nil    // "Yes" / "Mild" / "No"
    var sideEffects: String? = nil
    var exercise: String? = nil
    var eating: String? = nil
    var stress: String? = nil
    var faith: String? = nil
    var caffeine: String? = nil
    var dayQuality: Int = 5            // 1–10
    var spendingNotes: String = ""
    var tomorrowFocus: String = ""
    var savedAt: String = ""
}

// MARK: - Pulse check

struct PulseCheck: Codable, Identifiable {
    var id: String = UUID().uuidString
    var mood: Int = 5          // 1–10
    var note: String = ""
    var date: String = ""      // "yyyy-MM-dd"
    var timestamp: Int64 = 0   // ms since epoch
}
