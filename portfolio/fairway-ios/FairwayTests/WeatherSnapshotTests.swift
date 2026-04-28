import XCTest
@testable import Fairway

@MainActor
final class WeatherSnapshotTests: XCTestCase {

    // MARK: - Round-trip

    func testWeatherSnapshotRoundTrip() throws {
        let now = Date()
        let snapshot = WeatherSnapshot(
            fetchedAt: now,
            latitude: 40.30,
            longitude: -111.74,
            current: CurrentConditions(
                tempF: 62.0,
                precipInchesToday: 0.05,
                weatherCode: 61,
                soilTemp6cmF: 51.5
            ),
            dailyForecast: [
                DailyWeather(date: now.addingTimeInterval(86400), highF: 65, lowF: 45, precipInches: 0.1)
            ],
            dailyHistory: [
                DailyWeather(date: now.addingTimeInterval(-86400), highF: 60, lowF: 42, precipInches: 0.5)
            ],
            soilTempForecast: [
                HourlySoil(date: now, tempF: 51.5)
            ]
        )

        let data = try JSONEncoder().encode(snapshot)
        let decoded = try JSONDecoder().decode(WeatherSnapshot.self, from: data)

        XCTAssertEqual(decoded.current.tempF, 62.0, accuracy: 0.01)
        XCTAssertEqual(decoded.current.soilTemp6cmF, 51.5, accuracy: 0.01)
        XCTAssertEqual(decoded.dailyForecast.count, 1)
        XCTAssertEqual(decoded.dailyHistory.count, 1)
        XCTAssertEqual(decoded.soilTempForecast.count, 1)
        XCTAssertEqual(decoded.latitude, 40.30, accuracy: 0.0001)
    }

    func testRainAccumulationHelpers() {
        let now = Date()
        let snapshot = WeatherSnapshot(
            fetchedAt: now,
            latitude: 40, longitude: -111,
            current: CurrentConditions(tempF: 60, precipInchesToday: 0, weatherCode: 0, soilTemp6cmF: 50),
            dailyForecast: [
                DailyWeather(date: now, highF: 65, lowF: 45, precipInches: 0.2),
                DailyWeather(date: now, highF: 70, lowF: 50, precipInches: 0.1)
            ],
            dailyHistory: [
                DailyWeather(date: now, highF: 55, lowF: 40, precipInches: 0.7),
                DailyWeather(date: now, highF: 58, lowF: 42, precipInches: 0.3)
            ],
            soilTempForecast: []
        )

        XCTAssertEqual(snapshot.rainInchesLast7Days, 1.0, accuracy: 0.001)
        XCTAssertEqual(snapshot.rainInchesNext7Days, 0.3, accuracy: 0.001)
    }

    // MARK: - Open-Meteo response decode

    func testOpenMeteoDTODecodes() throws {
        let json = sampleOpenMeteoJSON.data(using: .utf8)!
        let dto = try JSONDecoder().decode(OpenMeteoDTO.Response.self, from: json)
        XCTAssertEqual(dto.latitude ?? 0, 40.30, accuracy: 0.01)
        XCTAssertEqual(dto.current?.temperature_2m, 62.0)
        XCTAssertEqual(dto.daily?.time?.count, 14) // 7 past + 7 forecast
        XCTAssertEqual(dto.hourly?.time?.count, 24)
    }

    func testMakeSnapshotSplitsHistoryFromForecast() throws {
        let json = sampleOpenMeteoJSON.data(using: .utf8)!
        let dto = try JSONDecoder().decode(OpenMeteoDTO.Response.self, from: json)

        // The sample data has dates centered on 2026-04-27 (8 days history,
        // today, 6 days forecast). Pick "now" as 2026-04-27 noon UTC-6.
        let cal = makeMountainCalendar()
        let now = cal.date(from: DateComponents(
            timeZone: TimeZone(identifier: "America/Denver"),
            year: 2026, month: 4, day: 27, hour: 12, minute: 0
        ))!

        let snapshot = WeatherAPI.makeSnapshot(from: dto, latitude: 40.30, longitude: -111.74, now: now)

        XCTAssertGreaterThan(snapshot.dailyHistory.count, 0, "should split out at least one history day")
        XCTAssertGreaterThan(snapshot.dailyForecast.count, 0, "should split out at least one forecast day")
        XCTAssertTrue(snapshot.dailyHistory.allSatisfy { $0.date < cal.startOfDay(for: now) })
        XCTAssertTrue(snapshot.dailyForecast.allSatisfy { $0.date > cal.startOfDay(for: now) })
        XCTAssertEqual(snapshot.current.tempF, 62.0)
        // Sample hourly soil temps are all 50 → soil snapshot picks 50.
        XCTAssertEqual(snapshot.current.soilTemp6cmF, 50.0)
    }

    // MARK: - Helpers

    private func makeMountainCalendar() -> Calendar {
        var cal = Calendar(identifier: .gregorian)
        cal.timeZone = TimeZone(identifier: "America/Denver")!
        return cal
    }
}

/// Minimal Open-Meteo response sample (April 2026, Vineyard UT). Daily array
/// has 14 entries (7 past + 7 forecast); hourly has 24 entries.
private let sampleOpenMeteoJSON: String = """
{
  "latitude": 40.30,
  "longitude": -111.74,
  "timezone": "America/Denver",
  "current": {
    "time": "2026-04-27T12:00",
    "temperature_2m": 62.0,
    "precipitation": 0.05,
    "weather_code": 61
  },
  "daily": {
    "time": ["2026-04-20","2026-04-21","2026-04-22","2026-04-23","2026-04-24","2026-04-25","2026-04-26","2026-04-27","2026-04-28","2026-04-29","2026-04-30","2026-05-01","2026-05-02","2026-05-03"],
    "temperature_2m_max": [55,58,52,60,65,68,62,64,70,72,68,66,64,62],
    "temperature_2m_min": [40,42,38,42,45,48,46,44,50,52,48,46,44,42],
    "precipitation_sum": [0.1,0.2,0.0,0.3,0.0,0.5,0.1,0.05,0.0,0.0,0.2,0.1,0.0,0.0]
  },
  "hourly": {
    "time": ["2026-04-27T00:00","2026-04-27T01:00","2026-04-27T02:00","2026-04-27T03:00","2026-04-27T04:00","2026-04-27T05:00","2026-04-27T06:00","2026-04-27T07:00","2026-04-27T08:00","2026-04-27T09:00","2026-04-27T10:00","2026-04-27T11:00","2026-04-27T12:00","2026-04-27T13:00","2026-04-27T14:00","2026-04-27T15:00","2026-04-27T16:00","2026-04-27T17:00","2026-04-27T18:00","2026-04-27T19:00","2026-04-27T20:00","2026-04-27T21:00","2026-04-27T22:00","2026-04-27T23:00"],
    "soil_temperature_6cm": [50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50,50]
  }
}
"""
