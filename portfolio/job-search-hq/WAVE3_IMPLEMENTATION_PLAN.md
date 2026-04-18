# Wave 3 Implementation Plan: Job Search HQ

## Executive Summary
Three remaining Wave 3 features to implement:
1. **Post-Interview Debrief Log** — structured feedback capture and review
2. **Application Velocity Dashboard** — weekly application targets and trend tracking
3. **Mock Interview Mode** — AI-assisted interview practice via copy-prompt pattern

All three are additive features with minimal breaking changes to existing data model. No charting library currently installed; **recharts** recommended for velocity dashboard.

---

## Feature 1: Post-Interview Debrief Log

### Overview
Capture structured feedback immediately after interviews. Store as timeline within each application. Display debrief history with sortable/filterable view.

### Data Model Changes
**Location**: `src/constants.js` → `blankApp()` function

Add new field to application object:
```javascript
interviewLog: [
  {
    id: uuid(),
    stageInterviewed: "Phone Screen" | "Interview" | "Final Round",
    dateCompleted: "2026-04-18",
    time: "14:30",
    duration: 45, // minutes
    interviewers: "Jane Doe, John Smith",
    interviewer_titles: "Senior PM, Hiring Manager",
    
    // Debrief structure
    overall_impression: "positive" | "neutral" | "negative",
    confidence_level: 1-5,
    
    // Feedback sections
    strengths: "Clear communication, strong examples...",
    gaps_addressed: "Lack of mobile experience → showed projects",
    improvements: "Could have asked more questions about team...",
    
    // Red flags / next steps
    red_flags: "Asked about competitor pricing (sensitive?)",
    next_steps: "They want case study by Friday",
    
    // Interview content notes
    key_questions_asked: "Walk me through a product failure...",
    competencies_tested: ["Problem solving", "Communication", "Technical depth"],
    
    notes: "Went longer than expected; great rapport with Jane",
    created_at: "2026-04-18T14:35:00Z"
  }
]
```

### Component Architecture
**New Tab**: Add to main tab bar → `DebriefTab.jsx`

**Sub-sections**:
1. **Quick Add Debrief** (form at top)
   - Application picker (dropdown → auto-fill stage options based on current stage)
   - Date / Time picker
   - Duration input
   - Interviewer names + titles
   - Overall impression radio (positive/neutral/negative)
   - Confidence level slider (1-5)
   - Strengths / Gaps / Improvements / Red Flags / Next Steps text areas
   - Key questions textarea
   - Competency multi-select chips (from `STAR_COMPETENCIES`)
   - General notes textarea
   - Save button → calls `saveApp(updatedApp)`

2. **Debrief Timeline** (sortable/filterable)
   - Filter by: stage, date range, impression, confidence level
   - Sort by: date (desc default), impression, confidence
   - Card view showing:
     - Company + Title + Stage
     - Date + Time + Duration
     - Interviewer names (expandable to titles)
     - Impression badge + confidence score
     - Collapsible accordion with full feedback
   - Edit button → opens form in modal
   - Delete button → removes from interviewLog

3. **Debrief Statistics** (info cards)
   - Total interviews conducted
   - Average confidence by stage
   - Impression breakdown (positive %, neutral %, negative %)
   - Most common red flags (tag-based summary)
   - Average duration by stage

4. **Interview Prep Reflection**
   - Link debrief back to prep sections (did prep address the questions asked?)
   - Suggestion cards: "You mentioned X in prep, interview showed Y instead"

### Implementation Details
- **State management**: Extend `saveApp()` in `App.jsx` to handle `interviewLog` array mutations
- **Normalization**: Update `normalizeApplication()` in `constants.js` to ensure `interviewLog` exists
- **Styling**: Match existing tab patterns (colors from `STAGE_COLORS`, spacing)
- **Persistence**: Auto-save to localStorage + Supabase via existing sync mechanism
- **No new dependencies**: Pure React, no charting needed

### Effort Estimate
**Medium** (~3-4 hours)
- Form component build: 1.5 hours
- Timeline + filtering: 1 hour
- Stats cards: 0.5 hours
- Integration + testing: 1 hour

---

## Feature 2: Application Velocity Dashboard

### Overview
Track weekly application targets, actual submissions, and trend. Show: weekly submission counts, cumulative line chart, velocity vs. target, and historical trend.

### Data Model Changes
**Location**: `src/constants.js` → `defaultData` and application object

Add to profile:
```javascript
profile: {
  // ... existing fields
  velocityTarget: 5, // target applications per week
}
```

