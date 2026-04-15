import SwiftUI
import ClarityUI

struct PipelineTabView: View {
    @Environment(JobSearchStore.self) private var store
    @State private var editorApp: JobApplication?

    var body: some View {
        NavigationStack {
            Group {
                if store.data.applications.isEmpty {
                    ContentUnavailableView(
                        "No applications",
                        systemImage: "rectangle.stack",
                        description: Text("Tap + to add your first role.")
                    )
                    .foregroundStyle(JSHQTheme.textMuted)
                } else {
                    List {
                        ForEach(store.data.applications) { app in
                            Button {
                                editorApp = app
                            } label: {
                                applicationRow(app)
                            }
                            .listRowBackground(JSHQTheme.surface)
                        }
                        .onDelete(perform: deleteAt)
                    }
                    .listStyle(.plain)
                    .scrollContentBackground(.hidden)
                }
            }
            .background(JSHQTheme.background)
            .navigationTitle("Pipeline")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        editorApp = JobApplication(id: JobSearchId.generate())
                    } label: {
                        Image(systemName: "plus")
                    }
                    .accessibilityLabel("Add application")
                    .frame(minWidth: ClarityMetrics.minTapTarget, minHeight: ClarityMetrics.minTapTarget)
                }
            }
            .sheet(item: $editorApp) { app in
                ApplicationEditorSheet(initial: app) { updated in
                    store.upsertApplication(updated)
                }
            }
        }
    }

    private func applicationRow(_ app: JobApplication) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(app.company.isEmpty ? "Company" : app.company)
                .font(ClarityTypography.headline)
                .foregroundStyle(JSHQTheme.textPrimary)
            Text(app.title.isEmpty ? "Title" : app.title)
                .font(ClarityTypography.body)
                .foregroundStyle(JSHQTheme.textMuted)
            Text(app.stage)
                .font(ClarityTypography.caption)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(JSHQTheme.accentBlue.opacity(0.2))
                .foregroundStyle(JSHQTheme.accentBlue)
                .clipShape(Capsule())
            if !app.nextStepDate.isEmpty {
                Text("Next: \(app.nextStepDate)")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(JSHQTheme.accentAmber)
            }
        }
        .padding(.vertical, 4)
    }

    private func deleteAt(_ offsets: IndexSet) {
        for i in offsets {
            let id = store.data.applications[i].id
            store.deleteApplication(id: id)
        }
    }
}
