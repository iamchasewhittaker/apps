import SwiftData
import SwiftUI

struct ParkAttractionsView: View {
    var tasks: [ChecklistTaskItem]
    @Binding var parkCash: Int
    @Binding var statusFocus: AttractionStatus?
    @Binding var zoneFilter: ParkZone?
    var readableFonts: Bool
    var onToast: (String) -> Void

    @AppStorage("chase_roller_task_tycoon_ios_board") private var useBoard = true
    @Environment(\.modelContext) private var modelContext

    @State private var staffFilter: StaffRole?

    private var visible: [ChecklistTaskItem] {
        tasks.filter { item in
            if let z = zoneFilter, item.zone != z { return false }
            if let s = staffFilter, item.staffRole != s { return false }
            return true
        }
    }

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 6) {
                filterBar
                Picker("Layout", selection: $useBoard) {
                    Text("Board").tag(true)
                    Text("List").tag(false)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal, 4)

                if useBoard {
                    board
                } else {
                    listView
                }
            }
            .padding(.horizontal, 10)
            .padding(.top, 6)
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
            .background(ParkTheme.parkBackground.ignoresSafeArea())
            .navigationTitle("Attractions")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(ParkTheme.woodLight.opacity(0.95), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.light, for: .navigationBar)
            .navigationDestination(for: UUID.self) { id in
                if let t = tasks.first(where: { $0.id == id }) {
                    AttractionDetailView(task: t, parkCash: $parkCash, readableFonts: readableFonts, onToast: onToast)
                } else {
                    Text("Missing attraction").foregroundStyle(ParkTheme.ink)
                }
            }
        }
    }

    // MARK: - Filter bar

    private var filterBar: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 6) {
                if zoneFilter != nil || staffFilter != nil || statusFocus != nil {
                    filterChip("Clear all", isActive: true, color: ParkTheme.alertRed) {
                        zoneFilter = nil
                        staffFilter = nil
                        statusFocus = nil
                    }
                }

                ForEach(ParkZone.allCases) { zone in
                    let active = zoneFilter == zone
                    filterChip("\(zone.emoji) \(zone.displayTitle)", isActive: active, color: ParkTheme.wood) {
                        zoneFilter = active ? nil : zone
                    }
                }

                Divider().frame(height: 20)

                ForEach(StaffRole.allCases) { role in
                    let active = staffFilter == role
                    filterChip("\(role.emoji) \(role.displayTitle)", isActive: active, color: ParkTheme.grassTop) {
                        staffFilter = active ? nil : role
                    }
                }
            }
            .padding(.horizontal, 4)
            .padding(.vertical, 2)
        }
    }

    private func filterChip(_ label: String, isActive: Bool, color: Color, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .font(ParkTheme.captionFont(readable: readableFonts).weight(isActive ? .bold : .regular))
                .foregroundStyle(isActive ? ParkTheme.plaque : ParkTheme.ink)
                .padding(.horizontal, 10)
                .padding(.vertical, 5)
                .background(isActive ? color : ParkTheme.plaque.opacity(0.85))
                .clipShape(Capsule())
                .overlay(Capsule().stroke(color.opacity(0.5), lineWidth: 1))
        }
        .buttonStyle(.plain)
    }

    // MARK: - Board

    private var board: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(alignment: .top, spacing: 12) {
                ForEach(AttractionStatus.allCases) { status in
                    boardColumn(status)
                }
            }
            .padding(.bottom, 12)
        }
    }

    private func boardColumn(_ status: AttractionStatus) -> some View {
        let col = visible.filter { $0.status == status }
        let highlight = (statusFocus == status)
        return VStack(alignment: .leading, spacing: 8) {
            Text("\(status.emoji) \(status.displayTitle.uppercased())")
                .font(ParkTheme.captionFont(readable: readableFonts).weight(.heavy))
                .foregroundStyle(highlight ? ParkTheme.accent : ParkTheme.ink)
                .frame(width: 200, alignment: .leading)
            ScrollView {
                VStack(spacing: 8) {
                    ForEach(col) { item in
                        NavigationLink(value: item.id) {
                            AttractionCardView(item: item, readableFonts: readableFonts)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .frame(width: 200)
        }
        .padding(8)
        .background(ParkTheme.plaque.opacity(highlight ? 0.98 : 0.88))
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(highlight ? ParkTheme.accent : ParkTheme.wood.opacity(0.45), lineWidth: highlight ? 2 : 1)
        )
    }

    // MARK: - List

    private var listView: some View {
        List {
            ForEach(AttractionStatus.allCases) { status in
                let col = visible.filter { $0.status == status }
                if !col.isEmpty {
                    Section(header: Text("\(status.emoji) \(status.displayTitle)")) {
                        ForEach(col) { item in
                            NavigationLink(value: item.id) {
                                AttractionCardView(item: item, readableFonts: readableFonts, compact: true)
                            }
                        }
                    }
                }
            }
        }
        .listStyle(.plain)
        .scrollContentBackground(.hidden)
    }
}

struct AttractionCardView: View {
    var item: ChecklistTaskItem
    var readableFonts: Bool
    var compact: Bool = false

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(item.text)
                .font(ParkTheme.bodyFont(readable: readableFonts).weight(.semibold))
                .foregroundStyle(ParkTheme.ink)
                .multilineTextAlignment(.leading)
            HStack(spacing: 6) {
                Text("\(item.zone.emoji) \(item.zone.displayTitle)")
                Text("·")
                Text("💰 $\(item.rewardDollars)")
            }
            .font(ParkTheme.captionFont(readable: readableFonts))
            .foregroundStyle(ParkTheme.ink.opacity(0.85))
            HStack {
                Text("Priority: \(item.priority.displayTitle)")
                Spacer()
                Text("Due: \(item.dueDateLabel())")
            }
            .font(ParkTheme.captionFont(readable: readableFonts))
            .foregroundStyle(ParkTheme.ink.opacity(0.8))
        }
        .padding(10)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(ParkTheme.plaque.opacity(0.95))
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .overlay(
            RoundedRectangle(cornerRadius: 10)
                .stroke(ParkTheme.wood.opacity(0.45), lineWidth: 1)
        )
    }
}
