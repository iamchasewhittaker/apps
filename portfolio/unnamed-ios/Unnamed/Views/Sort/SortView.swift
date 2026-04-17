import SwiftUI

struct SortView: View {
    @Environment(AppStore.self) private var store

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
                        ForEach(lanes, id: \.self) { lane in
                            Button {
                                store.assignItem(item, to: lane)
                            } label: {
                                HStack {
                                    Text(lane.label)
                                        .fontWeight(.medium)
                                    Spacer()
                                }
                                .foregroundStyle(.white)
                                .padding()
                                .background(lane.color.opacity(0.15))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(lane.color.opacity(0.4), lineWidth: 1)
                                )
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                            }
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
        }
    }
}
