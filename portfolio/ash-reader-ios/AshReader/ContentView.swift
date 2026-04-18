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
    var body: some View {
        TabView {
            ReaderTab()
                .tabItem { Label("Reader", systemImage: "book") }

            ThemesView()
                .tabItem { Label("Themes", systemImage: "square.stack") }

            ActionsView()
                .tabItem { Label("Actions", systemImage: "checkmark.circle") }

            SettingsView()
                .tabItem { Label("Settings", systemImage: "gearshape") }
        }
        .tint(Color(hex: "#f5e300"))
        .preferredColorScheme(.dark)
    }
}

private struct ReaderTab: View {
    @State private var chunks: [Chunk] = []
    @State private var targetSize: Int = 2000
    @State private var isLoading = true
    @AppStorage("ash_reader_ios_prompt_prefix") private var storedPrefix: String = ""
    @AppStorage("ash_reader_ios_prompt_prefix_on") private var storedPrefixOn: String = ""

    private var activePrefix: String? {
        guard storedPrefixOn == "1" else { return nil }
        return storedPrefix.isEmpty ? defaultPromptPrefix : storedPrefix
    }

    var body: some View {
        ZStack {
            Color(hex: "#0f0f0f").ignoresSafeArea()

            if isLoading {
                ProgressView()
                    .tint(Color(hex: "#f5e300"))
            } else {
                ChunkReaderView(
                    chunks: chunks,
                    targetSize: $targetSize,
                    onRechunk: rechunk,
                    storageKey: "ash_reader_ios_sent",
                    promptPrefix: activePrefix
                )
                .transition(.opacity)
            }
        }
        .animation(.easeInOut(duration: 0.2), value: isLoading)
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
