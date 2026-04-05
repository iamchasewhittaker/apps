import SwiftUI

private func hAnyString(_ v: Any?) -> String? { v as? String }

private func hStringArray(_ v: Any?) -> [String] {
    (v as? [String]) ?? []
}

// MARK: - Health & lifestyle

struct HealthLifestyleSectionView: View {
    @ObservedObject var store: WellnessStore
    private let section = "health_lifestyle"

    private var d: [String: Any] { store.formData[section] ?? [:] }
    private func set(_ key: String, _ value: Any?) {
        store.setSectionField(section: section, key: key, value: value)
    }

    private let exerciseTypes = ["Walking / hiking", "Weightlifting", "Cardio", "Yoga / stretching", "Sports", "Physical work", "None today"]
    private let stressSources = ["Work / job search", "Family / parenting", "Finances", "Health / medical", "Relationships", "Nothing specific", "No real stress today"]

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            WTSectionLabel(num: 1, "Physical energy today...")
            ForEach(
                [
                    ("exhausted", "🔴", "Exhausted / running on empty"),
                    ("low", "🟠", "Low — got through it but felt drained"),
                    ("okay", "🟡", "Okay — average"),
                    ("good", "🟢", "Good — felt physically well"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: hAnyString(d["energy"]) == v) { set("energy", v) }
            }

            WTDivider()
            WTSectionLabel(num: 2, "Exercise or movement today...")
            ForEach(
                [
                    ("none", "🔴", "None — sedentary most of the day"),
                    ("light", "🟡", "Light — short walk, stretching"),
                    ("moderate", "🟢", "Moderate — 20–40 min workout"),
                    ("heavy", "💚", "Heavy — intense training"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: hAnyString(d["exercise"]) == v) { set("exercise", v) }
            }
            Text("Type of movement (select all)").font(.caption).foregroundStyle(WellnessTheme.muted).padding(.top, 8)
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 130), spacing: 6)], spacing: 6) {
                ForEach(exerciseTypes, id: \.self) { t in
                    let arr = hStringArray(d["exerciseTypes"])
                    WTMultiChip(label: t, selected: arr.contains(t)) {
                        var n = arr
                        if n.contains(t) { n.removeAll { $0 == t } } else { n.append(t) }
                        set("exerciseTypes", n)
                    }
                }
            }
            if (hAnyString(d["exercise"]) ?? "") != "none" {
                Text("Exercise affected my mood/energy...").font(.caption).foregroundStyle(WellnessTheme.muted).padding(.top, 8)
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 120), spacing: 6)], spacing: 6) {
                    ForEach(["Significantly helped", "Helped a little", "No noticeable effect", "Actually drained me"], id: \.self) { e in
                        WTMultiChip(label: e, selected: hAnyString(d["exerciseEffect"]) == e) { set("exerciseEffect", e) }
                    }
                }
            }

            WTDivider()
            WTSectionLabel(num: 3, "Eating today...")
            ForEach(
                [
                    ("barely", "🔴", "Barely ate — skipped meals"),
                    ("less", "🟠", "Ate less than usual"),
                    ("okay", "🟡", "Okay — hit the basics"),
                    ("good", "🟢", "Good — ate well"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: hAnyString(d["eating"]) == v) { set("eating", v) }
            }

            WTDivider()
            WTSectionLabel(num: 4, "Meal timing today...")
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 140), spacing: 6)], spacing: 6) {
                ForEach(["Skipped breakfast/lunch", "Ate late in the day", "Somewhat regular times", "Consistent meals all day"], id: \.self) { t in
                    WTMultiChip(label: t, selected: hAnyString(d["mealTiming"]) == t) { set("mealTiming", t) }
                }
            }

            WTDivider()
            WTSectionLabel(num: 5, "Food quality today was mostly...")
            ForEach(
                [
                    ("junk", "🔴", "Processed / fast food / junk"),
                    ("mixed", "🟠", "Mixed"),
                    ("decent", "🟡", "Decent — mostly whole foods"),
                    ("good", "🟢", "Good — nutritious"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: hAnyString(d["foodQuality"]) == v) { set("foodQuality", v) }
            }

            WTDivider()
            WTSectionLabel(num: 6, "Sugar / junk food today...")
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 120), spacing: 6)], spacing: 6) {
                ForEach(["Heavy — multiple times", "Some — a treat or two", "Minimal", "None"], id: \.self) { s in
                    WTMultiChip(label: s, selected: hAnyString(d["sugar"]) == s) { set("sugar", s) }
                }
            }

            WTDivider()
            WTSectionLabel(num: 7, "Water intake today...")
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 120), spacing: 6)], spacing: 6) {
                ForEach(["Poor — mostly caffeine/soda", "Okay — some water", "Good — well hydrated"], id: \.self) { w in
                    WTMultiChip(label: w, selected: hAnyString(d["water"]) == w) { set("water", w) }
                }
            }

            WTDivider()
            WTSectionLabel(num: 8, "Stress level today...")
            ForEach(
                [
                    ("overwhelming", "🔴", "Overwhelming"),
                    ("high", "🟠", "High — managing but hard"),
                    ("moderate", "🟡", "Moderate"),
                    ("low", "🟢", "Low — relaxed"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: hAnyString(d["stress"]) == v) { set("stress", v) }
            }
            Text("Stress mainly from... (select all)").font(.caption).foregroundStyle(WellnessTheme.muted).padding(.top, 8)
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 120), spacing: 6)], spacing: 6) {
                ForEach(stressSources, id: \.self) { s in
                    let arr = hStringArray(d["stressSources"])
                    WTMultiChip(label: s, selected: arr.contains(s)) {
                        var n = arr
                        if n.contains(s) { n.removeAll { $0 == s } } else { n.append(s) }
                        set("stressSources", n)
                    }
                }
            }

            WTDivider()
            WTSectionLabel(num: 9, "Social interaction today felt...")
            ForEach(
                [
                    ("isolated", "🔴", "Completely isolated"),
                    ("minimal", "🟠", "Mostly alone"),
                    ("some", "🟡", "Some interaction"),
                    ("connected", "🟢", "Connected"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: hAnyString(d["social"]) == v) { set("social", v) }
            }

            WTDivider()
            WTSectionLabel(num: 10, "Recreational screen time today...")
            ForEach(
                [
                    ("5plus", "🔴", "5+ hours"),
                    ("3_5", "🟠", "3–5 hours"),
                    ("1_3", "🟡", "1–3 hours"),
                    ("under_1", "🟢", "Under 1 hour"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: hAnyString(d["screenTime"]) == v) { set("screenTime", v) }
            }

            WTDivider()
            WTSectionLabel(num: 11, "Time outside / sunlight today...")
            LazyVGrid(columns: [GridItem(.adaptive(minimum: 100), spacing: 6)], spacing: 6) {
                ForEach(["None", "Under 15 min", "15–30 min", "30–60 min", "60+ min"], id: \.self) { t in
                    WTMultiChip(label: t, selected: hAnyString(d["sunlight"]) == t) { set("sunlight", t) }
                }
            }

            WTDivider()
            WTSectionLabel(num: 12, "Faith / spiritual practice today...")
            ForEach(
                [
                    ("none", "⚪", "None"),
                    ("brief", "🟡", "Brief"),
                    ("moderate", "🟢", "Moderate"),
                    ("meaningful", "💚", "Meaningful"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: hAnyString(d["faith"]) == v) { set("faith", v) }
            }
            if hAnyString(d["faith"]) != nil && hAnyString(d["faith"]) != "none" {
                Text("Faith felt like...").font(.caption).foregroundStyle(WellnessTheme.muted).padding(.top, 8)
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 120), spacing: 6)], spacing: 6) {
                    ForEach(["A source of peace today", "Neutral — went through motions", "Struggled / felt distant"], id: \.self) { f in
                        WTMultiChip(label: f, selected: hAnyString(d["faithQuality"]) == f) { set("faithQuality", f) }
                    }
                }
            }

            WTDivider()
            WTSectionLabel(num: 13, "Caffeine today...")
            ForEach(
                [
                    ("none", "⚪", "None"),
                    ("light", "🟢", "Light — 1 drink, before noon"),
                    ("moderate", "🟡", "Moderate"),
                    ("heavy", "🔴", "Heavy — 3+ or into evening"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: hAnyString(d["caffeine"]) == v) { set("caffeine", v) }
            }

            WTDivider()
            WTSectionLabel(num: 14, "After caffeine today I felt...")
            ForEach(
                [
                    ("anxious", "🔴", "More anxious or jittery"),
                    ("racing", "🔴", "Heart racing or overstimulated"),
                    ("fine", "🟢", "Fine"),
                    ("focused", "🟢", "Helped focus"),
                    ("na", "⚪", "Didn't have caffeine"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: hAnyString(d["caffeineEffect"]) == v) { set("caffeineEffect", v) }
            }
        }
    }
}

