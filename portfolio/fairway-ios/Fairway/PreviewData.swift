import Foundation

enum PreviewData {
    // MARK: - Helpers
    static func date(_ y: Int, _ m: Int, _ d: Int) -> Date {
        var comps = DateComponents()
        comps.year = y
        comps.month = m
        comps.day = d
        comps.hour = 8
        return Calendar.current.date(from: comps) ?? Date()
    }

    // MARK: - Public entry point
    static func seededBlob() -> FairwayBlob {
        var blob = FairwayBlob()
        blob.zones = seedZones()
        blob.soilTest = seedSoilTest()
        blob.fertilizerPlan = seedFertilizerPlan()
        blob.maintenanceTasks = seedMaintenanceTasks()
        blob.mowLog = []
        blob.inventory = seedInventory()
        blob.seeded = true
        return blob
    }

    static var previewBlob: FairwayBlob { seededBlob() }

    // MARK: - Zones

    private static func seedZones() -> [ZoneData] {
        [zone1(), zone2(), zone3(), zone4()]
    }

    private static func zone1() -> ZoneData {
        var zone = ZoneData(
            number: 1,
            name: "Shrubs & Bubblers",
            type: .shrubs,
            squareFootage: 106,
            headType: "Bubblers",
            notes: "Three shrub bed areas. Bubbler irrigation."
        )
        zone.schedule = ScheduleData(
            mode: "Flex Daily",
            cycleMinutes: 5,
            soakMinutes: 30,
            cycles: 2,
            startTime: "5:00 AM",
            precipitationRate: 0.5,
            grassType: "N/A",
            nozzleType: "Bubbler",
            notes: "Deep watering for shrubs."
        )

        // Bed A — backyard house
        var bedA = ShrubBed(
            label: "Bed A",
            description: "Backyard near house",
            plants: [
                PlantEntry(name: "Hydrangeas", count: 3, waterNeeds: .high, notes: "Afternoon shade helps."),
                PlantEntry(name: "Boxwoods", count: 4, waterNeeds: .medium)
            ],
            notes: "Highest water need bed.",
            upkeepTasks: [
                BedUpkeepTask(title: "Mulch refresh", dueDate: date(2026, 4, 15), reminderEnabled: true)
            ]
        )

        var bedB = ShrubBed(
            label: "Bed B",
            description: "Near AC unit",
            plants: [
                PlantEntry(name: "Boxwoods", count: 3, waterNeeds: .medium)
            ],
            notes: "Check for heat stress from AC unit.",
            upkeepTasks: [
                BedUpkeepTask(title: "Heat stress check", dueDate: date(2026, 6, 1), reminderEnabled: false)
            ]
        )

        var bedC = ShrubBed(
            label: "Bed C",
            description: "Driveway island",
            plants: [
                PlantEntry(name: "Ornamental tree", count: 1, waterNeeds: .low),
                PlantEntry(name: "Boxwoods", count: 3, waterNeeds: .medium),
                PlantEntry(name: "Groundcover", count: 1, waterNeeds: .low, notes: "Spreads slowly.")
            ],
            notes: "Low water overall, watch ornamental tree.",
            upkeepTasks: [
                BedUpkeepTask(title: "Ornamental tree pruning", dueDate: date(2026, 4, 15), reminderEnabled: false)
            ]
        )

        zone.shrubBeds = [bedA, bedB, bedC]
        _ = (bedA, bedB, bedC)
        return zone
    }

