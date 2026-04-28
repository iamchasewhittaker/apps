import Foundation

enum WeatherError: Error, LocalizedError, Equatable {
    case badURL
    case http(Int)
    case network(String)
    case decoding(String)

    var errorDescription: String? {
        switch self {
        case .badURL:            return "Couldn't build weather request URL."
        case .http(let code):    return "Weather API returned HTTP \(code)."
        case .network(let msg):  return "Network error: \(msg)"
        case .decoding(let msg): return "Couldn't decode weather response: \(msg)"
        }
    }
}

/// Open-Meteo client. No API key, no auth, just one GET per refresh.
/// https://open-meteo.com/en/docs
struct WeatherAPI {
    let baseURL: String
    let session: URLSession
    let timezone: String

    init(
        baseURL: String = "https://api.open-meteo.com/v1/forecast",
        session: URLSession = .shared,
        timezone: String = "America/Denver"
    ) {
        self.baseURL = baseURL
        self.session = session
        self.timezone = timezone
    }

    func fetch(latitude: Double, longitude: Double) async throws -> WeatherSnapshot {
        var components = URLComponents(string: baseURL)
        components?.queryItems = [
            URLQueryItem(name: "latitude", value: String(latitude)),
            URLQueryItem(name: "longitude", value: String(longitude)),
            URLQueryItem(name: "current", value: "temperature_2m,precipitation,weather_code"),
            URLQueryItem(name: "daily", value: "temperature_2m_max,temperature_2m_min,precipitation_sum"),
            URLQueryItem(name: "hourly", value: "soil_temperature_6cm"),
            URLQueryItem(name: "past_days", value: "7"),
            URLQueryItem(name: "forecast_days", value: "7"),
            URLQueryItem(name: "timezone", value: timezone),
            URLQueryItem(name: "temperature_unit", value: "fahrenheit"),
            URLQueryItem(name: "precipitation_unit", value: "inch")
        ]

        guard let url = components?.url else { throw WeatherError.badURL }

        var req = URLRequest(url: url)
        req.httpMethod = "GET"
        req.setValue("application/json", forHTTPHeaderField: "Accept")
        req.timeoutInterval = 20

        let (data, response): (Data, URLResponse)
        do {
            (data, response) = try await session.data(for: req)
        } catch let urlError as URLError {
            throw WeatherError.network(urlError.localizedDescription)
        } catch {
            throw WeatherError.network(error.localizedDescription)
        }

        guard let http = response as? HTTPURLResponse else {
            throw WeatherError.network("Non-HTTP response")
        }
        guard (200..<300).contains(http.statusCode) else {
            throw WeatherError.http(http.statusCode)
        }

        let dto: OpenMeteoDTO.Response
        do {
            dto = try JSONDecoder().decode(OpenMeteoDTO.Response.self, from: data)
        } catch {
            throw WeatherError.decoding(String(describing: error))
        }

        return Self.makeSnapshot(from: dto, latitude: latitude, longitude: longitude)
    }

    // MARK: - DTO → snapshot

