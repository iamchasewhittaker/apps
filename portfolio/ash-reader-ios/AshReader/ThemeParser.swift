import Foundation

struct ThemeSection: Identifiable, Equatable {
    let id: String
    let title: String
    let content: String
    let actions: [String]
}

private func slugify(_ s: String) -> String {
    let lower = s.lowercased()
    let pattern = try! NSRegularExpression(pattern: "[^a-z0-9]+")
    let range = NSRange(lower.startIndex..., in: lower)
    let replaced = pattern.stringByReplacingMatches(
        in: lower, options: [], range: range, withTemplate: "-"
    )
    return replaced.trimmingCharacters(in: CharacterSet(charactersIn: "-"))
}

private func extractActions(_ body: String) -> [String] {
    let patterns = [
        #"^[-*]\s+(.+)$"#,
        #"^\d+\.\s+(.+)$"#,
    ]
    var results: [String] = []
    for pattern in patterns {
        guard let re = try? NSRegularExpression(
            pattern: pattern, options: [.anchorsMatchLines]
        ) else { continue }
        let range = NSRange(body.startIndex..., in: body)
        re.enumerateMatches(in: body, options: [], range: range) { match, _, _ in
            guard let match = match, match.numberOfRanges >= 2,
                  let captured = Range(match.range(at: 1), in: body) else { return }
            let raw = String(body[captured])
            let cleaned = raw.replacingOccurrences(of: "**", with: "")
                .trimmingCharacters(in: .whitespaces)
            if cleaned.count > 10 && cleaned.count < 200 {
                results.append(cleaned)
            }
        }
    }
    return results
}

func parseThemes(_ md: String) -> [ThemeSection] {
    // Split on lines starting with "## " (matching the web regex: /^## /m)
    let splitPattern = try! NSRegularExpression(
        pattern: #"^## "#, options: [.anchorsMatchLines]
    )
    let range = NSRange(md.startIndex..., in: md)
    let matches = splitPattern.matches(in: md, options: [], range: range)

    var parts: [String] = []
    let nsString = md as NSString
    var cursor = 0
    for match in matches {
        if match.range.location > cursor {
            let prev = nsString.substring(with: NSRange(
                location: cursor,
                length: match.range.location - cursor
            ))
            parts.append(prev)
        }
        cursor = match.range.location + match.range.length
    }
    if cursor < nsString.length {
        parts.append(nsString.substring(from: cursor))
    }

    // First "part" is whatever preceded the first ## — discard it (matches JS `.filter(Boolean)`
    // after splitting, which here means dropping the preamble)
    let sections = parts.filter { !$0.isEmpty }

    let titlePrefix = try! NSRegularExpression(pattern: #"^\d+\.\s*"#)

    return sections.compactMap { part -> ThemeSection? in
        let lines = part.components(separatedBy: "\n")
        guard let rawTitleLine = lines.first else { return nil }
        let titleRange = NSRange(rawTitleLine.startIndex..., in: rawTitleLine)
        let strippedTitle = titlePrefix.stringByReplacingMatches(
            in: rawTitleLine, options: [], range: titleRange, withTemplate: ""
        ).trimmingCharacters(in: .whitespaces)
        if strippedTitle.isEmpty { return nil }

        let body = lines.dropFirst().joined(separator: "\n")
            .trimmingCharacters(in: .whitespacesAndNewlines)

        return ThemeSection(
            id: slugify(strippedTitle),
            title: strippedTitle,
            content: body,
            actions: extractActions(body)
        )
    }
}
