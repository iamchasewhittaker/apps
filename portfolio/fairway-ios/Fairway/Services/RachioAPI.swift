import Foundation

enum RachioError: Error, LocalizedError, Equatable {
    case unauthorized
    case noDevices
    case http(Int)
    case network(String)
    case decoding(String)
    case missingToken

    var errorDescription: String? {
        switch self {
        case .unauthorized:      return "Token rejected — reconnect in Settings."
        case .noDevices:         return "No Rachio devices found on this account."
        case .http(let code):    return "Rachio API returned HTTP \(code)."
        case .network(let msg):  return "Network error: \(msg)"
        case .decoding(let msg): return "Couldn't decode Rachio response: \(msg)"
        case .missingToken:      return "No Rachio token stored."
        }
    }
}

/// Async Rachio v1 client. Pure read-only for v1 — no POST/PUT.
struct RachioAPI {
    let baseURL: String
    let session: URLSession

    init(baseURL: String = FairwayConfig.rachioAPIBase, session: URLSession = .shared) {
        self.baseURL = baseURL
        self.session = session
    }

    // MARK: - Endpoints

    func fetchPersonInfo(token: String) async throws -> RachioDTO.PersonInfoResponse {
        try await get("/person/info", token: token)
    }

    func fetchPerson(id: String, token: String) async throws -> RachioDTO.PersonResponse {
        try await get("/person/\(id)", token: token)
    }

    /// Events within the window. `from`/`to` are converted to ms since epoch.
    func fetchEvents(deviceId: String, from: Date, to: Date, token: String) async throws -> [RachioDTO.EventResponse] {
        let start = Int64(from.timeIntervalSince1970 * 1000)
        let end   = Int64(to.timeIntervalSince1970 * 1000)
        let path  = "/device/\(deviceId)/event?startTime=\(start)&endTime=\(end)"
        return try await get(path, token: token)
    }

    // MARK: - Core GET

    private func get<T: Decodable>(_ path: String, token: String) async throws -> T {
        guard let url = URL(string: baseURL + path) else {
            throw RachioError.network("Bad URL: \(baseURL)\(path)")
        }
        var req = URLRequest(url: url)
        req.httpMethod = "GET"
        req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        req.setValue("application/json", forHTTPHeaderField: "Accept")
        req.timeoutInterval = 20

        let (data, response): (Data, URLResponse)
        do {
            (data, response) = try await session.data(for: req)
        } catch let urlError as URLError {
            throw RachioError.network(urlError.localizedDescription)
        } catch {
            throw RachioError.network(error.localizedDescription)
        }

        guard let http = response as? HTTPURLResponse else {
            throw RachioError.network("Non-HTTP response")
        }
        if http.statusCode == 401 {
            throw RachioError.unauthorized
        }
        guard (200..<300).contains(http.statusCode) else {
            throw RachioError.http(http.statusCode)
        }

        do {
            return try JSONDecoder().decode(T.self, from: data)
        } catch {
            throw RachioError.decoding(String(describing: error))
        }
    }
}
