import Foundation

struct Chunk: Identifiable {
    let id: Int
    let text: String
    var charCount: Int { text.count }
}
