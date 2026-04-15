import Foundation

// MARK: - Top-level blob (matches web `chase_job_search_v1` JSON)

struct JobSearchDataBlob: Codable, Equatable, Sendable {
    var applications: [JobApplication]
    var contacts: [JobContact]
    var starStories: [StarStory]
    var dailyActions: [DailyAction]
    var baseResume: String
    var profile: JobProfile
    /// Milliseconds since epoch — web uses `_syncAt`
    var syncAt: Int64?

    enum CodingKeys: String, CodingKey {
        case applications, contacts, starStories, dailyActions, baseResume, profile
        case syncAt = "_syncAt"
    }

    static func empty() -> JobSearchDataBlob {
        JobSearchDataBlob(
            applications: [],
            contacts: [],
            starStories: [],
            dailyActions: [],
            baseResume: "",
            profile: .defaultProfile,
            syncAt: nil
        )
    }

    init(
        applications: [JobApplication],
        contacts: [JobContact],
        starStories: [StarStory],
        dailyActions: [DailyAction],
        baseResume: String,
        profile: JobProfile,
        syncAt: Int64?
    ) {
        self.applications = applications
        self.contacts = contacts
        self.starStories = starStories
        self.dailyActions = dailyActions
        self.baseResume = baseResume
        self.profile = profile
        self.syncAt = syncAt
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        applications = try c.decodeIfPresent([JobApplication].self, forKey: .applications) ?? []
        contacts = try c.decodeIfPresent([JobContact].self, forKey: .contacts) ?? []
        starStories = try c.decodeIfPresent([StarStory].self, forKey: .starStories) ?? []
        dailyActions = try c.decodeIfPresent([DailyAction].self, forKey: .dailyActions) ?? []
        baseResume = try c.decodeIfPresent(String.self, forKey: .baseResume) ?? ""
        profile = try c.decodeIfPresent(JobProfile.self, forKey: .profile) ?? .defaultProfile
        syncAt = try c.decodeIfPresent(Int64.self, forKey: .syncAt)
    }

    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(applications, forKey: .applications)
        try c.encode(contacts, forKey: .contacts)
        try c.encode(starStories, forKey: .starStories)
        try c.encode(dailyActions, forKey: .dailyActions)
        try c.encode(baseResume, forKey: .baseResume)
        try c.encode(profile, forKey: .profile)
        try c.encodeIfPresent(syncAt, forKey: .syncAt)
    }
}

// MARK: - Application

struct JobApplication: Codable, Equatable, Identifiable, Hashable, Sendable {
    enum CodingKeys: String, CodingKey {
        case id, company, title, stage, appliedDate, url, nextStep, nextStepDate, nextStepType
        case jobDescription, notes, prepNotes, prepSections
    }

    var id: String
    var company: String
    var title: String
    var stage: String
    var appliedDate: String
    var url: String
    var nextStep: String
    var nextStepDate: String
    var nextStepType: String
    var jobDescription: String
    var notes: String
    var prepNotes: String
    var prepSections: PrepSections