Ensure applications include:
```javascript
appliedDate: "2026-04-18", // already exists in blankApp()
stage: "Applied", // already exists
```

**No new fields required** — velocity can be calculated from existing `appliedDate` + `stage` filtering.

### Component Architecture
**New Tab**: Add to main tab bar → `VelocityTab.jsx`

**Sub-sections**:
1. **Velocity Target Setter** (at top)
   - Input field: "Target applications per week"
   - Default: 5
   - Save to profile
   - Display: "You're aiming for X apps/week → Y per month"

2. **This Week's Progress** (prominent metric box)
   - Count of applications with `appliedDate` in current week
   - vs. target
   - Progress bar (green if on track, amber if behind)
   - Days remaining in week
   - Pace indicator: "On track / Ahead / Behind by X"

3. **Weekly Velocity Chart** (line + bar combo)
   - **Chart library**: Use `recharts` (lightweight, React-native)
   - X-axis: Last 12 weeks (or 8 weeks)
   - Y-axis: Application count
   - Bar chart overlay: actual submissions per week
   - Line chart: 4-week rolling average (smooths noise)
   - Reference line: target velocity (dashed)
   - Tooltips on hover: "Week of Apr 14: 6 apps (target 5)"

4. **Velocity Leaderboard / Insights** (cards)
   - Best week: "Week of Apr 7 — 8 submissions"
   - Current streak: "Last 3 weeks on target"
   - Slowest week: "Week of Mar 24 — 2 submissions"
   - Trend: "↑ Improving | → Steady | ↓ Declining"

5. **Weekly Breakdown Table** (optional expandable)
   - Date range | Submissions | Target | Variance | Stage distribution (pie or horizontal bar)
   - Sortable by any column

### Implementation Details
- **Charting library**: Install `recharts ^2.13.0`
  ```bash
  npm install recharts
  ```
- **Date math**: Use JavaScript `Date` + helper functions or `date-fns` (optional, not required)
- **Calculations**:
  ```javascript
  getWeeklyApplicationCounts(applications) {
    // Group by ISO week number
    // Return array of { week: "2026-W15", count: 6, target: 5 }
  }
  
  getRollingAverage(weekly, window = 4) {
    // Calculate 4-week rolling average
  }
  ```
- **State**: Add `velocityTarget` to profile state in `App.jsx`, persist via existing sync
- **Styling**: Match PipelineTab colors (stage pills), use recharts default theming (or custom with CSS)

### Effort Estimate
**Medium** (~4-5 hours)
- recharts setup + learning curve: 1 hour
- Chart component build: 1.5 hours
- Weekly calculations + helpers: 1 hour
- Stats cards + insights: 1 hour
- Integration + testing: 0.5 hours

---

## Feature 3: Mock Interview Mode

### Overview
AI-assisted interview practice. User answers questions via text, receives feedback on response quality. Uses copy-prompt pattern (no in-app API).

### Data Model Changes
**Location**: `src/constants.js` → new function `blankMockInterview()`

Add to application:
```javascript
mockInterviews: [
  {
    id: uuid(),
    stage: "Phone Screen" | "Interview" | "Final Round",
    scenario: "Technical Case Study", // or "Behavioral", "Product Sense", "Estimation"
    createdAt: "2026-04-18T14:00:00Z",
    
    // Track answers + feedback
    questions: [
      {
        id: uuid(),
        questionText: "Walk me through a product you've built...",
        userAnswer: "I led a team to build...",
        feedback: "Strong STAR structure. Could strengthen takeaway section.",
        confidenceRating: 4, // 1-5
        timestamp: "2026-04-18T14:05:00Z"
      }
    ],
    
    // Summary
    overallFeedback: "Strong technical foundation, weak on edge cases.",
    areasForImprovement: ["Edge case handling", "Estimation accuracy"],
    strongPoints: ["Problem decomposition", "Communication"],
    nextSteps: "Practice estimation questions"
  }
]
```

### Component Architecture
**New Sub-tab in AITab**: Add to `AITab.jsx` → `Mock Interview` section

**Design**:
1. **Interview Scenario Selector** (grid or dropdown)
   - Options: Behavioral, Technical Case, Product Sense, Estimation
   - Stage picker: Phone Screen / Interview / Final Round
   - Application context: auto-fill company + title
   - Start button

2. **Question Delivery Interface**
   - Display question on card
   - "Think time" countdown (optional, 30 sec)
   - Text textarea for user response
   - Submit button → captures response + timestamp
   - Next question button (shows progress: "Question 3 of 5")

