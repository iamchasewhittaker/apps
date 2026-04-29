import SwiftUI
import UniformTypeIdentifiers

let defaultPromptPrefix = "Here's a section from my capture system conversation. Walk me through it like a therapist and help me process what I was feeling and what I learned:"

private let ACCENT = Color(hex: "#f5e300")
private let ACCENT_INK = Color(hex: "#0f0f0f")
private let USER_DEFAULTS_PREFIX = "ash_reader_ios_"

struct SettingsView: View {
    @AppStorage("ash_reader_ios_prompt_prefix") private var promptPrefix: String = ""
    @AppStorage("ash_reader_ios_prompt_prefix_on") private var promptPrefixOn: String = ""
    @AppStorage("ash_reader_ios_notif_enabled") private var notifEnabled: Bool = false
    @AppStorage("ash_reader_ios_notif_hour") private var notifHour: Int = 9
    @AppStorage("ash_reader_ios_notif_minute") private var notifMinute: Int = 0
    @AppStorage("ash_reader_ios_notif_weekdays") private var notifWeekdaysRaw: String = "2,3,4,5,6"
    @ObservedObject private var streak = StreakStore.shared

    @State private var showResetAlert = false
    @State private var showImporter = false
    @State private var exportURL: URL?
    @State private var showExporter = false
    @State private var importResult: String?

    private var notifWeekdays: Set<Int> {
        Set(notifWeekdaysRaw.split(separator: ",").compactMap { Int($0) })
    }

    private func toggleWeekday(_ d: Int) {
        var s = notifWeekdays
        if s.contains(d) { s.remove(d) } else { s.insert(d) }
        notifWeekdaysRaw = s.sorted().map(String.init).joined(separator: ",")
        reschedule()
    }

    private func reschedule() {
        NotificationManager.shared.scheduleReminders(
            enabled: notifEnabled,
            hour: notifHour,
            minute: notifMinute,
            weekdays: notifWeekdays
        )
    }

    private var prefixEnabled: Binding<Bool> {
        Binding(
            get: { promptPrefixOn == "1" },
            set: { promptPrefixOn = $0 ? "1" : "" }
        )
    }

    private var editablePrefix: Binding<String> {
        Binding(
            get: { promptPrefix.isEmpty ? defaultPromptPrefix : promptPrefix },
            set: { promptPrefix = $0 }
        )
    }

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    Toggle(isOn: prefixEnabled) {
                        Text("Prepend prompt prefix")
                            .font(.system(size: 15))
                    }
                    .tint(ACCENT)

                    TextEditor(text: editablePrefix)
                        .font(.system(size: 14))
                        .frame(minHeight: 110)
                        .disabled(!prefixEnabled.wrappedValue)
                        .opacity(prefixEnabled.wrappedValue ? 1.0 : 0.5)
                        .scrollContentBackground(.hidden)

