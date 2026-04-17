import SwiftUI

struct CheckView: View {
    @Environment(AppStore.self) private var store

    var body: some View {
        NavigationStack {
            if store.hasCheckedToday {
                CheckDoneView()
            } else {
                CheckFormView()
            }
        }
    }
}
