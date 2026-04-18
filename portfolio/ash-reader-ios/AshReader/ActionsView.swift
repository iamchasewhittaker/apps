import SwiftUI
import UIKit

private let ACCENT = Color(hex: "#f5e300")
private let ACCENT_INK = Color(hex: "#0f0f0f")

struct ActionItem: Identifiable {
    let id: String
    let themeId: String
    let themeTitle: String
    let themeIndex: Int
    let index: Int
    let text: String
}

private enum ActionFilter: String, CaseIterable {
    case all = "All"
    case incomplete = "Incomplete"
    case done = "Done"
}

struct ActionsView: View {
    @State private var sections: [ThemeSection] = []
    @State private var loaded = false
    @State private var filter: ActionFilter = .all
    @State private var doneStates: [String: Bool] = [:]

    private var allActions: [ActionItem] {
        var items: [ActionItem] = []
        for (themeIdx, section) in sections.enumerated() {
            for (idx, text) in section.actions.enumerated() {
                items.append(ActionItem(
                    id: "\(section.id)_\(idx)",
                    themeId: section.id,
                    themeTitle: section.title,
                    themeIndex: themeIdx,
                    index: idx,
                    text: text
                ))
            }
        }
        return items
    }

    private var filteredActions: [ActionItem] {
        switch filter {
        case .all: return allActions
        case .incomplete: return allActions.filter { !(doneStates[$0.id] ?? false) }
        case .done: return allActions.filter { doneStates[$0.id] ?? false }
        }
    }

    private var doneCount: Int {
        allActions.filter { doneStates[$0.id] ?? false }.count
    }

    private var groupedActions: [(theme: String, items: [ActionItem])] {
        let filtered = filteredActions
        let grouped = Dictionary(grouping: filtered, by: { $0.themeIndex })
        return grouped
            .sorted { $0.key < $1.key }
            .compactMap { entry in
                guard let first = entry.value.first else { return nil }
                return (theme: first.themeTitle, items: entry.value)
            }
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                headerBar

                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 18) {
                        if filteredActions.isEmpty {
                            Text(loaded ? "Nothing here." : "Loading…")
                                .foregroundStyle(.secondary)
                                .padding(.top, 40)
                                .frame(maxWidth: .infinity)
                        }
                        ForEach(groupedActions, id: \.theme) { group in
                            VStack(alignment: .leading, spacing: 6) {
                                Text(group.theme)
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundStyle(Color(hex: "#888888"))
                                    .textCase(.uppercase)
                                    .tracking(0.7)
                                    .padding(.horizontal, 16)

                                VStack(spacing: 0) {
                                    ForEach(group.items.indices, id: \.self) { i in
                                        let item = group.items[i]
                                        ActionRow(
                                            item: item,
                                            done: doneStates[item.id] ?? false,
                                            onToggle: { toggle(item) }
                                        )
                                        if i < group.items.count - 1 {
                                            Divider().overlay(Color(hex: "#2a2a2a")).padding(.leading, 52)
                                        }
                                    }
                                }
                                .background(Color(hex: "#151515"))
                                .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "#2a2a2a"), lineWidth: 1))
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                                .padding(.horizontal, 16)
                            }
                        }
                    }
                    .padding(.vertical, 16)
                }
            }
            .background(Color(hex: "#0f0f0f"))
            .navigationTitle("Actions")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(Color(hex: "#0f0f0f"), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
        }
        .onAppear(perform: loadActions)
    }

    private var headerBar: some View {
        VStack(spacing: 12) {
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text("\(doneCount) of \(allActions.count) complete")
                        .font(.system(size: 13))
                        .foregroundStyle(Color(hex: "#b0b0b0"))
                    Spacer()
                    if allActions.count > 0 {
                        Text("\(Int((Double(doneCount) / Double(allActions.count)) * 100))%")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundStyle(ACCENT)
                    }
                }
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 2)
                            .fill(Color(hex: "#2e2e2e"))
                        RoundedRectangle(cornerRadius: 2)
                            .fill(ACCENT)
                            .frame(width: allActions.isEmpty ? 0 : geo.size.width * CGFloat(doneCount) / CGFloat(allActions.count))
                            .animation(.easeOut(duration: 0.3), value: doneCount)
                    }
                }
                .frame(height: 4)
            }
            .padding(.horizontal, 16)

            HStack(spacing: 8) {
                ForEach(ActionFilter.allCases, id: \.self) { f in
                    Button {
                        filter = f
                    } label: {
                        Text(f.rawValue)
                            .font(.system(size: 13, weight: filter == f ? .semibold : .regular))
                            .padding(.horizontal, 14)
                            .padding(.vertical, 7)
                            .background(filter == f ? ACCENT : Color(hex: "#1e1e1e"))
                            .foregroundStyle(filter == f ? ACCENT_INK : Color(hex: "#b0b0b0"))
                            .clipShape(Capsule())
                            .overlay(Capsule().stroke(filter == f ? ACCENT : Color(hex: "#2e2e2e"), lineWidth: 1))
                    }
                    .buttonStyle(.plain)
                }
                Spacer()
            }
            .padding(.horizontal, 16)
        }
        .padding(.top, 12)
        .padding(.bottom, 10)
        .background(Color(hex: "#0f0f0f"))
        .overlay(alignment: .bottom) {
            Divider().overlay(Color(hex: "#2a2a2a"))
        }
    }

    private func loadActions() {
        guard !loaded else { return }
        loaded = true
        guard let url = Bundle.main.url(forResource: "themes", withExtension: "md"),
              let md = try? String(contentsOf: url, encoding: .utf8) else {
            return
        }
        sections = parseThemes(md)

        var initial: [String: Bool] = [:]
        for section in sections {
            for (idx, _) in section.actions.enumerated() {
                let key = userDefaultsKey(themeId: section.id, index: idx)
                if UserDefaults.standard.string(forKey: key) == "1" {
                    initial["\(section.id)_\(idx)"] = true
                }
            }
        }
        doneStates = initial
    }

    private func toggle(_ item: ActionItem) {
        let next = !(doneStates[item.id] ?? false)
        doneStates[item.id] = next
        let key = userDefaultsKey(themeId: item.themeId, index: item.index)
        if next {
            UserDefaults.standard.set("1", forKey: key)
        } else {
            UserDefaults.standard.removeObject(forKey: key)
        }
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
    }

    private func userDefaultsKey(themeId: String, index: Int) -> String {
        "ash_reader_ios_action_\(themeId)_\(index)"
    }
}

private struct ActionRow: View {
    let item: ActionItem
    let done: Bool
    let onToggle: () -> Void

    var body: some View {
        Button(action: onToggle) {
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: done ? "checkmark.circle.fill" : "circle")
                    .font(.system(size: 20))
                    .foregroundStyle(done ? Color(hex: "#6dbf6d") : Color(hex: "#555555"))
                    .padding(.top, 1)

                Text(item.text)
                    .font(.system(size: 15))
                    .foregroundStyle(done ? Color(hex: "#777777") : Color(hex: "#e8e8e8"))
                    .strikethrough(done, color: Color(hex: "#555555"))
                    .multilineTextAlignment(.leading)
                    .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding(.vertical, 12)
            .padding(.horizontal, 16)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}