    private static func zone2() -> ZoneData {
        var zone = ZoneData(
            number: 2,
            name: "Front Yard",
            type: .coolSeasonGrass,
            squareFootage: 1028,
            headType: "Hunter Pro-Spray",
            notes: "KBG front lawn, park strip included."
        )

        zone.heads = [
            HeadData(label: "H2-1", headType: "Hunter Pro-Spray", nozzle: "MP Rotator 10-30", arcDegrees: 90, radiusFeet: 10, gpm: 0.5, location: "NE corner", isConfirmed: true),
            HeadData(label: "H2-2", headType: "Hunter Pro-Spray", nozzle: "MP Rotator 10-30", arcDegrees: 90, radiusFeet: 10, gpm: 0.5, location: "NW corner", isConfirmed: true),
            HeadData(label: "H2-3", headType: "Hunter Pro-Spray", nozzle: "MP Rotator 8-30", arcDegrees: 180, radiusFeet: 8, gpm: 0.4, location: "Park strip south", isConfirmed: true, issues: [.overspray]),
            HeadData(label: "H2-4", headType: "Hunter Pro-Spray", nozzle: "MP Rotator 10-30", arcDegrees: 180, radiusFeet: 10, gpm: 0.5, location: "Center lawn", isConfirmed: true),
            HeadData(label: "H2-5", headType: "Hunter Pro-Spray", nozzle: "MP Rotator 8-30", arcDegrees: 180, radiusFeet: 8, gpm: 0.4, location: "Park strip north", isConfirmed: true, issues: [.overspray]),
            HeadData(label: "H2-6", headType: "Hunter Pro-Spray", nozzle: "MP Rotator 10-30", arcDegrees: 90, radiusFeet: 10, gpm: 0.5, location: "SW corner", isConfirmed: true)
        ]

        zone.problemAreas = [
            ProblemData(title: "Dry park strip", description: "Park strip browns out by mid-July.", severity: .medium, isPreSeason: true),
            ProblemData(title: "Dry lawn center", description: "Suspected coverage gap mid-lawn.", severity: .medium, isPreSeason: true),
            ProblemData(title: "H2-3 / H2-5 overspray", description: "Misting onto driveway/sidewalk.", severity: .low, isPreSeason: true),
            ProblemData(title: "Weed pressure park strip", description: "Crabgrass and dandelions last summer.", severity: .medium, isPreSeason: true)
        ]

        zone.schedule = ScheduleData(
            mode: "Flex Daily",
            cycleMinutes: 4,
            soakMinutes: 40,
            cycles: 3,
            startTime: "5:00 AM",
            precipitationRate: 0.4,
            grassType: "KBG",
            nozzleType: "MP Rotator",
            notes: "Cycle & Soak for Utah clay."
        )

        return zone
    }

    private static func zone3() -> ZoneData {
        var zone = ZoneData(
            number: 3,
            name: "West Side",
            type: .coolSeasonGrass,
            squareFootage: 998,
            headType: "Hunter (series TBD)",
            notes: "West side yard along fence."
        )

        zone.heads = [
            HeadData(label: "H3-1", headType: "Hunter", nozzle: "TBD", arcDegrees: 90, location: "NW corner", isConfirmed: true),
            HeadData(label: "H3-2", headType: "Hunter", nozzle: "TBD", arcDegrees: 180, location: "West fence N", isConfirmed: true),
            HeadData(label: "H3-3", headType: "Hunter", nozzle: "TBD", arcDegrees: 180, location: "West fence mid", isConfirmed: true),
            HeadData(label: "H3-4", headType: "Hunter", nozzle: "TBD", arcDegrees: 180, location: "West fence S", isConfirmed: true),
            HeadData(label: "H3-5", headType: "Hunter", nozzle: "TBD", arcDegrees: 90, location: "SW corner (unconfirmed)", isConfirmed: false)
        ]

        zone.problemAreas = [
            ProblemData(title: "East fence coverage gap", description: "Dry strip along east fence line.", severity: .medium, isPreSeason: true),
            ProblemData(title: "Misdirected head near foundation", description: "Spraying foundation wall.", severity: .medium, isPreSeason: true),
            ProblemData(title: "Hardscape overspray", description: "Water hitting sidewalk/concrete.", severity: .low, isPreSeason: true),
            ProblemData(title: "Nozzle type unconfirmed", description: "Need to identify nozzle series during season test.", severity: .low, isPreSeason: true)
        ]

        zone.schedule = ScheduleData(
            mode: "Flex Daily",
            cycleMinutes: 4,
            soakMinutes: 40,
            cycles: 3,
            startTime: "5:15 AM",
            precipitationRate: 0.4,
            grassType: "Cool season",
            nozzleType: "TBD",
            notes: "PR to be confirmed during season test."
        )

        return zone
    }

