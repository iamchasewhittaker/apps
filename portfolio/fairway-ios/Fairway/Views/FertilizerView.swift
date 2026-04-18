import SwiftUI

struct FertilizerView: View {
    @Environment(FairwayStore.self) private var store
    @State private var completionTarget: FertilizerEntry?

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                soilBanner
                seasonPlanSection
                toolsSection
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(FairwayTheme.backgroundPrimary)
        .navigationTitle("Lawn Plan")
        .sheet(item: $completionTarget) { entry in
            LogApplicationSheet(entry: entry) { date in
                store.markFertilizerComplete(id: entry.id, date: date)
            }
        }
    }

    private var soilBanner: some View {
        FairwayCard {
            HStack(alignment: .top, spacing: 10) {
                Image(systemName: "exclamationmark.triangle.fill")
                    .foregroundStyle(FairwayTheme.statusAttention)
                VStack(alignment: .leading, spacing: 4) {
                    Text("Utah clay soil (0.2 in/hr)")
                        .font(.footnote.bold())
                        .foregroundStyle(FairwayTheme.textPrimary)
                    Text("Cycle & Soak critical. K deficiency — dial in irrigation this season.")
                        .font(.caption)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
            }
        }
    }

    @MainActor private var seasonPlanSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            sectionTitle("Season Plan")
            VStack(spacing: 10) {
                ForEach(store.blob.fertilizerPlan) { entry in
                    FertilizerRow(entry: entry, onTap: { completionTarget = entry }, onUndo: { store.unmarkFertilizerComplete(id: entry.id) })
                }
            }
        }
    }

    @MainActor private var toolsSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            sectionTitle("The Shed")
            NavigationLink {
                InventoryView()
            } label: {
                FairwayCard {
                    HStack {
                        Image(systemName: "shippingbox.fill")
                            .foregroundStyle(FairwayTheme.accentGold)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Inventory")
                                .font(.headline)
                                .foregroundStyle(FairwayTheme.textPrimary)
                            Text("\(store.blob.inventory.count) items tracked")
                                .font(.caption)
                                .foregroundStyle(FairwayTheme.textSecondary)
                        }
                        Spacer()
                        Image(systemName: "chevron.right")
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }
                }
            }
            .buttonStyle(.plain)

            NavigationLink {
                SpreaderCalcView()
            } label: {
                FairwayCard {
                    HStack {
                        Image(systemName: "function")
                            .foregroundStyle(FairwayTheme.accentGold)
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Spreader Calculator")
                                .font(.headline)
                                .foregroundStyle(FairwayTheme.textPrimary)
                            Text("Plan the next application")
                                .font(.caption)
                                .foregroundStyle(FairwayTheme.textSecondary)
                        }
                        Spacer()
                        Image(systemName: "chevron.right")
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }
                }
            }
            .buttonStyle(.plain)
        }
    }

    private func sectionTitle(_ text: String) -> some View {
        HStack {
            Text(text.uppercased())
                .font(.caption.bold())
                .foregroundStyle(FairwayTheme.textSecondary)
            Spacer()
        }
    }
}

private struct FertilizerRow: View {
    let entry: FertilizerEntry
    let onTap: () -> Void
    let onUndo: () -> Void

    var body: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text(entry.season.rawValue)
                        .font(.caption.bold())
                        .padding(.horizontal, 8).padding(.vertical, 3)
                        .background(FairwayTheme.accentGreen.opacity(0.3))
                        .foregroundStyle(FairwayTheme.textPrimary)
                        .clipShape(Capsule())
                    Spacer()
                    Text(dateWindow)
                        .font(.caption)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }

                Text(entry.product)
                    .font(.headline)
                    .foregroundStyle(FairwayTheme.textPrimary)

                if !entry.alternateProduct.isEmpty {
                    Text("Alt: \(entry.alternateProduct)")
                        .font(.caption)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }

                HStack(spacing: 12) {
                    Label("\(entry.ratePerThousandSqFt, specifier: "%.1f") \(entry.unit)", systemImage: "scalemass")
                        .font(.caption)
                        .foregroundStyle(FairwayTheme.textSecondary)
                    if let source = entry.productSource {
                        Label(source, systemImage: "building.2.fill")
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }
                }

                HStack(spacing: 8) {
                    if let urlString = entry.productURL, let url = URL(string: urlString) {
                        Link(destination: url) {
                            Label("View Product", systemImage: "link")
                                .font(.caption.bold())
                                .padding(.horizontal, 10).padding(.vertical, 5)
                                .background(FairwayTheme.backgroundElevated)
                                .clipShape(Capsule())
                                .foregroundStyle(FairwayTheme.accentGold)
                        }
                    }
                    Spacer()
                    if entry.isCompleted, let applied = entry.applicationDate {
                        HStack(spacing: 6) {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundStyle(FairwayTheme.statusHealthy)
                            Text("Done \(applied.formatted(.dateTime.month().day()))")
                                .font(.caption)
                                .foregroundStyle(FairwayTheme.statusHealthy)
                        }
                        Button("Undo", action: onUndo)
                            .font(.caption2)
                            .foregroundStyle(FairwayTheme.textSecondary)
                    } else {
                        Button(action: onTap) {
                            Label("Mark Complete", systemImage: "checkmark.circle")
                                .font(.caption.bold())
                                .padding(.horizontal, 10).padding(.vertical, 5)
                                .background(FairwayTheme.accentGreen)
                                .foregroundStyle(FairwayTheme.textPrimary)
                                .clipShape(Capsule())
                        }
                    }
                }
            }
        }
    }

    private var dateWindow: String {
        let df = DateFormatter()
        df.dateFormat = "MMM d"
        return "\(df.string(from: entry.windowStart)) – \(df.string(from: entry.windowEnd))"
    }
}

struct LogApplicationSheet: View {
    @Environment(\.dismiss) private var dismiss
    let entry: FertilizerEntry
    let onSave: (Date) -> Void
    @State private var date: Date = Date()

    var body: some View {
        NavigationStack {
            Form {
                Section("Applied") {
                    Text(entry.product).font(.headline)
                    DatePicker("Date", selection: $date, displayedComponents: .date)
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Log Application")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        onSave(date)
                        dismiss()
                    }
                    .bold()
                }
            }
        }
    }
}
