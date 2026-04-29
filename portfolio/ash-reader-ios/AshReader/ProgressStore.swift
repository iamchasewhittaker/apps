import Foundation

class ProgressStore: ObservableObject {
    private let key: String
    private var observer: NSObjectProtocol?

    @Published var sent: Set<Int> = []

    init(key: String = "ash_reader_ios_sent") {
        self.key = key
        sent = Set(SyncedStore.shared.intArray(forKey: key))
        observer = NotificationCenter.default.addObserver(
            forName: .iCloudSyncDidChange,
            object: nil,
            queue: .main
        ) { [weak self] _ in
            guard let self else { return }
            self.sent = Set(SyncedStore.shared.intArray(forKey: self.key))
        }
    }

    func toggle(_ index: Int) {
        if sent.contains(index) {
            sent.remove(index)
        } else {
            sent.insert(index)
        }
        persist()
    }

    func reset() {
        sent = []
        persist()
    }

    private func persist() {
        SyncedStore.shared.setIntArray(Array(sent), forKey: key)
    }
}