    private static func zone4() -> ZoneData {
        var zone = ZoneData(
            number: 4,
            name: "East Side",
            type: .coolSeasonGrass,
            squareFootage: 711,
            headType: "Hunter Pro-Spray fixed spray",
            notes: "East side yard along patio."
        )

        zone.heads = [
            HeadData(label: "H4-1", headType: "Hunter Pro-Spray", nozzle: "Fixed spray 15A", arcDegrees: 90, radiusFeet: 15, gpm: 1.85, location: "Patio edge", isConfirmed: true, issues: [.overspray]),
            HeadData(label: "H4-2", headType: "Hunter Pro-Spray", nozzle: "Fixed spray 15F", arcDegrees: 360, radiusFeet: 15, gpm: 3.70, location: "Center strip", isConfirmed: true),
            HeadData(label: "H4-3", headType: "Hunter Pro-Spray", nozzle: "Fixed spray 15H", arcDegrees: 180, radiusFeet: 15, gpm: 1.85, location: "East fence", isConfirmed: true)
        ]

        zone.problemAreas = [
            ProblemData(title: "H4-1 overspray onto patio", description: "Confirmed last season — soaks patio furniture.", severity: .medium, isPreSeason: false),
            ProblemData(title: "Dry strip east fence", description: "Browns out near fence in heat.", severity: .medium, isPreSeason: true),
            ProblemData(title: "NE corner gap", description: "Suspected dry corner.", severity: .low, isPreSeason: true),
            ProblemData(title: "Uneven distribution", description: "Fixed spray PR is high — prone to runoff.", severity: .medium, isPreSeason: true)
        ]

        zone.schedule = ScheduleData(
            mode: "Flex Daily",
            cycleMinutes: 3,
            soakMinutes: 45,
            cycles: 3,
            startTime: "5:30 AM",
            precipitationRate: 1.5,
            grassType: "KBG",
            nozzleType: "Fixed spray",
            notes: "High PR — shorter cycles, longer soak for clay."
        )

        return zone
    }

    // MARK: - Soil test

    private static func seedSoilTest() -> SoilTestData {
        SoilTestData(
            testedBy: "Jimmy Lewis",
            consultantURL: "jimmylewismows.com",
            dateReceived: date(2026, 4, 2),
            ph: 6.75,
            nutrients: [
                NutrientReading(name: "Nitrogen", symbol: "N", result: 2.45, optimalMin: 7, optimalMax: 18, rating: .low),
                NutrientReading(name: "Phosphorus", symbol: "P", result: 5.09, optimalMin: 5, optimalMax: 11, rating: .optimal),
                NutrientReading(name: "Potassium", symbol: "K", result: 8.84, optimalMin: 38, optimalMax: 72, rating: .low),
                NutrientReading(name: "Sulfur", symbol: "S", result: 6.79, optimalMin: 7, optimalMax: 16, rating: .low),
                NutrientReading(name: "Calcium", symbol: "Ca", result: 790.95, optimalMin: 93, optimalMax: 314, rating: .high),
                NutrientReading(name: "Magnesium", symbol: "Mg", result: 96.65, optimalMin: 28, optimalMax: 67, rating: .high),
                NutrientReading(name: "Sodium", symbol: "Na", result: 1.81, optimalMin: 0.5, optimalMax: 30, rating: .optimal),
                NutrientReading(name: "Iron", symbol: "Fe", result: 1.15, optimalMin: 4, optimalMax: 11, rating: .low),
                NutrientReading(name: "Manganese", symbol: "Mn", result: 1.27, optimalMin: 4, optimalMax: 12, rating: .low),
                NutrientReading(name: "Zinc", symbol: "Zn", result: 0.02, optimalMin: 0.1, optimalMax: 0.25, rating: .low),
                NutrientReading(name: "Copper", symbol: "Cu", result: 0.02, optimalMin: 0.07, optimalMax: 0.28, rating: .low),
                NutrientReading(name: "Boron", symbol: "B", result: 0.01, optimalMin: 0.22, optimalMax: 0.66, rating: .low),
                NutrientReading(name: "pH", symbol: "pH", result: 6.75, optimalMin: 6.0, optimalMax: 7.0, rating: .optimal)
            ],
            keyFindings: [
                "pH is optimal (6.75) — no acidification needed",
                "Nitrogen and Potassium are primary deficiencies",
                "Potassium especially important heading into summer",
                "Micronutrients broadly low (Fe, Mn, Zn, Cu, B)",
                "High Ca and Mg typical of Utah clay — not a concern"
            ],
            recommendations: [
                "Focus on N and K throughout the season",
                "ProPeat fertilizers recommended — peat coating improves clay soil moisture retention",
                "Yard Mastery products provide iron boost and micronutrients",
                "Hydr8 wetting agent monthly June–August — helps water penetrate clay soil",
                "IFA Humate twice yearly — improves soil structure over time"
            ]
        )
    }

