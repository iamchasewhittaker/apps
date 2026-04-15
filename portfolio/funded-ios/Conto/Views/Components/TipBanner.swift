import SwiftUI

struct TipBanner: View {
    let message: String

    @AppStorage private var dismissed: Bool

    init(message: String, storageKey: String) {
        self.message = message
        self._dismissed = AppStorage(wrappedValue: false, storageKey)
    }

    var body: some View {
        if !dismissed {
            HStack(alignment: .top, spacing: 10) {
                Image(systemName: "lightbulb.fill")
                    .foregroundStyle(ClarityTheme.accent)
                    .font(.subheadline)
                Text(message)
                    .font(ClarityTheme.supportingFont)
                    .foregroundStyle(ClarityTheme.text)
                Spacer()
                Button {
                    withAnimation { dismissed = true }
                } label: {
                    Image(systemName: "xmark")
                        .font(.caption2)
                        .foregroundStyle(ClarityTheme.muted)
                }
            }
            .padding(12)
            .background(ClarityTheme.accent.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: 10))
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(ClarityTheme.accent.opacity(0.25), lineWidth: 1)
            )
        }
    }
}
