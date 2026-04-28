import Foundation

/// Cached weather data fetched from Open-Meteo. Lives as an optional field on
/// FairwayBlob so existing stored blobs decode unchanged (nil = never fetched).
struct WeatherSnapshot: Codable, Equatable {
    var fetchedAt: Date
    /// Lat/lon used for this fetch — recorded so we can detect a property move
    /// and invalidate the cache.
    var latitude: Double
    var longitude: Double
    var current: CurrentConditions
    /// Tomorrow → 6 days ahead.
    var dailyForecast: [DailyWeather]
    /// 7 days ago → yesterday (oldest first). Used for rain accumulation.
    var dailyHistory: [DailyWeather]
    /// Hourly soil temp at 6 cm depth — today through ~5 days ahead.
    var soilTempForecast: [HourlySoil]
}

extension WeatherSnapshot {
    init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        fetchedAt = try c.decode(Date.self, forKey: .fetchedAt)
        latitude = try c.decodeIfPresent(Double.self, forKey: .latitude) ?? 0
        longitude = try c.decodeIfPresent(Double.self, forKey: .longitude) ?? 0
        current = try c.decode(CurrentConditions.self, forKey: .current)
        dailyForecast = try c.decodeIfPresent([DailyWeather].self, forKey: .dailyForecast) ?? []
        dailyHistory = try c.decodeIfPresent([DailyWeather].self, forKey: .dailyHistory) ?? []
        soilTempForecast = try c.decodeIfPresent([HourlySoil].self, forKey: .soilTempForecast) ?? []
    }

    /// Total rainfall across `dailyHistory` (last 7 days, excluding today).
    var rainInchesLast7Days: Double {
        dailyHistory.reduce(0) { $0 + $1.precipInches }
    }

    /// Total rainfall across `dailyForecast` (next ~7 days, excluding today).
    var rainInchesNext7Days: Double {
        dailyForecast.reduce(0) { $0 + $1.precipInches }
    }
}

struct CurrentConditions: Codable, Equatable {
    var tempF: Double
    /// Precipitation that has fallen so far today (Open-Meteo `current.precipitation`).
    var precipInchesToday: Double
    /// WMO weather code — see `weatherSymbol(forCode:)` for mapping.
    var weatherCode: Int
    /// Soil temperature at 6 cm depth right now. Open-Meteo gives this hourly;
    /// we lift the closest-to-now sample into the snapshot for fast access.
    var soilTemp6cmF: Double
}

struct DailyWeather: Codable, Equatable, Identifiable {
    var id: Date { date }
    var date: Date
    var highF: Double
    var lowF: Double
    var precipInches: Double
}

struct HourlySoil: Codable, Equatable, Identifiable {
    var id: Date { date }
    var date: Date
    var tempF: Double
}

// MARK: - WMO weather code → SF Symbol mapping

/// Maps an Open-Meteo WMO weather code to a representative SF Symbol name.
/// Not every code is covered; falls back to `cloud.fill`.
func weatherSymbol(forCode code: Int) -> String {
    switch code {
    case 0: return "sun.max.fill"                            // clear
    case 1, 2: return "cloud.sun.fill"                       // mainly clear / partly cloudy
    case 3: return "cloud.fill"                              // overcast
    case 45, 48: return "cloud.fog.fill"                     // fog
    case 51, 53, 55, 56, 57: return "cloud.drizzle.fill"     // drizzle
    case 61, 63, 65, 66, 67: return "cloud.rain.fill"        // rain
    case 71, 73, 75, 77: return "cloud.snow.fill"            // snow
    case 80, 81, 82: return "cloud.heavyrain.fill"           // rain showers
    case 85, 86: return "cloud.snow.fill"                    // snow showers
    case 95: return "cloud.bolt.rain.fill"                   // thunderstorm
    case 96, 99: return "cloud.bolt.rain.fill"               // thunderstorm w/ hail
    default: return "cloud.fill"
    }
}

/// Short label for a WMO code — used by VoiceOver and tooltips.
func weatherLabel(forCode code: Int) -> String {
    switch code {
    case 0: return "Clear"
    case 1: return "Mainly clear"
    case 2: return "Partly cloudy"
    case 3: return "Overcast"
    case 45, 48: return "Fog"
    case 51, 53, 55: return "Drizzle"
    case 56, 57: return "Freezing drizzle"
    case 61, 63, 65: return "Rain"
    case 66, 67: return "Freezing rain"
    case 71, 73, 75, 77: return "Snow"
    case 80, 81, 82: return "Rain showers"
    case 85, 86: return "Snow showers"
    case 95: return "Thunderstorm"
    case 96, 99: return "Thunderstorm with hail"
    default: return "Cloudy"
    }
}
