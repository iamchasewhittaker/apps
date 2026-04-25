import SwiftUI

struct LockedLanesHeader: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        if let lock = store.todayLock, !lock.lanes.isEmpty {
            VStack(alignment: .leading, spacing: 8) {
                Text("Today's lanes")
                    .font(.caption)
                    .fontWeight(.semibold)
                    .foregroundStyle(Color(.systemGray))
                    .textCase(.uppercase)
                    .tracking(1)

                HStack(spacing: 8) {
                    ForEach(lock.lanes) { lane in
                        Text(lane.label)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .foregroundStyle(lane.color)
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(lane.color.opacity(0.15))
                            .overlay(
                                RoundedRectangle(cornerRadius: 20)
                                    .stroke(lane.color.opacity(0.4), lineWidth: 1)
                            )
                            .clipShape(RoundedRectangle(cornerRadius: 20))
                    }
                }
            }
            .padding(.horizontal)
        } else {
            Text("No lanes locked today. You can still log a check.")
                .font(.subheadline)
                .foregroundStyle(Color(.systemGray))
                .padding(.horizontal)
        }
    }
}