3. **Copy-Prompt Feedback Pattern** (key)
   - After user submits response:
     - Display "Copy feedback request" button
     - Button copies prompt to clipboard:
       ```
       I'm practicing for a [PM/AE] interview at [Company].
       I was asked: "[question]"
       
       I answered: "[user answer]"
       
       Please provide:
       1. Strengths in my response
       2. Areas for improvement
       3. A better version (2-3 sentences)
       4. Key takeaways
       
       Keep feedback concise.
       ```
   - User pastes to ChatGPT/Claude, copies result
   - Paste result back into "Feedback" textarea
   - Save to mockInterviews array

4. **Interview Summary** (end of session)
   - Questions answered count
   - Time spent
   - Overall notes textarea
   - Save button → stores complete mock interview
   - "Review your responses" link → opens review modal

5. **Mock Interview History** (expandable list)
   - Filter by: stage, scenario, date range
   - Cards showing: date, scenario, questions answered, link to review
   - Click to expand → shows Q&A pairs with feedback
   - Delete button

### Implementation Details
- **Question database**: Create `src/mockInterviewQuestions.js`
  ```javascript
  const MOCK_INTERVIEW_QUESTIONS = {
    "Behavioral": [
      "Walk me through a product you've built...",
      "Tell me about a time you failed...",
      // 8-10 questions
    ],
    "Technical Case": [
      "Design a notification system for a social app...",
      // 5-7 questions
    ],
    // ... more scenarios
  };
  ```
- **Question randomizer**: Shuffle and pick 5 questions based on scenario
- **State management**: Extend `saveApp()` to handle `mockInterviews` array
- **Normalization**: Update `normalizeApplication()` to ensure `mockInterviews` exists
- **Styling**: Match existing AITab sub-tab pattern (tabs, buttons, spacing)
- **No new dependencies**: Pure React, copy-to-clipboard via existing pattern

### Effort Estimate
**Medium-High** (~5-6 hours)
- Question database + randomizer: 1 hour
- Interview delivery UI: 1.5 hours
- Feedback capture + copy-prompt pattern: 1 hour
- History + review interface: 1.5 hours
- Integration + testing: 1 hour

---

## Implementation Roadmap

### Execution Order (Recommended)
1. **Debrief Log** (Feature 1) — foundational, no dependencies
2. **Velocity Dashboard** (Feature 2) — depends on recharts install, but independent otherwise
3. **Mock Interview Mode** (Feature 3) — most complex, can build on patterns from 1 & 2

### Dependency Chain
```
Debrief Log
  ↓ (no blocking deps)
Velocity Dashboard
  ├ Requires: npm install recharts
  ↓
Mock Interview Mode
  ├ Reuses: form patterns from Debrief
  ├ Reuses: copy-prompt pattern from AITab
  └ No new dependencies
```

### Parallel Work Possible
- Debrief Log UI + Velocity Dashboard calculations can happen in parallel
- Mock Interview questions database can be written while other features build UI

---

## Integration Checklist

### For Each Feature:
- [ ] Add data fields to `src/constants.js` (blankApp(), defaultData, or new functions)
- [ ] Update `normalizeApplication()` to initialize new fields
- [ ] Create new Tab component in `src/tabs/`
- [ ] Add tab entry to main tab bar in `App.jsx`
- [ ] Implement save/update functions (reuse `saveApp()` pattern)
- [ ] Add localStorage + Supabase sync (existing mechanism handles)
- [ ] Test with sample data
- [ ] Update ROADMAP.md with completion notes

### Dependencies to Install
```bash
npm install recharts@^2.13.0
```

### Files to Modify
- `src/App.jsx` — add tab entries, state management
- `src/constants.js` — add data model fields, helper functions
- `src/tabs/DebriefTab.jsx` — new file
- `src/tabs/VelocityTab.jsx` — new file
- `src/tabs/AITab.jsx` — add Mock Interview sub-tab
- `src/mockInterviewQuestions.js` — new file
- `package.json` — add recharts
- `ROADMAP.md` — update status

### Files NOT Modified
- Authentication (Supabase, App.jsx auth logic unchanged)
- Data sync logic (existing Supabase integration handles new fields)
- Core application structure (no refactoring needed)

---

## Design Patterns to Reuse

### 1. Form Pattern (Debrief + Mock Interview)
From: `AITab.jsx` → STAR story editor
Pattern: Textarea + controlled inputs, save button, clear on submit
Reuse: Input components, button styling, form layout

