# Irrigation Optimizer — iOS App
## Claude Code Project Instructions

### Project Purpose
Build a native iOS app (SwiftUI) that serves as a smart irrigation management companion for a Rachio smart controller system. The app helps homeowners track zone health, log field observations, manage head inventories, and surface Rachio schedule recommendations — all backed by persistent local storage.

### Tech Stack
- **Language:** Swift 5.9+
- **UI Framework:** SwiftUI
- **Minimum Deployment Target:** iOS 17.0
- **Data Persistence:** SwiftData (preferred) or Core Data
- **Architecture:** MVVM
- **No external dependencies** — use only Apple frameworks

### Project Structure
```
IrrigationOptimizer/
├── IrrigationOptimizerApp.swift
├── Models/
│   ├── Zone.swift
│   ├── IrrigationHead.swift
│   ├── ProblemArea.swift
│   └── ScheduleRecommendation.swift
├── ViewModels/
│   ├── ZoneListViewModel.swift
│   └── ZoneDetailViewModel.swift
├── Views/
│   ├── ContentView.swift
│   ├── ZoneListView.swift
│   ├── ZoneDetailView.swift
│   ├── HeadInventoryView.swift
│   ├── ProblemAreaView.swift
│   └── ScheduleView.swift
├── Resources/
│   └── Assets.xcassets
└── Preview Content/
    └── PreviewData.swift
```

### Core Features (MVP)

1. **Zone Dashboard** — card-based list of all 4 zones with status indicators
2. **Zone Detail** — per-zone view with tabs: Heads, Problems, Schedule
3. **Head Inventory** — add/edit/delete sprinkler heads with field notes
4. **Problem Tracker** — log problem areas with confirmation status (pre-season vs confirmed)
5. **Schedule View** — display Rachio schedule settings per zone
6. **Pre-Season Flag** — visual badge system for unconfirmed/pre-season findings

### Data Models

#### Zone
```swift
@Model class Zone {
    var id: UUID
    var number: Int           // 1–4
    var name: String          // e.g. "Front Yard"
    var type: ZoneType        // .shrubs, .coolSeasonGrass
    var squareFootage: Int
    var headType: String      // e.g. "Hunter Pro-Spray"
    var notes: String
    var heads: [IrrigationHead]
    var problemAreas: [ProblemArea]
    var schedule: ScheduleRecommendation?
}

enum ZoneType: String, Codable, CaseIterable {
    case shrubs = "Shrubs/Bubblers"
    case coolSeasonGrass = "Cool Season Grass"
}
```

#### IrrigationHead
```swift
@Model class IrrigationHead {
    var id: UUID
    var label: String         // e.g. "H2-1"
    var zone: Zone?
    var headType: String      // e.g. "Hunter Pro-Spray"
    var nozzle: String        // e.g. "MP Rotator 1000"
    var arcDegrees: Int       // spray arc
    var location: String      // e.g. "NW corner of lawn"
    var notes: String
    var isConfirmed: Bool     // false = pre-season estimate
    var photoAttached: Bool
}
```

#### ProblemArea
```swift
@Model class ProblemArea {
    var id: UUID
    var zone: Zone?
    var title: String         // e.g. "Dry strip along east fence"
    var description: String
    var severity: Severity    // .low, .medium, .high
    var isPreSeason: Bool     // true = PRE-SEASON/UNCONFIRMED
    var isResolved: Bool
    var dateLogged: Date
}

enum Severity: String, Codable, CaseIterable {
    case low, medium, high
}
```

#### ScheduleRecommendation
```swift
@Model class ScheduleRecommendation {
    var id: UUID
    var zone: Zone?
    var mode: String           // e.g. "Flex Daily"
    var cycleMinutes: Int
    var soakMinutes: Int
    var runDaysPerWeek: Int
    var startTime: String      // e.g. "5:00 AM"
    var precipitationRate: Double  // inches/hour
    var notes: String
}
```

### Pre-Seeded Zone Data

Use this data to pre-populate the app on first launch:

