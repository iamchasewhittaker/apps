import SwiftUI

struct ContentView: View {
    @Environment(FleetStore.self) private var store

    var body: some View {
        Group {
            if store.isSignedIn {
                NavigationStack {
                    FleetListView()
                        .navigationTitle("Fleet")
                        .toolbarBackground(Palette.navy, for: .navigationBar)
                        .toolbarBackground(.visible, for: .navigationBar)
                        .toolbarColorScheme(.dark, for: .navigationBar)
                }
            } else {
                SignInView()
            }
        }
    }
}

#Preview {
    ContentView()
        .environment(FleetStore())
}
