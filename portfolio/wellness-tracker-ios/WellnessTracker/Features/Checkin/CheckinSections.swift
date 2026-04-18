import SwiftUI

private func anyInt(_ v: Any?) -> Int? {
    if let i = v as? Int { return i }
    if let d = v as? Double { return Int(d) }
    return nil
}

private func anyString(_ v: Any?) -> String? { v as? String }

private func stringArray(_ v: Any?) -> [String] {
    (v as? [String]) ?? []
}

// MARK: - Sleep

struct SleepSectionView: View {
    @ObservedObject var store: WellnessStore
    private let section = "sleep"

    private var d: [String: Any] { store.formData[section] ?? [:] }
    private func set(_ key: String, _ value: Any?) {
        store.setSectionField(section: section, key: key, value: value)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            WTSectionLabel(num: 1, "After last night's Trazodone, I fell asleep...")
            ForEach(
                [
                    ("never", "🔴", "Never really fell asleep / took forever"),
                    ("over_hour", "🟠", "Eventually — took over an hour"),
                    ("30_60", "🟡", "Within 30–60 minutes"),
                    ("under_30", "🟢", "Within 30 minutes or less"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: anyString(d["onset"]) == v) { set("onset", v) }
            }

            WTDivider()
            WTSectionLabel(num: 2, "During the night I...")
            ForEach(
                [
                    ("struggled", "🔴", "Woke multiple times, struggled to get back to sleep"),
                    ("few_times", "🟠", "Woke a few times but fell back asleep"),
                    ("once", "🟡", "Woke once — got back to sleep okay"),
                    ("through", "🟢", "Slept mostly straight through"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: anyString(d["staying"]) == v) { set("staying", v) }
            }

            WTDivider()
            WTSectionLabel(num: 3, "Sleep quality felt... (1–10)")
            WTRatingRow(value: anyInt(d["quality"])) { set("quality", $0) }

            WTDivider()
            WTSectionLabel(num: 4, "Waking up this morning felt...")
            ForEach(
                [
                    ("drugged", "🔴", "Couldn't get up — felt drugged or groggy for hours"),
                    ("rough", "🟠", "Pretty rough — took a long time to feel alert"),
                    ("slow", "🟡", "A little slow — wore off within an hour"),
                    ("normal", "🟢", "Normal — felt okay getting up"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: anyString(d["groggy"]) == v) { set("groggy", v) }
            }

            WTDivider()
            WTSectionLabel(num: 5, "Trazodone dose last night")
            FlowChips(items: ["50mg", "75mg", "100mg", "Skipped"], selected: anyString(d["dose"])) { set("dose", $0) }

            WTDivider()
            WTSectionLabel(num: 6, "Hours slept (approximate)")
            FlowChips(
                items: ["< 4hrs", "4–5hrs", "5–6hrs", "6–7hrs", "7–8hrs", "8+ hrs"],
                selected: anyString(d["hours"])
            ) { set("hours", $0) }

            WTDivider()
            ouraBlock
        }
    }

    private var ouraBlock: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Oura Scores (optional)")
                .font(.caption.weight(.bold))
                .foregroundStyle(WellnessTheme.muted)
            ouraRow("ouraReadiness", "Readiness", WellnessTheme.accent)
            ouraRow("ouraSleep", "Sleep", WellnessTheme.blue)
            ouraRow("ouraHrv", "HRV", Color(red: 0.48, green: 0.37, blue: 0.65))
        }
        .padding(14)
        .background(WellnessTheme.faint)
        .overlay(RoundedRectangle(cornerRadius: 10).stroke(WellnessTheme.border))
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }

    private func ouraRow(_ key: String, _ label: String, _ tint: Color) -> some View {
        HStack {
            Text(label).font(.subheadline.weight(.semibold)).foregroundStyle(WellnessTheme.text)
            Spacer()
            TextField("—", text: Binding(
                get: {
                    if let n = anyInt(d[key]) { return "\(n)" }
                    return ""
                },
                set: {
                    let t = $0.trimmingCharacters(in: .whitespacesAndNewlines)
                    if t.isEmpty { set(key, nil); return }
                    if let v = Int(t) { set(key, v) }
                }
            ))
            .font(.body)
            .keyboardType(.numberPad)
            .multilineTextAlignment(.center)
            .frame(width: 64)
            .padding(6)
            .background(anyInt(d[key]) != nil ? tint.opacity(0.12) : WellnessTheme.surface)
            .overlay(RoundedRectangle(cornerRadius: 6).stroke(anyInt(d[key]) != nil ? tint : WellnessTheme.border, lineWidth: 1.5))
            .clipShape(RoundedRectangle(cornerRadius: 6))
            .foregroundStyle(anyInt(d[key]) != nil ? tint : WellnessTheme.muted)
        }
    }
}

