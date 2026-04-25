import CoreLocation

final class Geocoder {
    static func geocode(address: String) async -> CLLocationCoordinate2D? {
        let geocoder = CLGeocoder()
        guard let placemark = try? await geocoder.geocodeAddressString(address).first,
              let loc = placemark.location else {
            return nil
        }
        let coord = loc.coordinate
        guard isPlausible(coord) else { return nil }
        return coord
    }

    private static func isPlausible(_ c: CLLocationCoordinate2D) -> Bool {
        abs(c.latitude) > 0.0001 &&
        abs(c.longitude) > 0.0001 &&
        abs(c.latitude) <= 90 &&
        abs(c.longitude) <= 180
    }
}
