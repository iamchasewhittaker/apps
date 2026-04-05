import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var store: WellnessStore

    var body: some View {
        CheckinFlowView(store: store)
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(WellnessTheme.bg)
    }
}

#Preview {
    ContentView()
        .environmentObject(WellnessStore())
}
