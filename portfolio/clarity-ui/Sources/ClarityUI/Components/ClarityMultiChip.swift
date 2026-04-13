import SwiftUI

/// A tag chip that can be selected or deselected.
/// Used for multi-select tag pickers (time tracking tags, milestone chips).
/// Minimum 44pt height via vertical padding.
public struct ClarityMultiChip: View {
    public let label: String
    public let isSelected: Bool
    public let action: () -> Void

    @ScaledMetric(relativeTo: .caption) private var minHeight: CGFloat = ClarityMetrics.minTapTarget

    public init(_ label: String, isSelected: Bool, action: @escaping () -> Void) {
        self.label = label
        self.isSelected = isSelected
        self.action = action
    }

    public var body: some View {
        Button(action: action) {
            Text(label)
                .font(ClarityTypography.caption)
                .foregroundStyle(isSelected ? ClarityPalette.bg : ClarityPalette.muted)
                .padding(.horizontal, 10)
                .padding(.vertical, 6)
                .frame(minHeight: minHeight)
                .background(isSelected ? ClarityPalette.accent : ClarityPalette.surface)
                .clipShape(Capsule())
                .overlay(Capsule().stroke(
                    isSelected ? ClarityPalette.accent : ClarityPalette.border,
                    lineWidth: ClarityMetrics.borderWidth
                ))
        }
        .buttonStyle(.plain)
        .accessibilityAddTraits(isSelected ? [.isSelected] : [])
        .accessibilityHint(isSelected ? "Tap to deselect" : "Tap to select")
    }
}

/// Wraps a collection of chips in a flow layout.
public struct ClarityChipGroup<Option: Hashable & CustomStringConvertible>: View {
    public let options: [Option]
    @Binding public var selected: Set<Option>

    public init(options: [Option], selected: Binding<Set<Option>>) {
        self.options = options
        self._selected = selected
    }

    public var body: some View {
        FlowLayout(spacing: 8) {
            ForEach(options, id: \.self) { opt in
                ClarityMultiChip(opt.description, isSelected: selected.contains(opt)) {
                    if selected.contains(opt) {
                        selected.remove(opt)
                    } else {
                        selected.insert(opt)
                    }
                }
            }
        }
    }
}

// MARK: - Simple flow layout

public struct FlowLayout: Layout {
    public var spacing: CGFloat = 8

    public init(spacing: CGFloat = 8) { self.spacing = spacing }

    public func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let maxWidth = proposal.width ?? .infinity
        var x: CGFloat = 0, y: CGFloat = 0, rowHeight: CGFloat = 0
        for view in subviews {
            let size = view.sizeThatFits(.unspecified)
            if x + size.width > maxWidth, x > 0 {
                y += rowHeight + spacing
                x = 0
                rowHeight = 0
            }
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
        return CGSize(width: maxWidth, height: y + rowHeight)
    }

    public func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        var x = bounds.minX, y = bounds.minY, rowHeight: CGFloat = 0
        for view in subviews {
            let size = view.sizeThatFits(.unspecified)
            if x + size.width > bounds.maxX, x > bounds.minX {
                y += rowHeight + spacing
                x = bounds.minX
                rowHeight = 0
            }
            view.place(at: CGPoint(x: x, y: y), proposal: ProposedViewSize(size))
            x += size.width + spacing
            rowHeight = max(rowHeight, size.height)
        }
    }
}