                    Button("Reset to default") {
                        promptPrefix = ""
                    }
                    .font(.system(size: 13))
                    .foregroundStyle(Color(hex: "#888888"))
                } header: {
                    Text("Prompt prefix")
                } footer: {
                    Text("When enabled, this text is prepended before each copied chunk or summary.")
                }

                Section {
                    Button {
                        exportProgress()
                    } label: {
                        HStack {
                            Image(systemName: "square.and.arrow.up")
                            Text("Export progress")
                        }
                    }

                    Button {
                        showImporter = true
                    } label: {
                        HStack {
                            Image(systemName: "square.and.arrow.down")
                            Text("Import progress")
                        }
                    }

                    if let importResult {
                        Text(importResult)
                            .font(.system(size: 12))
                            .foregroundStyle(Color(hex: "#6dbf6d"))
                    }
                } header: {
                    Text("Progress")
                } footer: {
                    Text("Export sent chunks, action completion, and prefix settings as JSON.")
                }

                Section {
                    Toggle(isOn: Binding(
                        get: { notifEnabled },
                        set: { v in
                            if v {
                                Task {
                                    let granted = await NotificationManager.shared.requestPermission()
                                    notifEnabled = granted
                                    if granted { reschedule() }
                                }
                            } else {
                                notifEnabled = false
                                NotificationManager.shared.cancelAll()
                            }
                        }
                    )) {
                        Text("Daily Reading Reminders")
                            .font(.system(size: 15))
                    }
                    .tint(ACCENT)

                    if notifEnabled {
                        DatePicker(
                            "Time",
                            selection: Binding(
                                get: {
                                    var comps = DateComponents()
                                    comps.hour = notifHour
                                    comps.minute = notifMinute
                                    return Calendar.current.date(from: comps) ?? Date()
                                },
                                set: { date in
                                    let comps = Calendar.current.dateComponents([.hour, .minute], from: date)
                                    notifHour = comps.hour ?? 9
                                    notifMinute = comps.minute ?? 0
                                    reschedule()
                                }
                            ),
                            displayedComponents: .hourAndMinute
                        )

                        HStack(spacing: 8) {
                            let labels = ["S", "M", "T", "W", "T", "F", "S"]
                            ForEach(1...7, id: \.self) { d in
                                let selected = notifWeekdays.contains(d)
                                Button {
                                    toggleWeekday(d)
                                } label: {
                                    Text(labels[d - 1])
                                        .font(.system(size: 13, weight: .semibold))
                                        .frame(width: 32, height: 32)
                                        .background(selected ? ACCENT : Color(hex: "#1e1e1e"))
                                        .foregroundStyle(selected ? ACCENT_INK : Color(hex: "#b0b0b0"))
                                        .clipShape(Circle())
                                        .overlay(Circle().stroke(selected ? ACCENT : Color(hex: "#2e2e2e"), lineWidth: 1))
                                }
                                .buttonStyle(.plain)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                } header: {
                    Text("Reminders")
                } footer: {
                    Text("Sends a local notification on selected days at the chosen time.")
                }

                Section {
                    HStack {
                        Label("Current streak", systemImage: "flame")
                        Spacer()
                        Text(streak.currentStreak == 1 ? "1 day" : "\(streak.currentStreak) days")
                            .foregroundStyle(ACCENT)
                            .fontWeight(.semibold)
                    }
                    HStack {
                        Label("Longest streak", systemImage: "trophy")
                        Spacer()
                        Text(streak.longestStreak == 1 ? "1 day" : "\(streak.longestStreak) days")
                            .foregroundStyle(Color(hex: "#b0b0b0"))
                    }
                } header: {
                    Text("Reading Streak")
                } footer: {
                    Text("A day counts when you mark at least one chunk sent or complete one action.")
                }

                Section {
                    Button(role: .destructive) {
                        showResetAlert = true
                    } label: {
                        HStack {
                            Image(systemName: "trash")
                            Text("Reset all progress")
                        }
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(Color(hex: "#0f0f0f"))
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbarBackground(Color(hex: "#0f0f0f"), for: .navigationBar)
            .toolbarBackground(.visible, for: .navigationBar)
            .toolbarColorScheme(.dark, for: .navigationBar)
            .alert("Reset all progress?", isPresented: $showResetAlert) {
                Button("Cancel", role: .cancel) {}
                Button("Reset", role: .destructive) {
                    resetAll()
                }
            } message: {
                Text("This clears every sent chunk, action, and prefix setting. Can't be undone.")
            }
            .fileImporter(
                isPresented: $showImporter,
                allowedContentTypes: [.json],
                allowsMultipleSelection: false
            ) { result in
                handleImport(result: result)
            }
            .sheet(isPresented: $showExporter) {
                if let exportURL {
                    ShareSheet(items: [exportURL])
                        .presentationDetents([.medium, .large])
                }
            }
        }
    }

    private func exportProgress() {
        let data = allProgressKeys()
        guard let json = try? JSONSerialization.data(
            withJSONObject: data,
            options: [.prettyPrinted, .sortedKeys]
        ) else { return }

        let fm = FileManager.default
        let tmpDir = fm.temporaryDirectory
        let url = tmpDir.appendingPathComponent("ash-reader-progress.json")
        do {
            try json.write(to: url, options: .atomic)
            exportURL = url
            showExporter = true
        } catch {
            importResult = "Export failed: \(error.localizedDescription)"
        }
    }

    private func allProgressKeys() -> [String: Any] {
        let defaults = UserDefaults.standard
        let dict = defaults.dictionaryRepresentation()
        var out: [String: Any] = [:]
        for (k, v) in dict where k.hasPrefix(USER_DEFAULTS_PREFIX) {
            out[k] = v
        }
        return out
    }

    private func handleImport(result: Result<[URL], Error>) {
        switch result {
        case .failure(let err):
            importResult = "Import failed: \(err.localizedDescription)"
        case .success(let urls):
            guard let url = urls.first else { return }
            let needsScope = url.startAccessingSecurityScopedResource()
            defer { if needsScope { url.stopAccessingSecurityScopedResource() } }
            do {
                let data = try Data(contentsOf: url)
                guard let parsed = try JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                    importResult = "Invalid JSON format."
                    return
                }
                var count = 0
                for (k, v) in parsed where k.hasPrefix(USER_DEFAULTS_PREFIX) {
                    if let arr = v as? [Int] {
                        SyncedStore.shared.setIntArray(arr, forKey: k)
                    } else if let str = v as? String {
                        SyncedStore.shared.setString(str, forKey: k)
                    } else {
                        UserDefaults.standard.set(v, forKey: k)
                    }
                    count += 1
                }
                importResult = "Imported \(count) keys. Restart the app to see changes."
            } catch {
                importResult = "Import failed: \(error.localizedDescription)"
            }
        }
    }

    private func resetAll() {
        for key in SyncedStore.shared.allKeys(withPrefix: USER_DEFAULTS_PREFIX) where key != "ash_reader_ios_migrated" {
            SyncedStore.shared.removeObject(forKey: key)
        }
        // Also clear any UserDefaults-only keys (Bool/Int settings not routed through SyncedStore)
        for key in UserDefaults.standard.dictionaryRepresentation().keys where key.hasPrefix(USER_DEFAULTS_PREFIX) && key != "ash_reader_ios_migrated" {
            UserDefaults.standard.removeObject(forKey: key)
        }
        importResult = "All progress cleared. Restart the app to see changes."
    }
}

