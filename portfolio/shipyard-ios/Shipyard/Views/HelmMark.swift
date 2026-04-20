import SwiftUI

/// Ship's helm — the Shipyard brand mark.
/// 8 spokes, 4 cardinal steel dots, 4 cream handles protruding from the rim.
struct HelmMark: View {
    var strokeScale: CGFloat = 1.0

    var body: some View {
        GeometryReader { geo in
            let size = min(geo.size.width, geo.size.height)
            let center = CGPoint(x: geo.size.width / 2, y: geo.size.height / 2)
            let rimRadius = size * 0.45
            let hubRadius = size * 0.09
            let stroke = size * 0.033 * strokeScale

            ZStack {
                // Rim
                Circle()
                    .stroke(Palette.white, lineWidth: stroke)
                    .frame(width: rimRadius * 2, height: rimRadius * 2)
                    .position(center)

                // 8 spokes
                ForEach(0..<8, id: \.self) { i in
                    Rectangle()
                        .fill(Palette.white)
                        .frame(width: stroke * 0.8, height: rimRadius * 2)
                        .rotationEffect(.degrees(Double(i) * 22.5))
                        .position(center)
                }

                // Hub cover
                Circle()
                    .fill(Palette.bg)
                    .frame(width: hubRadius * 2.6, height: hubRadius * 2.6)
                    .position(center)

                // Hub ring
                Circle()
                    .stroke(Palette.white, lineWidth: stroke * 0.65)
                    .frame(width: hubRadius * 2, height: hubRadius * 2)
                    .position(center)

                // 4 cardinal handles (N/E/S/W) protruding from rim
                ForEach(0..<4, id: \.self) { i in
                    Capsule()
                        .fill(Palette.white)
                        .frame(width: stroke * 1.2, height: size * 0.13)
                        .offset(y: -(rimRadius + size * 0.055))
                        .rotationEffect(.degrees(Double(i) * 90))
                        .position(center)
                }

                // 4 cardinal steel dots on rim
                ForEach(0..<4, id: \.self) { i in
                    Circle()
                        .fill(Palette.steel)
                        .frame(width: size * 0.044, height: size * 0.044)
                        .offset(y: -rimRadius)
                        .rotationEffect(.degrees(Double(i) * 90 + 45))
                        .position(center)
                }
            }
        }
        .aspectRatio(1, contentMode: .fit)
    }
}

#Preview {
    ZStack {
        Palette.bg.ignoresSafeArea()
        HelmMark().frame(width: 200, height: 200)
    }
}
