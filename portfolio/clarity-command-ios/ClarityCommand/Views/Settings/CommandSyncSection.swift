import SwiftUI
import ClarityUI

@MainActor
struct CommandSyncSection: View {
    @Environment(CommandStore.self) private var store
    @ObservedObject var sync: CommandCloudSync
    @State private var email = ""
    @State private var otp = ""

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            ClaritySectionLabel("Cloud sync")
            Text("Same Supabase project as web Clarity Command (`command` row). Sign in with the same email as the web app.")
                .font(ClarityTypography.caption)
                .foregroundStyle(ClarityPalette.muted)

            if let session = sync.sessionEmail {
                Text("Signed in as \(session)")
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.text)
                HStack(spacing: 12) {
                    Button("Pull from cloud") {
                        Task { await sync.pull(into: store) }
                    }
                    .buttonStyle(.bordered)
                    Button("Push now") {
                        Task { await sync.push(from: store) }
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(CommandPalette.accent)
                    Button("Sign out") {
                        Task { await sync.signOut() }
                    }
                    .buttonStyle(.bordered)
                }
            } else {
                TextField("Email", text: $email)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)
                    .textFieldStyle(.roundedBorder)
                Button("Send sign-in code") {
                    Task { await sync.signInOtp(email: email.trimmingCharacters(in: .whitespaces)) }
                }
                .disabled(email.trimmingCharacters(in: .whitespaces).isEmpty || sync.isBusy)
                TextField("6-digit code", text: $otp)
                    .keyboardType(.numberPad)
                    .textFieldStyle(.roundedBorder)
                Button("Verify") {
                    Task {
                        await sync.verifyOtp(email: email.trimmingCharacters(in: .whitespaces), token: otp.trimmingCharacters(in: .whitespaces))
                        otp = ""
                        await sync.pull(into: store)
                    }
                }
                .disabled(otp.count < 6 || sync.isBusy)
            }

            if let status = sync.status, !status.isEmpty {
                Text(status)
                    .font(ClarityTypography.caption)
                    .foregroundStyle(ClarityPalette.muted)
            }
        }
        .padding(12)
        .background(ClarityPalette.surface)
        .clipShape(RoundedRectangle(cornerRadius: 10))
        .task {
            await sync.bootstrapSession()
        }
    }
}
