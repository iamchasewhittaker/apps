import SwiftUI
import ClarityUI

struct ContentView: View {
    @Environment(JobSearchStore.self) private var store

    var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 10) {
                Image("Logo")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 36, height: 36)
                    .accessibilityHidden(true)
                Text("Job Search HQ")
                    .font(ClarityTypography.title)
                    .foregroundStyle(JSHQTheme.textPrimary)
                Spacer(minLength: 0)
            }
            .padding(.horizontal, ClarityMetrics.pagePadding)
            .padding(.vertical, 10)
            .background(JSHQTheme.surface)
            .overlay(alignment: .bottom) {
                Rectangle()
                    .fill(JSHQTheme.border)
                    .frame(height: 1)
            }

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
        }
        .tint(JSHQTheme.accentBlue)
        .preferredColorScheme(.dark)
    }
}

#Preview {
    ContentView()
        .environment(JobSearchStore())
}
