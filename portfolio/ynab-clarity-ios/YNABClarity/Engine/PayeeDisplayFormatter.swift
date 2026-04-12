import Foundation

/// Normalizes noisy bank/merchant payee strings for display in transaction lists.
enum PayeeDisplayFormatter {

    /// Friendly merchant label for UI (never empty — returns `"Unknown Payee"` when missing).
    static func displayPayee(_ raw: String?) -> String {
        guard var s = raw?.trimmingCharacters(in: .whitespacesAndNewlines), !s.isEmpty else {
            return "Unknown Payee"
        }

        let normalized = collapseWhitespace(s)
        let bankStripped = stripLeadingBankNoise(normalized)
        let lower = bankStripped.lowercased()

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

        var cleaned = stripNoise(bankStripped)
        cleaned = cleaned.trimmingCharacters(in: .whitespacesAndNewlines)
        if cleaned.isEmpty { return "Unknown Payee" }

        // If still ALL CAPS (common for card descriptors), title-case lightly.
        let letters = cleaned.filter(\.isLetter)
        if letters.count >= 4, letters == letters.uppercased() {
            return titleCaseWords(cleaned.lowercased())
        }
        return cleaned
    }

    /// True when the raw payee (after bank noise stripping) looks like Amazon / AMZN.
    static func isAmazonMerchant(_ raw: String?) -> Bool {
        guard let s = raw?.trimmingCharacters(in: .whitespacesAndNewlines), !s.isEmpty else { return false }
        let normalized = collapseWhitespace(s)
        let bankStripped = stripLeadingBankNoise(normalized)
        return amazonLike(bankStripped.lowercased())
    }

    /// Single-line memo preview for subtitles (nil when empty).
    static func memoPreview(_ memo: String?, maxLength: Int = 90) -> String? {
        guard var m = memo?.trimmingCharacters(in: .whitespacesAndNewlines), !m.isEmpty else { return nil }
        m = collapseWhitespace(m)
        if m.count <= maxLength { return m }
        let idx = m.index(m.startIndex, offsetBy: maxLength - 1)
        return String(m[..<idx]) + "…"
    }

    /// Subtitle for item / memo context in transaction rows (Amazon-specific fallback when memo is empty).
    static func itemContextSubtitle(payeeRaw: String?, memo: String?) -> String? {
        if let preview = memoPreview(memo), !preview.isEmpty {
            return "Item: \(preview)"
        }
        if isAmazonMerchant(payeeRaw) {
            return "No item details in YNAB memo yet. Add a memo in YNAB or use Spend Clarity to enrich."
        }
        return nil
    }

    // MARK: - Private

    private static func collapseWhitespace(_ s: String) -> String {
        s.replacingOccurrences(of: #"\s+"#, with: " ", options: .regularExpression)
    }

    private static func amazonLike(_ lower: String) -> Bool {
        if lower.contains("amazon") { return true }
        if lower.contains("amzn") { return true }
        if lower.contains("prime video") { return true }
        if lower.contains("audible") && lower.contains("amzn") { return true }
        return false
    }

    /// Strips repeated leading bank / ACH / card boilerplate so merchant tokens surface.
    private static func stripLeadingBankNoise(_ s: String) -> String {
        var out = s
        let maxPasses = 8
        for _ in 0..<maxPasses {
            let before = out
            for pattern in leadingBankNoisePatterns {
                out = out.replacingOccurrences(
                    of: pattern,
                    with: "",
                    options: [.regularExpression, .caseInsensitive]
                )
            }
            out = out.trimmingCharacters(in: .whitespacesAndNewlines)
            if out == before { break }
        }
        return out
    }

    /// Ordered patterns applied repeatedly (leading anchor).
    private static let leadingBankNoisePatterns: [String] = [
        // Withdrawal / ACH / transfer verbs
        #"^(withdrawal|wd|ach|eft|transfer|xfer)\s+"#,
        #"^(online|web)\s+(payment|transfer|bill\s*pay|bill\s*payment)\s+"#,
        #"^(bill\s*pay(?:ment)?|recurring\s+ach|direct\s+debit|auto\s*pay|autopay)\s+"#,
        #"^(debit|credit)\s+(card\s+)?(purchase|payment|pmt|txn)?\s*"#,
        #"^(pos|point\s+of\s+sale|purchase|purch)\s+"#,
        #"^(electronic|digital)\s+(payment|funds\s+transfer|transfer)\s+"#,
        // ACH subtypes often prefix the merchant
        #"^ach\s*[-–]\s*\w+\s+"#,
        #"^ach\s+(credit|debit|payment|withdrawal)\s+"#,
        #"^(ppd|ccd|web|tel)\s+(ach\s+)?"#,
        #"^(checking|savings|chk|sv)\s+"#,
    ]

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
