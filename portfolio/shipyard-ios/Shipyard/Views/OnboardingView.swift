import SwiftUI

struct OnboardingView: View {
    @AppStorage("hasOnboarded") private var hasOnboarded = false
    @State private var page = 0

    private let images = ["Onboarding1", "Onboarding2", "Onboarding3"]

    var body: some View {
        ZStack {
            Palette.bg.ignoresSafeArea()

            TabView(selection: $page) {
                ForEach(0..<images.count, id: \.self) { i in
                    Image(images[i])
                        .resizable()
                        .scaledToFill()
                        .ignoresSafeArea()
                        .tag(i)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
            .onTapGesture {
                if page < images.count - 1 {
                    withAnimation { page += 1 }
                } else {
                    hasOnboarded = true
                }
            }

            VStack {
                Spacer()
                HStack(spacing: 8) {
                    ForEach(0..<images.count, id: \.self) { i in
                        Circle()
                            .fill(i == page ? Palette.steel : Palette.dim.opacity(0.4))
                            .frame(width: 8, height: 8)
                    }
                }
                .padding(.bottom, 40)
            }
        }
    }
}

#Preview {
    OnboardingView()
}