// MARK: - Chip grid (wrap)

private struct FlowChips: View {
    let items: [String]
    let selected: String?
    let onSelect: (String) -> Void

    var body: some View {
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 100), spacing: 6)], spacing: 6) {
            ForEach(items, id: \.self) { item in
                WTMultiChip(label: item, selected: selected == item) { onSelect(item) }
            }
        }
    }
}

private struct ChipGrid<Content: View>: View {
    @ViewBuilder var content: () -> Content

    var body: some View {
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 120), spacing: 6)], spacing: 6, content: content)
    }
}

// MARK: - Morning start

struct MorningStartSectionView: View {
    @ObservedObject var store: WellnessStore
    private let section = "morning_start"

    private var d: [String: Any] { store.formData[section] ?? [:] }
    private func set(_ key: String, _ value: Any?) {
        store.setSectionField(section: section, key: key, value: value)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Best time: Right after your 7–8am meds.")
                .font(.caption)
                .foregroundStyle(WellnessTheme.accent)
                .padding(12)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(WellnessTheme.accentLight)
                .clipShape(RoundedRectangle(cornerRadius: 8))
                .padding(.bottom, 12)

            WTSectionLabel(num: 1, "How am I waking up feeling today...")
            ForEach(
                [
                    ("rough", "🔴", "Rough — dreading the day, low energy"),
                    ("low", "🟠", "Low — not great but I'll get through it"),
                    ("neutral", "🟡", "Neutral — nothing remarkable"),
                    ("okay", "🟢", "Okay — feeling decent"),
                    ("good", "💚", "Good — actually ready for today"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: anyString(d["morningFeel"]) == v) { set("morningFeel", v) }
            }

            WTDivider()
            WTSectionLabel(num: 2, "Medications taken this morning")
            ChipGrid {
                ForEach(store.meds, id: \.self) { m in
                    let sel = stringArray(d["morningMeds"]).contains(m)
                    WTMultiChip(label: m, selected: sel) {
                        var arr = stringArray(d["morningMeds"])
                        if sel { arr.removeAll { $0 == m } } else { arr.append(m) }
                        set("morningMeds", arr)
                    }
                }
            }

            WTDivider()
            WTSectionLabel(num: 3, "Today's capacity — focused hours")
            ForEach(
                [
                    ("survival", "😔", "Survival — 1 hour or less"),
                    ("limited", "😐", "Limited — 1–2 hours"),
                    ("average", "🙂", "Average — 2–4 hours"),
                    ("strong", "💪", "Strong — 4+ hours"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: anyString(d["capacity"]) == v) { set("capacity", v) }
            }

            WTDivider()
            WTSectionLabel(num: 4, "Medication timing (optional)")
            ForEach(medTimeRows, id: \.key) { row in
                medTimeRow(key: row.key, label: row.label, color: row.color)
            }

            WTDivider()
            WTSectionLabel(num: 5, "Anything already on my mind this morning...")
            TextField("Optional note", text: Binding(
                get: { anyString(d["morningNote"]) ?? "" },
                set: { set("morningNote", $0.isEmpty ? nil : $0) }
            ), axis: .vertical)
            .lineLimit(2 ... 6)
            .textFieldStyle(.plain)
            .padding(12)
            .background(WellnessTheme.surface)
            .overlay(RoundedRectangle(cornerRadius: 8).stroke(WellnessTheme.border))
            .foregroundStyle(WellnessTheme.text)
        }
    }

    private var medTimeRows: [(key: String, label: String, color: Color)] {
        [
            ("timeSertraline", "Sertraline 200mg", WellnessTheme.blue),
            ("timeAdderall1", "Adderall 20mg (1st)", Color(red: 0.83, green: 0.63, blue: 0.09)),
            ("timeWellbutrin", "Wellbutrin 150mg", WellnessTheme.accent),
            ("timeBuspar1", "Buspar 10mg (AM)", WellnessTheme.purple),
            ("timeAdderall2", "Adderall 20mg (2nd)", Color(red: 0.77, green: 0.38, blue: 0.18)),
            ("timeBuspar2", "Buspar 10mg (PM)", WellnessTheme.purple),
        ]
    }

    private func medTimeRow(key: String, label: String, color: Color) -> some View {
        HStack {
            Text(label).font(.caption).foregroundStyle(WellnessTheme.text)
            Spacer()
            if let t = anyString(d[key]) {
                Text(t).font(.caption.weight(.bold)).foregroundStyle(color)
            }
            Button(anyString(d[key]) == nil ? "Tap to log" : "✓ Logged") {
                if anyString(d[key]) != nil {
                    set(key, nil)
                } else {
                    let now = Date()
                    let t = now.formatted(date: .omitted, time: .shortened)
                    set(key, t)
                }
            }
            .font(.caption.weight(.semibold))
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(anyString(d[key]) != nil ? color.opacity(0.15) : WellnessTheme.surface)
            .foregroundStyle(anyString(d[key]) != nil ? color : WellnessTheme.muted)
            .overlay(RoundedRectangle(cornerRadius: 6).stroke(anyString(d[key]) != nil ? color : WellnessTheme.border))
        }
        .padding(.vertical, 6)
    }
}

// MARK: - Med check-in

struct MedCheckinSectionView: View {
    @ObservedObject var store: WellnessStore
    @State private var editMeds = false
    @State private var newMed = ""
    private let section = "med_checkin"

