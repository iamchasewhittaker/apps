import SwiftUI

struct SoilTestView: View {
    @Environment(FairwayStore.self) private var store

    var body: some View {
        ScrollView {
            if let test = store.blob.soilTest {
                VStack(spacing: 14) {
                    header(test: test)
                    phCard(test: test)
                    nutrientChartCard(test: test)
                    findingsCard(test: test)
                    recommendationsCard(test: test)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
            } else {
                ContentUnavailableView("No soil test yet", systemImage: "chart.bar")
                    .padding(.top, 80)
            }
        }
        .background(FairwayTheme.backgroundPrimary)
        .navigationTitle("Soil Test")
    }

    private func header(test: SoilTestData) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 6) {
                Text("Soil Test — \(test.testedBy)")
                    .font(.headline)
                    .foregroundStyle(FairwayTheme.textPrimary)
                Text(test.dateReceived, style: .date)
                    .font(.caption)
                    .foregroundStyle(FairwayTheme.textSecondary)
                if let url = URL(string: "https://" + test.consultantURL) {
                    Link(destination: url) {
                        Label(test.consultantURL, systemImage: "link")
                            .font(.caption)
                            .foregroundStyle(FairwayTheme.accentGold)
                    }
                }
            }
        }
    }

    private func phCard(test: SoilTestData) -> some View {
        FairwayCard {
            HStack(alignment: .center, spacing: 16) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("pH")
                        .font(.caption.bold())
                        .foregroundStyle(FairwayTheme.textSecondary)
                        .textCase(.uppercase)
                    Text("\(test.ph, specifier: "%.2f")")
                        .font(.system(size: 40, weight: .bold))
                        .foregroundStyle(FairwayTheme.statusHealthy)
                    Text("Optimal")
                        .font(.caption.bold())
                        .padding(.horizontal, 8).padding(.vertical, 3)
                        .background(FairwayTheme.statusHealthy.opacity(0.2))
                        .clipShape(Capsule())
                        .foregroundStyle(FairwayTheme.statusHealthy)
                }
                Spacer()
                Image(systemName: "checkmark.seal.fill")
                    .font(.system(size: 40))
                    .foregroundStyle(FairwayTheme.statusHealthy)
            }
        }
    }

    private func nutrientChartCard(test: SoilTestData) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("Nutrients").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                ForEach(test.nutrients.filter { $0.symbol != "pH" }) { n in
                    NutrientBar(reading: n)
                }
            }
        }
    }

    private func findingsCard(test: SoilTestData) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Key Findings").font(.caption.bold()).foregroundStyle(FairwayTheme.textSecondary).textCase(.uppercase)
                ForEach(test.keyFindings, id: \.self) { finding in
                    HStack(alignment: .top, spacing: 8) {
                        Image(systemName: "circle.fill").font(.system(size: 4))
                            .foregroundStyle(FairwayTheme.accentGold)
                            .padding(.top, 7)
                        Text(finding)
                            .font(.footnote)
                            .foregroundStyle(FairwayTheme.textPrimary)
                    }
                }
            }
        }
    }

    private func recommendationsCard(test: SoilTestData) -> some View {
        FairwayCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Recommendations").font(.caption.bold()).foregroundStyle(FairwayTheme.accentGold).textCase(.uppercase)
                ForEach(test.recommendations, id: \.self) { rec in
                    HStack(alignment: .top, spacing: 8) {
                        Image(systemName: rec.localizedCaseInsensitiveContains("hydr8") ? "drop.fill" : "checkmark.circle")
                            .foregroundStyle(rec.localizedCaseInsensitiveContains("hydr8") ? FairwayTheme.accentGold : FairwayTheme.statusHealthy)
                            .font(.footnote)
                        Text(rec)
                            .font(.footnote)
                            .foregroundStyle(FairwayTheme.textPrimary)
                    }
                }
            }
        }
    }
}

private struct NutrientBar: View {
    let reading: NutrientReading

    private var barColor: Color {
        switch reading.rating {
        case .optimal: return FairwayTheme.statusHealthy
        case .low: return FairwayTheme.statusAttention
        case .high: return FairwayTheme.statusAction
        }
    }

    private var fillFraction: CGFloat {
        // Normalize to 0...1 where optimalMax = 1.0
        let denom = reading.optimalMax
        guard denom > 0 else { return 0 }
        return CGFloat(min(max(reading.result / denom, 0.0), 1.5))
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text("\(reading.name) (\(reading.symbol))")
                    .font(.caption.bold())
                    .foregroundStyle(FairwayTheme.textPrimary)
                Spacer()
                Text("\(reading.result, specifier: "%.2f")")
                    .font(.caption.bold())
                    .foregroundStyle(barColor)
            }
            GeometryReader { geo in
                ZStack(alignment: .leading) {
                    // Baseline
                    RoundedRectangle(cornerRadius: 4)
                        .fill(FairwayTheme.backgroundElevated)
                        .frame(height: 8)
                    // Optimal band
                    let startFrac = CGFloat(reading.optimalMin / max(reading.optimalMax, 0.001))
                    Rectangle()
                        .fill(FairwayTheme.statusHealthy.opacity(0.25))
                        .frame(width: geo.size.width * (1 - startFrac).clamped(to: 0...1) * 0.67,
                               height: 8)
                        .offset(x: geo.size.width * startFrac.clamped(to: 0...1) * 0.67)
                    // Fill
                    RoundedRectangle(cornerRadius: 4)
                        .fill(barColor)
                        .frame(width: min(geo.size.width, geo.size.width * fillFraction * 0.67),
                               height: 8)
                }
            }
            .frame(height: 8)
            HStack {
                Text("Optimal: \(reading.optimalMin, specifier: "%.1f")–\(reading.optimalMax, specifier: "%.1f")")
                    .font(.caption2)
                    .foregroundStyle(FairwayTheme.textSecondary)
                Spacer()
                Text(reading.rating.rawValue.uppercased())
                    .font(.caption2.bold())
                    .foregroundStyle(barColor)
            }
        }
    }
}

private extension CGFloat {
    func clamped(to range: ClosedRange<CGFloat>) -> CGFloat {
        Swift.min(Swift.max(self, range.lowerBound), range.upperBound)
    }
}
