import SwiftUI

struct FocusView: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        VStack {
            if let item = store.activeItems.first {
                Spacer()

                Text(item.lane.label)
                    .font(.caption)
                    .fontWeight(.medium)
                    .foregroundStyle(item.lane.color)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(item.lane.color.opacity(0.15))
                    .clipShape(Capsule())

                Text(item.text)
                    .font(.title2)
                    .fontWeight(.medium)
                    .foregroundStyle(.white)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 32)
                    .padding(.top, 16)

                Spacer()

                Text("\(store.activeItems.count) remaining")
                    .font(.caption)
                    .foregroundStyle(Color(.systemGray))
                    .padding(.bottom, 8)

                HStack(spacing: 16) {
                    Button("Skip") {
                        store.skipActiveItem(item)
                    }
                    .foregroundStyle(Color(.systemGray))
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color(hex: "#18181b"))
                    .clipShape(RoundedRectangle(cornerRadius: 12))

                    Button("Done") {
                        UIImpactFeedbackGenerator(style: .light).impactOccurred()
                        store.markDone(item)
                    }
                    .fontWeight(.semibold)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(Color(hex: "#10b981"))
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                }
                .padding(.horizontal)
                .padding(.bottom, 32)

            } else {
                Spacer()
                VStack(spacing: 12) {
                    Text("▲")
                        .font(.system(size: 48))
                        .foregroundStyle(Color(.systemGray3))
                    Text("All clear.")
                        .font(.title3)
                        .fontWeight(.medium)
                        .foregroundStyle(.white)
                    Text("Nothing left in your active lanes.")
                        .foregroundStyle(Color(.systemGray))
                }
                Spacer()
            }
        }
        .background(Color(hex: "#09090b").ignoresSafeArea())
        .navigationTitle("Today")
        .navigationBarTitleDisplayMode(.large)
    }
}
