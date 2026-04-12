import Foundation
import Security

/// Stores the YNAB personal access token in the iOS Keychain.
/// Token is device-only (kSecAttrAccessibleWhenUnlockedThisDeviceOnly) —
/// it is never synced to iCloud Keychain.
enum KeychainHelper {
    private static let service = "com.chasewhittaker.YNABClarity"
    private static let account = "ynab_personal_access_token"

    /// Save a token. Replaces any existing value.
    @discardableResult
    static func saveToken(_ token: String) -> Bool {
        guard let data = token.data(using: .utf8) else { return false }
        // Delete existing entry first to avoid errSecDuplicateItem.
        deleteToken()
        let query: [CFString: Any] = [
            kSecClass:                kSecClassGenericPassword,
            kSecAttrService:          service,
            kSecAttrAccount:          account,
            kSecValueData:            data,
            // Device-only: never synced to iCloud Keychain.
            kSecAttrAccessible:       kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
        ]
        return SecItemAdd(query as CFDictionary, nil) == errSecSuccess
    }

    /// Read the stored token. Returns nil if no token is saved.
    static func readToken() -> String? {
        let query: [CFString: Any] = [
            kSecClass:       kSecClassGenericPassword,
            kSecAttrService: service,
            kSecAttrAccount: account,
            kSecReturnData:  true,
            kSecMatchLimit:  kSecMatchLimitOne,
        ]
        var result: AnyObject?
        guard SecItemCopyMatching(query as CFDictionary, &result) == errSecSuccess,
              let data = result as? Data else { return nil }
        return String(data: data, encoding: .utf8)
    }

    /// Delete the stored token (called on 401 or explicit sign-out).
    @discardableResult
    static func deleteToken() -> Bool {
        let query: [CFString: Any] = [
            kSecClass:       kSecClassGenericPassword,
            kSecAttrService: service,
            kSecAttrAccount: account,
        ]
        let status = SecItemDelete(query as CFDictionary)
        return status == errSecSuccess || status == errSecItemNotFound
    }

    static func hasToken() -> Bool {
        readToken() != nil
    }
}
