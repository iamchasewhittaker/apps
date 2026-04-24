import SwiftUI

struct RachioSettingsView: View {
    @Environment(FairwayStore.self) private var store

    @State private var tokenInput: String = ""
    @State private var verifying: Bool = false
    @State private var preview: RachioConnectPreview? = nil
    @State private var selectedDeviceId: String? = nil
    @State private var connectError: String? = nil

    var body: some View {
        List {
            if store.rachioIsConnected {
                connectedSections
            } else if let preview {
                devicePickerSection(preview: preview)
            } else {
                connectSection
            }
        }
        .scrollContentBackground(.hidden)
        .background(FairwayTheme.backgroundPrimary)
        .navigationTitle("Rachio Sync")
        .navigationBarTitleDisplayMode(.inline)
    }

    // MARK: - Sections

    private var connectSection: some View {
        Group {
            Section {
                VStack(alignment: .leading, spacing: 8) {
                    Text("Personal API Token")
                        .font(.caption.bold())
                        .foregroundStyle(FairwayTheme.textSecondary)
                        .textCase(.uppercase)
                    SecureField("Paste token", text: $tokenInput)
                        .textContentType(.password)
                        .autocorrectionDisabled()
                        .textInputAutocapitalization(.never)
                        .padding(12)
                        .background(FairwayTheme.backgroundElevated)
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                    Text("Get it at app.rach.io → Account Settings → Get API Key.")
                        .font(.footnote)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
                .padding(.vertical, 4)
                .listRowBackground(FairwayTheme.backgroundSurface)
            }

            Section {
                Button {
                    Task { await verify() }
                } label: {
                    HStack {
                        if verifying { ProgressView().tint(FairwayTheme.textPrimary) }
                        Text(verifying ? "Verifying…" : "Verify & Connect")
                            .font(.subheadline.bold())
                    }
                    .frame(maxWidth: .infinity)
                }
                .disabled(tokenInput.trimmingCharacters(in: .whitespaces).isEmpty || verifying)
                .listRowBackground(FairwayTheme.accentGreen)
                .foregroundStyle(FairwayTheme.textPrimary)

                if let connectError {
                    Text(connectError)
                        .font(.footnote)
                        .foregroundStyle(FairwayTheme.statusAction)
                        .listRowBackground(FairwayTheme.backgroundSurface)
                }
            }
        }
    }

    private func devicePickerSection(preview: RachioConnectPreview) -> some View {
        Group {
            Section("Choose Controller") {
                ForEach(preview.devices, id: \.id) { device in
                    Button {
                        selectedDeviceId = device.id
                        Task { await complete(preview: preview, device: device) }
                    } label: {
                        HStack {
                            Image(systemName: "dot.radiowaves.left.and.right")
                                .foregroundStyle(FairwayTheme.accentGold)
                            VStack(alignment: .leading, spacing: 2) {
                                Text(device.name ?? "Rachio Device").foregroundStyle(FairwayTheme.textPrimary)
                                Text("\(device.zones?.count ?? 0) zones")
                                    .font(.caption)
                                    .foregroundStyle(FairwayTheme.textSecondary)
                            }
                            Spacer()
                            if selectedDeviceId == device.id && store.rachioSyncing {
                                ProgressView().tint(FairwayTheme.textPrimary)
                            }
                        }
                    }
                    .listRowBackground(FairwayTheme.backgroundSurface)
                }
            }

            Section {
                Button("Cancel", role: .cancel) {
                    self.preview = nil
                    selectedDeviceId = nil
                }
                .listRowBackground(FairwayTheme.backgroundSurface)
            }
        }
    }

    @ViewBuilder
    private var connectedSections: some View {
        if let state = store.blob.rachio {
            Section("Controller") {
                InfoLine(label: "Device", value: state.deviceName)
                InfoLine(label: "Rachio zones", value: "\(state.zones.count)")
                InfoLine(label: "Schedule rules", value: "\(state.allScheduleRules.count)")
                InfoLine(label: "Events cached", value: "\(state.recentEvents.count)")
                InfoLine(label: "Last sync", value: relativeTime(state.lastSyncAt))
            }
            .listRowBackground(FairwayTheme.backgroundSurface)

            if let err = store.rachioLastError {
                Section {
                    Text(err)
                        .font(.footnote)
                        .foregroundStyle(FairwayTheme.statusAction)
                }
                .listRowBackground(FairwayTheme.backgroundSurface)
            }

            Section {
                Button {
                    Task { await store.syncRachio() }
                } label: {
                    HStack {
                        if store.rachioSyncing { ProgressView().tint(FairwayTheme.textPrimary) }
                        Text(store.rachioSyncing ? "Syncing…" : "Sync Now")
                            .font(.subheadline.bold())
                    }
                    .frame(maxWidth: .infinity)
                }
                .disabled(store.rachioSyncing)
                .listRowBackground(FairwayTheme.accentGreen)
                .foregroundStyle(FairwayTheme.textPrimary)
            }

            Section("Zone Linking") {
                ForEach(store.blob.zones, id: \.id) { fairwayZone in
                    zoneLinkRow(for: fairwayZone, state: state)
                }
            }
            .listRowBackground(FairwayTheme.backgroundSurface)

            Section {
                Button("Disconnect", role: .destructive) {
                    store.disconnectRachio()
                }
                .listRowBackground(FairwayTheme.backgroundSurface)
            }
        }
    }

    private func zoneLinkRow(for fairwayZone: ZoneData, state: RachioState) -> some View {
        let linkedId = state.rachioZoneId(forFairwayZone: fairwayZone.number)
        return Picker(selection: Binding(
            get: { linkedId ?? "" },
            set: { newValue in
                store.setRachioZoneLink(
                    fairwayZoneNumber: fairwayZone.number,
                    rachioZoneId: newValue.isEmpty ? nil : newValue
                )
            }
        )) {
            Text("— unlinked —").tag("")
            ForEach(state.zones) { rz in
                Text("Z\(rz.zoneNumber) · \(rz.name)").tag(rz.id)
            }
        } label: {
            HStack {
                ZoneNumberBadge(number: fairwayZone.number)
                VStack(alignment: .leading, spacing: 2) {
                    Text(fairwayZone.name).foregroundStyle(FairwayTheme.textPrimary)
                    Text(fairwayZone.type.rawValue)
                        .font(.caption)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
            }
        }
    }

    // MARK: - Actions

    private func verify() async {
        connectError = nil
        verifying = true
        defer { verifying = false }
        let token = tokenInput.trimmingCharacters(in: .whitespacesAndNewlines)
        do {
            let preview = try await store.verifyRachioToken(token)
            if preview.devices.count == 1, let only = preview.devices.first {
                await complete(preview: preview, device: only)
            } else {
                self.preview = preview
            }
        } catch let err as RachioError {
            connectError = err.errorDescription
        } catch {
            connectError = error.localizedDescription
        }
    }

    private func complete(preview: RachioConnectPreview, device: RachioDTO.PersonResponse.Device) async {
        let token = tokenInput.trimmingCharacters(in: .whitespacesAndNewlines)
        await store.completeRachioConnection(token: token, personId: preview.personId, device: device)
        // Reset local state — now we render the connected branch from the store.
        self.preview = nil
        selectedDeviceId = nil
        tokenInput = ""
    }

    private func relativeTime(_ date: Date) -> String {
        let f = RelativeDateTimeFormatter()
        f.unitsStyle = .short
        return f.localizedString(for: date, relativeTo: Date())
    }
}
