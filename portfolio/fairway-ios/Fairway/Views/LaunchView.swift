import SwiftUI

struct LaunchView: View {
    @State private var entered = false

    var body: some View {
        ZStack {
            FairwayTheme.backgroundPrimary.ignoresSafeArea()

            VStack(spacing: 20) {
                LogoView(size: 180, showWordmark: false)

                Text("Fairway")
                    .font(FairwayFont.wordmark(size: 44))
                    .kerning(4)
                    .foregroundStyle(FairwayTheme.accentGold)

                Text("Course-quality lawn care")
                    .font(.caption)
                    .tracking(2)
                    .textCase(.uppercase)
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
            .opacity(entered ? 1 : 0)
            .scaleEffect(entered ? 1 : 0.96)
        }
        .onAppear {
            withAnimation(.easeOut(duration: 0.9)) {
                entered = true
            }
        }
    }
}

#Preview {
    LaunchView()
}
