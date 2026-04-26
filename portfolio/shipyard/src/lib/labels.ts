export type ThemeMode = 'nautical' | 'regular';

export const LABELS = {
  fleet:    { nautical: 'Fleet',           regular: 'Dashboard' },
  wip:      { nautical: 'Drydock Gate',    regular: 'In Progress' },
  review:   { nautical: 'Review',          regular: 'Review' },
  log:      { nautical: 'Log',             regular: 'Activity' },
  charts:   { nautical: 'Charts',          regular: 'Analytics' },
  showcase: { nautical: 'Fleet Showcase',  regular: 'Portfolio' },
  harbor:   { nautical: 'Harbor',          regular: 'Linear' },
  bridge:   { nautical: 'Bridge',          regular: 'Daily' },
  manifest: { nautical: 'Manifest',        regular: 'Changelog & Roadmap' },
  settings: { nautical: 'Settings',        regular: 'Settings' },

  // MVP steps
  step1: { nautical: 'Blueprint',          regular: 'Step 1 — Definition' },
  step2: { nautical: 'Charting',           regular: 'Step 2 — PRD' },
  step3: { nautical: 'Drafting',           regular: 'Step 3 — UX Flow' },
  step4: { nautical: 'Under Construction', regular: 'Step 4 — Build' },
  step5: { nautical: 'Launched',           regular: 'Step 5 — Shipped' },
  step6: { nautical: 'Fleet Active',       regular: 'Step 6 — Active' },

  // Sublabels / tagline under logo
  fleetCommand:      { nautical: 'FLEET COMMAND', regular: 'COMMAND CENTER' },
  fleetDashboard:    { nautical: 'Fleet Dashboard', regular: 'Dashboard' },
  shipsInBuild:      { nautical: 'Ships in Build',  regular: 'In Build' },
  pickOneActiveShip: { nautical: 'Pick ONE active ship. Others move to drydock (paused).', regular: 'Pick ONE focus project. Others get paused.' },
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
