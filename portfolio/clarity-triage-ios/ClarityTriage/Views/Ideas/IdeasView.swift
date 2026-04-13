import SwiftUI
import ClarityUI

@MainActor
struct IdeasView: View {
    @Environment(TriageStore.self) private var store

    @State private var title: String = ""
    @State private var note: String = ""

    var body: some View {
        ScrollView {
            VStack(spacing: ClarityMetrics.cardSpacing) {
                addIdeaCard

                ForEach(Array(TriageConfig.stageLabels.enumerated()), id: \.offset) { stage in
                    stageCard(title: stage.element, stageIndex: stage.offset)
                }
            }
            .padding(ClarityMetrics.pagePadding)
        }
        .background(ClarityPalette.bg.ignoresSafeArea())
        .navigationTitle("Ideas")
    }

    private var addIdeaCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("Capture Idea")
                .font(ClarityTypography.title)
            TextField("Idea title", text: $title)
                .textFieldStyle(.roundedBorder)
            TextField("Optional note", text: $note, axis: .vertical)
                .textFieldStyle(.roundedBorder)
                .lineLimit(2...4)

            Button {
                store.addIdea(title: title, note: note)
                title = ""
                note = ""
            } label: {
                Label("Add Idea", systemImage: "plus.circle.fill")
                    .frame(maxWidth: .infinity)
                    .frame(minHeight: ClarityMetrics.minTapTarget)
            }
            .buttonStyle(.borderedProminent)
            .disabled(title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
        }
        .clarityCard()
    }

    private func stageCard(title: String, stageIndex: Int) -> some View {
        let ideas = store.ideasByStage[stageIndex]
        return VStack(alignment: .leading, spacing: 10) {
            Text(title)
                .font(ClarityTypography.headline)
                .foregroundStyle(ClarityPalette.text)

            if ideas.isEmpty {
                Text("No ideas in this stage.")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
            } else {
                ForEach(ideas) { idea in
                    HStack(alignment: .top, spacing: 10) {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(idea.title)
                                .font(ClarityTypography.body)
                                .foregroundStyle(ClarityPalette.text)
                            if !idea.note.isEmpty {
                                Text(idea.note)
                                    .font(ClarityTypography.caption)
                                    .foregroundStyle(ClarityPalette.muted)
                            }
                        }
                        Spacer()
                        Button {
                            store.advanceIdea(idea.id)
                        } label: {
                            Image(systemName: "arrow.right.circle")
                        }
                        .buttonStyle(.plain)
                        .disabled(idea.stage >= 2)
                        .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)

                        Button(role: .destructive) {
                            store.deleteIdea(idea.id)
                        } label: {
                            Image(systemName: "trash")
                        }
                        .buttonStyle(.plain)
                        .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                    }
                    .padding(.vertical, 4)
                }
            }
        }
        .clarityCard()
    }
}
