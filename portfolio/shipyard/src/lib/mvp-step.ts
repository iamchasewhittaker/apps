import type { Compliance } from './types';

interface StepInput {
  has_live_url: boolean;
  last_commit_date: string | null;
  compliance: Compliance;
  mvp_step_claimed: string | null;
}

export function inferMvpStep(input: StepInput): { step: number; status: 'active' | 'stalled' } {
  const { has_live_url, last_commit_date, compliance } = input;

  const daysSinceCommit = last_commit_date
    ? Math.floor((Date.now() - new Date(last_commit_date).getTime()) / 86_400_000)
    : Infinity;

  // Stalled if no commits in 30 days
  if (daysSinceCommit > 30) {
    return { step: parseClaimedStep(input.mvp_step_claimed) || 1, status: 'stalled' };
  }

  // Has live URL + recent commits → at least Step 5
  if (has_live_url && daysSinceCommit <= 14) {
    return { step: 5, status: 'active' };
  }

  // Missing core docs → cap at Step 3
  if (!compliance.has_readme || !compliance.has_claude_md || !compliance.has_mvp_audit) {
    const claimed = parseClaimedStep(input.mvp_step_claimed) || 3;
    return { step: Math.min(claimed, 3), status: 'active' };
  }

  // Default to claimed step or 4 (Build)
  return { step: parseClaimedStep(input.mvp_step_claimed) || 4, status: 'active' };
}

function parseClaimedStep(claimed: string | null): number | null {
  if (!claimed) return null;
  const match = claimed.match(/step\s*(\d)/i);
  return match ? parseInt(match[1], 10) : null;
}

export const STEP_LABELS: Record<number, string> = {
  1: 'Idea',
  2: 'Learn',
  3: 'Plan',
  4: 'Build',
  5: 'Ship',
  6: 'Grow',
};

export const STEP_NAUTICAL: Record<number, string> = {
  1: 'Blueprint',
  2: 'Charting',
  3: 'Drafting',
  4: 'Under Construction',
  5: 'Launched',
  6: 'Fleet Active',
};
