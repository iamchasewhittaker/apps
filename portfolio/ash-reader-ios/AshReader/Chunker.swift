import Foundation

/// Strip common Markdown syntax so copied text pastes cleanly into a chat UI.
/// Mirrors `stripMarkdown` in ash-reader/lib/chunker.ts.
func stripMarkdown(_ text: String) -> String {
    let replacements: [(pattern: String, replacement: String, options: NSRegularExpression.Options)] = [
        (#"^#{1,6}\s+"#,          "",    [.anchorsMatchLines]),
        (#"\*\*(.+?)\*\*"#,       "$1",  []),
        (#"\*(.+?)\*"#,           "$1",  []),
        (#"`(.+?)`"#,             "$1",  []),
        (#"^\s*[-*+]\s+"#,        "• ",  [.anchorsMatchLines]),
        (#"^\s*\d+\.\s+"#,        "",    [.anchorsMatchLines]),
        (#"\[(.+?)\]\(.+?\)"#,    "$1",  []),
        (#"^>\s+"#,               "",    [.anchorsMatchLines]),
        (#"---+"#,                "",    []),
        (#"\n{3,}"#,              "\n\n",[]),
    ]
    var out = text
    for (pattern, replacement, options) in replacements {
        guard let re = try? NSRegularExpression(pattern: pattern, options: options) else { continue }
        let range = NSRange(out.startIndex..., in: out)
        out = re.stringByReplacingMatches(in: out, options: [], range: range, withTemplate: replacement)
    }
    return out.trimmingCharacters(in: .whitespacesAndNewlines)
}

private let turnPattern = try! NSRegularExpression(
    pattern: #"^(Human|User|You|ChatGPT|Assistant|GPT-4|GPT-3\.5|AI)\s*:"#,
    options: [.caseInsensitive, .anchorsMatchLines]
)

private func splitIntoTurns(_ text: String) -> [String] {
    let lines = text.components(separatedBy: "\n")
    var segments: [String] = []
    var current: [String] = []

    for line in lines {
        let range = NSRange(line.startIndex..., in: line)
        let isNewTurn = turnPattern.firstMatch(in: line, range: range) != nil

        if isNewTurn && !current.isEmpty {
            segments.append(current.joined(separator: "\n"))
            current = [line]
        } else {
            current.append(line)
        }
    }
    if !current.isEmpty { segments.append(current.joined(separator: "\n")) }
    return segments.filter { !$0.trimmingCharacters(in: .whitespaces).isEmpty }
}

private func splitIntoParagraphs(_ text: String) -> [String] {
    text.components(separatedBy: "\n\n")
        .filter { !$0.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }
}

private func splitIntoSentences(_ text: String) -> [String] {
    var segments: [String] = []
    var current = ""
    let chars = Array(text)
    var i = 0
    while i < chars.count {
        current.append(chars[i])
        if chars[i] == "." || chars[i] == "!" || chars[i] == "?" {
            let next = i + 1
            if next < chars.count, chars[next].isWhitespace {
                segments.append(current)
                current = ""
            }
        }
        i += 1
    }
    if !current.isEmpty { segments.append(current) }
    return segments.map { $0.trimmingCharacters(in: .whitespaces) }
                   .filter { !$0.isEmpty }
}

/// Recursively split `text` into segments each ≤ maxChars.
/// Strategy order: Q&A turns → paragraphs → sentences → greedy word pack → hard slice.
private func splitToFit(_ text: String, maxChars: Int) -> [String] {
    if text.count <= maxChars { return [text] }

    for splitter in [splitIntoTurns, splitIntoParagraphs, splitIntoSentences] {
        let parts = splitter(text)
        if parts.count > 1 {
            return parts.flatMap { splitToFit($0, maxChars: maxChars) }
        }
    }

    // Greedy-pack words
    let words = text.split(whereSeparator: { $0.isWhitespace }).map(String.init)
    if words.count > 1 {
        var out: [String] = []
        var buf: [String] = []
        var bufLen = 0
        for w in words {
            let projected = bufLen == 0 ? w.count : bufLen + 1 + w.count
            if projected > maxChars && !buf.isEmpty {
                out.append(buf.joined(separator: " "))
                buf = []
                bufLen = 0
            }
            if w.count > maxChars {
                var start = w.startIndex
                while start < w.endIndex {
                    let end = w.index(start, offsetBy: maxChars, limitedBy: w.endIndex) ?? w.endIndex
                    out.append(String(w[start..<end]))
                    start = end
                }
            } else {
                buf.append(w)
                bufLen = bufLen == 0 ? w.count : bufLen + 1 + w.count
            }
        }
        if !buf.isEmpty { out.append(buf.joined(separator: " ")) }
        return out
    }

    // Hard slice
    var out: [String] = []
    var start = text.startIndex
    while start < text.endIndex {
        let end = text.index(start, offsetBy: maxChars, limitedBy: text.endIndex) ?? text.endIndex
        out.append(String(text[start..<end]))
        start = end
    }
    return out
}

/// Character-based chunker. Never exceeds maxChars.
/// Greedy-packs turn/paragraph atoms joined by "\n\n".
/// Mirrors `chunkByChars` in ash-reader/lib/chunker.ts.
func chunkByChars(_ text: String, maxChars: Int) -> [Chunk] {
    let turns = splitIntoTurns(text)
    let segments = turns.count > 1 ? turns : splitIntoParagraphs(text)

    let atoms = segments.flatMap { splitToFit($0, maxChars: maxChars) }

    let join = "\n\n"
    var chunks: [Chunk] = []
    var cur: [String] = []
    var curLen = 0
    var chunkIndex = 0

    for atom in atoms {
        let projected = curLen == 0 ? atom.count : curLen + join.count + atom.count
        if projected > maxChars && !cur.isEmpty {
            let joined = cur.joined(separator: join).trimmingCharacters(in: .whitespacesAndNewlines)
            if !joined.isEmpty {
                chunks.append(Chunk(id: chunkIndex, text: joined))
                chunkIndex += 1
            }
            cur = []
            curLen = 0
        }
        cur.append(atom)
        curLen = curLen == 0 ? atom.count : curLen + join.count + atom.count
    }

    if !cur.isEmpty {
        let joined = cur.joined(separator: join).trimmingCharacters(in: .whitespacesAndNewlines)
        if !joined.isEmpty {
            chunks.append(Chunk(id: chunkIndex, text: joined))
        }
    }

    return chunks
}
