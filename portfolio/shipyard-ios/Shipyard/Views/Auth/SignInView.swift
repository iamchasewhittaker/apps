import SwiftUI

// MARK: - SignInView
// Phase 2: wire real magic-link send once supabase-swift package is added in Xcode.
// Until then, this view shows the correct UI and integrates with FleetStore.isSignedIn.

struct SignInView: View {
    @Environment(FleetStore.self) private var store
    @State private var email = Config.ownerEmail
    @State private var sent = false
    @State private var error: String?
    @State private var loading = false

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            VStack(spacing: 8) {
                Text("Shipyard")
                    .font(.largeTitle.bold())
                    .foregroundStyle(Palette.gold)
                Text("Fleet command — captains only")
                    .font(.subheadline)
                    .foregroundStyle(Palette.mist)
            }

            if sent {
                VStack(spacing: 12) {
                    Image(systemName: "envelope.badge.checkmark")
                        .font(.system(size: 48))
                        .foregroundStyle(Palette.gold)
                    Text("Magic link sent to")
                        .font(.subheadline)
                        .foregroundStyle(Palette.mist)
                    Text(email)
                        .font(.subheadline.bold())
                        .foregroundStyle(.white)
                    Text("Check your inbox and tap the link to sign in.")
                        .font(.caption)
                        .foregroundStyle(Palette.mist)
                        .multilineTextAlignment(.center)
                }
                .padding()
            } else {
                VStack(spacing: 16) {
                    VStack(alignment: .leading, spacing: 6) {
                        Text("EMAIL")
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(Palette.mist)
                        TextField("you@example.com", text: $email)
                            .textContentType(.emailAddress)
                            .keyboardType(.emailAddress)
                            .autocorrectionDisabled()
                            .textInputAutocapitalization(.never)
                            .padding(.horizontal, 14)
                            .padding(.vertical, 10)
                            .background(Palette.deepSea)
                            .clipShape(RoundedRectangle(cornerRadius: 10))
                            .overlay(
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(Palette.gold.opacity(0.3), lineWidth: 1)
                            )
                    }

                    if let error {
                        Text(error)
                            .font(.caption)
                            .foregroundStyle(.red)
                    }

                    Button {
                        Task { await sendMagicLink() }
                    } label: {
                        if loading {
                            ProgressView().tint(.white)
                        } else {
                            Text("Send magic link")
                                .font(.subheadline.bold())
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 12)
                    .background(Palette.gold)
                    .foregroundStyle(Palette.navy)
                    .clipShape(RoundedRectangle(cornerRadius: 10))
                    .disabled(loading || email.isEmpty)
                }
                .padding(.horizontal)
            }

            Spacer()
        }
        .background(Palette.navy.ignoresSafeArea())
    }

    private func sendMagicLink() async {
        loading = true
        error = nil
        // TODO: replace with real Supabase SDK call once supabase-swift is added in Xcode:
        //   try await client.auth.signInWithOTP(
        //     email: email,
        //     redirectTo: URL(string: "shipyard://auth/confirm")!
        //   )
        //   Then handle the deep-link in a .onOpenURL modifier in ShipyardApp.
        // Simulate send + auto-sign-in for mock flow:
        try? await Task.sleep(for: .seconds(0.8))
        sent = true
        loading = false
        // Auto-advance after 1s so mock flow reaches the fleet:
        try? await Task.sleep(for: .seconds(1.0))
        await store.signIn()
    }
}

#Preview {
    SignInView()
        .environment(FleetStore())
}
