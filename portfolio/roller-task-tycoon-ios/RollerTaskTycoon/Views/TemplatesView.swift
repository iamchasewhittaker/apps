import SwiftData
import SwiftUI

struct TemplatesView: View {
    var readableFonts: Bool
    var onSelect: (ChecklistTaskItem) -> Void

    @Environment(\.dismiss) private var dismiss

    private let zones: [ParkZone] = ParkZone.allCases

    var body: some View {
        NavigationStack {
            List {
                ForEach(zones) { zone in
                    let templates = TemplateLibrary.all.filter { $0.zone == zone }
                    if !templates.isEmpty {
                        Section {
                            ForEach(templates) { template in
                                Button {
                                    onSelect(template.makeItem())
                                    dismiss()
                                } label: {
                                    templateRow(template)
                                }
                                .buttonStyle(.plain)
                            }
                        } header: {
                            Text("\(zone.emoji) \(zone.displayTitle)")
                                .font(ParkTheme.titleFont(readable: readableFonts))
                                .foregroundStyle(ParkTheme.wood)
                        }
                    }
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Templates")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(ParkTheme.woodLight.opacity(0.95), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.light, for: .navigationBar)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }

    private func templateRow(_ t: AttractionTemplate) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(t.text)
                    .font(ParkTheme.bodyFont(readable: readableFonts).weight(.semibold))
                    .foregroundStyle(ParkTheme.ink)
                Spacer()
                Text("$\(t.rewardDollars)")
                    .font(ParkTheme.captionFont(readable: readableFonts).weight(.bold))
                    .foregroundStyle(ParkTheme.gold)
            }
            HStack(spacing: 8) {
                Text(t.staffRole.emoji + " " + t.staffRole.displayTitle)
                Text("·")
                Text(t.priority.displayTitle)
            }
            .font(ParkTheme.captionFont(readable: readableFonts))
            .foregroundStyle(ParkTheme.ink.opacity(0.6))
        }
        .padding(.vertical, 2)
    }
}
