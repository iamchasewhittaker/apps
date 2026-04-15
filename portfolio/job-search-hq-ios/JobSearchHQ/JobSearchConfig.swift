import Foundation

enum JobSearchConfig {
    /// Distinct from web `localStorage` key during dev — same JSON shape (see `docs/SCOPE_V1.md`).
    static let storageKey = "chase_job_search_ios_v1"

    /// Pipeline stages aligned with web [`STAGES`](../../../job-search-hq/src/constants.js).
    static let stages: [String] = [
        "Interested", "Applied", "Phone Screen", "Interview", "Final Round", "Offer", "Rejected", "Withdrawn"
    ]
}