**Zone 1 — Shurbs (Shrubs/Bubblers)**
- Sq ft: 106 (Rachio figure; estimated true ~115–145)
- Head type: Bubblers (estimated 5–8 heads)
- Plant types: Boxwoods, Hydrangeas, Ornamental tree, Groundcover
- Beds: Bed A (backyard along house), Bed B (near AC units), Bed C (driveway island)
- Key issue: Hydrangeas and boxwoods on same zone — different water needs
- Schedule mode: Flex Daily recommended

**Zone 2 — Front Yard**
- Sq ft: 1,028
- Grass: Kentucky Bluegrass (cool season)
- Head type: Hunter Pro-Spray pop-up
- Heads: H2-1 through H2-6 (estimated)
- Key issues: Dry spots in park strip and lawn center, overspray onto hardscape
- Schedule mode: Flex Daily, Cycle & Soak for Utah clay soil

**Zone 3 — West Side Backyard**
- Sq ft: 998
- Grass: Cool season (species unconfirmed)
- Head type: Hunter (series unconfirmed)
- Heads: H3-1 through H3-4 confirmed, H3-5 unconfirmed (east fence)
- Key issues: Coverage gap along east fence, possible misdirected head near foundation
- Schedule mode: Flex Daily, Cycle & Soak

**Zone 4 — East Side Backyard**
- Sq ft: 711
- Grass: Kentucky Bluegrass (cool season)
- Head type: Hunter Pro-Spray (fixed spray, NOT MP Rotators)
- Heads: H4-1 through H4-3
- Key issues: Dry strip along east fence (PRE-SEASON), overspray from H4-1 onto patio (confirmed)
- Schedule mode: Flex Daily, Cycle & Soak

### UI/UX Requirements

- **Color scheme:** Use green/blue tones consistent with irrigation/landscaping theme
- **Zone cards** should show: zone number, name, sq footage, head count, open problem count
- **Problem areas** must clearly show PRE-SEASON badge (orange/amber) vs CONFIRMED (red)
- **Status indicators:** Green (healthy), Yellow (attention), Red (action needed)
- **Empty states:** All list views need friendly empty state messages
- **Editing:** All fields should be editable inline or via edit sheets
- **Apple Notes integration hint:** Show a banner/tip on the Head Inventory view suggesting users can also track heads in Apple Notes for field use

### Soil & Climate Context (inform schedule defaults)
- Location: Vineyard, Utah (Utah County)
- Soil type: Clay-heavy (low infiltration rate — ~0.2 in/hr)
- Climate: Hot, dry summers
- Soil test completed April 2026 (Jimmy Lewis, jimmylewismows.com): pH 6.75 (optimal), Nitrogen low, Potassium very low, micronutrients broadly low, Calcium/Magnesium high (typical Utah clay)
- Fertilizer season plan is underway — ProPeat + IFA Humate + Yard Mastery products; Hydr8 wetting agent recommended monthly in summer to improve water infiltration through clay
- This means: Cycle & Soak is critical to prevent runoff; MP Rotator nozzles are preferred over fixed sprays for clay soils; Hydr8 application will compound irrigation efficiency gains

### Key Business Rules
1. Any finding marked `isPreSeason: true` must display "PRE-SEASON — UNCONFIRMED" badge
2. Zone 1 schedule should bias toward hydrangea water needs (more frequent)
3. Zones 2–4 should default to Flex Daily mode in Rachio schedule display
4. Cycle & Soak pattern for clay soil: run 3–5 min, soak 30–45 min, repeat 2–3 cycles
5. MP Rotator nozzles have ~0.4 in/hr precip rate; fixed sprays ~1.5–2.0 in/hr

### Testing
- Provide SwiftUI previews for all major views
- Use `PreviewData.swift` to supply mock Zone data for previews
- No unit test target required for MVP

### File Naming Conventions
- Views: `[Name]View.swift`
- ViewModels: `[Name]ViewModel.swift`  
- Models: singular noun, e.g. `Zone.swift`

### Xcode Project Setup Notes
- Bundle ID: `com.irrigation.optimizer`
- Display name: "Irrigation Optimizer"
- Supports: iPhone only (portrait + landscape)
- SwiftData container should be set up in the App entry point
