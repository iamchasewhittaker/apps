import SwiftUI
import UIKit

private let ACCENT = Color(hex: "#f5e300")
private let ACCENT_INK = Color(hex: "#0f0f0f")

struct SummaryView: View {
    let promptPrefix: String?

    @State private var summaries: [String: String] = [:]
    @State private var selectedSize: Int = 1500
    @State private var copied = false

    private let sizes = [1000, 1500, 2000]

    private var currentSummary: String {
        summaries[String(selectedSize)] ?? ""
    }

    private var wordCount: Int {
        currentSummary.split(whereSeparator: { $0.isWhitespace }).count
    }

    private var preview: String {
        let trimmed = currentSummary.trimmingCharacters(in: .whitespacesAndNewlines)
        if trimmed.count <= 180 { return trimmed }
        let idx = trimmed.index(trimmed.startIndex, offsetBy: 180)
        return String(trimmed[..<idx]) + "…"
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("AI summary")
                .font(.system(size: 13, weight: .semibold))
                .foregroundStyle(Color(hex: "#888888"))
                .textCase(.uppercase)
                .tracking(0.8)

            HStack(spacing: 10) {
                ForEach(sizes, id: \.self) { size in
                    Button {
                        selectedSize = size
                    } label: {
                        Text(sizeLabel(size))
                            .font(.system(size: 14, weight: selectedSize == size ? .semibold : .regular))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(selectedSize == size ? ACCENT : Color(hex: "#1e1e1e"))
                            .foregroundStyle(selectedSize == size ? ACCENT_INK : Color(hex: "#b0b0b0"))
                            .clipShape(Capsule())
                            .overlay(Capsule().stroke(selectedSize == size ? ACCENT : Color(hex: "#2e2e2e"), lineWidth: 1))
                    }
                    .buttonStyle(.plain)
                }
                Spacer()
                Text("\(wordCount) words")
                    .font(.system(size: 12))
                    .foregroundStyle(Color(hex: "#777777"))
            }

            Text(preview)
                .font(.system(size: 14))
                .foregroundStyle(Color(hex: "#cfcfcf"))
                .lineSpacing(4)
                .frame(maxWidth: .infinity, alignment: .leading)

            Button(copied ? "Copied ✓" : "Copy summary") {
                copy()
            }
            .font(.system(size: 14, weight: .semibold))
            .frame(maxWidth: .infinity)
            .padding(.vertical, 11)
            .background(copied ? Color(hex: "#2a3a2a") : ACCENT)
            .foregroundStyle(copied ? Color(hex: "#6dbf6d") : ACCENT_INK)
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .buttonStyle(.plain)
        }
        .padding(18)
        .background(Color(hex: "#151515"))
        .overlay(RoundedRectangle(cornerRadius: 14).stroke(Color(hex: "#2a2a2a"), lineWidth: 1))
        .clipShape(RoundedRectangle(cornerRadius: 14))
        .onAppear(perform: loadSummaries)
    }

    private func loadSummaries() {
        guard let url = Bundle.main.url(forResource: "summary", withExtension: "json"),
              let data = try? Data(contentsOf: url),
              let parsed = try? JSONSerialization.jsonObject(with: data) as? [String: String] else {
            return
        }
        summaries = parsed
    }

    private func copy() {
        let body = stripMarkdown(currentSummary)
        let text: String
        if let prefix = promptPrefix, !prefix.isEmpty {
            text = "\(prefix)\n\n\(body)"
        } else {
            text = body
        }
        UIPasteboard.general.string = text
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        copied = true
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) { copied = false }
    }

    private func sizeLabel(_ size: Int) -> String {
        let k = Double(size) / 1000
        let trimmed = k.truncatingRemainder(dividingBy: 1) == 0
            ? String(Int(k))
            : String(format: "%.1f", k)
        return "\(trimmed)k"
    }
}
