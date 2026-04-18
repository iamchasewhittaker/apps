import SwiftUI

struct SpreaderCalcView: View {
    @Environment(FairwayStore.self) private var store
    @State private var selectedProductID: UUID?
    @State private var selectedSpreaderID: UUID?
    @State private var selectedZones: Set<Int> = []
    @State private var rate: Double = 0
    @State private var showAddSetting = false

    @MainActor private var productOptions: [InventoryItem] {
        store.blob.inventory.filter { $0.category == .fertilizer || $0.category == .soilAmendment }
    }

    @MainActor private var spreaderOptions: [InventoryItem] {
        store.blob.inventory.filter { $0.category == .equipment && $0.spreaderCapacityLbs != nil }
    }

    @MainActor private var product: InventoryItem? {
        productOptions.first(where: { $0.id == selectedProductID })
    }

    @MainActor private var spreader: InventoryItem? {
        spreaderOptions.first(where: { $0.id == selectedSpreaderID })
    }

    @MainActor private var totalSqFt: Int {
        store.blob.zones.filter { selectedZones.contains($0.number) }.map(\.squareFootage).reduce(0, +)
    }

    @MainActor private var totalLbsNeeded: Double {
        guard rate > 0, totalSqFt > 0 else { return 0 }
        return (Double(totalSqFt) / 1000.0) * rate
    }

    @MainActor private var bagsToBuy: Int? {
        guard let bag = product?.bagSizeLbs, bag > 0 else { return nil }
        guard totalLbsNeeded > 0 else { return 0 }
        return Int((totalLbsNeeded / bag).rounded(.up))
    }

    @MainActor private var leftOver: Double? {
        guard let bag = product?.bagSizeLbs, let bags = bagsToBuy else { return nil }
        let bought = Double(bags) * bag
        let current = product?.currentStockLbs ?? 0
        return bought + current - totalLbsNeeded
    }

    @MainActor private var spreaderFills: Int? {
        guard let cap = spreader?.spreaderCapacityLbs, cap > 0 else { return nil }
        guard totalLbsNeeded > 0 else { return nil }
        return Int((totalLbsNeeded / cap).rounded(.up))
    }

    @MainActor private var currentSpreaderSetting: String? {
        guard let product, let spreader else { return nil }
        return product.spreaderSettings.first(where: { $0.spreaderModel == spreader.name })?.setting
    }

    @MainActor private var inputsValid: Bool {
        product != nil && !selectedZones.isEmpty && rate > 0
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                productCard
                zonesCard
                rateCard
                spreaderCard
                if inputsValid {
                    resultsCard
                    if product != nil, totalLbsNeeded > 0 {
                        Button {
                            logApplication()
                        } label: {
                            Label("Log This Application", systemImage: "checkmark.circle.fill")
                                .font(.subheadline.bold())
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 12)
                                .background(FairwayTheme.accentGreen)
                                .foregroundStyle(FairwayTheme.textPrimary)
                                .clipShape(RoundedRectangle(cornerRadius: 12))
                        }
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(FairwayTheme.backgroundPrimary)
        .navigationTitle("Spreader Calc")
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showAddSetting) {
            if let productID = product?.id {
                AddSpreaderSettingSheet(itemID: productID)
            }
        }
        .onChange(of: selectedProductID) { _, _ in
            if let r = product?.defaultRatePer1000SqFt {
                rate = r
            }
        }
    }

    @MainActor private var productCard: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Product").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                Picker("Product", selection: $selectedProductID) {
                    Text("Choose…").tag(UUID?.none)
                    ForEach(productOptions) { item in
                        Text(item.name).tag(UUID?.some(item.id))
                    }
                }
                .pickerStyle(.menu)
                .tint(FairwayTheme.accentGold)
            }
        }
    }

    @MainActor private var zonesCard: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Zones").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                ForEach(store.blob.zones, id: \.number) { zone in
                    Button {
                        if selectedZones.contains(zone.number) { selectedZones.remove(zone.number) }
                        else { selectedZones.insert(zone.number) }
                    } label: {
                        HStack {
                            Image(systemName: selectedZones.contains(zone.number) ? "checkmark.square.fill" : "square")
                                .foregroundStyle(selectedZones.contains(zone.number) ? FairwayTheme.accentGold : FairwayTheme.textSecondary)
                            VStack(alignment: .leading) {
                                Text("Zone \(zone.number) — \(zone.name)")
                                    .font(.footnote)
                                    .foregroundStyle(FairwayTheme.textPrimary)
                                Text("\(zone.squareFootage) sq ft")
                                    .font(.caption2)
                                    .foregroundStyle(FairwayTheme.textSecondary)
                            }
                            Spacer()
                        }
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }

    private var rateCard: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Rate").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                HStack {
                    Text("lb per 1000 sq ft").font(.footnote)
                    Spacer()
                    TextField("0", value: $rate, format: .number)
                        .keyboardType(.decimalPad)
                        .multilineTextAlignment(.trailing)
                        .font(.headline)
                        .foregroundStyle(FairwayTheme.accentGold)
                }
            }
        }
    }

    @MainActor private var spreaderCard: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Spreader").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                Picker("Spreader", selection: $selectedSpreaderID) {
                    Text("Choose…").tag(UUID?.none)
                    ForEach(spreaderOptions) { item in
                        Text(item.name).tag(UUID?.some(item.id))
                    }
                }
                .pickerStyle(.menu)
                .tint(FairwayTheme.accentGold)
            }
        }
    }

    @MainActor private var resultsCard: some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Results").font(.caption.bold()).foregroundStyle(FairwayTheme.accentGold).textCase(.uppercase)
                InfoLine(label: "Total sq ft", value: "\(totalSqFt)")
                InfoLine(label: "Product needed", value: String(format: "%.2f lb", totalLbsNeeded))
                if let bags = bagsToBuy, let bag = product?.bagSizeLbs {
                    InfoLine(label: "Bags to buy", value: "\(bags) × \(Int(bag)) lb")
                }
                if let left = leftOver {
                    InfoLine(label: "Left over", value: String(format: "%.2f lb", left))
                }
                if let fills = spreaderFills, let spreader {
                    InfoLine(label: "Spreader fills", value: "\(fills) × \(spreader.name)")
                }
                Divider().background(FairwayTheme.textSecondary.opacity(0.3))
                if let setting = currentSpreaderSetting {
                    HStack {
                        Text("Dial setting").font(.footnote).foregroundStyle(FairwayTheme.textSecondary)
                        Spacer()
                        Text(setting).font(.headline).foregroundStyle(FairwayTheme.accentGold)
                    }
                } else if spreader != nil {
                    Button { showAddSetting = true } label: {
                        Label("Add setting from product label", systemImage: "plus.circle")
                            .font(.caption.bold())
                            .padding(.horizontal, 10).padding(.vertical, 5)
                            .background(FairwayTheme.backgroundElevated)
                            .clipShape(Capsule())
                            .foregroundStyle(FairwayTheme.accentGold)
                    }
                }
            }
        }
    }

    @MainActor private func logApplication() {
        guard let id = product?.id else { return }
        store.logInventoryUse(
            id: id,
            amountLbs: totalLbsNeeded,
            zones: Array(selectedZones).sorted(),
            notes: "Via Spreader Calculator"
        )
        selectedZones.removeAll()
    }
}
