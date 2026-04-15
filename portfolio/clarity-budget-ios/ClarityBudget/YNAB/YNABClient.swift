import Foundation

enum YNABClientError: LocalizedError {
    case invalidURL
    case unauthorized
    case httpError(statusCode: Int)
    case decodingError(underlying: Error)
    case networkError(underlying: Error)

    var errorDescription: String? {
        switch self {
        case .invalidURL: return "Invalid API URL."
        case .unauthorized: return "Token invalid or expired — open Settings to re-enter."
        case .httpError(let code): return "YNAB API returned status \(code)."
        case .decodingError: return "Failed to parse YNAB response."
        case .networkError: return "Network unavailable. Check your connection and try again."
        }
    }
}

/// YNAB API client — same surface as YNAB Clarity iOS; token supplied per request lifecycle.
final class YNABClient {
    private let baseURL = URL(string: "https://api.ynab.com/v1")!
    private let token: String
    private let decoder: JSONDecoder

    init(token: String) {
        self.token = token
        self.decoder = JSONDecoder()
        self.decoder.keyDecodingStrategy = .convertFromSnakeCase
    }

    func fetchBudgets() async throws -> [YNABBudgetSummary] {
        let response: YNABBudgetsResponse = try await request(path: "/budgets")
        return response.data.budgets
    }

    func fetchCategories(budgetID: String) async throws -> [YNABCategoryGroup] {
        let response: YNABCategoriesResponse = try await request(path: "/budgets/\(budgetID)/categories")
        return response.data.categoryGroups
    }

    func fetchMonth(budgetID: String, month: Date) async throws -> YNABMonthDetail {
        let monthStr = Self.monthString(from: month)
        let response: YNABMonthResponse = try await request(
            path: "/budgets/\(budgetID)/months/\(monthStr)"
        )
        return response.data.month
    }

    func fetchTransactions(budgetID: String, sinceDate: Date) async throws -> [YNABTransaction] {
        let dateStr = Self.calendarDateString(from: sinceDate)
        let response: YNABTransactionsResponse = try await request(
            path: "/budgets/\(budgetID)/transactions",
            queryItems: [URLQueryItem(name: "since_date", value: dateStr)]
        )
        return response.data.transactions.filter { !$0.deleted }
    }

    func fetchBudgetDetail(budgetID: String) async throws -> YNABBudgetDetail {
        let response: YNABBudgetDetailResponse = try await request(path: "/budgets/\(budgetID)")
        return response.data.budget
    }

    func updateCategoryBudgeted(
        budgetID: String,
        month: Date,
        categoryID: String,
        budgetedMilliunits: Int
    ) async throws {
        let monthStr = Self.monthString(from: month)
        let path = "/budgets/\(budgetID)/months/\(monthStr)/categories/\(categoryID)"
        let body: [String: [String: Int]] = ["category": ["budgeted": budgetedMilliunits]]
        try await patchRequest(path: path, body: body)
    }

    private func request<T: Decodable>(path: String, queryItems: [URLQueryItem] = []) async throws -> T {
        var components = URLComponents(url: baseURL.appendingPathComponent(path), resolvingAgainstBaseURL: false)
        if !queryItems.isEmpty { components?.queryItems = queryItems }
        guard let url = components?.url else { throw YNABClientError.invalidURL }

        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        request.timeoutInterval = 15

        let data: Data
        let response: URLResponse
        do {
            (data, response) = try await URLSession.shared.data(for: request)
        } catch {
            throw YNABClientError.networkError(underlying: error)
        }

        guard let http = response as? HTTPURLResponse else {
            throw YNABClientError.httpError(statusCode: 0)
        }
        switch http.statusCode {
        case 200: break
        case 401: throw YNABClientError.unauthorized
        default: throw YNABClientError.httpError(statusCode: http.statusCode)
        }

        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            throw YNABClientError.decodingError(underlying: error)
        }
    }

    private func patchRequest<T: Encodable>(path: String, body: T) async throws {
        guard let url = URLComponents(
            url: baseURL.appendingPathComponent(path),
            resolvingAgainstBaseURL: false
        )?.url else { throw YNABClientError.invalidURL }

        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.timeoutInterval = 15
        request.httpBody = try JSONEncoder().encode(body)

        let response: URLResponse
        do {
            (_, response) = try await URLSession.shared.data(for: request)
        } catch {
            throw YNABClientError.networkError(underlying: error)
        }

        guard let http = response as? HTTPURLResponse else {
            throw YNABClientError.httpError(statusCode: 0)
        }
        switch http.statusCode {
        case 200, 201, 209: break
        case 401: throw YNABClientError.unauthorized
        default: throw YNABClientError.httpError(statusCode: http.statusCode)
        }
    }

    static func monthString(from date: Date, calendar: Calendar = .current) -> String {
        let comps = calendar.dateComponents([.year, .month], from: date)
        let year = comps.year ?? 2026
        let month = comps.month ?? 1
        return String(format: "%04d-%02d-01", year, month)
    }

    static func calendarDateString(from date: Date, calendar: Calendar = .current) -> String {
        let comps = calendar.dateComponents([.year, .month, .day], from: date)
        let year = comps.year ?? 2026
        let month = comps.month ?? 1
        let day = comps.day ?? 1
        return String(format: "%04d-%02d-%02d", year, month, day)
    }
}
