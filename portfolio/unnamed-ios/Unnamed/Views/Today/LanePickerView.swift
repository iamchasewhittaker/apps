import SwiftUI

struct LanePickerView: View {
    @Environment(AppStore.self) private var store
    @State private var selected: Set<Lane> = []

    private let lanes: [Lane] = [.regulation, .maintenance, .support, .future]

    var body: some View {
        VStack(alignment: .leading, spacing: 24) {
            Text("Pick your 2 lanes. The rest disappear.")
                .foregroundStyle(Color(.systemGray))
                .padding(.horizontal)

            VStack(spacing: 12) {
                ForEach(lanes, id: \.self) { lane in
                    let isSelected = selected.contains(lane)
                    let isDisabled = selected.count >= 2 && !isSelected

                    Button {
                        toggleLane(lane)
                    } label: {
                        HStack(spacing: 12) {
                            RoundedRectangle(cornerRadius: 3)
                                .fill(lane.color)
                                .frame(width: 4, height: 44)

                            VStack(alignment: .leading, spacing: 2) {
                                Text(lane.label)
                                    .font(.headline)
                                    .foregroundStyle(.white)
                                Text(lane.laneDescription)
                                    .font(.caption)
                                    .foregroundStyle(Color(.systemGray))
                            }

                            Spacer()

                            if isSelected {
                                Image(systemName: "checkmark.circle.fill")
                                    .foregroundStyle(lane.color)
                            }
                        }
                        .padding()
                        .background(isSelected ? lane.color.opacity(0.1) : Color(hex: "#18181b"))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(isSelected ? lane.color.opacity(0.5) : Color.clear, lineWidth: 1)
                        )
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                        .opacity(isDisabled ? 0.4 : 1)
                    }
                    .disabled(isDisabled)
                }
            }
            .padding(.horizontal)

            Spacer()

            VStack(spacing: 8) {
                Text("This can't be undone until tomorrow.")
                    .font(.caption)
                    .foregroundStyle(Color(.systemGray2))
                    .opacity(selected.count < 2 ? 1 : 0)

                Button {
                    lockIn()
                } label: {
                    Text("Lock in for today")
                        .fontWeight(.semibold)
                        .foregroundStyle(.black)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color(hex: "#f59e0b"))
                        .clipShape(RoundedRectangle(cornerRadius: 12))
                }
                .disabled(selected.count != 2)
                .opacity(selected.count == 2 ? 1 : 0.4)
            }
            .padding()
        }
        .background(Color(hex: "#09090b").ignoresSafeArea())
        .navigationTitle("Today")
        .navigationBarTitleDisplayMode(.large)
    }

    @MainActor private func toggleLane(_ lane: Lane) {
        if selected.contains(lane) {
            selected.remove(lane)
        } else if selected.count < 2 {
            selected.insert(lane)
        }
    }

    @MainActor private func lockIn() {
        guard selected.count == 2 else { return }
        let sorted = selected.sorted { $0.rawValue < $1.rawValue }
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        store.lockLanes(sorted[0], sorted[1])
    }
}
