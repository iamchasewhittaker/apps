import Foundation

// Ported from portfolio/shipyard/src/lib/mvp-step.ts STEP_NAUTICAL.
enum NauticalLabels {
    static let step: [Int: String] = [
        1: "Blueprint",
        2: "Charting",
        3: "Drafting",
        4: "Under Construction",
        5: "Launched",
        6: "Fleet Active",
    ]

    static func label(for stepNumber: Int?) -> String {
        guard let n = stepNumber else { return "Unknown" }
        return step[n] ?? "Step \(n)"
    }
}
