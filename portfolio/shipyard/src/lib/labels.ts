export type ThemeMode = 'regular' | 'nautical' | 'rct';

export const LABELS = {
  fleet:    { regular: 'Dashboard',           nautical: 'Fleet',           rct: 'Park Map' },
  wip:      { regular: 'In Progress',         nautical: 'Drydock Gate',    rct: 'Workshop' },
  review:   { regular: 'Review',              nautical: 'Review',          rct: 'Park Inspection' },
  log:      { regular: 'Activity',            nautical: 'Log',             rct: 'Park Diary' },
  charts:   { regular: 'Analytics',           nautical: 'Charts',          rct: 'Park Stats' },
  showcase: { regular: 'Portfolio',           nautical: 'Fleet Showcase',  rct: 'Featured Rides' },
  harbor:   { regular: 'Linear',              nautical: 'Harbor',          rct: 'Linear' },
  bridge:   { regular: 'Daily',               nautical: 'Bridge',          rct: 'Daily Operations' },
  manifest: { regular: 'Changelog & Roadmap', nautical: 'Manifest',        rct: 'Building Plans' },
  settings: { regular: 'Settings',            nautical: 'Settings',        rct: 'Office' },

  // MVP steps
  step1: { regular: 'Step 1 — Definition', nautical: 'Blueprint',          rct: 'Drafting' },
  step2: { regular: 'Step 2 — PRD',        nautical: 'Charting',           rct: 'Planning' },
  step3: { regular: 'Step 3 — UX Flow',    nautical: 'Drafting',           rct: 'Designing' },
  step4: { regular: 'Step 4 — Build',      nautical: 'Under Construction', rct: 'Construction' },
  step5: { regular: 'Step 5 — Shipped',    nautical: 'Launched',           rct: 'Open' },
  step6: { regular: 'Step 6 — Active',     nautical: 'Fleet Active',       rct: 'Operating' },

  // Sublabels / tagline under logo
  fleetCommand:      { regular: 'COMMAND CENTER',                                nautical: 'FLEET COMMAND',                                  rct: 'PARK CENTRAL' },
  fleetDashboard:    { regular: 'Dashboard',                                      nautical: 'Fleet Dashboard',                                rct: 'Park Map' },
  shipsInBuild:      { regular: 'In Build',                                       nautical: 'Ships in Build',                                 rct: 'Rides Under Construction' },
  pickOneActiveShip: { regular: 'Pick ONE focus project. Others get paused.',     nautical: 'Pick ONE active ship. Others move to drydock (paused).', rct: 'Open ONE star attraction. Others go to maintenance.' },

  // Page headings (longer than the nav label)
  analyticsHeading:  { regular: 'Analytics & Themes', nautical: 'Charts & Constellations', rct: 'Park Stats & Theme Areas' },

  // Nouns used throughout the UI
  ships:        { regular: 'projects',    nautical: 'ships',        rct: 'rides' },
  shipsTitle:   { regular: 'Projects',    nautical: 'Ships',        rct: 'Rides' },
  ship:         { regular: 'project',     nautical: 'ship',         rct: 'ride' },
  shipTitle:    { regular: 'Project',     nautical: 'Ship',         rct: 'Ride' },
  activeShip:   { regular: 'Active Project', nautical: 'Active Ship', rct: 'Star Attraction' },
  reviewsDue:   { regular: 'Reviews Due', nautical: 'Reviews Due',  rct: 'Inspections Due' },
  launched:     { regular: 'Launched',    nautical: 'Launched',     rct: 'Open' },
  inProgressLabel: { regular: 'In Progress', nautical: 'In Build',  rct: 'Construction' },
  totalShips:   { regular: 'Total Projects', nautical: 'Total Ships', rct: 'Total Rides' },
  openShip:     { regular: 'Open Project',   nautical: 'Open Ship',   rct: 'Open Ride' },
} as const;

export type LabelKey = keyof typeof LABELS;

export function resolveLabel(key: LabelKey, mode: ThemeMode): string {
  return LABELS[key][mode];
}

export function resolveStep(step: number, mode: ThemeMode): string {
  const key = `step${step}` as LabelKey;
  if (key in LABELS) return LABELS[key][mode];
  return `Step ${step}`;
}
