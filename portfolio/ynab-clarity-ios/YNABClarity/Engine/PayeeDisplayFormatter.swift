import Foundation

/// Normalizes noisy bank/merchant payee strings for display in transaction lists.
enum PayeeDisplayFormatter {

    /// Friendly merchant label for UI (never empty — returns `"Unknown Payee"` when missing).
    static func displayPayee(_ raw: String?) -> String {
        guard var s = raw?.trimmingCharacters(in: .whitespacesAndNewlines), !s.isEmpty else {
            return "Unknown Payee"
        }

        let normalized = s.replacingOccurrences(of: #"\s+"#, with: " ", options: .regularExpression)
        let lower = normalized.lowercased()

        if amazonLike(lower) { return "Amazon" }
        if lower.contains("walmart") || lower.contains("wal-mart") || lower.contains("wm supercenter") {
            return "Walmart"
        }
        if lower.contains("target") || lower.contains("tgt ") { return "Target" }
        if lower.contains("costco") { return "Costco" }
        if lower.contains("wholefds") || lower.contains("whole foods") { return "Whole Foods" }
        if lower.contains("uber eats") || lower == "uber eats" { return "Uber Eats" }
        if lower.contains("doordash") { return "DoorDash" }
        if lower.contains("instacart") { return "Instacart" }
        if lower.contains("paypal") { return "PayPal" }
        if lower.contains("venmo") { return "Venmo" }
        if lower.contains("zelle") { return "Zelle" }
        if lower.contains("apple.com") || lower.contains("apple store") { return "Apple" }
        if lower.contains("google") && lower.contains("youtube") { return "YouTube" }
        if lower.contains("netflix") { return "Netflix" }
        if lower.contains("spotify") { return "Spotify" }
        if lower.contains("shell") && lower.contains("oil") { return "Shell" }
        if lower.contains("chevron") { return "Chevron" }

        var cleaned = stripNoise(normalized)
        cleaned = cleaned.trimmingCharacters(in: .whitespacesAndNewlines)
        if cleaned.isEmpty { return "Unknown Payee" }

        // If still ALL CAPS (common for card descriptors), title-case lightly.
        let letters = cleaned.filter(\.isLetter)
        if letters.count >= 4, letters == letters.uppercased() {
            return titleCaseWords(cleaned.lowercased())
        }
        return cleaned
    }

    /// Single-line memo preview for subtitles (nil when empty).
    static func memoPreview(_ memo: String?, maxLength: Int = 90) -> String? {
        guard var m = memo?.trimmingCharacters(in: .whitespacesAndNewlines), !m.isEmpty else { return nil }
        m = m.replacingOccurrences(of: #"\s+"#, with: " ", options: .regularExpression)
        if m.count <= maxLength { return m }
        let idx = m.index(m.startIndex, offsetBy: maxLength - 1)
        return String(m[..<idx]) + "…"
    }

    // MARK: - Private

    private static func amazonLike(_ lower: String) -> Bool {
        if lower.contains("amazon") { return true }
        if lower.contains("amzn") { return true }
        if lower.contains("prime video") { return true }
        if lower.contains("audible") && lower.contains("amzn") { return true }
        return false
    }

    /// Removes trailing reference / location noise often appended by processors.
    private static func stripNoise(_ s: String) -> String {
        var out = s

        // Trailing asterisk + alphanumerics (e.g. `AMZN MKTP US*AB12CD34EF`)
        out = out.replacingOccurrences(
            of: #"\s*\*[A-Z0-9]{4,}\s*$"#,
            with: "",
            options: [.regularExpression, .caseInsensitive]
        )

        // Trailing #digits
        out = out.replacingOccurrences(
            of: #"\s*#\d{3,}\s*$"#,
            with: "",
            options: .regularExpression
        )

        // "POS " / "DEBIT " prefixes (keep merchant after)
        out = out.replacingOccurrences(
            of: #"^(POS|DEBIT|CREDIT|PURCHASE)\s+"#,
            with: "",
            options: [.regularExpression, .caseInsensitive]
        )

        return out.trimmingCharacters(in: .whitespacesAndNewlines)
    }

    private static func titleCaseWords(_ lower: String) -> String {
        lower.split(separator: " ")
            .map { word in
                guard let first = word.first else { return "" }
                return String(first).uppercased() + word.dropFirst().lowercased()
            }
            .joined(separator: " ")
    }
}
