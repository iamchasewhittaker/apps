import SwiftUI

/// Optional stretch: read-only list of saved days (no charts).
struct PastDaysView: View {
    @ObservedObject var store: WellnessStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        List {
            ForEach(Array(store.entries.enumerated()), id: \.offset) { _, entry in
                NavigationLink {
                    PastDayDetailView(entry: entry)
                } label: {
                    PastDayRow(entry: entry)
                }
                .listRowBackground(WellnessTheme.surface)
            }
        }
        .scrollContentBackground(.hidden)
        .background(WellnessTheme.bg)
        .navigationTitle("Past days")
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button("Done") { dismiss() }
                    .foregroundStyle(WellnessTheme.accent)
            }
        }
    }
}

private struct PastDayRow: View {
    let entry: [String: Any]

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(dateLabel)
                .font(.headline)
                .foregroundStyle(WellnessTheme.text)
            HStack {
                if entry["morningDone"] as? Bool == true {
                    Text("Morning").font(.caption).foregroundStyle(WellnessTheme.accent)
                }
                if entry["eveningDone"] as? Bool == true {
                    Text("Evening").font(.caption).foregroundStyle(WellnessTheme.accent)
                }
            }
        }
    }

    private var dateLabel: String {
        guard let s = entry["date"] as? String else { return "—" }
        let f1 = ISO8601DateFormatter()
        f1.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        let f2 = ISO8601DateFormatter()
        f2.formatOptions = [.withInternetDateTime]
        guard let d = f1.date(from: s) ?? f2.date(from: s) else { return "—" }
        return d.formatted(date: .abbreviated, time: .omitted)
    }
}

private struct PastDayDetailView: View {
    let entry: [String: Any]

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                let eod = (entry["endOfDay"] as? [String: Any]) ?? (entry["end_of_day"] as? [String: Any]) ?? [:]
                if let ow = eod["oneWord"] as? String, !ow.isEmpty {
                    Text("“\(ow)”")
                        .italic()
                        .foregroundStyle(WellnessTheme.muted)
                }
                sectionBlock("Sleep", entry["sleep"] as? [String: Any])
                sectionBlock("Morning start", entry["morning_start"] as? [String: Any])
                sectionBlock("Med check-in", entry["med_checkin"] as? [String: Any])
                sectionBlock("Health & lifestyle", entry["health_lifestyle"] as? [String: Any])
                sectionBlock("End of day", eod)
            }
            .padding(16)
        }
        .background(WellnessTheme.bg)
        .navigationTitle("Day detail")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func sectionBlock(_ title: String, _ data: [String: Any]?) -> some View {
        Group {
            if let data, !data.isEmpty {
                VStack(alignment: .leading, spacing: 8) {
                    Text(title)
                        .font(.caption.weight(.bold))
                        .foregroundStyle(WellnessTheme.accent)
                    ForEach(data.keys.sorted(), id: \.self) { k in
                        HStack(alignment: .top) {
                            Text(k).font(.caption2).foregroundStyle(WellnessTheme.muted)
                            Spacer()
                            Text(String(describing: data[k] ?? ""))
                                .font(.caption)
                                .foregroundStyle(WellnessTheme.text)
                                .multilineTextAlignment(.trailing)
                        }
                    }
                }
                .padding(12)
                .background(WellnessTheme.surface)
                .clipShape(RoundedRectangle(cornerRadius: 10))
            }
        }
    }
}
