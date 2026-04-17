import type { ReviewCadence, ReviewChip, ChipState } from './types';

export function computeChipState(cadence: ReviewCadence): ReviewChip {
  const { kind, cadence_days, last_review_at } = cadence;

  if (!last_review_at) {
    return { kind, days_remaining: 0, state: 'red', last_review_at: null };
  }

  const lastDate = new Date(last_review_at);
  const now = new Date();
  const msPerDay = 86_400_000;
  const daysSince = Math.floor((now.getTime() - lastDate.getTime()) / msPerDay);
  const days_remaining = cadence_days - daysSince;

  let state: ChipState = 'neutral';
  if (days_remaining <= 0) {
    state = 'red';
  } else if (days_remaining <= cadence_days * 0.25) {
    state = 'amber';
  }

  return { kind, days_remaining, state, last_review_at };
}

export function chipColor(state: ChipState): string {
  switch (state) {
    case 'red': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'amber': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'neutral': return 'bg-slate-700/50 text-slate-300 border-slate-600/30';
  }
}

export function chipLabel(chip: ReviewChip): string {
  if (chip.days_remaining <= 0) return `${chip.kind} · due now`;
  return `${chip.kind} · ${chip.days_remaining}d`;
}
