import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var store: WellnessStore
    @State private var selectedTab: AppTab = .checkin

    var body: some View {
        TabView(selection: $selectedTab) {
            CheckinFlowView(store: store)
                .tabItem {
                    Label("Check-in", systemImage: "sun.max")
                }
                .tag(AppTab.checkin)

            TasksTabView(store: store)
                .tabItem {
                    Label("Tasks", systemImage: "checklist")
                }
                .tag(AppTab.tasks)

            TimeTabView(store: store)
                .tabItem {
                    Label("Time", systemImage: "timer")
                }
                .tag(AppTab.time)

            CaptureTabView(store: store)
                .tabItem {
                    Label("Capture", systemImage: "bolt")
                }
                .tag(AppTab.capture)

            SyncTabView()
                .tabItem {
                    Label("Sync", systemImage: "icloud")
                }
                .tag(AppTab.sync)
        }
        .background(WellnessTheme.bg)
    }
}

private enum AppTab {
    case checkin
    case tasks
    case time
    case capture
    case sync
}

#Preview {
    ContentView()
        .environmentObject(WellnessStore())
        .environmentObject(WellnessCloudSync())
}
