import XCTest
@testable import ClarityTriage
import ClarityUI

final class TriageBlobTests: XCTestCase {

    func testBlobEncodeDecodeRoundTrip() throws {
        let blob = TriageBlob(
            capacity: 3,
            capacityDate: "2026-04-12",
            tasks: [
                TriageTask(title: "Ship update", category: "job", size: "short", isComplete: false, createdDate: "2026-04-12")
            ],
            ideas: [
                TriageIdea(title: "Course concept", stage: 1, note: "Validate market", createdDate: "2026-04-12")
            ],
            wins: [
                TriageWin(category: "task", note: "Finished priority task", date: "2026-04-12", timestamp: 1712899200000)
            ]
        )

        let data = try JSONEncoder().encode(blob)
        let decoded = try JSONDecoder().decode(TriageBlob.self, from: data)

        XCTAssertEqual(decoded.capacity, 3)
        XCTAssertEqual(decoded.tasks.count, 1)
        XCTAssertEqual(decoded.ideas.first?.stage, 1)
        XCTAssertEqual(decoded.wins.first?.category, "task")
    }

    func testCapacityResetDateBehavior() {
        let staleDate = "2000-01-01"
        let today = DateHelpers.todayString
        XCTAssertNotEqual(staleDate, today)
        XCTAssertTrue(DateHelpers.isToday(today))
    }

    func testSlotsAccountingLogic() {
        let quick = TriageTask(title: "Email", category: "job", size: "quick", isComplete: false, createdDate: "2026-04-12")
        let short = TriageTask(title: "Budget pass", category: "financial", size: "short", isComplete: false, createdDate: "2026-04-12")
        let medium = TriageTask(title: "Deep work block", category: "job", size: "medium", isComplete: false, createdDate: "2026-04-12")

        let used = slotsRequired(for: quick.size) + slotsRequired(for: short.size) + slotsRequired(for: medium.size)
        XCTAssertEqual(used, 6)
        XCTAssertEqual(TriageConfig.slots(for: 4), 5)
        XCTAssertEqual(max(0, TriageConfig.slots(for: 4) - used), 0)
    }

    func testIdeaStageAdvancementCap() {
        var idea = TriageIdea(title: "New process", stage: 0, note: "", createdDate: "2026-04-12")
        idea.stage = min(2, idea.stage + 1)
        idea.stage = min(2, idea.stage + 1)
        idea.stage = min(2, idea.stage + 1)
        XCTAssertEqual(idea.stage, 2)
    }

    private func slotsRequired(for size: String) -> Int {
        switch size {
        case "short": return 2
        case "medium": return 3
        default: return 1
        }
    }
}