    // MARK: - Fertilizer plan

    private static func seedFertilizerPlan() -> [FertilizerEntry] {
        [
            FertilizerEntry(
                season: .earlySpring,
                product: "Pre-emergent + IFA Humate",
                alternateProduct: "Yard Mastery Prodiamine OR Lesco Stonewall",
                ratePerThousandSqFt: 10,
                unit: "lb/1000sqft",
                windowStart: date(2026, 3, 15),
                windowEnd: date(2026, 4, 15),
                productURL: nil,
                productSource: "IFA Store",
                notes: "IFA Humate 10 lb/1000 sqft + pre-emergent at label rate."
            ),
            FertilizerEntry(
                season: .earlySpring,
                product: "ProPeat 17-0-4",
                alternateProduct: "Yard Mastery Flagship 3 lb/1000",
                ratePerThousandSqFt: 4,
                unit: "lb/1000sqft",
                windowStart: date(2026, 3, 15),
                windowEnd: date(2026, 4, 15),
                productURL: nil,
                productSource: "Great Basin Turf",
                notes: "First fertilizer of the season."
            ),
            FertilizerEntry(
                season: .lateSpring,
                product: "ProPeat 17-0-4 + GrubEx",
                alternateProduct: "",
                ratePerThousandSqFt: 4,
                unit: "lb/1000sqft",
                windowStart: date(2026, 5, 1),
                windowEnd: date(2026, 6, 1),
                productURL: nil,
                productSource: "Great Basin Turf",
                notes: "Late spring feeding + grub prevention."
            ),
            FertilizerEntry(
                season: .summer,
                product: "ProPeat 10-0-10",
                alternateProduct: "Yard Mastery Stress Blend",
                ratePerThousandSqFt: 5,
                unit: "lb/1000sqft",
                windowStart: date(2026, 6, 15),
                windowEnd: date(2026, 7, 15),
                productURL: nil,
                productSource: "Great Basin Turf",
                notes: "Summer stress blend — heavy on K."
            ),
            FertilizerEntry(
                season: .earlyFall,
                product: "ProPeat 17-0-4",
                alternateProduct: "Yard Mastery Flagship",
                ratePerThousandSqFt: 4,
                unit: "lb/1000sqft",
                windowStart: date(2026, 8, 15),
                windowEnd: date(2026, 9, 15),
                productURL: nil,
                productSource: "Great Basin Turf",
                notes: "Fall recovery feeding."
            ),
            FertilizerEntry(
                season: .lateFall,
                product: "ProPeat 13-5-8",
                alternateProduct: "IFA Step 4 22-2-12 4 lb/1000",
                ratePerThousandSqFt: 6,
                unit: "lb/1000sqft",
                windowStart: date(2026, 10, 15),
                windowEnd: date(2026, 11, 1),
                productURL: nil,
                productSource: "Great Basin Turf",
                notes: "Winterizer before freeze."
            )
        ]
    }

    // MARK: - Maintenance

    private static func seedMaintenanceTasks() -> [MaintenanceTask] {
        [
            MaintenanceTask(title: "Spring startup", category: .irrigation, targetDate: date(2026, 4, 1), isRecurring: false, reminderEnabled: false),
            MaintenanceTask(title: "Season test run — walk all 4 zones", category: .inspection, targetDate: date(2026, 4, 15), isRecurring: false, notes: "Confirm nozzles, look for leaks and coverage gaps.", reminderEnabled: true),
            MaintenanceTask(title: "Hydr8 application — June", category: .seasonal, targetDate: date(2026, 6, 1), isRecurring: true, recurrenceNote: "Monthly June–August", reminderEnabled: true),
            MaintenanceTask(title: "Hydr8 application — July", category: .seasonal, targetDate: date(2026, 7, 1), isRecurring: true, recurrenceNote: "Monthly June–August", reminderEnabled: true),
            MaintenanceTask(title: "Hydr8 application — August", category: .seasonal, targetDate: date(2026, 8, 1), isRecurring: true, recurrenceNote: "Monthly June–August", reminderEnabled: true),
            MaintenanceTask(title: "Fall aeration — core aerate KBG zones", category: .aeration, targetDate: date(2026, 9, 1), isRecurring: false, reminderEnabled: true),
            MaintenanceTask(title: "Winterization — blow out system before freeze", category: .irrigation, targetDate: date(2026, 10, 1), isRecurring: false, reminderEnabled: true),
            MaintenanceTask(title: "TZone weed spray — spot treat as needed", category: .weedControl, targetDate: nil, isRecurring: false),
            MaintenanceTask(title: "Bed A mulch refresh", category: .shrubBeds, targetDate: date(2026, 4, 15), isRecurring: false, zoneNumber: 1, reminderEnabled: true),
            MaintenanceTask(title: "Bed B heat stress check", category: .shrubBeds, targetDate: date(2026, 6, 1), isRecurring: false, zoneNumber: 1),
            MaintenanceTask(title: "Bed C ornamental tree pruning", category: .shrubBeds, targetDate: date(2026, 4, 15), isRecurring: false, zoneNumber: 1)
        ]
    }

