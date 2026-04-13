import Foundation

/// Generic UserDefaults JSON storage helpers used across all Clarity apps.
/// All Clarity apps store data as JSON-encoded Codable structs under `chase_*` prefixed keys.
public enum StorageHelpers {

    private static let encoder = JSONEncoder()
    private static let decoder = JSONDecoder()

    // MARK: - Load

    /// Loads and decodes a Codable value from UserDefaults.
    /// Returns `nil` if the key doesn't exist or decoding fails.
    public static func load<T: Codable>(_ type: T.Type, key: String) -> T? {
        guard let data = UserDefaults.standard.data(forKey: key) else { return nil }
        return try? decoder.decode(type, from: data)
    }

    // MARK: - Save

    /// Encodes a Codable value and saves it to UserDefaults.
    @discardableResult
    public static func save<T: Codable>(_ value: T, key: String) -> Bool {
        guard let data = try? encoder.encode(value) else { return false }
        UserDefaults.standard.set(data, forKey: key)
        return true
    }

    // MARK: - Remove

    /// Removes a key from UserDefaults.
    public static func remove(key: String) {
        UserDefaults.standard.removeObject(forKey: key)
    }

    // MARK: - Exists

    /// Returns true if a key exists in UserDefaults (regardless of whether it's decodable).
    public static func exists(key: String) -> Bool {
        UserDefaults.standard.object(forKey: key) != nil
    }
}
