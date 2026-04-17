import Foundation

struct Chunk: Identifiable {
    let id: Int
    let text: String
    var wordCount: Int { text.split(separator: " ").count }
}
