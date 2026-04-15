import SwiftUI

struct SyncTabView: View {
    @EnvironmentObject private var store: WellnessStore
    @EnvironmentObject private var cloud: WellnessCloudSync

    @State private var email = ""
    @State private var otp = ""
    @State private var otpSent = false

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    if let em = cloud.sessionEmail {
                        Text("Signed in as \(em)")
                            .font(.subheadline)
                            .foregroundStyle(WellnessTheme.text)
                        Button("Sign out") {
                            Task { await cloud.signOut() }
                        }
                        .foregroundStyle(WellnessTheme.red)
                    } else {
                        TextField("Email", text: $email)
                            .textContentType(.emailAddress)
                            .textInputAutocapitalization(.never)
                            .keyboardType(.emailAddress)
                        if otpSent {
                            TextField("6–8 digit code", text: $otp)
                                .keyboardType(.numberPad)
                            Button("Verify code") {
                                Task {
                                    await cloud.verifyOtp(email: email.trimmingCharacters(in: .whitespacesAndNewlines), token: otp)
                                    otp = ""
                                    if cloud.sessionEmail != nil {
                                        await cloud.pullWellness(into: store)
                                        await cloud.pushAll(from: store)
                                    }
                                }
                            }
                            .disabled(otp.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                        } else {
                            Button("Send sign-in code") {
                                Task {
                                    await cloud.signInOtp(email: email.trimmingCharacters(in: .whitespacesAndNewlines))
                                    otpSent = true
                                }
                            }
                            .disabled(email.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                        }
                    }
                } header: {
                    Text("Supabase")
                } footer: {
                    Text("Same account as Wellness web and Clarity Command. Data stays on-device until you sign in.")
                        .font(.caption)
                }

                if cloud.sessionEmail != nil {
                    Section("Sync") {
                        Button("Pull from cloud") {
                            Task { await cloud.pullWellness(into: store) }
                        }
                        Button("Push to cloud now") {
                            Task { await cloud.pushAll(from: store) }
                        }
                    }
                }

                if let s = cloud.status, !s.isEmpty {
                    Section {
                        Text(s)
                            .font(.caption)
                            .foregroundStyle(WellnessTheme.muted)
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(WellnessTheme.bg)
            .navigationTitle("Sync")
            .toolbarBackground(WellnessTheme.bg, for: .navigationBar)
            .task {
                await cloud.bootstrapSession()
            }
        }
    }
}

#Preview {
    SyncTabView()
        .environmentObject(WellnessStore())
        .environmentObject(WellnessCloudSync())
}
