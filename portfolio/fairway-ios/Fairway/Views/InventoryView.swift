import SwiftUI

struct InventoryView: View {
    @Environment(FairwayStore.self) private var store
    @State private var showAddItem = false
    @State private var selectedItem: InventoryItem?

    @MainActor private var grouped: [(InventoryCategory, [InventoryItem])] {
        let groups = Dictionary(grouping: store.blob.inventory, by: \.category)
        return InventoryCategory.allCases.compactMap { cat in
            guard let items = groups[cat], !items.isEmpty else { return nil }
            return (cat, items.sorted { $0.name < $1.name })
        }
    }

    var body: some View {
        ScrollView {
            VStack(spacing: 14) {
                ForEach(grouped, id: \.0) { cat, items in
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Image(systemName: cat.icon)
                            Text(cat.rawValue.uppercased())
                                .font(.caption.bold())
                            Spacer()
                        }
                        .foregroundStyle(FairwayTheme.textSecondary)
                        VStack(spacing: 8) {
                            ForEach(items) { item in
                                Button {
                                    selectedItem = item
                                } label: {
                                    InventoryRow(item: item)
                                }
                                .buttonStyle(.plain)
                            }
                        }
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .background(FairwayTheme.backgroundPrimary)
        .navigationTitle("The Shed")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Button { showAddItem = true } label: {
                    Image(systemName: "plus")
                }
            }
        }
        .sheet(isPresented: $showAddItem) { AddInventoryItemSheet() }
        .sheet(item: $selectedItem) { item in
            InventoryItemDetailSheet(itemID: item.id)
        }
    }
}

private struct InventoryRow: View {
    let item: InventoryItem

    var body: some View {
        FairwayCard {
            HStack(alignment: .top, spacing: 12) {
                Image(systemName: item.category.icon)
                    .font(.title3)
                    .foregroundStyle(FairwayTheme.accentGold)
                    .frame(width: 28)
                VStack(alignment: .leading, spacing: 3) {
                    Text(item.name)
                        .font(.headline)
                        .foregroundStyle(FairwayTheme.textPrimary)
                    if !item.brand.isEmpty {
                        Text(item.brand)
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }
                    HStack(spacing: 10) {
                        StockBadge(currentLbs: item.currentStockLbs,
                                   onApplicationLbs: oneLot)
                        if let last = item.lastUsedDate {
                            Text("Used \(last, style: .date)")
                                .font(.caption2)
                                .foregroundStyle(FairwayTheme.textSecondary)
                        }
                    }
                }
                Spacer()
                Image(systemName: "chevron.right").foregroundStyle(FairwayTheme.textSecondary)
            }
        }
    }

    private var oneLot: Double? {
        guard let rate = item.defaultRatePer1000SqFt else { return nil }
        return (Double(FairwayConfig.totalGrassSqFt) / 1000.0) * rate
    }
}

