import Foundation
import SwiftData

// MARK: - CategoryRole

enum CategoryRole: String, CaseIterable, Identifiable {
    case mortgage
    case bill
    case essential
    case flexible
    case ignore

    var id: String { rawValue }

    var displayName: String {
        switch self {
        case .mortgage:  return "Mortgage / Housing"
        case .bill:      return "Fixed Bill"
        case .essential: return "Essential Variable"
        case .flexible:  return "Flexible Spending"
        case .ignore:    return "Ignore"
        }
    }
}

// MARK: - CategoryMapping

@Model
final class CategoryMapping {
    var ynabCategoryID: String
    var ynabCategoryName: String
    var ynabGroupName: String
    /// Raw value of CategoryRole — never store as enum directly in SwiftData.
    var roleRaw: String
    /// Day of month the bill is due (1-31). 0 means "not set" — uses default.
    var dueDay: Int = 0

    init(
        ynabCategoryID: String,
        ynabCategoryName: String,
        ynabGroupName: String = "",
        role: CategoryRole = .ignore,
        dueDay: Int = 0
    ) {
        self.ynabCategoryID = ynabCategoryID
        self.ynabCategoryName = ynabCategoryName
        self.ynabGroupName = ynabGroupName
        self.roleRaw = role.rawValue
        self.dueDay = dueDay
    }
}

extension CategoryMapping {
    var role: CategoryRole {
        get { CategoryRole(rawValue: roleRaw) ?? .ignore }
        set { roleRaw = newValue.rawValue }
    }
}