    // MARK: - Inventory

    private static func seedInventory() -> [InventoryItem] {
        [
            InventoryItem(
                name: "Spyker HHS100 Handheld Spreader",
                category: .equipment,
                brand: "Spyker",
                spreaderCapacityLbs: 5.0,
                storageLocation: "Garage",
                storageNotes: "Rinse thoroughly after each use. Store dry."
            ),
            InventoryItem(
                name: "ProPeat 17-0-4",
                category: .fertilizer,
                brand: "ProPeat",
                productSource: "Great Basin Turf",
                defaultRatePer1000SqFt: 4.0,
                bagSizeLbs: 50,
                storageLocation: "Shed",
                storageNotes: "Cool, dry location. Sealed bag. Never let it get wet."
            ),
            InventoryItem(
                name: "ProPeat 10-0-10",
                category: .fertilizer,
                brand: "ProPeat",
                productSource: "Great Basin Turf",
                defaultRatePer1000SqFt: 5.0,
                bagSizeLbs: 50,
                storageLocation: "Shed",
                storageNotes: "Cool, dry location. Sealed bag."
            ),
            InventoryItem(
                name: "ProPeat 13-5-8",
                category: .fertilizer,
                brand: "ProPeat",
                productSource: "Great Basin Turf",
                defaultRatePer1000SqFt: 6.0,
                bagSizeLbs: 50,
                storageLocation: "Shed",
                storageNotes: "Cool, dry location. Sealed bag."
            ),
            InventoryItem(
                name: "Yard Mastery Flagship",
                category: .fertilizer,
                brand: "Yard Mastery",
                productURL: "https://yardmastery.com/products/flagship-fertilizer",
                defaultRatePer1000SqFt: 3.0,
                bagSizeLbs: 45,
                storageLocation: "Shed",
                storageNotes: "Cool, dry location."
            ),
            InventoryItem(
                name: "Yard Mastery Stress Blend",
                category: .fertilizer,
                brand: "Yard Mastery",
                productURL: "https://yardmastery.com/products/stress-blend",
                defaultRatePer1000SqFt: 5.0,
                bagSizeLbs: 45,
                storageLocation: "Shed",
                storageNotes: "Cool, dry location."
            ),
            InventoryItem(
                name: "IFA Humate",
                category: .soilAmendment,
                brand: "IFA",
                productSource: "IFA Store",
                defaultRatePer1000SqFt: 10.0,
                bagSizeLbs: 50,
                storageLocation: "Shed",
                storageNotes: "Dry storage. Reseal after each use. Clumping is cosmetic."
            ),
            InventoryItem(
                name: "Hydr8",
                category: .soilAmendment,
                brand: "Yard Mastery",
                productURL: "https://yardmastery.com/products/hydr8-liquicuretm-soil-surfactant-wetting-agent",
                storageLocation: "Garage",
                storageNotes: "Do NOT freeze. Keep sealed, out of direct sun. Store above 32°F."
            ),
            InventoryItem(
                name: "TZone",
                category: .herbicide,
                brand: "PBI Gordon",
                productURL: "https://yardmastery.com",
                storageLocation: "Locked cabinet",
                storageNotes: "Follow label. Cool, dry, locked storage. Do not freeze."
            ),
            InventoryItem(
                name: "Mower",
                category: .equipment,
                storageLocation: "Garage",
                storageNotes: "Store with stabilized fuel or drain tank for winter."
            )
        ]
    }
}
