import SwiftUI

private let SIZES = [1000, 1500, 2000]

struct ChunkReaderView: View {
    let chunks: [Chunk]
    @Binding var targetSize: Int
    let onRechunk: (Int) -> Void

    @StateObject private var store = ProgressStore()
    @State private var currentIndex: Int = 0
    @State private var copied = false
    @State private var showSettings = false
    @State private var selectedSize: Int = 2000

    var sentCount: Int { store.sent.count }

    var body: some View {
        VStack(spacing: 0) {
            // Top bar
            HStack {
                Button {
                    selectedSize = targetSize
                    showSettings = true
                } label: {
                    Image(systemName: "gearshape")
                        .font(.system(size: 16))
                        .foregroundStyle(Color(hex: "#7c9cff"))
                }
                .buttonStyle(.plain)

                Spacer()

                Text("Chunk \(currentIndex + 1) of \(chunks.count)")
                    .font(.system(size: 14, weight: .semibold))

                Spacer()

                Button("Reset") {
                    store.reset()
                }
                .font(.system(size: 13))
                .foregroundStyle(Color(hex: "#555555"))
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 14)

            // Progress bar
            VStack(spacing: 6) {
                HStack {
                    Text("\(sentCount) / \(chunks.count) sent")
                        .font(.system(size: 12))
                        .foregroundStyle(Color(hex: "#777777"))
                    Spacer()
                }
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 2)
                            .fill(Color(hex: "#2e2e2e"))
                        RoundedRectangle(cornerRadius: 2)
                            .fill(Color(hex: "#7c9cff"))
                            .frame(width: chunks.isEmpty ? 0 : geo.size.width * CGFloat(sentCount) / CGFloat(chunks.count))
                            .animation(.easeOut(duration: 0.3), value: sentCount)
                    }
                }
                .frame(height: 4)
            }
            .padding(.horizontal, 20)
            .padding(.bottom, 16)

            Divider().overlay(Color(hex: "#2e2e2e"))

            if chunks.isEmpty {
                Spacer()
                Text("No chunks")
                    .foregroundStyle(.secondary)
                Spacer()
            } else {
                let chunk = chunks[currentIndex]
                let isSent = store.sent.contains(currentIndex)

                ScrollView {
                    VStack(alignment: .leading, spacing: 12) {
                        // Chunk meta + action buttons
                        HStack(alignment: .top) {
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Chunk \(currentIndex + 1)")
                                    .font(.system(size: 15, weight: .semibold))
                                Text("\(chunk.wordCount.formatted()) words")
                                    .font(.system(size: 12))
                                    .foregroundStyle(Color(hex: "#777777"))
                            }
                            Spacer()
                            HStack(spacing: 8) {
                                Button(copied ? "Copied ✓" : "Copy") {
                                    UIPasteboard.general.string = chunk.text
                                    copied = true
                                    DispatchQueue.main.asyncAfter(deadline: .now() + 2) { copied = false }
                                }
                                .font(.system(size: 14, weight: .semibold))
                                .padding(.horizontal, 16)
                                .padding(.vertical, 7)
                                .background(copied ? Color(hex: "#2a3a2a") : Color(hex: "#3d4f80"))
                                .foregroundStyle(copied ? Color(hex: "#6dbf6d") : .white)
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                                .buttonStyle(.plain)

                                Button(isSent ? "Sent ✓" : "Mark sent") {
                                    store.toggle(currentIndex)
                                }
                                .font(.system(size: 14))
                                .padding(.horizontal, 14)
                                .padding(.vertical, 7)
                                .background(isSent ? Color(hex: "#1a2e1a") : Color.clear)
                                .foregroundStyle(isSent ? Color(hex: "#6dbf6d") : Color(hex: "#777777"))
                                .clipShape(RoundedRectangle(cornerRadius: 8))
                                .overlay(RoundedRectangle(cornerRadius: 8).stroke(isSent ? Color(hex: "#6dbf6d") : Color(hex: "#2e2e2e"), lineWidth: 1))
                                .buttonStyle(.plain)
                            }
                        }

                        // Chunk text card
                        Text(chunk.text)
                            .font(.system(size: 16))
                            .lineSpacing(6)
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding(20)
                            .background(isSent ? Color(hex: "#141f14") : Color(hex: "#1a1a1a"))
                            .overlay(RoundedRectangle(cornerRadius: 12).stroke(isSent ? Color(hex: "#2a3a2a") : Color(hex: "#2e2e2e"), lineWidth: 1))
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                            .opacity(isSent ? 0.6 : 1.0)
                    }
                    .padding(20)
                }

                // Navigation
                HStack(spacing: 12) {
                    Button("← Prev") {
                        if currentIndex > 0 { currentIndex -= 1 }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .foregroundStyle(currentIndex == 0 ? Color(hex: "#444444") : Color(hex: "#e8e8e8"))
                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "#2e2e2e"), lineWidth: 1))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .disabled(currentIndex == 0)
                    .buttonStyle(.plain)

                    Button("Next →") {
                        if currentIndex < chunks.count - 1 { currentIndex += 1 }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(currentIndex == chunks.count - 1 ? Color(hex: "#252525") : Color(hex: "#3d4f80"))
                    .foregroundStyle(currentIndex == chunks.count - 1 ? Color(hex: "#444444") : .white)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .disabled(currentIndex == chunks.count - 1)
                    .buttonStyle(.plain)
                }
                .font(.system(size: 17, weight: .semibold))
                .padding(.horizontal, 20)
                .padding(.vertical, 16)
            }
        }
        .background(Color(hex: "#0f0f0f"))
        .onAppear {
            selectedSize = targetSize
            if let first = (0..<chunks.count).first(where: { !store.sent.contains($0) }) {
                currentIndex = first
            }
        }
        .sheet(isPresented: $showSettings) {
            SettingsSheet(selectedSize: $selectedSize) { size in
                showSettings = false
                store.reset()
                currentIndex = 0
                onRechunk(size)
            }
        }
    }
}

