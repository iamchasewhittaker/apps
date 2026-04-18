export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { computeChipState } from '@/lib/review-cadence';
import ReviewForm from './ReviewForm';
import type { ReviewKind, ReviewCadence, Review, Learning } from '@/lib/types';

interface Props {
  searchParams: Promise<{ kind?: string }>;
}

export default async function ReviewPage({ searchParams }: Props) {
  const sp = await searchParams;
  const supabase = await createServerClient();

  // Fetch cadence rows to determine most overdue kind
  const { data: cadenceRows } = await supabase
    .from('review_cadence')
    .select('*');
  const cadences: ReviewCadence[] = cadenceRows ?? [];

  // Determine most overdue kind
  const chips = cadences.map(computeChipState);
  const mostOverdue = chips.sort((a, b) => a.days_remaining - b.days_remaining)[0];
  const activeKind: ReviewKind =
    (sp.kind as ReviewKind) ?? mostOverdue?.kind ?? 'weekly';

  const activeCadence = cadences.find((c) => c.kind === activeKind);

  // Fetch recent reviews of selected kind
  const { data: reviewRows } = await supabase
    .from('reviews')
    .select('*')
    .eq('kind', activeKind)
    .order('started_at', { ascending: false })
    .limit(10);
  const reviews: Review[] = reviewRows ?? [];

  // Fetch learnings for these reviews (reflections)
  const reviewIds = reviews
    .map((r) => r.reflection_id)
    .filter(Boolean) as string[];
  let learnings: Learning[] = [];
  if (reviewIds.length > 0) {
    const { data: learningRows } = await supabase
      .from('learnings')
      .select('*')
      .in('id', reviewIds);
    learnings = learningRows ?? [];
  }
  const learningMap = new Map(learnings.map((l) => [l.id, l]));

  const KINDS: ReviewKind[] = ['weekly', 'monthly', 'quarterly'];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold tracking-tight text-accent">
        Reviews
      </h1>

      {/* Tab selector */}
      <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
        {KINDS.map((k) => (
          <Link
            key={k}
            href={`/review?kind=${k}`}
            className={`flex-1 rounded-md px-4 py-2 text-center text-sm font-medium capitalize transition-colors ${
              activeKind === k
                ? 'bg-accent/20 text-accent border border-accent/40'
                : 'text-muted hover:text-foreground border border-transparent'
            }`}
          >
            {k}
          </Link>
        ))}
      </div>

      {/* Auto-collected stats placeholder */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">
          Auto-collected Stats
        </h2>
        <p className="text-sm text-muted">
          Stats for <span className="text-accent capitalize">{activeKind}</span>{' '}
          reviews will be computed from scan data.
        </p>
      </div>

      {/* Reflection prompt form */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
          Reflection Prompts
        </h2>
        <ReviewForm kind={activeKind} />
      </div>

      {/* History table */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
          Past Reviews
        </h2>
        {reviews.length === 0 ? (
          <p className="text-sm text-muted">
            No {activeKind} reviews yet.
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => {
              const learning = review.reflection_id
                ? learningMap.get(review.reflection_id)
                : null;
              const date = new Date(review.started_at);
              const formatted = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              });

              return (
                <details
                  key={review.id}
                  className="group rounded-md border border-border"
                >
                  <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="capitalize text-accent font-medium">
                        {review.kind}
                      </span>
                      <span className="text-muted">{formatted}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {review.kind === 'quarterly' && review.csv_blob && (
                        <a
                          href={`data:text/csv;charset=utf-8,${encodeURIComponent(review.csv_blob)}`}
                          download={`review-${review.kind}-${formatted}.csv`}
                          className="rounded border border-border px-2 py-0.5 text-xs text-muted hover:border-accent/40 hover:text-accent transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Download CSV
                        </a>
                      )}
                      <span className="text-xs text-muted group-open:rotate-90 transition-transform">
                        &#9654;
                      </span>
                    </div>
                  </summary>
                  <div className="border-t border-border px-4 py-3">
                    {learning ? (
                      <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap text-sm text-foreground/80">
                        {learning.text}
                      </div>
                    ) : (
                      <p className="text-sm text-muted italic">
                        No reflection recorded.
                      </p>
                    )}
                  </div>
                </details>
              );
            })}
          </div>
        )}
      </div>

      {/* Cadence settings */}
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted">
          Cadence Settings
        </h2>
        {activeCadence ? (
          <CadenceEditor kind={activeKind} cadenceDays={activeCadence.cadence_days} />
        ) : (
          <p className="text-sm text-muted">
            No cadence configuration found for {activeKind}.
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Cadence Editor (inline form) ──────────────────────────── */

function CadenceEditor({
  kind,
  cadenceDays,
}: {
  kind: ReviewKind;
  cadenceDays: number;
}) {
  async function updateCadence(formData: FormData) {
    'use server';
    const days = parseInt(formData.get('cadence_days') as string, 10);
    if (isNaN(days) || days < 1) return;

    const supabase = await createServerClient();
    await supabase
      .from('review_cadence')
      .update({ cadence_days: days })
      .eq('kind', kind);
  }

  return (
    <form action={updateCadence} className="flex items-center gap-3">
      <label className="text-sm text-muted">
        <span className="capitalize">{kind}</span> every
      </label>
      <input
        name="cadence_days"
        type="number"
        min={1}
        defaultValue={cadenceDays}
        className="w-20 rounded border border-border bg-background px-2 py-1 text-sm text-foreground focus:border-accent focus:outline-none"
      />
      <span className="text-sm text-muted">days</span>
      <button
        type="submit"
        className="rounded border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/20 transition-colors"
      >
        Save
      </button>
    </form>
  );
}
