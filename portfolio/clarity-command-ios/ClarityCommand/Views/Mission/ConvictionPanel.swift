import SwiftUI
import ClarityUI

struct ConvictionPanel: View {
    let yesterdayLog: DailyLog
    let targets: Targets
    let customReminders: [Reminder]
    let scripture: Scripture

    private struct MissedArea: Identifiable {
        let id: String
        let area: String
        let message: String
    }

    private var missed: [MissedArea] {
        let a = yesterdayLog.areas
        var result: [MissedArea] = []

        if yesterdayLog.jobActions.count < targets.jobActions {
            let r = ReminderBank.reminderForArea("jobs", custom: customReminders)
            result.append(MissedArea(
                id: "jobs",
                area: "jobs",
                message: "You logged \(yesterdayLog.jobActions.count) of \(targets.jobActions) job actions yesterday. \"\(r.text)\" Get back to work today. (\(scripture.ref))"
            ))
        }
        if a.time < targets.productiveHours {
            result.append(MissedArea(
                id: "time",
                area: "time",
                message: "You tracked \(a.time) of \(targets.productiveHours) productive hours yesterday. \"You are wasting time.\" Every hour matters. (\(scripture.ref))"
            ))
        }
        if !a.budget {
            result.append(MissedArea(
                id: "budget",
                area: "budget",
                message: "You didn\u{2019}t check your budget yesterday. Financial pressure is real for your family \u{2014} stay aware. (\(scripture.ref))"
            ))
        }
        if a.scripture < targets.scriptureMinutes {
            result.append(MissedArea(
                id: "scripture",
                area: "scripture",
                message: "You skipped scripture study yesterday. How can you lead your family spiritually if you\u{2019}re not feeding your own spirit? \u{2018}I will go and do.\u{2019} (1 Ne 3:7)"
            ))
        }
        if !a.prayer.morning || !a.prayer.evening {
            result.append(MissedArea(
                id: "prayer",
                area: "prayer",
                message: "You skipped prayer yesterday. Start there \u{2014} that\u{2019}s where strength comes from."
            ))
        }
        if !a.wellness.morning || !a.wellness.evening {
            result.append(MissedArea(
                id: "wellness",
                area: "wellness",
                message: "You didn\u{2019}t complete your wellness check-ins yesterday. You can\u{2019}t lead your family if you\u{2019}re running on empty."
            ))
        }

        return result
    }

    var body: some View {
        if !missed.isEmpty {
            VStack(spacing: 0) {
                HStack(spacing: 8) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundStyle(ClarityPalette.danger)
                    Text("Yesterday you fell short. No excuses \u{2014} respond today.")
                        .font(ClarityTypography.caption.bold())
                        .foregroundStyle(ClarityPalette.danger)
                    Spacer()
                }
                .padding(12)
                .background(ClarityPalette.danger.opacity(0.1))

                ForEach(missed) { m in
                    Text(m.message)
                        .font(ClarityTypography.caption)
                        .foregroundStyle(ClarityPalette.text)
                        .lineSpacing(4)
                        .padding(12)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .overlay(alignment: .top) {
                            ClarityPalette.border.frame(height: 1)
                        }
                }
            }
            .background(ClarityPalette.surface)
            .clipShape(RoundedRectangle(cornerRadius: 12))
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(ClarityPalette.danger, lineWidth: 1)
            )
            .accessibilityElement(children: .combine)
            .accessibilityLabel("Conviction: \(missed.count) areas missed yesterday")
        }
    }
}
