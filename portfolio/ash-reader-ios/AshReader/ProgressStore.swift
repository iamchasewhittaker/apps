import Foundation

class ProgressStore: ObservableObject {
    private let key = "ash_reader_ios_sent"

    @Published var sent: Set<Int> = []

    init() {
        let saved = UserDefaults.standard.array(forKey: key) as? [Int] ?? []
        sent = Set(saved)
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
        UserDefaults.standard.set(Array(sent), forKey: key)
    }
}