### 2. Copy-Prompt Pattern (Mock Interview Feedback)
From: `AITab.jsx` → all prompts
Pattern: Copy button → user pastes to ChatGPT → paste result back
Reuse: Copy-to-clipboard utility, prompt formatting function

### 3. Filtering + Sorting (Debrief Timeline)
From: `PipelineTab.jsx` → AppCard grid
Pattern: Filter pill groups, sort dropdown, card grid
Reuse: Pill button styling, sort logic, card layout

### 4. Statistics Cards (Debrief + Velocity)
From: `FocusTab.jsx` → streak counter, action queue
Pattern: Metric + label card, badge styling
Reuse: Card background color, metric font sizing, badge colors

### 5. Tab Architecture
From: `AITab.jsx` → sub-tabs (Tailor Resume, etc.)
Pattern: Tab buttons, conditional render, sub-section props
Reuse: Tab styling, active state CSS, conditional rendering

---

## Risk Assessment

### Low Risk
- Debrief Log — additive feature, no breaking changes, isolated state
- Velocity Dashboard — calculations are pure functions, charting is standard

### Medium Risk
- Mock Interview Mode — heaviest feature, copy-prompt adds user friction (good UX review needed)
- recharts installation — new dependency, needs testing for bundle size impact

### Mitigation
- Test each feature independently before shipping
- Include sample data in defaultData for testing
- Verify Supabase sync with new fields (run a few save/load cycles)
- Get user feedback on Mock Interview UX (copy-prompt pattern vs. alternatives)

---

## Success Criteria

### Debrief Log
- [ ] Can create debrief from application detail view
- [ ] Can view debrief timeline sorted + filtered
- [ ] Debrief data persists to localStorage + Supabase
- [ ] Debrief impressions feed into stage-specific feedback

### Velocity Dashboard
- [ ] Dashboard shows weekly submission counts
- [ ] Line chart renders 4-week rolling average
- [ ] Progress bar reflects current week vs. target
- [ ] Historical data (12+ weeks) is accessible

### Mock Interview Mode
- [ ] Can start mock interview for a given stage/scenario
- [ ] Can answer questions and capture responses
- [ ] Can request feedback via copy-prompt pattern
- [ ] Mock interview history is retrievable and editable

---

## Next Steps (When Ready to Execute)
1. Confirm feature priority + execution order with user
2. Estimate actual calendar time needed
3. Create feature branches
4. Begin with Feature 1 (Debrief Log)
5. Get UX feedback on Mock Interview copy-prompt pattern

---

## Open Questions / Design Decisions

### Debrief Log
- Should debrief be visible in application detail view, or only in dedicated Debrief tab?
  - Recommend: Both (summary card in detail, full timeline in Debrief tab)
- Should debrief feedback inform "next interview stage" suggestions?
  - Recommend: Yes, link weak areas to prep sections

### Velocity Dashboard
- Should velocity target be global (one for all apps) or per-role?
  - Recommend: Global for now, can add per-role in Wave 4
- Should chart show only "Applied" apps, or all submissions?
  - Recommend: All submissions (includes rejections in same week count)

### Mock Interview Mode
- Should questions be randomized, or follow a fixed sequence per scenario?
  - Recommend: Randomize, with option to "practice this question again"
- Should mock interviews be tied to specific applications, or generic prep?
  - Recommend: Generic prep (not tied to single app), but can reference app context

---

## Files Referenced
- `/Users/chase/Developer/chase/portfolio/job-search-hq/src/App.jsx`
- `/Users/chase/Developer/chase/portfolio/job-search-hq/src/constants.js`
- `/Users/chase/Developer/chase/portfolio/job-search-hq/src/tabs/AITab.jsx`
- `/Users/chase/Developer/chase/portfolio/job-search-hq/src/tabs/FocusTab.jsx`
- `/Users/chase/Developer/chase/portfolio/job-search-hq/src/tabs/PipelineTab.jsx`
- `/Users/chase/Developer/chase/portfolio/job-search-hq/src/tabs/ResourcesTab.jsx`
- `/Users/chase/Developer/chase/portfolio/job-search-hq/src/applyPrompts.js`
- `/Users/chase/Developer/chase/portfolio/job-search-hq/ROADMAP.md`
- `/Users/chase/Developer/chase/portfolio/job-search-hq/package.json`

---

**Plan Created**: 2026-04-18  
**Status**: Ready for execution (awaiting user confirmation)