    private var d: [String: Any] { store.formData[section] ?? [:] }
    private func set(_ key: String, _ value: Any?) {
        store.setSectionField(section: section, key: key, value: value)
    }

    private let sideEffectOptions = [
        "Headache", "Nausea", "Appetite down", "Appetite up",
        "Trouble sleeping", "Irritable", "Too wired", "Too flat / numb",
        "Racing heart", "Increased anxiety", "Mood crash", "Morning grogginess",
    ]

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack {
                Text("Daily medication tracking")
                    .font(.caption)
                    .foregroundStyle(WellnessTheme.blue)
                Spacer()
                Button("⚙️") { editMeds.toggle() }
                    .foregroundStyle(WellnessTheme.blue)
            }
            .padding(12)
            .background(WellnessTheme.blueLight)
            .clipShape(RoundedRectangle(cornerRadius: 8))

            if editMeds {
                VStack(alignment: .leading, spacing: 8) {
                    ChipGrid {
                        ForEach(store.meds, id: \.self) { m in
                            Button("\(m) ✕") {
                                store.updateMeds(store.meds.filter { $0 != m })
                            }
                            .font(.caption)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(WellnessTheme.surface)
                            .foregroundStyle(WellnessTheme.text)
                            .overlay(Capsule().stroke(WellnessTheme.border))
                        }
                    }
                    HStack {
                        TextField("Add medication", text: $newMed)
                            .textFieldStyle(.roundedBorder)
                        Button("Add") {
                            let t = newMed.trimmingCharacters(in: .whitespacesAndNewlines)
                            guard !t.isEmpty, !store.meds.contains(t) else { return }
                            store.updateMeds(store.meds + [t])
                            newMed = ""
                        }
                        .buttonStyle(.borderedProminent)
                        .tint(WellnessTheme.blue)
                    }
                }
                .padding(12)
                .background(WellnessTheme.faint)
                .overlay(RoundedRectangle(cornerRadius: 8).stroke(WellnessTheme.border))
                .padding(.vertical, 8)
            }

            WTSectionLabel(num: 1, "Focus today (1-10)")
            WTNumberGrid(value: anyInt(d["focusScore"]), color: WellnessTheme.warn) { set("focusScore", $0) }
            chipMulti("taskAbility", ["Start tasks", "Stay on track", "Finish tasks", "Felt scattered"])

            WTDivider()
            WTSectionLabel(num: 2, "Mood today (1-10)")
            WTNumberGrid(value: anyInt(d["medMoodScore"]), color: WellnessTheme.blue) { set("medMoodScore", $0) }
            chipMulti("moodState", ["Calm", "Overwhelmed", "Low / down", "Emotionally steady"])

            WTDivider()
            WTSectionLabel(num: 3, "Anxiety today (1-10)")
            WTNumberGrid(value: anyInt(d["anxietyScore"]), color: WellnessTheme.purple) { set("anxietyScore", $0) }

