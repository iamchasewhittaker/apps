import SwiftUI

struct TodayView: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        NavigationStack {
            if store.isLockedToday {
                FocusView()
            } else {
                LanePickerView()
            }
        }
    }
}