    init(
        id: String,
        company: String = "",
        title: String = "",
        stage: String = "Interested",
        appliedDate: String = "",
        url: String = "",
        nextStep: String = "",
        nextStepDate: String = "",
        nextStepType: String = "",
        jobDescription: String = "",
        notes: String = "",
        prepNotes: String = "",
        prepSections: PrepSections = .empty
    ) {
        self.id = id
        self.company = company
        self.title = title
        self.stage = stage
        self.appliedDate = appliedDate
        self.url = url
        self.nextStep = nextStep
        self.nextStepDate = nextStepDate
        self.nextStepType = nextStepType
        self.jobDescription = jobDescription
        self.notes = notes
        self.prepNotes = prepNotes
        self.prepSections = prepSections
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(String.self, forKey: .id) ?? JobSearchId.generate()
        company = try c.decodeIfPresent(String.self, forKey: .company) ?? ""
        title = try c.decodeIfPresent(String.self, forKey: .title) ?? ""
        stage = try c.decodeIfPresent(String.self, forKey: .stage) ?? "Interested"
        appliedDate = try c.decodeIfPresent(String.self, forKey: .appliedDate) ?? ""
        url = try c.decodeIfPresent(String.self, forKey: .url) ?? ""
        nextStep = try c.decodeIfPresent(String.self, forKey: .nextStep) ?? ""
        nextStepDate = try c.decodeIfPresent(String.self, forKey: .nextStepDate) ?? ""
        nextStepType = try c.decodeIfPresent(String.self, forKey: .nextStepType) ?? ""
        jobDescription = try c.decodeIfPresent(String.self, forKey: .jobDescription) ?? ""
        notes = try c.decodeIfPresent(String.self, forKey: .notes) ?? ""
        prepNotes = try c.decodeIfPresent(String.self, forKey: .prepNotes) ?? ""
        if let ps = try c.decodeIfPresent(PrepSections.self, forKey: .prepSections) {
            prepSections = ps
        } else {
            prepSections = PrepSections.normalized(from: nil, prepNotes: prepNotes)
        }
    }

    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(id, forKey: .id)
        try c.encode(company, forKey: .company)
        try c.encode(title, forKey: .title)
        try c.encode(stage, forKey: .stage)
        try c.encode(appliedDate, forKey: .appliedDate)
        try c.encode(url, forKey: .url)
        try c.encode(nextStep, forKey: .nextStep)
        try c.encode(nextStepDate, forKey: .nextStepDate)
        try c.encode(nextStepType, forKey: .nextStepType)
        try c.encode(jobDescription, forKey: .jobDescription)
        try c.encode(notes, forKey: .notes)
        try c.encode(prepNotes, forKey: .prepNotes)
        try c.encode(prepSections, forKey: .prepSections)
    }
}

struct PrepSections: Codable, Equatable, Hashable, Sendable {
    var companyResearch: String
    var roleAnalysis: String
    var starStories: String
    var questionsToAsk: String

    static let empty = PrepSections(
        companyResearch: "",
        roleAnalysis: "",
        starStories: "",
        questionsToAsk: ""
    )

    static func normalized(from decoded: PrepSections?, prepNotes: String) -> PrepSections {
        if let decoded {
            return decoded
        }
        let trimmed = prepNotes.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.isEmpty { return .empty }
        return PrepSections(companyResearch: "", roleAnalysis: trimmed, starStories: "", questionsToAsk: "")
    }
}

// MARK: - Contact

struct JobContact: Codable, Equatable, Identifiable, Hashable, Sendable {
    enum CodingKeys: String, CodingKey {
        case id, name, company, role, email, linkedin, lastContact, notes, appIds
        case type, outreachStatus, outreachDate, source, companySize, industry, isHiring
    }

    var id: String
    var name: String
    var company: String
    var role: String
    var email: String
    var linkedin: String
    var lastContact: String
    var notes: String
    var appIds: [String]
    var type: String
    var outreachStatus: String
    var outreachDate: String
    var source: String
    var companySize: String
    var industry: String
    var isHiring: Bool