// MARK: - End of day

struct EndOfDaySectionView: View {
    @ObservedObject var store: WellnessStore
    private let section = "end_of_day"

    private var d: [String: Any] { store.formData[section] ?? [:] }
    private func set(_ key: String, _ value: Any?) {
        store.setSectionField(section: section, key: key, value: value)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            WTSectionLabel(num: 1, "Overall, today felt like...")
            ForEach(
                [
                    ("hardest", "🔴", "One of my harder days"),
                    ("rough", "🟠", "Rough but got through it"),
                    ("average", "🟡", "Average"),
                    ("good", "🟢", "A good day"),
                    ("best", "💚", "One of my better days lately"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: hAnyString(d["overall"]) == v) { set("overall", v) }
            }

            WTDivider()
            WTSectionLabel(num: 2, "Compared to yesterday, today felt...")
            ForEach(
                [
                    ("much_worse", "🔴", "Much worse"),
                    ("little_worse", "🟠", "A little worse"),
                    ("same", "🟡", "About the same"),
                    ("little_better", "🟢", "A little better"),
                    ("much_better", "💚", "Much better"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: hAnyString(d["vsYesterday"]) == v) { set("vsYesterday", v) }
            }

            WTDivider()
            WTSectionLabel(num: 3, "Money — uncertain spending today?")
            ForEach(
                [
                    ("significant", "🔴", "Yes — regret or weighing on me"),
                    ("small", "🟠", "Small purchase — not sure"),
                    ("maybe", "🟡", "Maybe need vs want blur"),
                    ("no", "🟢", "No — felt good about spending"),
                ],
                id: \.0
            ) { v, e, l in
                WTChoiceButton(emoji: e, label: l, selected: hAnyString(d["unplanned"]) == v) { set("unplanned", v) }
            }

            if let u = hAnyString(d["unplanned"]), u != "no" {
                WTDivider()
                WTSectionLabel(num: 4, "Before spending I felt... (select all)")
                LazyVGrid(columns: [GridItem(.adaptive(minimum: 120), spacing: 6)], spacing: 6) {
                    ForEach(["Anxious or stressed", "Bored", "Excited / impulsive", "Justified — genuinely needed it"], id: \.self) { f in
                        let arr = hStringArray(d["beforeSpending"])
                        WTMultiChip(label: f, selected: arr.contains(f)) {
                            var n = arr
                            if n.contains(f) { n.removeAll { $0 == f } } else { n.append(f) }
                            set("beforeSpending", n)
                        }
                    }
                }
            }

            WTDivider()
            WTSectionLabel(num: 5, "Today in one word...")
            TextField("e.g. foggy, hopeful", text: Binding(
                get: { hAnyString(d["oneWord"]) ?? "" },
                set: { set("oneWord", $0.isEmpty ? nil : $0) }
            ))
            .padding(12)
            .background(WellnessTheme.surface)
            .overlay(RoundedRectangle(cornerRadius: 8).stroke(WellnessTheme.border))
            .foregroundStyle(WellnessTheme.text)

            WTDivider()
            WTSectionLabel(num: 6, "Biggest thing that affected my day...")
            TextField("", text: Binding(
                get: { hAnyString(d["biggestThing"]) ?? "" },
                set: { set("biggestThing", $0.isEmpty ? nil : $0) }
            ), axis: .vertical)
            .lineLimit(2 ... 6)
            .padding(12)
            .background(WellnessTheme.surface)
            .overlay(RoundedRectangle(cornerRadius: 8).stroke(WellnessTheme.border))
            .foregroundStyle(WellnessTheme.text)

            WTDivider()
            WTSectionLabel(num: 7, "One thing I want my doctor to know (optional)")
            TextField("", text: Binding(
                get: { hAnyString(d["doctorNote"]) ?? "" },
                set: { set("doctorNote", $0.isEmpty ? nil : $0) }
            ), axis: .vertical)
            .lineLimit(2 ... 6)
            .padding(12)
            .background(WellnessTheme.surface)
            .overlay(RoundedRectangle(cornerRadius: 8).stroke(WellnessTheme.border))
            .foregroundStyle(WellnessTheme.text)

            WTDivider()
            VStack(alignment: .leading, spacing: 8) {
                WTSectionLabel(num: 8, "What does tomorrow need to be about?")
                Text("One word or one sentence for morning-you.")
                    .font(.caption)
                    .foregroundStyle(WellnessTheme.muted)
                TextField("e.g. rest, job search", text: Binding(
                    get: { hAnyString(d["tomorrowFocus"]) ?? "" },
                    set: { set("tomorrowFocus", $0.isEmpty ? nil : $0) }
                ))
                .padding(12)
                .background(WellnessTheme.surface)
                .overlay(RoundedRectangle(cornerRadius: 8).stroke(WellnessTheme.blue.opacity(0.5)))
                .foregroundStyle(WellnessTheme.text)
            }
            .padding(14)
            .background(WellnessTheme.blueLight)
            .overlay(RoundedRectangle(cornerRadius: 10).stroke(WellnessTheme.blue.opacity(0.3)))
            .clipShape(RoundedRectangle(cornerRadius: 10))
        }
    }
}
