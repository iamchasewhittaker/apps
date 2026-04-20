import SwiftUI

struct LogoView: View {
    var size: CGFloat = 160
    var showWordmark: Bool = true

    private var scale: CGFloat { size / 280 }
    private func s(_ v: CGFloat) -> CGFloat { v * scale }

    var body: some View {
        ZStack {
            Circle()
                .stroke(FairwayTheme.accentGold.opacity(0.6), lineWidth: s(1.2))
                .frame(width: s(256), height: s(256))

            badgeContents
                .frame(width: s(280), height: s(280))
                .mask(Circle().frame(width: s(236), height: s(236)))

            if showWordmark {
                Text("Fairway")
                    .font(FairwayFont.wordmark(size: s(28)))
                    .kerning(s(3))
                    .foregroundStyle(FairwayTheme.accentGold)
                    .offset(y: s(94))
            }
        }
        .frame(width: size, height: size)
    }

    private var badgeContents: some View {
        ZStack {
            Rectangle().fill(FairwayTheme.backgroundPrimary)

            // Sun glow — centered at (140, 148) in 280 coords, i.e. +8 from center
            Circle()
                .fill(Color(hex: "#d4872a").opacity(0.35))
                .frame(width: s(72), height: s(72))
                .offset(y: s(8))
            Circle()
                .fill(FairwayTheme.sunAmber.opacity(0.45))
                .frame(width: s(44), height: s(44))
                .offset(y: s(8))
            Circle()
                .fill(Color(hex: "#f0c050").opacity(0.55))
                .frame(width: s(24), height: s(24))
                .offset(y: s(8))

            // Horizon glow
            Ellipse()
                .fill(FairwayTheme.accentGold.opacity(0.08))
                .frame(width: s(180), height: s(12))
                .offset(y: s(12))

            // Three fairway bands, back to front
            FairwayBandShape(startY: 158, midY: 152, endY: 144)
                .fill(FairwayTheme.accentGreen)
            FairwayBandShape(startY: 172, midY: 166, endY: 158)
                .fill(FairwayTheme.fairwayMid)
            FairwayBandShape(startY: 188, midY: 182, endY: 174)
                .fill(FairwayTheme.fairwayDeep)

            // Band separator strokes
            BandSeparatorShape(startY: 172, midY: 166, endY: 158)
                .stroke(FairwayTheme.accentGreen.opacity(0.6), lineWidth: s(1.5))
            BandSeparatorShape(startY: 188, midY: 182, endY: 174)
                .stroke(FairwayTheme.accentGreen.opacity(0.5), lineWidth: s(1.5))

            // Flag pole: vertical line from (140,118) to (140,154)
            Path { p in
                p.move(to: CGPoint(x: s(140), y: s(118)))
                p.addLine(to: CGPoint(x: s(140), y: s(154)))
            }
            .stroke(FairwayTheme.accentGold.opacity(0.9), lineWidth: s(1.5))

            // Flag triangle: polygon 140,118 → 156,125 → 140,132
            Path { p in
                p.move(to: CGPoint(x: s(140), y: s(118)))
                p.addLine(to: CGPoint(x: s(156), y: s(125)))
                p.addLine(to: CGPoint(x: s(140), y: s(132)))
                p.closeSubpath()
            }
            .fill(FairwayTheme.accentGold.opacity(0.85))
        }
    }
}

private struct FairwayBandShape: Shape {
    let startY: CGFloat
    let midY: CGFloat
    let endY: CGFloat

    func path(in rect: CGRect) -> Path {
        let u = rect.width / 280
        var p = Path()
        p.move(to: CGPoint(x: 22 * u, y: startY * u))
        p.addQuadCurve(
            to: CGPoint(x: 140 * u, y: midY * u),
            control: CGPoint(x: 80 * u, y: (startY - 14) * u)
        )
        p.addQuadCurve(
            to: CGPoint(x: 258 * u, y: endY * u),
            control: CGPoint(x: 200 * u, y: (midY + 8) * u)
        )
        p.addLine(to: CGPoint(x: 258 * u, y: 258 * u))
        p.addLine(to: CGPoint(x: 22 * u, y: 258 * u))
        p.closeSubpath()
        return p
    }
}

private struct BandSeparatorShape: Shape {
    let startY: CGFloat
    let midY: CGFloat
    let endY: CGFloat

    func path(in rect: CGRect) -> Path {
        let u = rect.width / 280
        var p = Path()
        p.move(to: CGPoint(x: 24 * u, y: startY * u))
        p.addQuadCurve(
            to: CGPoint(x: 140 * u, y: midY * u),
            control: CGPoint(x: 80 * u, y: (startY - 14) * u)
        )
        p.addQuadCurve(
            to: CGPoint(x: 256 * u, y: endY * u),
            control: CGPoint(x: 200 * u, y: (midY + 8) * u)
        )
        return p
    }
}

#Preview {
    ZStack {
        FairwayTheme.backgroundPrimary.ignoresSafeArea()
        VStack(spacing: 40) {
            LogoView(size: 280)
            LogoView(size: 160)
            LogoView(size: 80, showWordmark: false)
        }
    }
}
