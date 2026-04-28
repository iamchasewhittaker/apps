import Foundation

/// Daily summary blob written by Job Search HQ web app under `app_key = "job-search-daily"`.
/// Web shape includes extra fields (`actions`, `_syncAt`) we ignore here.
struct JobSearchDaily: Codable, Equatable {
    var date: String
    var count: Int
    var met: Bool
}

extension JobSearchDaily {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        date = try c.decodeIfPresent(String.self, forKey: .date) ?? ""
        count = try c.decodeIfPresent(Int.self, forKey: .count) ?? 0
        met = try c.decodeIfPresent(Bool.self, forKey: .met) ?? false
    }
}

/// Daily summary blob written by Wellness Tracker web app under `app_key = "wellness-daily"`.
struct WellnessDaily: Codable, Equatable {
    var date: String
    var morningDone: Bool
    var eveningDone: Bool
    var activityDone: String?
    var met: Bool
}

extension WellnessDaily {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        date = try c.decodeIfPresent(String.self, forKey: .date) ?? ""
        morningDone = try c.decodeIfPresent(Bool.self, forKey: .morningDone) ?? false
        eveningDone = try c.decodeIfPresent(Bool.self, forKey: .eveningDone) ?? false
        activityDone = try c.decodeIfPresent(String.self, forKey: .activityDone)
        met = try c.decodeIfPresent(Bool.self, forKey: .met) ?? false
    }
}
