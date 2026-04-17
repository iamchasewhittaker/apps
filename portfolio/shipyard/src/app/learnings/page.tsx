export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import type { Learning } from '@/lib/types';

interface Props {
  searchParams: Promise<{ tab?: string }>;
}

const SOURCE_COLORS: Record<string, string> = {
  manual: 'bg-accent/20 text-accent border-accent/30',
  'auto:commit': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'auto:changelog': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  'auto:todo': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'auto:audit': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default async function LearningsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const tab = sp.tab ?? 'all';
  const supabase = createServerClient();

  const { data: allLearnings } = await supabase
    .from('learnings')
    .select('*')
    .order('created_at', { ascending: false });

  const learnings: Learning[] = allLearnings ?? [];

  const unreviewed = learnings.filter((l) => !l.reviewed);

  let filtered = learnings;
  if (tab === 'mine') {
    filtered = learnings.filter((l) => l.source === 'manual');
  } else if (tab === 'review') {
    filtered = unreviewed;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-accent">
          Captain&apos;s Log
        </h1>
        <p className="text-sm text-muted">
          Learnings, insights, and notes captured across the fleet.
        </p>
      </div>

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
                ? 'border-accent bg-accent/20 text-accent'
                : 'border-border text-muted hover:border-accent/40 hover:text-foreground'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Learning cards */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <p className="text-sm text-muted">
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
      <div className="rounded-lg border border-border bg-card/50 p-4 text-center">
        <p className="text-xs text-muted">
          Add form and tag cloud coming in Phase 2.
        </p>
      </div>
    </div>
  );
}

function LearningCard({ learning }: { learning: Learning }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <p className="text-sm text-foreground leading-relaxed">
        {learning.text}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        {/* Source badge */}
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
            SOURCE_COLORS[learning.source] ?? 'bg-card text-muted border-border'
          }`}
        >
          {learning.source}
        </span>

        {/* Reviewed status */}
        {!learning.reviewed && (
          <span className="rounded-full border border-warning/30 bg-warning/20 px-2 py-0.5 text-[10px] font-medium text-warning">
            Unreviewed
          </span>
        )}

        {/* Tags */}
        {learning.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-medium text-muted"
          >
            {tag}
          </span>
        ))}

        {/* Scripture ref */}
        {learning.scripture_ref && (
          <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
            {learning.scripture_ref}
          </span>
        )}

        {/* Project link */}
        {learning.project_slug && (
          <Link
            href={`/ship/${learning.project_slug}`}
            className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            {learning.project_slug}
          </Link>
        )}
      </div>

      <p className="text-[10px] text-muted">
        {new Date(learning.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </div>
  );
}
