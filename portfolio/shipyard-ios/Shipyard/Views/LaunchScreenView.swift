import SwiftUI

struct LaunchScreenView: View {
    var body: some View {
        ZStack {
            Palette.bg.ignoresSafeArea()

            VStack(spacing: 20) {
                HelmMark()
                    .frame(width: 140, height: 140)

                Text("SHIPYARD")
                    .font(.shipyardDisplay(52))
                    .foregroundStyle(Palette.white)
                    .tracking(2)

                Rectangle()
                    .fill(Palette.gold)
                    .frame(width: 64, height: 2)

                Text("FLEET COMMAND")
                    .font(.shipyardMono(14))
                    .foregroundStyle(Palette.dim)
                    .tracking(4)
            }
        }
    }
}

#Preview {
    LaunchScreenView()
}
