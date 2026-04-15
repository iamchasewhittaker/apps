import Foundation

@Observable
final class JobSearchStore {
    private(set) var data: JobSearchDataBlob
    private let remoteSync: JobSearchRemoteSync
    private let encoder: JSONEncoder = {
        let e = JSONEncoder()
        e.outputFormatting = [.sortedKeys, .prettyPrinted]
        return e
    }()

    private let decoder = JSONDecoder()

    init(data: JobSearchDataBlob = .empty(), remoteSync: JobSearchRemoteSync = NoOpJobSearchRemoteSync()) {
        self.data = data
        self.remoteSync = remoteSync
    }

    func load() {
        guard let raw = UserDefaults.standard.data(forKey: JobSearchConfig.storageKey) else {
            data = .empty()
            return
        }
        do {
            data = try decoder.decode(JobSearchDataBlob.self, from: raw)
        } catch {
            data = .empty()
        }
    }

    func save() {
        data.syncAt = Int64(Date().timeIntervalSince1970 * 1000)
        do {
            let bytes = try encoder.encode(data)
            UserDefaults.standard.set(bytes, forKey: JobSearchConfig.storageKey)
        } catch {}
        Task {
            try? await remoteSync.push(data)
        }
    }

    func refreshFromRemote() async {
        do {
            if let remote = try await remoteSync.pullIfNewerThan(localSyncAt: data.syncAt) {
                data = remote
                save()
            }
        } catch {}
    }

    // MARK: - Applications

    func upsertApplication(_ app: JobApplication) {
        if let idx = data.applications.firstIndex(where: { $0.id == app.id }) {
            data.applications[idx] = app
        } else {
            data.applications.insert(app, at: 0)
        }
        save()
    }

    func deleteApplication(id: String) {
        data.applications.removeAll { $0.id == id }
        save()
    }

    // MARK: - Contacts

    func upsertContact(_ contact: JobContact) {
        if let idx = data.contacts.firstIndex(where: { $0.id == contact.id }) {
            data.contacts[idx] = contact
        } else {
            data.contacts.insert(contact, at: 0)
        }
        save()
    }

    func deleteContact(id: String) {
        data.contacts.removeAll { $0.id == id }
        save()
    }

    // MARK: - Profile

    func updateProfile(_ profile: JobProfile) {
        data.profile = profile
        save()
    }
}