    static func makeSnapshot(
        from dto: OpenMeteoDTO.Response,
        latitude: Double,
        longitude: Double,
        now: Date = Date()
    ) -> WeatherSnapshot {
        let tz = TimeZone(identifier: dto.timezone ?? "America/Denver") ?? TimeZone.current
        var calendar = Calendar(identifier: .gregorian)
        calendar.timeZone = tz

        // ---- Current ----
        let currentTemp = dto.current?.temperature_2m ?? 0
        let currentPrecip = dto.current?.precipitation ?? 0
        let currentCode = dto.current?.weather_code ?? -1

        // ---- Hourly soil temp (parse all then split today vs forecast) ----
        let hourlySoil: [HourlySoil] = OpenMeteoDTO.zipHourly(
            times: dto.hourly?.time ?? [],
            values: dto.hourly?.soil_temperature_6cm ?? [],
            timezone: tz
        )

        // Pick the soil-temp sample closest to now for the "current" reading.
        let currentSoilTemp: Double = hourlySoil
            .min(by: { abs($0.date.timeIntervalSince(now)) < abs($1.date.timeIntervalSince(now)) })?
            .tempF ?? currentTemp

        // ---- Daily ---- split into history (past) and forecast (today + future).
        let allDays = OpenMeteoDTO.zipDaily(
            dates: dto.daily?.time ?? [],
            highs: dto.daily?.temperature_2m_max ?? [],
            lows: dto.daily?.temperature_2m_min ?? [],
            precips: dto.daily?.precipitation_sum ?? [],
            timezone: tz
        )

        let startOfToday = calendar.startOfDay(for: now)
        let history = allDays.filter { $0.date < startOfToday }
        let forecast = allDays.filter { $0.date > startOfToday }

        // Soil-temp forecast = same calendar day as now or later, sorted ascending.
        let soilForecast = hourlySoil
            .filter { $0.date >= calendar.startOfDay(for: now) }
            .sorted { $0.date < $1.date }

        return WeatherSnapshot(
            fetchedAt: now,
            latitude: latitude,
            longitude: longitude,
            current: CurrentConditions(
                tempF: currentTemp,
                precipInchesToday: currentPrecip,
                weatherCode: currentCode,
                soilTemp6cmF: currentSoilTemp
            ),
            dailyForecast: forecast,
            dailyHistory: history,
            soilTempForecast: soilForecast
        )
    }
}

// MARK: - DTO

/// Internal Codable wire types for Open-Meteo. Kept separate from
/// `WeatherSnapshot` so upstream API drift doesn't ripple into stored data.
enum OpenMeteoDTO {

    struct Response: Decodable {
        let latitude: Double?
        let longitude: Double?
        let timezone: String?
        let current: Current?
        let daily: Daily?
        let hourly: Hourly?
    }

    struct Current: Decodable {
        let time: String?
        let temperature_2m: Double?
        let precipitation: Double?
        let weather_code: Int?
    }

    struct Daily: Decodable {
        let time: [String]?
        let temperature_2m_max: [Double?]?
        let temperature_2m_min: [Double?]?
        let precipitation_sum: [Double?]?
    }

    struct Hourly: Decodable {
        let time: [String]?
        let soil_temperature_6cm: [Double?]?
    }

    // ---- helpers ----

    /// Parse Open-Meteo's "yyyy-MM-dd'T'HH:mm" hourly timestamps in a fixed timezone.
    static func parseHourly(_ raw: String, timezone: TimeZone) -> Date? {
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = timezone
        f.dateFormat = "yyyy-MM-dd'T'HH:mm"
        return f.date(from: raw)
    }

    /// Parse Open-Meteo's "yyyy-MM-dd" daily date strings.
    static func parseDaily(_ raw: String, timezone: TimeZone) -> Date? {
        let f = DateFormatter()
        f.locale = Locale(identifier: "en_US_POSIX")
        f.timeZone = timezone
        f.dateFormat = "yyyy-MM-dd"
        return f.date(from: raw)
    }

    static func zipHourly(times: [String], values: [Double?], timezone: TimeZone) -> [HourlySoil] {
        let pairs = zip(times, values)
        return pairs.compactMap { (raw, value) -> HourlySoil? in
            guard let date = parseHourly(raw, timezone: timezone),
                  let temp = value else { return nil }
            return HourlySoil(date: date, tempF: temp)
        }
    }

    static func zipDaily(
        dates: [String],
        highs: [Double?],
        lows: [Double?],
        precips: [Double?],
        timezone: TimeZone
    ) -> [DailyWeather] {
        var result: [DailyWeather] = []
        for i in 0..<dates.count {
            guard let date = parseDaily(dates[i], timezone: timezone) else { continue }
            let high = (i < highs.count ? highs[i] : nil) ?? 0
            let low = (i < lows.count ? lows[i] : nil) ?? 0
            let precip = (i < precips.count ? precips[i] : nil) ?? 0
            result.append(DailyWeather(date: date, highF: high, lowF: low, precipInches: precip))
        }
        return result
    }
}
