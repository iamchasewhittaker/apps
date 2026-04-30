export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { readVisibleSetFromCookie } from '@/lib/visible-projects-server';
import { ModeHeading } from '@/components/ModeHeading';
import type { Learning } from '@/lib/types';

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

const SOURCE_COLORS: Record<string, string> = {
  manual: 'bg-gold/20 text-gold border-gold/30',
  'auto:commit': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'auto:changelog': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  'auto:todo': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'auto:audit': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default async function LearningsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tab = sp.tab ?? 'all';
  const supabase = await createServerClient();

  const [{ data: allLearnings }, visibleSet] = await Promise.all([
    supabase
      .from('learnings')
      .select('*')
      .order('created_at', { ascending: false }),
    readVisibleSetFromCookie(),
  ]);

  const rawLearnings: Learning[] = allLearnings ?? [];
  const learnings: Learning[] = visibleSet
    ? rawLearnings.filter(
        (l) => !l.project_slug || visibleSet.has(l.project_slug),
      )
    : rawLearnings;

  const unreviewed = learnings.filter((l) => !l.reviewed);

  let filtered = learnings;
  if (tab === 'mine') {
    filtered = learnings.filter((l) => l.source === 'manual');
  } else if (tab === 'review') {
    filtered = unreviewed;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <ModeHeading
        labelKey="log"
        subtitle="Learnings, insights, and notes captured across the fleet."
      />

      {/* Tab links */}
      <div className="flex items-center gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'mine', label: 'My Notes' },
          { key: 'review', label: `Needs Review (${unreviewed.length})` },
        ].map((t) => (
          <Link
            key={t.key}
            href={t.key === 'all' ? '/learnings' : `/learnings?tab=${t.key}`}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'border-gold bg-gold/20 text-gold'
                : 'border-dimmer text-steel hover:border-gold/30 hover:text-white'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Learning cards */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-8 text-center">
          <p className="text-base text-steel">
            {tab === 'review'
              ? 'All learnings have been reviewed.'
              : 'No learnings captured yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((learning) => (
            <LearningCard key={learning.id} learning={learning} />
          ))}
        </div>
      )}

      {/* Coming soon note */}
      <div className="rounded-2xl border border-dimmer bg-surface/50 backdrop-blur-sm p-4 text-center">
        <p className="text-xs text-steel">
          Add form and tag cloud coming in Phase 2.
        </p>
      </div>
    </div>
  );
}

function LearningCard({ learning }: { learning: Learning }) {
  return (
    <div className="rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-4 space-y-3">
      <p className="text-base text-white leading-relaxed">
        {learning.text}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {/* Source badge */}
        <span
          className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
            SOURCE_COLORS[learning.source] ?? 'bg-surface/80 backdrop-blur-sm text-steel border-dimmer'
          }`}
        >
          {learning.source}
        </span>

        {/* Reviewed status */}
        {!learning.reviewed && (
          <span className="rounded-full border border-warning/30 bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning">
            Unreviewed
          </span>
        )}

        {/* Tags */}
        {learning.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-dimmer bg-surface/80 backdrop-blur-sm px-2 py-0.5 text-xs font-medium text-steel"
          >
            {tag}
          </span>
        ))}

        {/* Scripture ref */}
        {learning.scripture_ref && (
          <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-xs font-medium text-gold">
            {learning.scripture_ref}
          </span>
        )}

        {/* Project link */}
        {learning.project_slug && (
          <Link
            href={`/ship/${learning.project_slug}`}
            className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            {learning.project_slug}
          </Link>
        )}
      </div>

      <p className="text-xs text-steel">
        {new Date(learning.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </div>
  );
}
