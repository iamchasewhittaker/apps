import SwiftUI
import ClarityUI

struct ContentView: View {
    @Environment(JobSearchStore.self) private var store

    var body: some View {
        TabView {
            FocusTabView()
                .tabItem { Label("Focus", systemImage: "scope") }
            PipelineTabView()
                .tabItem { Label("Pipeline", systemImage: "rectangle.stack") }
            ContactsTabView()
                .tabItem { Label("Contacts", systemImage: "person.2") }
            MoreTabView()
                .tabItem { Label("More", systemImage: "ellipsis.circle") }
        }
        .tint(JSHQTheme.accentBlue)
        .preferredColorScheme(.dark)
    }
}

#Preview {
    ContentView()
        .environment(JobSearchStore())
}
