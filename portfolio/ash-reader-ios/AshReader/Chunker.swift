import Foundation

private let turnPattern = try! NSRegularExpression(
    pattern: #"^(Human|User|You|ChatGPT|Assistant|GPT-4|GPT-3\.5|AI)\s*:"#,
    options: [.caseInsensitive, .anchorsMatchLines]
)

private func wordCount(_ text: String) -> Int {
    text.split(whereSeparator: { $0.isWhitespace }).count
}

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

/// Recursively split any segment larger than `maxWords` using the finer-grained splitters.
private func refineSegments(_ segments: [String], maxWords: Int) -> [String] {
    var result: [String] = []
    for seg in segments {
        if wordCount(seg) <= maxWords {
            result.append(seg)
            continue
        }
        // Too big — try paragraphs
        let paras = splitIntoParagraphs(seg)
        if paras.count > 1 {
            result.append(contentsOf: refineSegments(paras, maxWords: maxWords))
            continue
        }
        // Try sentences
        let sentences = splitIntoSentences(seg)
        if sentences.count > 1 {
            result.append(contentsOf: refineSegments(sentences, maxWords: maxWords))
            continue
        }
        // Can't split further — keep as is
        result.append(seg)
    }
    return result
}

func chunkSmart(_ text: String, targetWords: Int) -> [Chunk] {
    let lo = Int(Double(targetWords) * 0.8)
    let hi = Int(Double(targetWords) * 1.2)

    let turns = splitIntoTurns(text)
    let initial: [String]
    if turns.count > 1 {
        initial = turns
    } else {
        let paras = splitIntoParagraphs(text)
        initial = paras.count > 1 ? paras : splitIntoSentences(text)
    }

    // Guarantee no single segment exceeds the upper bound
    let segments = refineSegments(initial, maxWords: hi)

    var chunks: [Chunk] = []
    var current: [String] = []
    var currentWords = 0
    var chunkIndex = 0

    var i = 0
    while i < segments.count {
        let seg = segments[i]
        let segWords = wordCount(seg)

        if currentWords >= lo && currentWords + segWords > hi {
            let joined = current.joined(separator: "\n\n").trimmingCharacters(in: .whitespacesAndNewlines)
            chunks.append(Chunk(id: chunkIndex, text: joined))
            chunkIndex += 1
            current = [seg]
            currentWords = segWords
            i += 1
            continue
        }

        current.append(seg)
        currentWords += segWords

        if currentWords >= targetWords {
            let nextIdx = i + 1
            if nextIdx < segments.count {
                let nextWords = wordCount(segments[nextIdx])
                if currentWords + nextWords <= hi {
                    current.append(segments[nextIdx])
                    currentWords += nextWords
                    i += 1
                }
            }
            let joined = current.joined(separator: "\n\n").trimmingCharacters(in: .whitespacesAndNewlines)
            chunks.append(Chunk(id: chunkIndex, text: joined))
            chunkIndex += 1
            current = []
            currentWords = 0
        }

        i += 1
    }

    if !current.isEmpty {
        let joined = current.joined(separator: "\n\n").trimmingCharacters(in: .whitespacesAndNewlines)
        if !joined.isEmpty {
            chunks.append(Chunk(id: chunkIndex, text: joined))
        }
    }

    return chunks
}
