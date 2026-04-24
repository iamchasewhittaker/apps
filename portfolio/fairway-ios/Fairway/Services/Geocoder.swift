import CoreLocation

final class Geocoder {
    static func geocode(address: String) async -> CLLocationCoordinate2D? {
        let geocoder = CLGeocoder()
        guard let placemark = try? await geocoder.geocodeAddressString(address).first,
              let loc = placemark.location else {
            return nil
        }
        return loc.coordinate
    }
}
