import SwiftUI

private enum QuickLogAction: CaseIterable, Identifiable {
    case observation, waterRun, fertApp, mow

    var id: Self { self }

    var label: String {
        switch self {
        case .observation: return "Log Observation"
        case .waterRun:    return "Log Water Run"
        case .fertApp:     return "Log Fertilizer App"
        case .mow:         return "Log Mow"
        }
    }

    var icon: String {
        switch self {
        case .observation: return "eye.fill"
        case .waterRun:    return "drop.fill"
        case .fertApp:     return "leaf.fill"
        case .mow:         return "scissors"
        }
    }
}

struct QuickLogSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var activeAction: QuickLogAction? = nil

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 12) {
                    ForEach(QuickLogAction.allCases) { action in
                        Button {
                            activeAction = action
                        } label: {
                            Label(action.label, systemImage: action.icon)
                                .font(.body.weight(.medium))
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .padding()
                                .background(FairwayTheme.backgroundSurface)
                                .foregroundStyle(FairwayTheme.textPrimary)
                                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                                        .stroke(FairwayTheme.backgroundElevated, lineWidth: 1)
                                )
                        }
                    }
                }
                .padding()
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Quick Log")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                        .foregroundStyle(FairwayTheme.accentGold)
                }
            }
        }
        .sheet(item: $activeAction) { action in
            switch action {
            case .observation:
                AddObservationSheet()
            case .waterRun:
                AddWaterRunSheet()
            case .fertApp:
                AddFertAppSheet()
            case .mow:
                QuickLogStubSheet(actionLabel: action.label)
            }
        }
    }
}

private struct QuickLogStubSheet: View {
    let actionLabel: String
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 12) {
                Image(systemName: "hammer.fill")
                    .font(.largeTitle)
                    .foregroundStyle(FairwayTheme.accentGold)
                Text("Coming in the next build")
                    .foregroundStyle(FairwayTheme.textSecondary)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle(actionLabel)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                        .foregroundStyle(FairwayTheme.accentGold)
                }
            }
        }
        .presentationDetents([.medium])
    }
}
