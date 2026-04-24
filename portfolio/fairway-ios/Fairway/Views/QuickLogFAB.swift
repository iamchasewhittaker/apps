import SwiftUI

struct QuickLogFAB: View {
    @Binding var isShowing: Bool

    var body: some View {
        Button {
            isShowing = true
        } label: {
            Image(systemName: "plus")
                .font(.system(size: 22, weight: .semibold))
                .foregroundStyle(.white)
                .frame(width: 56, height: 56)
                .background(FairwayTheme.accentGold)
                .clipShape(Circle())
                .shadow(color: .black.opacity(0.35), radius: 8, x: 0, y: 4)
        }
        .accessibilityLabel("Quick Log — add observation, water run, fertilizer, or mow")
    }
}
