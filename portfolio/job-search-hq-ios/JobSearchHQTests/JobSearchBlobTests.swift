import XCTest
@testable import JobSearchHQ

final class JobSearchBlobTests: XCTestCase {
    override func setUp() {
        super.setUp()
        UserDefaults.standard.removeObject(forKey: JobSearchConfig.storageKey)
    }

    func testRoundTripEmptyBlob() throws {
        let original = JobSearchDataBlob.empty()
        let data = try JSONEncoder().encode(original)
        let decoded = try JSONDecoder().decode(JobSearchDataBlob.self, from: data)
        XCTAssertEqual(decoded, original)
    }

    func testDecodeWebShapedJSON() throws {
        let json = """
        {
          "applications": [{
            "id": "abc",
            "company": "Acme",
            "title": "PM",
            "stage": "Applied",
            "appliedDate": "2026-04-01",
            "url": "",
            "nextStep": "Follow up",
            "nextStepDate": "2026-04-10",
            "nextStepType": "follow_up",
            "jobDescription": "",
            "notes": "",
            "prepNotes": "",
            "prepSections": {
              "companyResearch": "R",
              "roleAnalysis": "",
              "starStories": "",
              "questionsToAsk": ""
            }
          }],
          "contacts": [],
          "starStories": [],
          "dailyActions": [],
          "baseResume": "x",
          "profile": {
            "name": "Test",
            "email": "t@example.com",
            "phone": "",
            "linkedin": "",
            "location": "",
            "targetRoles": "",
            "targetIndustries": "",
            "yearsExp": "",
            "topAchievements": "",
            "salaryTarget": "",
            "notes": ""
          },
          "_syncAt": 1700000000000
        }
        """.data(using: .utf8)!
        let blob = try JSONDecoder().decode(JobSearchDataBlob.self, from: json)
        XCTAssertEqual(blob.applications.count, 1)
        XCTAssertEqual(blob.applications[0].company, "Acme")
        XCTAssertEqual(blob.applications[0].prepSections.companyResearch, "R")
        XCTAssertEqual(blob.syncAt, 1_700_000_000_000)
    }

    func testStoreSaveLoad() throws {
        let store = JobSearchStore()
        store.load()
        let before = store.data.applications.count
        var app = JobApplication(id: "test-id")
        app.company = "Co"
        app.title = "Role"
        store.upsertApplication(app)
        store.load()
        XCTAssertEqual(store.data.applications.count, before + 1)
        XCTAssertEqual(store.data.applications.first { $0.id == "test-id" }?.company, "Co")
    }
}
