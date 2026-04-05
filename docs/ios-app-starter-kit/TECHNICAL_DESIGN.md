# Technical Design

Use this doc to decide how the app should be built.

## Recommended default stack
- Swift
- SwiftUI
- MVVM
- async/await
- SwiftData
- Swift Package Manager
- Xcode
- GitHub
- TestFlight

## Final chosen stack
Document the actual stack for this project.

### UI
[SwiftUI / other]

### Architecture
[MVVM / other]

### State management
[@State / @Observable / @Environment / etc.]

### Persistence
[SwiftData / Core Data / other]

### Networking
[None / URLSession / other]

### Backend
[None for V1 unless required]

### Analytics
[None / lightweight analytics]

## Why this stack
Explain why it matches the project.

## App structure
Recommended top-level folders:
- App
- Core
- Features
- Services
- Models
- ViewModels
- Views
- Resources
- Utilities

## Per-feature structure
Each feature may include:
- FeatureNameView
- FeatureNameViewModel
- FeatureNameModel
- FeatureNameService

## Data model
List all main models and fields.
- Model:
  - fields:
- Model:
  - fields:

## Data flow
Explain how data moves through the app.
Example:
View → ViewModel → Service / Persistence → Model → View

## Dependencies
List packages and why they are needed.

## Persistence design
What is stored locally?
What is cached?
What is derived?

## Error handling approach
How should errors be surfaced to the UI?

## Testing approach
- unit tests
- UI tests
- smoke tests on device

## Accessibility requirements
- readable contrast
- large tap targets
- Dynamic Type support where possible
- status should not rely only on color

## Risks
- architecture too complex
- dependency creep
- backend added too early
- weak separation of concerns
