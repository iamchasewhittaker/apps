import Foundation

final class SyncedStore {
    static let shared = SyncedStore()

    private let kvs = NSUbiquitousKeyValueStore.default
    private let ud = UserDefaults.standard
    private let migrationFlag = "ash_reader_ios_migrated"
    private let prefix = "ash_reader_ios_"

    private init() {
        migrate()
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(iCloudDidChange),
            name: NSUbiquitousKeyValueStore.didChangeExternallyNotification,
            object: kvs
        )
    }

    // MARK: - API

    func intArray(forKey key: String) -> [Int] {
        if let arr = kvs.array(forKey: key) as? [Int] { return arr }
        return ud.array(forKey: key) as? [Int] ?? []
    }

    func setIntArray(_ value: [Int], forKey key: String) {
        kvs.set(value, forKey: key)
        ud.set(value, forKey: key)
    }

    func string(forKey key: String) -> String? {
        if let s = kvs.string(forKey: key) { return s }
        return ud.string(forKey: key)
    }

    func setString(_ value: String, forKey key: String) {
        kvs.set(value, forKey: key)
        ud.set(value, forKey: key)
    }

    func removeObject(forKey key: String) {
        kvs.removeObject(forKey: key)
        ud.removeObject(forKey: key)
    }

    func allKeys(withPrefix prefix: String) -> [String] {
        var keys = Set<String>()
        for key in kvs.dictionaryRepresentation.keys where key.hasPrefix(prefix) {
            keys.insert(key)
        }
        for key in ud.dictionaryRepresentation().keys where key.hasPrefix(prefix) {
            keys.insert(key)
        }
        return Array(keys)
    }

    func synchronize() {
        kvs.synchronize()
    }

    // MARK: - Private

    private func migrate() {
        guard !ud.bool(forKey: migrationFlag) else { return }
        for (key, value) in ud.dictionaryRepresentation() where key.hasPrefix(prefix) {
            if let arr = value as? [Int] {
                kvs.set(arr, forKey: key)
            } else if let str = value as? String {
                kvs.set(str, forKey: key)
            }
        }
        kvs.synchronize()
        ud.set(true, forKey: migrationFlag)
    }

    @objc private func iCloudDidChange(_ notification: Notification) {
        DispatchQueue.main.async {
            NotificationCenter.default.post(name: .iCloudSyncDidChange, object: nil)
        }
    }
}

extension Notification.Name {
    static let iCloudSyncDidChange = Notification.Name("iCloudSyncDidChange")
}