            WTDivider()
            WTSectionLabel(num: 4, "Energy today")
            HStack(spacing: 8) {
                ForEach(["Low", "Medium", "High"], id: \.self) { v in
                    Button(v) {
                        set("energyLevel", v)
                    }
                    .font(.subheadline.weight(.bold))
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .background(anyString(d["energyLevel"]) == v ? WellnessTheme.accentLight : WellnessTheme.surface)
                    .foregroundStyle(anyString(d["energyLevel"]) == v ? WellnessTheme.accent : WellnessTheme.muted)
                    .overlay(RoundedRectangle(cornerRadius: 8).stroke(anyString(d["energyLevel"]) == v ? WellnessTheme.accent : WellnessTheme.border, lineWidth: 2))
                }
            }
            chipMulti("energyState", ["Motivated", "Restless / jittery", "Calm / steady", "Fatigued"])

            WTDivider()
            WTSectionLabel(num: 5, "Side effects today")
            WTMultiChip(label: "None", selected: stringArray(d["sideEffectList"]).contains("None")) {
                set("sideEffectList", ["None"])
            }
            ChipGrid {
                ForEach(sideEffectOptions, id: \.self) { e in
                    let list = stringArray(d["sideEffectList"]).filter { $0 != "None" }
                    WTMultiChip(label: e, selected: list.contains(e)) {
                        var next = list
                        if next.contains(e) { next.removeAll { $0 == e } } else { next.append(e) }
                        set("sideEffectList", next.isEmpty ? ["None"] : next)
                    }
                }
            }
            if !stringArray(d["sideEffectList"]).filter({ $0 != "None" }).isEmpty {
                TextField("Other side effects", text: Binding(
                    get: { anyString(d["sideEffectOther"]) ?? "" },
                    set: { set("sideEffectOther", $0.isEmpty ? nil : $0) }
                ))
                .padding(10)
                .background(WellnessTheme.surface)
                .overlay(RoundedRectangle(cornerRadius: 8).stroke(WellnessTheme.border))
                .foregroundStyle(WellnessTheme.text)
                .padding(.top, 8)
            }

            WTDivider()
            WTSectionLabel(num: 6, "Adderall timing today")
            DatePicker(
                "Wore off around",
                selection: Binding(
                    get: {
                        if let s = anyString(d["adderallWoreOff"]), let t = TimeFromString.parse(s) { return t }
                        return Calendar.current.date(from: DateComponents(hour: 12, minute: 0)) ?? Date()
                    },
                    set: { set("adderallWoreOff", TimeFromString.format($0)) }
                ),
                displayedComponents: .hourAndMinute
            )
            .labelsHidden()
            .padding(.bottom, 8)
            ChipGrid {
                ForEach(["Smooth", "Crash", "Not sure"], id: \.self) { v in
                    WTMultiChip(label: v, selected: anyString(d["adderallTiming"]) == v) {
                        set("adderallTiming", v)
                    }
                }
            }

            WTDivider()
            WTSectionLabel(num: 7, "Overall, today dose felt...")
            ForEach(
                [
                    ("helpful", "Helpful - worked the way it should"),
                    ("not_enough", "Not enough - could have used more support"),
                    ("too_much", "Too much - overstimulated or wired"),
                    ("skipped", "Only took one dose / skipped today"),
                ],
                id: \.0
            ) { v, l in
                WTChoiceButton(emoji: nil, label: l, selected: anyString(d["doseFelt"]) == v) { set("doseFelt", v) }
            }

            WTDivider()
            WTSectionLabel(num: 8, "Notes for your doctor (optional)")
            TextField("", text: Binding(
                get: { anyString(d["medNotes"]) ?? "" },
                set: { set("medNotes", $0.isEmpty ? nil : $0) }
            ), axis: .vertical)
            .lineLimit(3 ... 8)
            .padding(12)
            .background(WellnessTheme.surface)
            .overlay(RoundedRectangle(cornerRadius: 8).stroke(WellnessTheme.border))
            .foregroundStyle(WellnessTheme.text)
        }
    }

    private func chipMulti(_ field: String, _ options: [String]) -> some View {
        ChipGrid {
            ForEach(options, id: \.self) { opt in
                let list = stringArray(d[field])
                WTMultiChip(label: opt, selected: list.contains(opt)) {
                    var next = list
                    if next.contains(opt) { next.removeAll { $0 == opt } } else { next.append(opt) }
                    set(field, next)
                }
            }
        }
        .padding(.top, 6)
    }
}

private enum TimeFromString {
    static func parse(_ s: String) -> Date? {
        let f = DateFormatter()
        f.dateFormat = "HH:mm"
        return f.date(from: s)
    }

    static func format(_ d: Date) -> String {
        let f = DateFormatter()
        f.dateFormat = "HH:mm"
        return f.string(from: d)
    }
}
