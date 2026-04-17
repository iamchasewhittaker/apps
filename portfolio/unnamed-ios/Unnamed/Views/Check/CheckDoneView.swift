import SwiftUI

struct CheckDoneView: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        VStack {
            Spacer()

            if let check = store.todayCheck {
                let bothYes = check.produced && check.stayedInLanes
                let oneYes = check.produced || check.stayedInLanes

                VStack(spacing: 16) {
                    Text(bothYes ? "▲" : oneYes ? "◆" : "—")
                        .font(.system(size: 64))
                        .foregroundStyle(.white)

                    Text(bothYes ? "Solid day." : oneYes ? "Halfway there." : "Rest day. That counts too.")
                        .font(.title3)
                        .fontWeight(.medium)
                        .foregroundStyle(.white)

                    VStack(spacing: 4) {
                        Text("Produced: \(check.produced ? "Yes" : "No")")
                        Text("Stayed in lanes: \(check.stayedInLanes ? "Yes" : "No")")
                    }
                    .font(.subheadline)
                    .foregroundStyle(Color(.systemGray))
                    .padding(.top, 8)
                }
            }

            Spacer()
        }
        .background(Color(hex: "#09090b").ignoresSafeArea())
        .navigationTitle("Check")
        .navigationBarTitleDisplayMode(.large)
    }
}
