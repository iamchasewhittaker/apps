import SwiftUI

struct WTDivider: View {
    var body: some View {
        Rectangle()
            .fill(WellnessTheme.border)
            .frame(height: 1)
            .padding(.vertical, 10)
    }
}

struct WTSectionLabel: View {
    let num: Int
    let text: String

    init(num: Int, _ text: String) {
        self.num = num
        self.text = text
    }

    var body: some View {
        HStack(alignment: .top, spacing: 8) {
            Text("\(num)")
                .font(.caption2.weight(.bold))
                .foregroundStyle(WellnessTheme.muted)
                .frame(width: 22, height: 22)
                .background(Circle().stroke(WellnessTheme.border, lineWidth: 1.5))
            Text(text)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(WellnessTheme.text)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(.bottom, 6)
    }
}

struct WTChoiceButton: View {
    let emoji: String?
    let label: String
    let selected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(alignment: .top, spacing: 10) {
                if let emoji {
                    Text(emoji).font(.body)
                }
                Text(label)
                    .font(.subheadline)
                    .multilineTextAlignment(.leading)
                    .foregroundStyle(selected ? WellnessTheme.accent : WellnessTheme.text)
                Spacer(minLength: 0)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 10)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(selected ? WellnessTheme.accentLight : WellnessTheme.surface)
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(selected ? WellnessTheme.accent : WellnessTheme.border, lineWidth: selected ? 2 : 1)
            )
            .clipShape(RoundedRectangle(cornerRadius: 10))
        }
        .buttonStyle(.plain)
        .padding(.bottom, 6)
    }
}

struct WTMultiChip: View {
    let label: String
    let selected: Bool
    var color: Color = WellnessTheme.accent
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.footnote)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(selected ? color.opacity(0.2) : WellnessTheme.surface)
                .foregroundStyle(selected ? color : WellnessTheme.muted)
                .overlay(
                    Capsule().stroke(selected ? color : WellnessTheme.border, lineWidth: 1.5)
                )
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
        .padding(3)
    }
}

struct WTRatingRow: View {
    let value: Int?
    let onChange: (Int) -> Void

    var body: some View {
        HStack(spacing: 6) {
            ForEach(1 ... 10, id: \.self) { n in
                Button {
                    onChange(n)
                } label: {
                    Text("\(n)")
                        .font(.subheadline.weight(.bold))
                        .frame(width: 36, height: 44)
                        .background(value == n ? WellnessTheme.warn.opacity(0.15) : WellnessTheme.surface)
                        .foregroundStyle(value == n ? WellnessTheme.warn : WellnessTheme.muted)
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(value == n ? WellnessTheme.warn : WellnessTheme.border, lineWidth: 2))
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }
                .buttonStyle(.plain)
            }
        }
    }
}

struct WTNumberGrid: View {
    let value: Int?
    let color: Color
    let onSelect: (Int) -> Void

    var body: some View {
        LazyVGrid(columns: [GridItem(.adaptive(minimum: 40), spacing: 6)], spacing: 6) {
            ForEach(1 ... 10, id: \.self) { n in
                Button {
                    onSelect(n)
                } label: {
                    Text("\(n)")
                        .font(.subheadline.weight(.bold))
                        .frame(minWidth: 40, minHeight: 44)
                        .background(value == n ? color.opacity(0.15) : WellnessTheme.surface)
                        .foregroundStyle(value == n ? color : WellnessTheme.muted)
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(value == n ? color : WellnessTheme.border, lineWidth: 2))
                        .clipShape(RoundedRectangle(cornerRadius: 8))
                }
                .buttonStyle(.plain)
            }
        }
    }
}
