# QA Checklist

Use this before every beta and before release.

## Core flow
- user can launch the app
- user can complete the main flow
- user can create data successfully
- user can edit data successfully
- user can delete data successfully
- data persists after relaunch

## Empty states
- empty home screen is understandable
- empty list state is understandable
- empty search state is understandable
- empty history/summary states make sense

## Error states
- required field validation works
- save failure is handled
- delete confirmation works
- permission denial is handled if relevant

## Navigation
- every screen can be reached
- back navigation works
- tabs switch correctly
- modals dismiss correctly

## Accessibility
- text is readable
- controls have enough contrast
- tap targets are large enough
- state is not communicated by color alone

## Device testing
- test on at least one real iPhone
- test on small and large screen sizes if possible
- test dark mode if supported
- test airplane/offline mode if relevant

## Stability
- no obvious crashes
- no broken layouts
- no blocked core actions

## Release readiness
- app icon present
- screenshots ready
- version/build number updated
- privacy info prepared
