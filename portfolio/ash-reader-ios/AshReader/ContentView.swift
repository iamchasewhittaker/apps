import SwiftUI

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r = Double((int >> 16) & 0xFF) / 255
        let g = Double((int >> 8) & 0xFF) / 255
        let b = Double(int & 0xFF) / 255
        self.init(red: r, green: g, blue: b)
    }
}

struct ContentView: View {
    @State private var chunks: [Chunk] = []
    @State private var targetSize: Int = 2000
    @State private var isLoading = true

    var body: some View {
        ZStack {
            Color(hex: "#0f0f0f").ignoresSafeArea()

            if isLoading {
                ProgressView()
                    .tint(Color(hex: "#7c9cff"))
            } else {
                ChunkReaderView(
                    chunks: chunks,
                    targetSize: $targetSize,
                    onRechunk: rechunk
                )
                .transition(.opacity)
            }
        }
        .animation(.easeInOut(duration: 0.2), value: isLoading)
        .preferredColorScheme(.dark)
        .onAppear { loadDocument() }
    }

    private func loadDocument() {
        guard let url = Bundle.main.url(forResource: "doc", withExtension: "txt"),
              let text = try? String(contentsOf: url, encoding: .utf8) else {
            isLoading = false
            return
        }
        chunks = chunkSmart(text, targetWords: targetSize)
        isLoading = false
    }

    private func rechunk(size: Int) {
        targetSize = size
        guard let url = Bundle.main.url(forResource: "doc", withExtension: "txt"),
              let text = try? String(contentsOf: url, encoding: .utf8) else { return }
        chunks = chunkSmart(text, targetWords: size)
    }
}
