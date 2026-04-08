import SwiftUI

struct TokenStepView: View {
    var onNext: (String) -> Void

    @State private var tokenInput: String = ""
    @State private var isVerifying = false
    @State private var errorMessage: String? = nil

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                instructionCard
                tokenField
                if let error = errorMessage {
                    Text(error)
                        .font(ClarityTheme.captionFont)
                        .foregroundStyle(ClarityTheme.danger)
                        .padding(.horizontal, 4)
                }
                verifyButton
                Spacer(minLength: 40)
            }
            .padding(20)
        }
    }

    private var instructionCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Your YNAB Personal Access Token")
                .font(ClarityTheme.titleFont)
                .foregroundStyle(ClarityTheme.text)
            Text("Get it at app.ynab.com → Account Settings → Developer Settings → New Token. This stays on your device in the secure Keychain — never stored anywhere else.")
                .font(ClarityTheme.bodyFont)
                .foregroundStyle(ClarityTheme.muted)
        }
        .clarityCard()
    }

    private var tokenField: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Token")
                .font(ClarityTheme.captionFont)
                .foregroundStyle(ClarityTheme.muted)
            SecureField("Paste your token here", text: $tokenInput)
                .textContentType(.password)
                .autocorrectionDisabled()
                .textInputAutocapitalization(.never)
                .font(ClarityTheme.monoFont)
                .foregroundStyle(ClarityTheme.text)
                .padding(12)
                .background(ClarityTheme.surface)
                .clipShape(RoundedRectangle(cornerRadius: 10))
                .overlay(RoundedRectangle(cornerRadius: 10).stroke(ClarityTheme.border))
        }
    }

    private var verifyButton: some View {
        Button {
            Task { await verifyToken() }
        } label: {
            HStack {
                if isVerifying {
                    ProgressView()
                        .progressViewStyle(.circular)
                        .tint(ClarityTheme.bg)
                } else {
                    Text("Verify & Continue")
                        .font(ClarityTheme.headlineFont)
                }
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 14)
            .background(tokenInput.isEmpty ? ClarityTheme.muted : ClarityTheme.accent)
            .foregroundStyle(ClarityTheme.text)
            .clipShape(RoundedRectangle(cornerRadius: 12))
        }
        .disabled(tokenInput.isEmpty || isVerifying)
    }

    private func verifyToken() async {
        guard !tokenInput.isEmpty else { return }
        isVerifying = true
        errorMessage = nil
        defer { isVerifying = false }

        let client = YNABClient(token: tokenInput)
        do {
            // fetchBudgets validates the token — if it returns without throwing, the token is good.
            _ = try await client.fetchBudgets()
            KeychainHelper.saveToken(tokenInput)
            onNext(tokenInput)
        } catch YNABClientError.unauthorized {
            errorMessage = "Token not recognized. Double-check and try again."
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}
