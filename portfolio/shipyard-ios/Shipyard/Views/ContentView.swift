import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationStack {
            FleetListView()
                .navigationTitle("Fleet")
                .toolbarBackground(Palette.navy, for: .navigationBar)
                .toolbarBackground(.visible, for: .navigationBar)
                .toolbarColorScheme(.dark, for: .navigationBar)
        }
    }
}

#Preview {
    ContentView()
        .environment(FleetStore())
}
