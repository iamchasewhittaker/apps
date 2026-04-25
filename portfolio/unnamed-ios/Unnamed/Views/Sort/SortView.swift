import SwiftUI

private struct LaneHelpSheet: View {
    let lane: Lane
    let onSort: () -> Void
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Rectangle()
                .fill(lane.color)
                .frame(height: 4)

            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text(lane.label)
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundStyle(.white)

                    Text(lane.summary)
                        .foregroundStyle(Color(.systemGray))

                    VStack(alignment: .leading, spacing: 10) {
                        ForEach(lane.examples, id: \.self) { example in
                            HStack(alignment: .top, spacing: 10) {
                                Circle()
                                    .fill(lane.color)
                                    .frame(width: 6, height: 6)
                                    .padding(.top, 6)
                                Text(example)
                                    .foregroundStyle(.white)
                            }
                        }
                    }

                    Text(lane.rule)
                        .italic()
                        .foregroundStyle(Color(.systemGray))

                    Button {
                        dismiss()
                        onSort()
                    } label: {
                        Text("Sort into \(lane.label)")
                            .fontWeight(.semibold)
                            .foregroundStyle(.black)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(lane.color)
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                    }
                }
                .padding(24)
            }
        }
        .background(Color(hex: "#09090b").ignoresSafeArea())
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
    }
}

struct SortView: View {
    @Environment(AppStore.self) private var store
    @State private var helpLane: Lane? = nil

    private let lanes: [Lane] = [.regulation, .maintenance, .support, .future]

    var body: some View {
        NavigationStack {
            VStack {
                if let item = store.inboxItems.first {
                    Spacer()

                    Text(item.text)
                        .font(.title2)
                        .fontWeight(.medium)
                        .foregroundStyle(.white)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 32)

                    Spacer()

                    VStack(spacing: 12) {
                        ForEach(lanes) { lane in
                            HStack(spacing: 0) {
                                Button {
                                    store.assignItem(item, to: lane)
                                } label: {
                                    HStack {
                                        VStack(alignment: .leading, spacing: 2) {
                                            Text(lane.label)
                                                .fontWeight(.medium)
                                                .foregroundStyle(.white)
                                            Text(lane.laneDescription)
                                                .font(.caption)
                                                .foregroundStyle(Color(.systemGray))
                                        }
                                        Spacer()
                                    }
                                    .padding(.vertical, 14)
                                    .padding(.leading, 16)
                                    .padding(.trailing, 4)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                }
                                .buttonStyle(.plain)
                                .accessibilityLabel("Sort into \(lane.label)")

                                Button {
                                    helpLane = lane
                                } label: {
                                    Image(systemName: "info.circle")
                                        .foregroundStyle(lane.color.opacity(0.7))
                                        .frame(width: 44, height: 44)
                                }
                                .buttonStyle(.plain)
                                .padding(.trailing, 8)
                                .accessibilityLabel("What goes in \(lane.label)?")
                            }
                            .background(lane.color.opacity(0.15))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(lane.color.opacity(0.4), lineWidth: 1)
                            )
                            .clipShape(RoundedRectangle(cornerRadius: 12))
                        }

                        Button("Skip") {
                            store.skipItem(item)
                        }
                        .foregroundStyle(Color(.systemGray))
                        .padding(.top, 4)
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 32)

                } else {
                    Spacer()
                    VStack(spacing: 8) {
                        Text("Inbox is empty.")
                            .font(.title3)
                            .foregroundStyle(.white)
                        Text("Nothing to sort.")
                            .foregroundStyle(Color(.systemGray))
                    }
                    Spacer()
                }
            }
            .background(Color(hex: "#09090b").ignoresSafeArea())
            .navigationTitle("Sort")
            .navigationBarTitleDisplayMode(.large)
            .sheet(item: $helpLane) { lane in
                LaneHelpSheet(lane: lane) {
                    if let item = store.inboxItems.first {
                        store.assignItem(item, to: lane)
                    }
                }
            }
        }
    }
}