struct InventoryItemDetailSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let itemID: UUID
    @State private var showLogUse = false
    @State private var showRestock = false
    @State private var showAddService = false
    @State private var showAddSetting = false

    @MainActor private var item: InventoryItem? {
        store.blob.inventory.first(where: { $0.id == itemID })
    }

    var body: some View {
        NavigationStack {
            if let item {
                ScrollView {
                    VStack(spacing: 14) {
                        headerCard(item: item)
                        if item.category == .equipment {
                            serviceHistoryCard(item: item)
                        } else {
                            stockCard(item: item)
                            usageLogCard(item: item)
                        }
                        spreaderSettingsCard(item: item)
                        storageCard(item: item)
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                }
                .background(FairwayTheme.backgroundPrimary)
                .navigationTitle(item.name)
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .topBarTrailing) {
                        Button("Done") { dismiss() }
                    }
                }
                .sheet(isPresented: $showLogUse) { LogUseSheet(itemID: item.id) }
                .sheet(isPresented: $showRestock) { RestockSheet(itemID: item.id) }
                .sheet(isPresented: $showAddService) { AddServiceSheet(itemID: item.id) }
                .sheet(isPresented: $showAddSetting) { AddSpreaderSettingSheet(itemID: item.id) }
            } else {
                Text("Item not found").foregroundStyle(FairwayTheme.textSecondary)
            }
        }
    }

    private func headerCard(item: InventoryItem) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Image(systemName: item.category.icon)
                        .foregroundStyle(FairwayTheme.accentGold)
                    Text(item.category.rawValue)
                        .font(.caption.bold())
                        .foregroundStyle(FairwayTheme.textSecondary)
                        .textCase(.uppercase)
                    Spacer()
                }
                if !item.brand.isEmpty {
                    Text(item.brand).font(.subheadline).foregroundStyle(FairwayTheme.textSecondary)
                }
                if let url = item.productURL, let link = URL(string: url) {
                    Link(destination: link) {
                        Label(url, systemImage: "link")
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.accentGold)
                    }
                }
                if let source = item.productSource {
                    Label(source, systemImage: "building.2.fill")
                        .font(.caption)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
            }
        }
    }

    private func stockCard(item: InventoryItem) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("Stock").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                HStack(spacing: 12) {
                    StockBadge(currentLbs: item.currentStockLbs,
                               onApplicationLbs: oneLotFor(item))
                    Spacer()
                    if let current = item.currentStockLbs {
                        Text("\(current, specifier: "%.1f") lb on hand")
                            .font(.subheadline.bold())
                            .foregroundStyle(FairwayTheme.textPrimary)
                    } else {
                        Text("No stock tracked")
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.textSecondary)
                    }
                }
                if let bag = item.bagSizeLbs {
                    InfoLine(label: "Bag size", value: String(format: "%.0f lb", bag))
                }
                if let rate = item.defaultRatePer1000SqFt {
                    InfoLine(label: "Default rate", value: String(format: "%.1f lb/1000 sq ft", rate))
                }
                HStack {
                    Button { showLogUse = true } label: {
                        Label("Log Use", systemImage: "arrow.down.circle")
                            .font(.caption.bold())
                            .padding(.horizontal, 12).padding(.vertical, 6)
                            .background(FairwayTheme.backgroundElevated)
                            .clipShape(Capsule())
                    }
                    Button { showRestock = true } label: {
                        Label("Restock", systemImage: "arrow.up.circle")
                            .font(.caption.bold())
                            .padding(.horizontal, 12).padding(.vertical, 6)
                            .background(FairwayTheme.accentGreen)
                            .clipShape(Capsule())
                            .foregroundStyle(FairwayTheme.textPrimary)
                    }
                    Spacer()
                }
            }
        }
    }

    private func usageLogCard(item: InventoryItem) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Usage Log").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                if item.usageLog.isEmpty {
                    Text("No applications logged yet.").font(.caption).foregroundStyle(FairwayTheme.textSecondary)
                } else {
                    ForEach(item.usageLog.sorted(by: { $0.date > $1.date })) { u in
                        HStack(alignment: .top) {
                            VStack(alignment: .leading, spacing: 2) {
                                Text(u.date, style: .date).font(.caption.bold()).foregroundStyle(FairwayTheme.textPrimary)
                                Text("Zones: \(u.zonesApplied.map(String.init).joined(separator: ", "))")
                                    .font(.caption2).foregroundStyle(FairwayTheme.textSecondary)
                            }
                            Spacer()
                            Text("\(u.amountLbs, specifier: "%.1f") lb").font(.caption)
                                .foregroundStyle(FairwayTheme.accentGold)
                        }
                    }
                }
            }
        }
    }

    private func serviceHistoryCard(item: InventoryItem) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text("Service History").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                    Spacer()
                    Button { showAddService = true } label: {
                        Image(systemName: "plus.circle").foregroundStyle(FairwayTheme.accentGold)
                    }
                }
                if item.serviceHistory.isEmpty {
                    Text("No service records yet.").font(.caption).foregroundStyle(FairwayTheme.textSecondary)
                } else {
                    ForEach(item.serviceHistory.sorted(by: { $0.date > $1.date })) { record in
                        VStack(alignment: .leading, spacing: 2) {
                            Text(record.description).font(.footnote).foregroundStyle(FairwayTheme.textPrimary)
                            Text(record.date, style: .date).font(.caption2).foregroundStyle(FairwayTheme.textSecondary)
                            if let cost = record.cost {
                                Text("$\(cost, specifier: "%.2f")").font(.caption2).foregroundStyle(FairwayTheme.accentGold)
                            }
                        }
                    }
                }
            }
        }
    }

    private func spreaderSettingsCard(item: InventoryItem) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Text("Spreader Settings").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                    Spacer()
                    Button { showAddSetting = true } label: {
                        Image(systemName: "plus.circle").foregroundStyle(FairwayTheme.accentGold)
                    }
                }
                if item.spreaderSettings.isEmpty {
                    Text("No settings recorded. Add from product label.").font(.caption).foregroundStyle(FairwayTheme.textSecondary)
                } else {
                    ForEach(item.spreaderSettings) { s in
                        HStack {
                            Text(s.spreaderModel).font(.caption).foregroundStyle(FairwayTheme.textPrimary)
                            Spacer()
                            Text(s.setting).font(.caption.bold()).foregroundStyle(FairwayTheme.accentGold)
                        }
                    }
                }
            }
        }
    }

    private func storageCard(item: InventoryItem) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 6) {
                Text("Storage").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                if !item.storageLocation.isEmpty {
                    Label(item.storageLocation, systemImage: "house.fill")
                        .font(.footnote)
                        .foregroundStyle(FairwayTheme.textPrimary)
                }
                if !item.storageNotes.isEmpty {
                    Text(item.storageNotes)
                        .font(.caption)
                        .foregroundStyle(FairwayTheme.textSecondary)
                }
            }
        }
    }

    private func oneLotFor(_ item: InventoryItem) -> Double? {
        guard let rate = item.defaultRatePer1000SqFt else { return nil }
        return (Double(FairwayConfig.totalGrassSqFt) / 1000.0) * rate
    }
}

