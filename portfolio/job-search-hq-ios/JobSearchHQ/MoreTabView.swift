import SwiftUI
import ClarityUI

struct MoreTabView: View {
    @Environment(JobSearchStore.self) private var store

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: ClarityMetrics.cardSpacing) {
                    Text("Profile")
                        .font(ClarityTypography.title)
                        .foregroundStyle(JSHQTheme.textPrimary)

                    VStack(alignment: .leading, spacing: 8) {
                        labeled("Name", store.data.profile.name)
                        labeled("Email", store.data.profile.email)
                        labeled("Location", store.data.profile.location)
                        labeled("Target roles", store.data.profile.targetRoles)
                    }
                    .padding(ClarityMetrics.cardPadding)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(JSHQTheme.surface)
                    .clipShape(RoundedRectangle(cornerRadius: 12))
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(JSHQTheme.border, lineWidth: 1)
                    )

                    Text("Data & sync")
                        .font(ClarityTypography.title)
                        .foregroundStyle(JSHQTheme.textPrimary)

                    Text(
                        "This build keeps your job search blob on-device (UserDefaults). "
                            + "Supabase sync and sign-in will match the web app in Phase 2 — see docs/SYNC_PHASE2.md in this folder."
                    )
                    .font(ClarityTypography.support)
                    .foregroundStyle(JSHQTheme.textMuted)

                    Text("Chrome extension has no iOS equivalent; capture still happens on desktop.")
                        .font(ClarityTypography.caption)
                        .foregroundStyle(JSHQTheme.textMuted)
                }
                .padding(ClarityMetrics.pagePadding)
            }
            .background(JSHQTheme.background.ignoresSafeArea())
            .navigationTitle("More")
            .navigationBarTitleDisplayMode(.large)
        }
    }

    private func labeled(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(title.uppercased())
                .font(ClarityTypography.caption)
                .foregroundStyle(JSHQTheme.textMuted)
            Text(value.isEmpty ? "—" : value)
                .font(ClarityTypography.body)
                .foregroundStyle(JSHQTheme.textPrimary)
        }
    }
}
