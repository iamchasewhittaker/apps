import SwiftUI

struct SignInView: View {
    @Environment(FleetStore.self) private var store
    @State private var email = Config.ownerEmail
    @State private var password = ""
    @State private var error: String?
    @State private var loading = false

    var body: some View {
        VStack(spacing: 32) {
            Spacer()

            VStack(spacing: 12) {
                HelmMark()
                    .frame(width: 84, height: 84)
                Text("SHIPYARD")
                    .font(.shipyardDisplay(42))
                    .foregroundStyle(Palette.white)
                    .tracking(2)
                Text("FLEET COMMAND — CAPTAINS ONLY")
                    .font(.shipyardMono(11))
                    .foregroundStyle(Palette.dim)
                    .tracking(3)
            }

            VStack(spacing: 16) {
                fieldLabel("EMAIL")
                TextField("you@example.com", text: $email)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .autocorrectionDisabled()
                    .textInputAutocapitalization(.never)
                    .foregroundStyle(Palette.white)
                    .font(.shipyardBody(15))
                    .modifier(FieldBox())

                fieldLabel("PASSWORD")
                SecureField("••••••••", text: $password)
                    .textContentType(.password)
                    .autocorrectionDisabled()
                    .textInputAutocapitalization(.never)
                    .foregroundStyle(Palette.white)
                    .font(.shipyardBody(15))
                    .modifier(FieldBox())

                if let error {
                    Text(error)
                        .font(.shipyardMono(11))
                        .foregroundStyle(.red)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }

                Button {
                    Task { await submit() }
                } label: {
                    if loading {
                        ProgressView().tint(Palette.bg)
                    } else {
                        Text("SIGN IN")
                            .font(.shipyardMono(14))
                            .tracking(2)
                    }
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Palette.steel)
                .foregroundStyle(Palette.bg)
                .clipShape(RoundedRectangle(cornerRadius: 8))
                .disabled(loading || email.isEmpty || password.isEmpty)
            }
            .padding(.horizontal)

            Spacer()
        }
        .background(Palette.bg.ignoresSafeArea())
    }

    private func fieldLabel(_ text: String) -> some View {
        Text(text)
            .font(.shipyardMono(11))
            .tracking(2)
            .foregroundStyle(Palette.dim)
            .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func submit() async {
        loading = true
        error = nil
        defer { loading = false }
        do {
            try await store.signIn(email: email, password: password)
        } catch {
            self.error = error.localizedDescription
        }
    }
}

private struct FieldBox: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding(.horizontal, 14)
            .padding(.vertical, 12)
            .background(Palette.surface)
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .overlay(
                RoundedRectangle(cornerRadius: 8)
                    .stroke(Palette.dimmer, lineWidth: 1)
            )
    }
}

#Preview {
    SignInView()
        .environment(FleetStore())
}
