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

    // MARK: - Photo audit data (2026-04-25)
    // Returns (observation, confidence) for each head from the photo audit.
    // confidence values: "high", "med", "low", "blocked"
    static func auditData(for label: String) -> (obs: String, conf: String) {
        switch label {
        // Z2 park strip
        case "Z2-S1": return ("Rain Bird VAN yellow nozzle (text legible on cap). Hunter PROS-04 body. ~4 ft radius per label print. Park strip east end, next to driveway.", "high")
        case "Z2-S2": return ("Rain Bird 1555 fixed spray (photo-3 confirms single fan-spray pattern across driveway). Hunter Pro-Spray body. Park strip east, concrete apron.", "high")
        case "Z2-S3": return ("Rain Bird 1555ST fixed spray — text stamped on white nozzle ring and fully legible. Hunter Pro-Spray body. Park strip mid, narrow mulch strip.", "high")
        case "Z2-S4": return ("Rain Bird VAN yellow (yellow cap body + 'INCREASE+' arrow stamping visible). Hunter Pro-Spray body. Park strip far west end.", "high")
        case "Z2-S5": return ("BLOCKED — empty nozzle slot packed with dirt. No nozzle hardware present. Hunter Pro-Spray body only. Must clear slot and install nozzle before use.", "blocked")
        case "Z2-S6": return ("BLOCKED — buried in 4-5\" erosion pit. Head cannot pop up. Calcium-encrusted cap. Hunter Pro-Spray body only. Needs dig-out, swing-pipe raise, then re-photo.", "blocked")
        // Z2 front yard
        case "Z2-S7":  return ("MP Rotator, cream cap (likely MP1000, 8-15 ft). Hunter Pro-Spray body. Geared rotator visible top-down. North-most front yard head.", "high")
        case "Z2-S8":  return ("BLOCKED — empty nozzle slot packed with dirt. Same failure as S5. Hunter Pro-Spray body only. Clear slot and install nozzle.", "blocked")
        case "Z2-S9":  return ("MP Rotator, teal/sea-green cap (MP800 SR family, 6-12 ft, 0-30° arc). Photo-3 confirms multi-stream rotating pattern.", "high")
        case "Z2-S10": return ("MP Rotator, dark cap (MP800 or MP1000). Photo-3 confirms multi-stream rotating pattern.", "high")
        case "Z2-S11": return ("BLOCKED — empty nozzle slot packed with dirt. Same failure as S5 and S8. Hunter Pro-Spray body only.", "blocked")
        case "Z2-S12": return ("MP Rotator, cobalt blue cap (MP2000, 13-21 ft). Distinctive cobalt blue cap clearly visible.", "high")
        case "Z2-S13": return ("MP Rotator, cream cap (likely MP1000, 8-15 ft). 'Hunter' stamping + cream rotator cap visible.", "high")
        case "Z2-S14": return ("Hunter Pro-Spray body with 'PROS-04', 'PRS40' (40 PSI pressure-regulating), 'CHECK VALVE' markings. Nozzle center unclear in photos — fan or MP Rotator. Field re-photo needed while running.", "low")
        case "Z2-S15": return ("MP Rotator, cobalt blue cap (MP2000, 13-21 ft). Body + blue cap both legible.", "high")
        case "Z2-S16": return ("MP Rotator, cobalt blue cap (MP2000). Distinctive cobalt blue cap.", "high")
        case "Z2-S17": return ("Conflicting signals: photo-1 shows gear pattern (MP Rotator?), photo-3 shows single fan-spray pattern (fixed spray?). Needs field re-photo with clean close-up + running confirmation.", "low")
        case "Z2-S18": return ("BLOCKED — nozzle slot dark and encrusted. Hunter Pro-Spray body legible but nozzle hardware not visible. Clear and re-photo.", "blocked")
        // Z3 new (north) heads
        case "Z3-S1":  return ("MP Rotator-style turret visible inside white ring. Hunter Pro-Spray body. Only head missing a running photo — re-photo next valve-on.", "med")
        case "Z3-S2":  return ("MP Rotator, cream cap (likely MP1000, 8-15 ft). Hunter Pro-Spray body. Cream cap + gear clearly visible.", "high")
        case "Z3-S3":  return ("Hunter Pro-Spray body. Nozzle shows radial slots from above — consistent with either fixed spray or MP Rotator. Running photo recommended.", "med")
        case "Z3-S4":  return ("MP Rotator, cream/tan cap (likely MP1000). Hunter Pro-Spray body. Geared rotator visible.", "high")
        case "Z3-S5":  return ("MP Rotator, dark cap (MP800 or MP1000). Hunter Pro-Spray body. 'Hunter' + gear turret visible; cap color reads dark/charcoal.", "med")
        case "Z3-S6":  return ("MP Rotator, dark cap. Hunter Pro-Spray body. Similar appearance to S5.", "med")
        // Z3 legacy heads (was H3-1..H3-5)
        case "Z3-S7":  return ("MP Rotator, dark cap. Hunter Pro-Spray body (NW corner). Partially buried — turret + gear visible. Was H3-1.", "med")
        case "Z3-S8":  return ("MP Rotator, RED cap (MP3000, 22-30 ft). Hunter Pro-Spray body. Red cap is distinctive. Was H3-2.", "high")
        case "Z3-S9":  return ("MP Rotator, RED cap (MP3000). Hunter Pro-Spray body. Was H3-3.", "high")
        case "Z3-S10": return ("MP Rotator, RED cap (MP3000). Hunter Pro-Spray body. Was H3-4.", "high")
        case "Z3-S11": return ("MP Rotator, RED cap (MP3000). Hunter Pro-Spray body. Partly buried. Was H3-5.", "high")
        // Z4 back yard
        case "Z4-S1":  return ("BLOCKED — head fully submerged in mud at house corner. None of 3 photos show visible head or nozzle. Highest-priority blocked head (zero coverage). Needs dig-out.", "blocked")
        case "Z4-S2":  return ("MP Rotator, dark cap. Hunter Pro-Spray body. Running photo inconclusive — verify during season test.", "med")
        case "Z4-S3":  return ("MP Rotator, cream cap (likely MP1000). Hunter Pro-Spray body. Cream cap geared rotator clearly visible.", "high")
        case "Z4-S4":  return ("MP Rotator, dark cap. Hunter Pro-Spray body. Geared cap visible from above.", "med")
        case "Z4-S5":  return ("MP Rotator, dark cap. Hunter Pro-Spray body ('PRO-SPRAY' stamped). Running photo inconclusive.", "med")
        case "Z4-S6":  return ("MP Rotator, RED cap (MP3000, 22-30 ft). Hunter Pro-Spray body. Red cap distinctive.", "high")
        case "Z4-S7":  return ("BLOCKED — partially buried at sidewalk edge. Turret visible but cap not legible. Needs clearing and re-photo.", "blocked")
        case "Z4-S8":  return ("MP Rotator, RED cap (MP3000). Hunter Pro-Spray body ('PRO-SPRAY' stamped). Red cap distinctive.", "high")
        case "Z4-S9":  return ("MP Rotator, dark cap. Hunter Pro-Spray body ('PRO-SPRAY' fully legible). Gear cap visible.", "high")
        case "Z4-S10": return ("MP Rotator, RED cap (MP3000). Hunter Pro-Spray body.", "high")
        case "Z4-S11": return ("MP Rotator, dark cap (small, partially obscured). Hunter Pro-Spray body.", "med")
        case "Z4-S12": return ("MP Rotator, RED cap (MP3000). Hunter Pro-Spray body.", "high")
        default: return ("", "")
        }
    }

    // MARK: - Public entry point
    static func seededBlob() -> FairwayBlob {
        var blob = FairwayBlob()
        blob.zones = seedZones()
        blob.soilTest = seedSoilTest()
        blob.fertilizerPlan = seedFertilizerPlan()
        blob.maintenanceTasks = seedMaintenanceTasks()
        blob.mowLog = []
        let ifaID = UUID()
        blob.inventory = seedInventory(ifaID: ifaID)
        blob.fertApplications = [seedIFAOverApplication(ifaID: ifaID)]
        // Centroid of all 41 KML-sourced head coordinates (Z2-S1..S18 front yard,
        // Z3-S1..S11 side yard, Z4-S1..S12 back yard). Original seed had wrong coords.
        blob.property = PropertySettings(address: "345 E 170 N, Vineyard, UT 84059",
                                         latitude: 40.3004, longitude: -111.7456)
        blob.observations = seedObservations()
        blob.seeded = true
        return blob
    }

    private static func seedObservations() -> [LawnObservation] {
        [
            LawnObservation(zoneNumber: 4, text: "Possible grub activity near Zone 4 NW corner — need to investigate")
        ]
    }

    static var previewBlob: FairwayBlob { seededBlob() }

    // MARK: - Phase 0 shared helpers (2026-04-23 IFA over-application + Z2 catalog)
    //
    // These helpers are called by both `seededBlob()` for fresh installs AND
    // `FairwayStore.applyPhase0MigrationIfNeeded()` for existing installs whose
    // blob was seeded before the companion plan shipped.

    static func phase0Z2Heads() -> [HeadData] {
        // Provisional matching (KML pin → Z2-Sn) per HANDOFF.md 2026-04-24.
        // Z2-S1..S6 = 6 numbered park-strip pins; Z2-S7..S18 = 12 color-named front-yard pins.
        // Photo dirs for S1..S6 stay under Z2-MATCH-{1st..6th}/ until field-confirmed (then mv).
        var heads: [HeadData] = [
            {
                let a = auditData(for: "Z2-S1")
                return HeadData(
                    label: "Z2-S1",
                    headType: "Hunter Pro-Spray",
                    nozzle: "Rain Bird VAN yellow",
                    arcDegrees: 90,
                    radiusFeet: 4,
                    location: "Park strip east end, next to driveway concrete. Got over-applied fert 2026-04-23.",
                    notes: "KML pin: 1st Sprinkler.",
                    isConfirmed: false,
                    latitude: 40.30028099196461,
                    longitude: -111.7455404391101,
                    photoPaths: ["heads/Z2-MATCH-1st/photo-1.jpg","heads/Z2-MATCH-1st/photo-2.jpg","heads/Z2-MATCH-1st/photo-3.jpg"],
                    auditObservation: a.obs, auditConfidence: a.conf
                )
            }(),
            {
                let a = auditData(for: "Z2-S2")
                return HeadData(
                    label: "Z2-S2",
                    headType: "Hunter Pro-Spray",
                    nozzle: "Rain Bird 1555 fixed spray",
                    arcDegrees: 180,
                    location: "Park strip east end, large concrete apron. Got over-applied fert 2026-04-23.",
                    notes: "KML pin: 6th Sprinkler.",
                    isConfirmed: false,
                    latitude: 40.30026935353735,
                    longitude: -111.7455993735302,
                    photoPaths: ["heads/Z2-MATCH-6th/photo-1.jpg","heads/Z2-MATCH-6th/photo-2.jpg","heads/Z2-MATCH-6th/photo-3.jpg"],
                    auditObservation: a.obs, auditConfidence: a.conf
                )
            }(),
            {
                let a = auditData(for: "Z2-S3")
                return HeadData(
                    label: "Z2-S3",
                    headType: "Hunter Pro-Spray",
                    nozzle: "Rain Bird 1555ST fixed spray",
                    arcDegrees: 180,
                    location: "Park strip mid, narrow mulch strip by curb. Dormant ring — under-coverage symptom. Got over-applied fert 2026-04-23.",
                    notes: "KML pin: 2nd Sprinkler.",
                    isConfirmed: false,
                    issues: [.coverageGap],
                    latitude: 40.30026189777501,
                    longitude: -111.7455631374153,
                    photoPaths: ["heads/Z2-MATCH-2nd/photo-1.jpg","heads/Z2-MATCH-2nd/photo-2.jpg","heads/Z2-MATCH-2nd/photo-3.jpg"],
                    auditObservation: a.obs, auditConfidence: a.conf
                )
            }(),
            {
                let a = auditData(for: "Z2-S4")
                return HeadData(
                    label: "Z2-S4",
                    headType: "Hunter Pro-Spray",
                    nozzle: "Rain Bird VAN yellow",
                    arcDegrees: 180,
                    radiusFeet: 4,
                    location: "Park strip far west end. Got over-applied fert 2026-04-23.",
                    notes: "KML pin: 4th Sprinkler.",
                    isConfirmed: false,
                    latitude: 40.3002439130473,
                    longitude: -111.7456497901446,
                    photoPaths: ["heads/Z2-MATCH-4th/photo-1.jpg","heads/Z2-MATCH-4th/photo-2.jpg","heads/Z2-MATCH-4th/photo-3.jpg"],
                    auditObservation: a.obs, auditConfidence: a.conf
                )
            }(),
            {
                let a = auditData(for: "Z2-S5")
                return HeadData(
                    label: "Z2-S5",
                    headType: "Hunter Pro-Spray",
                    nozzle: "TBD — nozzle slot empty (dirt-packed)",
                    arcDegrees: 180,
                    location: "Park strip west, sidewalk side. Got over-applied fert 2026-04-23.",
                    notes: "KML pin: 5th Sprinkler. CORRECTION: prior seed claimed MP Rotator. Photo shows empty slot. Needs field check.",
                    isConfirmed: false,
                    issues: [.cloggedNozzle],
                    latitude: 40.30026159439472,
                    longitude: -111.745632151369,
                    photoPaths: ["heads/Z2-MATCH-5th/photo-1.jpg","heads/Z2-MATCH-5th/photo-2.jpg","heads/Z2-MATCH-5th/photo-3.jpg"],
                    auditObservation: a.obs, auditConfidence: a.conf
                )
            }(),
            {
                let a = auditData(for: "Z2-S6")
                return HeadData(
                    label: "Z2-S6",
                    headType: "Hunter Pro-Spray",
                    nozzle: "Buried — nozzle TBD after dig-out",
                    arcDegrees: 180,
                    location: "Park strip mid-north, sidewalk side. BURIED in 4–5\" erosion pit. Needs dig-out + swing-pipe raise. Got over-applied fert 2026-04-23.",
                    notes: "KML pin: 3rd Sprinkler. Heavily clogged with calcium + dirt.",
                    isConfirmed: false,
                    issues: [.tiltedHead, .coverageGap],
                    latitude: 40.30025224491366,
                    longitude: -111.7456124798277,
                    photoPaths: ["heads/Z2-MATCH-3rd/photo-1.jpg","heads/Z2-MATCH-3rd/photo-2.jpg","heads/Z2-MATCH-3rd/photo-3.jpg"],
                    auditObservation: a.obs, auditConfidence: a.conf
                )
            }()
        ]

        // Z2-S7..S18 = 12 front-yard color-named KML pins, sorted N→S by latitude.
        // Nozzle/arc TBD during season test; isConfirmed: false. Defaults: arc 180°.
        let frontYard: [(label: String, kmlName: String, lat: Double, lon: Double, photoCount: Int)] = [
            ("Z2-S7",  "grey",            40.30036257724772, -111.7456576627038, 3),
            ("Z2-S8",  "black",           40.30033912476767, -111.7455996651123, 3),
            ("Z2-S9",  "green",           40.30033526776812, -111.7456538330628, 3),
            ("Z2-S10", "Black",           40.30033220970269, -111.7456284823084, 3),
            ("Z2-S11", "black",           40.30033049080497, -111.7456749984465, 3),
            ("Z2-S12", "blue Sprinkler",  40.30032502234945, -111.7455562457889, 3),
            ("Z2-S13", "grey",            40.30031846380709, -111.7455899331795, 3),
            ("Z2-S14", "Black",           40.30030750592285, -111.745666148677,  3),
            ("Z2-S15", "Blue",            40.30030673853877, -111.745615152674,  4),
            ("Z2-S16", "Blue",            40.30029540993178, -111.7455465149624, 3),
            ("Z2-S17", "black",           40.30028746463701, -111.7456077864582, 3),
            ("Z2-S18", "black",           40.30027270460789, -111.7456575402995, 3)
        ]
        for (idx, entry) in frontYard.enumerated() {
            let position = idx + 1
            let a = auditData(for: entry.label)
            heads.append(HeadData(
                label: entry.label,
                headType: "Hunter Pro-Spray",
                nozzle: "TBD — confirm during season test",
                arcDegrees: 180,
                location: "Front yard, position N→S #\(position) of 12",
                notes: "KML pin: \(entry.kmlName)",
                isConfirmed: false,
                latitude: entry.lat,
                longitude: entry.lon,
                photoPaths: (1...entry.photoCount).map { "heads/\(entry.label)/photo-\($0).jpg" },
                auditObservation: a.obs,
                auditConfidence: a.conf
            ))
        }
        return heads
    }

    static func phase0Z2MixedPrecipProblem() -> ProblemData {
        ProblemData(
            title: "Z2 mixed precip rate (park strip nozzle inconsistency)",
            description: "Park strip heads run a mix of Rain Bird VAN yellow (~0.5 in/hr at 4 ft), Rain Bird 1555 fixed spray (~1.5 in/hr), and one head (S5) with an empty/dirt-packed nozzle slot. Run-time tuning cannot reconcile this on a single valve.",
            severity: .high,
            isPreSeason: false,
            dateLogged: date(2026, 4, 23),
            actions: [
                "Standardize Z2 park strip on MP Rotators (matching radius per location)",
                "Replace S5 (empty/dirt-packed slot) with MP Rotator 1000-360",
                "Verify each replacement nozzle's radius vs. its location before installing",
                "After swap, expect ~3× longer run time (MP ~0.4 in/hr vs sprays ~1.5 in/hr)"
            ]
        )
    }

    static func phase0IFAItem(id: UUID = UUID()) -> InventoryItem {
        InventoryItem(
            id: id,
            name: "IFA Crabgrass Preventer + Lawn Food 23-3-8",
            category: .fertilizer,
            brand: "IFA",
            productSource: "IFA Store",
            notes: "Pre-emergent + starter N. Apply BEFORE soil temps hit 55°F (Vineyard window: mid-Mar → late-Apr). Water in 0.25–0.5\" within 24–48h. No aerate/dethatch for 8–12 wk.",
            lastUsedDate: date(2026, 4, 23),
            spreaderSettings: [
                SpreaderSetting(
                    spreaderModel: "Spyker HHS100",
                    setting: "3.5",
                    notes: "Used 2026-04-23 WITHOUT calibration test → over-applied 62%. Future use: do the 100 sq ft TARE calibration first."
                )
            ],
            defaultRatePer1000SqFt: 4.0,
            bagSizeLbs: 25,
            currentStockLbs: 7.2,
            lastStockUpdateDate: date(2026, 4, 23),
            usageLog: [
                UsageEntry(
                    date: date(2026, 4, 23),
                    amountLbs: 17.8,
                    zonesApplied: [2, 3, 4],
                    notes: "Over-applied 62% — skipped calibration. Target 11 lb, applied 17.8 lb across 2,737 sq ft (6.5 lb/1,000 vs target 4.0)."
                )
            ],
            storageLocation: "Shed",
            storageNotes: "Cool, dry. Reseal bag after use."
        )
    }

    static func phase0IFAApplication(ifaID: UUID) -> FertApplication {
        FertApplication(
            date: date(2026, 4, 23),
            inventoryItemID: ifaID,
            productName: "IFA Crabgrass Preventer + Lawn Food 23-3-8",
            zoneNumbers: [2, 3, 4],
            amountLbs: 17.8,
            notes: "Spyker HHS100 dial 3.5. OVER-APPLIED 62% (target 11 lb / 4 lb per 1,000 sq ft; applied 17.8 lb / 6.5 lb per 1,000). Includes park strip (on Z2 valve). Cause: skipped calibration. Recovery: 75min Quick Run + 30min AM top-off. Skip next app until late June at HALF rate (2 lb per 1,000). No aerate until 2026-07-16."
        )
    }

    static func phase0RecoveryTasks() -> [MaintenanceTask] {
        [
            MaintenanceTask(
                title: "Water in IFA pre-emergent (0.25–0.5\") — TONIGHT 75min + AM 30min top-off",
                category: .irrigation,
                targetDate: date(2026, 4, 24),
                notes: "Z2/Z3/Z4 only. Skip Z1 (flower beds). Z2 covers park strip automatically.",
                reminderEnabled: true
            ),
            MaintenanceTask(
                title: "Pre-emergent active — no aerate/dethatch (over-app extends barrier)",
                category: .weedControl,
                targetDate: date(2026, 7, 16),
                notes: "Over-app 2026-04-23 → pre-emergent barrier runs longer. No mechanical disturbance until this date.",
                reminderEnabled: true
            ),
            MaintenanceTask(
                title: "Burn check Z2 (incl. park strip) / Z3 / Z4 — yellowing tips, brown stripes",
                category: .inspection,
                targetDate: date(2026, 5, 3),
                notes: "Daily 2026-04-24 → 2026-05-03. Watch fert lines + edges first. Park strip is highest-risk — concrete heat + already-stressed grass.",
                reminderEnabled: true
            ),
            MaintenanceTask(
                title: "Late-June fert — HALF RATE (2 lb/1,000 sq ft) — slow-release N",
                category: .seasonal,
                targetDate: date(2026, 6, 23),
                notes: "Half rate because 2026-04-23 over-applied IFA 62%. CALIBRATE FIRST (100 sq ft TARE test).",
                reminderEnabled: true
            ),
            MaintenanceTask(
                title: "October overseeding window — repair thin spots",
                category: .seasonal,
                targetDate: date(2026, 9, 15),
                notes: "Window: mid-Sep → mid-Oct. KBG over-seed any thin spots from spring over-app — especially park strip.",
                reminderEnabled: true
            ),
            MaintenanceTask(
                title: "Measure park strip width + check S5 MP cap color (blue=MP1000, purple=MP800SR)",
                category: .inspection,
                targetDate: date(2026, 4, 26),
                notes: "Determines whether to order MP1000 (10–15ft radius) or MP800SR (8–12ft) for the swap. 4-6ft wide strip → MP800SR; 6-8ft → MP1000. Match what's already on S5.",
                zoneNumber: 2,
                reminderEnabled: true
            ),
            MaintenanceTask(
                title: "Order 5× MP Rotator nozzles (model TBD)",
                category: .irrigation,
                targetDate: date(2026, 4, 27),
                notes: "Need 5 (S5 already has one). ~$8-10 each. Amazon or Hunter dealer. Model confirmed by prior measure-strip task.",
                zoneNumber: 2,
                reminderEnabled: true
            ),
            MaintenanceTask(
                title: "Dig out Z2-S6 (buried head) — raise to grade with swing pipe",
                category: .irrigation,
                targetDate: date(2026, 4, 25),
                notes: "Sitting in 4–5\" erosion pit. Identify nozzle once exposed. Add to MP swap order if not already MP.",
                zoneNumber: 2,
                reminderEnabled: true
            ),
            MaintenanceTask(
                title: "Install 5× MP Rotator nozzles on Z2 + adjust arc/radius per head",
                category: .irrigation,
                targetDate: date(2026, 5, 4),
                notes: "Match S5 model. Tune arc to avoid sidewalk/street overspray. Run-time after swap: ~3× longer Z2 (MP delivers ~0.4 in/hr vs sprays at ~1.5 in/hr). If Z2 was 15 min on sprays, it'll need ~45 min on MP for same precip.",
                zoneNumber: 2,
                reminderEnabled: true
            )
        ]
    }

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
        let bedA = ShrubBed(
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

        let bedB = ShrubBed(
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

        let bedC = ShrubBed(
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

        zone.heads = phase0Z2Heads()

        zone.problemAreas = [phase0Z2MixedPrecipProblem()]

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

    /// 6 new Z3 heads added by the 2026-04-25 KML reimport (north of the
    /// original 5 red pins). Public so `applyPhase1ZoneMigrationIfNeeded()`
    /// can append them to existing on-device blobs without going through
    /// the full zone3() seed.
    static func phase1Z3NewHeads() -> [HeadData] {
        let specs: [(String, String, Double, Double, [String])] = [
            ("Z3-S1", "KML pin: b yellow.", 40.30053473638974, -111.7457401702552,
             ["heads/Z3-S1/photo-1.jpg","heads/Z3-S1/photo-2.jpg"]),
            ("Z3-S2", "KML pin: b yellow.", 40.30051924957012, -111.7456873490801,
             ["heads/Z3-S2/photo-1.jpg","heads/Z3-S2/photo-2.jpg","heads/Z3-S2/photo-3.jpg","heads/Z3-S2/photo-4.jpg"]),
            ("Z3-S3", "KML pin: b black.", 40.30049601145916, -111.7457236854322,
             ["heads/Z3-S3/photo-1.jpg","heads/Z3-S3/photo-2.jpg","heads/Z3-S3/photo-3.jpg"]),
            ("Z3-S4", "KML pin: B black.", 40.30049509265507, -111.7456179983093,
             ["heads/Z3-S4/photo-1.jpg","heads/Z3-S4/photo-2.jpg","heads/Z3-S4/photo-3.jpg"]),
            ("Z3-S5", "KML pin: B Black.", 40.30047305730761, -111.7456258168152,
             ["heads/Z3-S5/photo-1.jpg","heads/Z3-S5/photo-2.jpg","heads/Z3-S5/photo-3.jpg"]),
            ("Z3-S6", "KML pin: b black.", 40.30046482949889, -111.7456645151178,
             ["heads/Z3-S6/photo-1.jpg","heads/Z3-S6/photo-2.jpg","heads/Z3-S6/photo-3.jpg"])
        ]
        return specs.map { (label, notes, lat, lon, paths) in
            let a = auditData(for: label)
            return HeadData(label: label, headType: "Hunter Pro-Spray", nozzle: "TBD",
                            arcDegrees: 0, location: "", notes: notes, isConfirmed: false,
                            latitude: lat, longitude: lon, photoPaths: paths,
                            auditObservation: a.obs, auditConfidence: a.conf)
        }
    }

    static func zone3() -> ZoneData {
        var zone = ZoneData(
            number: 3,
            name: "West Side",
            type: .coolSeasonGrass,
            squareFootage: 998,
            headType: "Hunter (series TBD)",
            notes: "West side yard along fence."
        )

        let legacySpecs: [(String, Int, String, String, Bool, Double, Double, [String])] = [
            ("Z3-S7", 90, "NW corner", "KML pin: b blue (red marker, NW-most). Was H3-1.", true,
             40.30045489168911, -111.7457086814581,
             ["heads/Z3-S7/photo-1.jpg","heads/Z3-S7/photo-2.jpg","heads/Z3-S7/photo-3.jpg"]),
            ("Z3-S8", 180, "West fence N", "KML pin: b red. Was H3-2.", true,
             40.30044324011, -111.7456786858868,
             ["heads/Z3-S8/photo-1.jpg","heads/Z3-S8/photo-2.jpg","heads/Z3-S8/photo-3.jpg"]),
            ("Z3-S9", 180, "West fence mid", "KML pin: b red. Was H3-3.", true,
             40.30039406539294, -111.7456939001862,
             ["heads/Z3-S9/photo-1.jpg","heads/Z3-S9/photo-2.jpg","heads/Z3-S9/photo-3.jpg"]),
            ("Z3-S10", 180, "West fence S", "KML pin: b red. Was H3-4.", true,
             40.3003882496641, -111.745666648806,
             ["heads/Z3-S10/photo-1.jpg","heads/Z3-S10/photo-2.jpg","heads/Z3-S10/photo-3.jpg"]),
            ("Z3-S11", 90, "SW corner (unconfirmed)", "KML pin: B bred (visible in property overhead). Was H3-5.", false,
             40.30036387431078, -111.7456811868022,
             ["heads/Z3-S11/photo-1.jpg","heads/Z3-S11/photo-2.jpg","heads/Z3-S11/photo-3.jpg","heads/Z3-S11/photo-4.jpg"])
        ]
        zone.heads = phase1Z3NewHeads() + legacySpecs.map { (label, arc, loc, notes, confirmed, lat, lon, paths) in
            let a = auditData(for: label)
            return HeadData(label: label, headType: "Hunter Pro-Spray", nozzle: "TBD",
                            arcDegrees: arc, location: loc, notes: notes, isConfirmed: confirmed,
                            latitude: lat, longitude: lon, photoPaths: paths,
                            auditObservation: a.obs, auditConfidence: a.conf)
        }

        zone.problemAreas = [
            ProblemData(
                title: "Misdirected head near foundation",
                description: "Spraying foundation wall.",
                severity: .medium,
                isPreSeason: true,
                actions: [
                    "Identify which Z3 head is hitting the wall during first runtime test",
                    "Adjust arc and direction; cap radius to clear the foundation",
                    "Photograph the corrected spray pattern for the head record"
                ]
            ),
            ProblemData(
                title: "Nozzle type unconfirmed",
                description: "Need to identify nozzle series during season test.",
                severity: .low,
                isPreSeason: true,
                actions: [
                    "Walk Z3 during a season-test cycle and ID nozzle family per head",
                    "Update HeadData.nozzle for each Z3-S* head from \"TBD\"",
                    "Recompute zone precip rate once the dominant family is confirmed"
                ]
            )
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

    /// Zone 4 = Back Yard. 12 Hunter Pro-Spray heads from the 2026-04-25 KML
    /// reimport (replaces the original 3-head "East Side" placeholder).
    /// Per-head nozzle/arc/GPM data is TBD and gets filled by Chase in-app
    /// during the season-test walk.
    static func zone4() -> ZoneData {
        var zone = ZoneData(
            number: 4,
            name: "Back Yard",
            type: .coolSeasonGrass,
            squareFootage: 711,
            headType: "Hunter Pro-Spray (TBD)",
            notes: "Back yard rectangle along rear fence."
        )

        let kmlNotes: [(String, String, Double, Double)] = [
            ("Z4-S1",  "b",       40.30058142169406, -111.7455279973688),
            ("Z4-S2",  "b",       40.3005726591168,  -111.7455549783393),
            ("Z4-S3",  "b",       40.30056725921459, -111.7455952106812),
            ("Z4-S4",  "b",       40.30055654324736, -111.7456475876912),
            ("Z4-S5",  "b black", 40.30054929673655, -111.7456775591771),
            ("Z4-S6",  "b red",   40.30054712884959, -111.7455114782393),
            ("Z4-S7",  "b black", 40.30053944550406, -111.7455525895473),
            ("Z4-S8",  "b red",   40.30052629371446, -111.7455312767651),
            ("Z4-S9",  "b black", 40.30051933702742, -111.7455873320466),
            ("Z4-S10", "b red",   40.30051213845528, -111.7456197989494),
            ("Z4-S11", "b black", 40.30050961696043, -111.7455064083307),
            ("Z4-S12", "b black", 40.30048656264817, -111.745501230088)
        ]

        zone.heads = kmlNotes.map { (label, kmlName, lat, lon) in
            let a = auditData(for: label)
            return HeadData(
                label: label,
                headType: "Hunter Pro-Spray",
                nozzle: "TBD",
                arcDegrees: 0,
                location: "",
                notes: "KML pin: \(kmlName).",
                isConfirmed: false,
                latitude: lat,
                longitude: lon,
                photoPaths: ["heads/\(label)/photo-1.jpg","heads/\(label)/photo-2.jpg","heads/\(label)/photo-3.jpg"],
                auditObservation: a.obs,
                auditConfidence: a.conf
            )
        }

        zone.problemAreas = [
            ProblemData(
                title: "Coverage gaps to verify",
                description: "12 heads brand new from KML — coverage map unconfirmed.",
                severity: .medium,
                isPreSeason: true,
                actions: [
                    "Run Z4 for 5 min and walk the back yard during the burst",
                    "Mark dry corners and overlap zones on the property photo",
                    "Photograph each head while running for the head record"
                ]
            ),
            ProblemData(
                title: "Nozzle types unconfirmed",
                description: "All 12 heads need nozzle ID during season test.",
                severity: .medium,
                isPreSeason: true,
                actions: [
                    "ID nozzle family on each Z4-S* head during first runtime",
                    "Update HeadData.nozzle for all 12 heads from \"TBD\"",
                    "Photograph nozzle markings (top-down close-up) for audit"
                ]
            ),
            ProblemData(
                title: "Cycle time TBD pending PR test",
                description: "PR unknown until nozzles identified.",
                severity: .low,
                isPreSeason: true,
                actions: [
                    "After nozzle ID, set zone precipitationRate from the dominant family",
                    "Run a tuna-can audit (4–6 cans across the zone, 15-min run)",
                    "Update ScheduleData.cycleMinutes to match measured PR"
                ]
            )
        ]

        zone.schedule = ScheduleData(
            mode: "Flex Daily",
            cycleMinutes: 3,
            soakMinutes: 45,
            cycles: 3,
            startTime: "5:30 AM",
            precipitationRate: 1.5,
            grassType: "KBG",
            nozzleType: "TBD",
            notes: "PR to be confirmed during season test."
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
        ] + phase0RecoveryTasks()
    }

    private static func seedIFAOverApplication(ifaID: UUID) -> FertApplication {
        phase0IFAApplication(ifaID: ifaID)
    }

    // MARK: - Inventory

    private static func seedInventory(ifaID: UUID = UUID()) -> [InventoryItem] {
        [
            InventoryItem(
                name: "Spyker HHS100 Handheld Spreader",
                category: .equipment,
                brand: "Spyker",
                spreaderCapacityLbs: 5.0,
                storageLocation: "Garage",
                storageNotes: "Rinse thoroughly after each use. Store dry."
            ),
            phase0IFAItem(id: ifaID),
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
