import SwiftUI

struct SettingsView: View {
    var body: some View {
        List {
            Section("Property") {
                NavigationLink("Address & Location") {
                    PropertySettingsView()
                }
            }
        }
        .scrollContentBackground(.hidden)
        .background(FairwayTheme.backgroundPrimary)
        .navigationTitle("Settings")
    }
}