    init(
        id: String,
        name: String = "",
        company: String = "",
        role: String = "",
        email: String = "",
        linkedin: String = "",
        lastContact: String = "",
        notes: String = "",
        appIds: [String] = [],
        type: String = "other",
        outreachStatus: String = "none",
        outreachDate: String = "",
        source: String = "linkedin",
        companySize: String = "",
        industry: String = "",
        isHiring: Bool = false
    ) {
        self.id = id
        self.name = name
        self.company = company
        self.role = role
        self.email = email
        self.linkedin = linkedin
        self.lastContact = lastContact
        self.notes = notes
        self.appIds = appIds
        self.type = type
        self.outreachStatus = outreachStatus
        self.outreachDate = outreachDate
        self.source = source
        self.companySize = companySize
        self.industry = industry
        self.isHiring = isHiring
    }

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(String.self, forKey: .id) ?? JobSearchId.generate()
        name = try c.decodeIfPresent(String.self, forKey: .name) ?? ""
        company = try c.decodeIfPresent(String.self, forKey: .company) ?? ""
        role = try c.decodeIfPresent(String.self, forKey: .role) ?? ""
        email = try c.decodeIfPresent(String.self, forKey: .email) ?? ""
        linkedin = try c.decodeIfPresent(String.self, forKey: .linkedin) ?? ""
        lastContact = try c.decodeIfPresent(String.self, forKey: .lastContact) ?? ""
        notes = try c.decodeIfPresent(String.self, forKey: .notes) ?? ""
        appIds = try c.decodeIfPresent([String].self, forKey: .appIds) ?? []
        type = try c.decodeIfPresent(String.self, forKey: .type) ?? "other"
        outreachStatus = try c.decodeIfPresent(String.self, forKey: .outreachStatus) ?? "none"
        outreachDate = try c.decodeIfPresent(String.self, forKey: .outreachDate) ?? ""
        source = try c.decodeIfPresent(String.self, forKey: .source) ?? "linkedin"
        companySize = try c.decodeIfPresent(String.self, forKey: .companySize) ?? ""
        industry = try c.decodeIfPresent(String.self, forKey: .industry) ?? ""
        isHiring = try c.decodeIfPresent(Bool.self, forKey: .isHiring) ?? false
    }

    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(id, forKey: .id)
        try c.encode(name, forKey: .name)
        try c.encode(company, forKey: .company)
        try c.encode(role, forKey: .role)
        try c.encode(email, forKey: .email)
        try c.encode(linkedin, forKey: .linkedin)
        try c.encode(lastContact, forKey: .lastContact)
        try c.encode(notes, forKey: .notes)
        try c.encode(appIds, forKey: .appIds)
        try c.encode(type, forKey: .type)
        try c.encode(outreachStatus, forKey: .outreachStatus)
        try c.encode(outreachDate, forKey: .outreachDate)
        try c.encode(source, forKey: .source)
        try c.encode(companySize, forKey: .companySize)
        try c.encode(industry, forKey: .industry)
        try c.encode(isHiring, forKey: .isHiring)
    }
}

// MARK: - STAR story

struct StarStory: Codable, Equatable, Identifiable, Sendable {
    enum CodingKeys: String, CodingKey {
        case id, title, competency, situation, task, action, result, takeaway
    }

    var id: String
    var title: String
    var competency: String
    var situation: String
    var task: String
    var action: String
    var result: String
    var takeaway: String

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(String.self, forKey: .id) ?? JobSearchId.generate()
        title = try c.decodeIfPresent(String.self, forKey: .title) ?? ""
        competency = try c.decodeIfPresent(String.self, forKey: .competency) ?? ""
        situation = try c.decodeIfPresent(String.self, forKey: .situation) ?? ""
        task = try c.decodeIfPresent(String.self, forKey: .task) ?? ""
        action = try c.decodeIfPresent(String.self, forKey: .action) ?? ""
        result = try c.decodeIfPresent(String.self, forKey: .result) ?? ""
        takeaway = try c.decodeIfPresent(String.self, forKey: .takeaway) ?? ""
    }

    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(id, forKey: .id)
        try c.encode(title, forKey: .title)
        try c.encode(competency, forKey: .competency)
        try c.encode(situation, forKey: .situation)
        try c.encode(task, forKey: .task)
        try c.encode(action, forKey: .action)
        try c.encode(result, forKey: .result)
        try c.encode(takeaway, forKey: .takeaway)
    }

    init(
        id: String,
        title: String = "",
        competency: String = "",
        situation: String = "",
        task: String = "",
        action: String = "",
        result: String = "",
        takeaway: String = ""
    ) {
        self.id = id
        self.title = title
        self.competency = competency
        self.situation = situation
        self.task = task
        self.action = action
        self.result = result
        self.takeaway = takeaway
    }
}

// MARK: - Daily action

struct DailyAction: Codable, Equatable, Identifiable, Sendable {
    enum CodingKeys: String, CodingKey {
        case id, date, type, note, time
    }

