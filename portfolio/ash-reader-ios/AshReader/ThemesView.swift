import SwiftUI

private let ACCENT = Color(hex: "#f5e300")

struct ThemesView: View {
    @State private var sections: [ThemeSection] = []
    @State private var loaded = false
    @AppStorage("ash_reader_ios_prompt_prefix") private var storedPrefix: String = ""
    @AppStorage("ash_reader_ios_prompt_prefix_on") private var storedPrefixOn: String = ""

    private var activePrefix: String? {
        guard storedPrefixOn == "1" else { return nil }
        return storedPrefix.isEmpty ? defaultPromptPrefix : storedPrefix
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 14) {
                    SummaryView(promptPrefix: activePrefix)

                    if sections.isEmpty && loaded {
                        Text("No themes found in themes.md")
                            .foregroundStyle(.secondary)
                            .padding()
                    }

                    ForEach(Array(sections.enumerated()), id: \.element.id) { index, section in
                        ThemeAccordion(
                            section: section,
                            index: index,
                            promptPrefix: activePrefix
                        )
                    }
                }
                .padding(16)
            }
            .background(Color(hex: "#0f0f0f"))
            .navigationTitle("Themes")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(Color(hex: "#0f0f0f"), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
        .onAppear(perform: loadThemes)
    }

    private func loadThemes() {
        guard !loaded else { return }
        loaded = true
        guard let url = Bundle.main.url(forResource: "themes", withExtension: "md"),
              let md = try? String(contentsOf: url, encoding: .utf8) else {
            return
        }
        sections = parseThemes(md)
    }
}

private struct ThemeAccordion: View {
    let section: ThemeSection
    let index: Int
    let promptPrefix: String?

    @State private var expanded = false
    @State private var themeChunks: [Chunk] = []
    @State private var chunkSize: Int = 4000
    @State private var syncRevision = 0

    private var storageKey: String {
        "ash_reader_ios_theme_\(section.id)_sent"
    }

    private var sentCount: Int {
        let _ = syncRevision
        return SyncedStore.shared.intArray(forKey: storageKey).count
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Button(action: toggle) {
                HStack(alignment: .top, spacing: 12) {
                    Text("\(index + 1)")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(ACCENT)
                        .frame(width: 22, alignment: .leading)
                    VStack(alignment: .leading, spacing: 4) {
                        Text(section.title)
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundStyle(Color(hex: "#e8e8e8"))
                            .multilineTextAlignment(.leading)
                        if !themeChunks.isEmpty {
                            Text("\(sentCount) / \(themeChunks.count) sent · \(section.actions.count) actions")
                                .font(.system(size: 11))
                                .foregroundStyle(Color(hex: "#777777"))
                        } else if !section.actions.isEmpty {
                            Text("\(section.actions.count) actions")
                                .font(.system(size: 11))
                                .foregroundStyle(Color(hex: "#777777"))
                        }
                    }
                    Spacer()
                    Image(systemName: expanded ? "chevron.up" : "chevron.down")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundStyle(Color(hex: "#777777"))
                }
                .padding(16)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(expanded ? Color(hex: "#1e1e22") : Color(hex: "#1a1a1a"))
            }
            .buttonStyle(.plain)

            if expanded {
                Divider().overlay(Color(hex: "#2e2e2e"))
                ChunkReaderView(
                    chunks: themeChunks,
                    targetSize: $chunkSize,
                    onRechunk: nil,
                    storageKey: storageKey,
                    promptPrefix: promptPrefix,
                    showSizeControl: false
                )
                .frame(minHeight: 520)
            }
        }
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "#2e2e2e"), lineWidth: 1))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .onReceive(NotificationCenter.default.publisher(for: .iCloudSyncDidChange)) { _ in
            syncRevision += 1
        }
    }

    private func toggle() {
        if !expanded && themeChunks.isEmpty {
            themeChunks = chunkByChars(section.content, maxChars: chunkSize)
        }
        withAnimation(.easeInOut(duration: 0.18)) {
            expanded.toggle()
        }
    }
}
