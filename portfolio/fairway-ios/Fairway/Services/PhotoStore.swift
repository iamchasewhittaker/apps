import UIKit

final class PhotoStore {
    let root: URL

    init(root: URL = FileManager.default
            .urls(for: .documentDirectory, in: .userDomainMask)[0]
            .appendingPathComponent("photos")) {
        self.root = root
        try? FileManager.default.createDirectory(at: root, withIntermediateDirectories: true)
    }

    @discardableResult
    func save(image: UIImage) -> UUID? {
        guard let data = compressed(image) else { return nil }
        let id = UUID()
        let url = root.appendingPathComponent("\(id.uuidString).jpg")
        try? data.write(to: url)
        return id
    }

    func load(id: UUID) -> UIImage? {
        let url = root.appendingPathComponent("\(id.uuidString).jpg")
        return UIImage(contentsOfFile: url.path)
    }

    func delete(id: UUID) {
        let url = root.appendingPathComponent("\(id.uuidString).jpg")
        try? FileManager.default.removeItem(at: url)
    }

    private func compressed(_ image: UIImage) -> Data? {
        // Walk quality down until ≤500 KB or give up
        for quality in stride(from: 0.8, through: 0.05, by: -0.15) {
            if let data = image.jpegData(compressionQuality: quality),
               data.count <= 500_000 {
                return data
            }
        }
        return nil
    }
}