    var id: String
    var date: String
    var type: String
    var note: String
    var time: String

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        id = try c.decodeIfPresent(String.self, forKey: .id) ?? JobSearchId.generate()
        date = try c.decodeIfPresent(String.self, forKey: .date) ?? ""
        type = try c.decodeIfPresent(String.self, forKey: .type) ?? ""
        note = try c.decodeIfPresent(String.self, forKey: .note) ?? ""
        time = try c.decodeIfPresent(String.self, forKey: .time) ?? ""
    }

    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(id, forKey: .id)
        try c.encode(date, forKey: .date)
        try c.encode(type, forKey: .type)
        try c.encode(note, forKey: .note)
        try c.encode(time, forKey: .time)
    }

    init(id: String, date: String = "", type: String = "", note: String = "", time: String = "") {
        self.id = id
        self.date = date
        self.type = type
        self.note = note
        self.time = time
    }
}

// MARK: - Profile

struct JobProfile: Codable, Equatable, Sendable {
    enum CodingKeys: String, CodingKey {
        case name, email, phone, linkedin, location, targetRoles, targetIndustries
        case yearsExp, topAchievements, salaryTarget, notes
    }

    var name: String
    var email: String
    var phone: String
    var linkedin: String
    var location: String
    var targetRoles: String
    var targetIndustries: String
    var yearsExp: String
    var topAchievements: String
    var salaryTarget: String
    var notes: String

    static let defaultProfile = JobProfile(
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        location: "",
        targetRoles: "",
        targetIndustries: "",
        yearsExp: "",
        topAchievements: "",
        salaryTarget: "",
        notes: ""
    )

    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        name = try c.decodeIfPresent(String.self, forKey: .name) ?? ""
        email = try c.decodeIfPresent(String.self, forKey: .email) ?? ""
        phone = try c.decodeIfPresent(String.self, forKey: .phone) ?? ""
        linkedin = try c.decodeIfPresent(String.self, forKey: .linkedin) ?? ""
        location = try c.decodeIfPresent(String.self, forKey: .location) ?? ""
        targetRoles = try c.decodeIfPresent(String.self, forKey: .targetRoles) ?? ""
        targetIndustries = try c.decodeIfPresent(String.self, forKey: .targetIndustries) ?? ""
        yearsExp = try c.decodeIfPresent(String.self, forKey: .yearsExp) ?? ""
        topAchievements = try c.decodeIfPresent(String.self, forKey: .topAchievements) ?? ""
        salaryTarget = try c.decodeIfPresent(String.self, forKey: .salaryTarget) ?? ""
        notes = try c.decodeIfPresent(String.self, forKey: .notes) ?? ""
    }

    func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(name, forKey: .name)
        try c.encode(email, forKey: .email)
        try c.encode(phone, forKey: .phone)
        try c.encode(linkedin, forKey: .linkedin)
        try c.encode(location, forKey: .location)
        try c.encode(targetRoles, forKey: .targetRoles)
        try c.encode(targetIndustries, forKey: .targetIndustries)
        try c.encode(yearsExp, forKey: .yearsExp)
        try c.encode(topAchievements, forKey: .topAchievements)
        try c.encode(salaryTarget, forKey: .salaryTarget)
        try c.encode(notes, forKey: .notes)
    }

    init(
        name: String,
        email: String,
        phone: String,
        linkedin: String,
        location: String,
        targetRoles: String,
        targetIndustries: String,
        yearsExp: String,
        topAchievements: String,
        salaryTarget: String,
        notes: String
    ) {
        self.name = name
        self.email = email
        self.phone = phone
        self.linkedin = linkedin
        self.location = location
        self.targetRoles = targetRoles
        self.targetIndustries = targetIndustries
        self.yearsExp = yearsExp
        self.topAchievements = topAchievements
        self.salaryTarget = salaryTarget
        self.notes = notes
    }
}

// MARK: - IDs

enum JobSearchId {
    /// Web-compatible opaque string id (UUID is valid for new iOS-only rows).
    static func generate() -> String {
        UUID().uuidString
    }
}