private func sizeLabel(_ size: Int) -> String {
    let k = Double(size) / 1000
    let trimmed = k.truncatingRemainder(dividingBy: 1) == 0
        ? String(Int(k))
        : String(format: "%.1f", k)
    return "\(trimmed)k words"
}

private struct SettingsSheet: View {
    @Binding var selectedSize: Int
    let onApply: (Int) -> Void

    var body: some View {
        VStack(spacing: 24) {
            Text("Chunk Size")
                .font(.system(size: 18, weight: .semibold))
                .padding(.top, 28)

            HStack(spacing: 12) {
                ForEach(SIZES, id: \.self) { size in
                    Button {
                        selectedSize = size
                    } label: {
                        Text(sizeLabel(size))
                            .font(.system(size: 15, weight: selectedSize == size ? .semibold : .regular))
                            .padding(.horizontal, 18)
                            .padding(.vertical, 10)
                            .background(selectedSize == size ? Color(hex: "#3d4f80") : Color(hex: "#1e1e1e"))
                            .foregroundStyle(selectedSize == size ? .white : Color(hex: "#777777"))
                            .clipShape(Capsule())
                            .overlay(Capsule().stroke(selectedSize == size ? Color(hex: "#7c9cff") : Color(hex: "#2e2e2e"), lineWidth: 1))
                    }
                    .buttonStyle(.plain)
                }
            }

            Text("Changing size resets all progress.")
                .font(.system(size: 13))
                .foregroundStyle(Color(hex: "#555555"))

            Button("Rechunk →") {
                onApply(selectedSize)
            }
            .font(.system(size: 16, weight: .semibold))
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(Color(hex: "#3d4f80"))
            .foregroundStyle(.white)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .padding(.horizontal, 20)
            .buttonStyle(.plain)

            Spacer()
        }
        .presentationDetents([.height(260)])
        .presentationDragIndicator(.visible)
        .preferredColorScheme(.dark)
        .background(Color(hex: "#0f0f0f"))
    }
}