// MARK: - Sheets

struct AddInventoryItemSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var category: InventoryCategory = .fertilizer
    @State private var brand = ""
    @State private var rate: Double = 0
    @State private var bagSize: Double = 0
    @State private var storage = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Basics") {
                    TextField("Name", text: $name)
                    Picker("Category", selection: $category) {
                        ForEach(InventoryCategory.allCases) { c in
                            Text(c.rawValue).tag(c)
                        }
                    }
                    TextField("Brand", text: $brand)
                }
                if category == .fertilizer || category == .soilAmendment {
                    Section("Application") {
                        HStack { Text("Rate lb/1000"); Spacer(); TextField("0", value: $rate, format: .number).keyboardType(.decimalPad).multilineTextAlignment(.trailing) }
                        HStack { Text("Bag size lb"); Spacer(); TextField("0", value: $bagSize, format: .number).keyboardType(.decimalPad).multilineTextAlignment(.trailing) }
                    }
                }
                Section("Storage") {
                    TextField("Location", text: $storage)
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Add Item")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        var item = InventoryItem(name: name, category: category, brand: brand, storageLocation: storage)
                        if rate > 0 { item.defaultRatePer1000SqFt = rate }
                        if bagSize > 0 { item.bagSizeLbs = bagSize }
                        store.addInventoryItem(item)
                        dismiss()
                    }
                    .disabled(name.isEmpty)
                }
            }
        }
    }
}

struct LogUseSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let itemID: UUID
    @State private var amount: Double = 0
    @State private var zones: Set<Int> = []

    var body: some View {
        NavigationStack {
            Form {
                Section("Amount") {
                    HStack { Text("Pounds used"); Spacer(); TextField("0", value: $amount, format: .number).keyboardType(.decimalPad).multilineTextAlignment(.trailing) }
                }
                Section("Zones") {
                    ForEach(store.blob.zones, id: \.number) { zone in
                        Button {
                            if zones.contains(zone.number) { zones.remove(zone.number) } else { zones.insert(zone.number) }
                        } label: {
                            HStack {
                                Text("Zone \(zone.number) — \(zone.name)")
                                Spacer()
                                if zones.contains(zone.number) {
                                    Image(systemName: "checkmark").foregroundStyle(FairwayTheme.accentGold)
                                }
                            }
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Log Use")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        store.logInventoryUse(id: itemID, amountLbs: amount, zones: Array(zones).sorted())
                        dismiss()
                    }
                    .disabled(amount <= 0)
                }
            }
        }
    }
}

struct RestockSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let itemID: UUID
    @State private var amount: Double = 0

    var body: some View {
        NavigationStack {
            Form {
                Section("Added") {
                    HStack { Text("Pounds added"); Spacer(); TextField("0", value: $amount, format: .number).keyboardType(.decimalPad).multilineTextAlignment(.trailing) }
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Restock")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        store.restockInventory(id: itemID, addLbs: amount)
                        dismiss()
                    }
                    .disabled(amount <= 0)
                }
            }
        }
    }
}

struct AddServiceSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let itemID: UUID
    @State private var date = Date()
    @State private var desc = ""
    @State private var cost: Double = 0

    var body: some View {
        NavigationStack {
            Form {
                Section("Service") {
                    DatePicker("Date", selection: $date, displayedComponents: .date)
                    TextField("Description", text: $desc)
                    HStack { Text("Cost"); Spacer(); TextField("0", value: $cost, format: .number).keyboardType(.decimalPad).multilineTextAlignment(.trailing) }
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Log Service")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        let rec = ServiceRecord(date: date, description: desc, cost: cost > 0 ? cost : nil)
                        store.addServiceRecord(rec, to: itemID)
                        dismiss()
                    }
                    .disabled(desc.isEmpty)
                }
            }
        }
    }
}

struct AddSpreaderSettingSheet: View {
    @Environment(FairwayStore.self) private var store
    @Environment(\.dismiss) private var dismiss
    let itemID: UUID
    @State private var spreader = ""
    @State private var setting = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("Setting") {
                    TextField("Spreader model", text: $spreader)
                    TextField("Dial setting", text: $setting)
                }
            }
            .scrollContentBackground(.hidden)
            .background(FairwayTheme.backgroundPrimary)
            .navigationTitle("Spreader Setting")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Save") {
                        store.addSpreaderSetting(SpreaderSetting(spreaderModel: spreader, setting: setting), to: itemID)
                        dismiss()
                    }
                    .disabled(spreader.isEmpty || setting.isEmpty)
                }
            }
        }
    }
}
