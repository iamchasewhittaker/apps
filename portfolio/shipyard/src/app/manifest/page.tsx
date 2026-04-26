export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { ModeHeading } from '@/components/ModeHeading';
import type { ChangelogEntry, RoadmapEntry, Project } from '@/lib/types';

interface Props {
  searchParams: Promise<{ timeframe?: string }>;
}

const TIMEFRAMES = [
  { key: '7d', label: '7 days', days: 7 },
  { key: '30d', label: '30 days', days: 30 },
  { key: '90d', label: '90 days', days: 90 },
  { key: 'all', label: 'All time', days: null },
] as const;

const RECENT_LIMIT = 60;
const HORIZON_LIMIT_BEFORE_TOGGLE = 5;

export default async function ManifestPage({ searchParams }: Props) {
  const sp = await searchParams;
  const timeframeKey = sp.timeframe ?? '30d';
  const timeframe = TIMEFRAMES.find((t) => t.key === timeframeKey) ?? TIMEFRAMES[1];

  const supabase = await createServerClient();

  const [{ data: changelog }, { data: roadmap }, { data: projects }] = await Promise.all([
    supabase
      .from('changelog_entries')
      .select('*')
      .order('entry_date', { ascending: false, nullsFirst: false })
      .order('scanned_at', { ascending: false })
      .limit(RECENT_LIMIT * 2),
    supabase
      .from('roadmap_entries')
      .select('*')
      .eq('item_done', false)
      .order('sort_index', { ascending: true }),
    supabase
      .from('projects')
      .select('slug, name, last_commit_date')
      .neq('status', 'archived'),
  ]);

  const projectMap = new Map<string, Pick<Project, 'slug' | 'name' | 'last_commit_date'>>();
  for (const p of (projects ?? []) as Pick<Project, 'slug' | 'name' | 'last_commit_date'>[]) {
    projectMap.set(p.slug, p);
  }

  // eslint-disable-next-line react-hooks/purity -- server component; runs per-request
  const nowMs = Date.now();
  const cutoffMs = timeframe.days !== null ? nowMs - timeframe.days * 86_400_000 : null;

  const allChangelog = (changelog ?? []) as ChangelogEntry[];
  const recentChangelog = allChangelog
    .filter((c) => projectMap.has(c.project_slug))
    .filter((c) => {
      if (cutoffMs === null) return true;
      if (!c.entry_date) return false;
      return new Date(c.entry_date).getTime() >= cutoffMs;
    })
    .slice(0, RECENT_LIMIT);

  const openRoadmap = ((roadmap ?? []) as RoadmapEntry[]).filter((r) =>
    projectMap.has(r.project_slug),
  );

  const roadmapBySlug = new Map<string, RoadmapEntry[]>();
  for (const r of openRoadmap) {
    const arr = roadmapBySlug.get(r.project_slug) ?? [];
    arr.push(r);
    roadmapBySlug.set(r.project_slug, arr);
  }

  const sortedRoadmapSlugs = Array.from(roadmapBySlug.keys()).sort((a, b) => {
    const ad = projectMap.get(a)?.last_commit_date
      ? new Date(projectMap.get(a)!.last_commit_date!).getTime()
      : 0;
    const bd = projectMap.get(b)?.last_commit_date
      ? new Date(projectMap.get(b)!.last_commit_date!).getTime()
      : 0;
    return bd - ad;
  });

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <ModeHeading
        labelKey="manifest"
        subtitle="Recent shipments and what's on the horizon."
      />

      {/* Timeframe filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-muted">
          Timeframe
        </span>
        {TIMEFRAMES.map((t) => (
          <Link
            key={t.key}
            href={t.key === '30d' ? '/manifest' : `/manifest?timeframe=${t.key}`}
            className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
              timeframe.key === t.key
                ? 'border-accent bg-accent/20 text-accent'
                : 'border-border text-muted hover:border-accent/40 hover:text-foreground'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* Recent shipments */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
          Recent shipments
        </h2>
        {recentChangelog.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted">
              No changelog entries in this timeframe.
            </p>
            <p className="mt-1 text-xs text-muted/70">
              Try a wider timeframe, or run{' '}
              <code className="text-xs">npx tsx scripts/scan.ts</code>.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentChangelog.map((c) => (
              <ChangelogRow
                key={c.id}
                entry={c}
                projectName={projectMap.get(c.project_slug)?.name ?? c.project_slug}
              />
            ))}
          </div>
        )}
      </section>

      {/* On the horizon */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
          On the horizon
        </h2>
        {sortedRoadmapSlugs.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted">No open roadmap items across the fleet.</p>
            <p className="mt-1 text-xs text-muted/70">
              Add <code className="text-xs">- [ ]</code> items to any{' '}
              <code className="text-xs">ROADMAP.md</code> and re-scan.
            </p>
          </div>
        ) : (
          <HorizonList
            slugs={sortedRoadmapSlugs}
            roadmapBySlug={roadmapBySlug}
            projectMap={projectMap}
          />
        )}
      </section>
    </div>
  );
}

function ChangelogRow({
  entry,
  projectName,
}: {
  entry: ChangelogEntry;
  projectName: string;
}) {
  const bullets = entry.body_md
    .split('\n')
    .filter((l) => /^\s*-\s+/.test(l))
    .slice(0, 2)
    .map((l) => l.replace(/^\s*-\s+/, '').replace(/\*\*/g, '').trim());

  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-2">
      <div className="flex flex-wrap items-baseline gap-2">
        <Link
          href={`/ship/${entry.project_slug}`}
          className="text-sm font-semibold text-accent hover:underline"
        >
          {projectName}
        </Link>
        {entry.entry_date && (
          <span className="text-[10px] text-muted">{entry.entry_date}</span>
        )}
        {entry.version && (
          <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] text-muted">
            {entry.version.length > 50 ? entry.version.slice(0, 50) + '…' : entry.version}
          </span>
        )}
      </div>
      <p className="text-sm text-foreground">
        {entry.heading.replace(/\*\*/g, '')}
      </p>
      {bullets.length > 0 && (
        <ul className="list-disc space-y-1 pl-5 text-xs text-muted">
          {bullets.map((b, i) => (
            <li key={i}>{b.length > 200 ? b.slice(0, 200) + '…' : b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function HorizonList({
  slugs,
  roadmapBySlug,
  projectMap,
}: {
  slugs: string[];
  roadmapBySlug: Map<string, RoadmapEntry[]>;
  projectMap: Map<string, Pick<Project, 'slug' | 'name' | 'last_commit_date'>>;
}) {
  return (
    <div className="space-y-4">
      {slugs.slice(0, HORIZON_LIMIT_BEFORE_TOGGLE).map((slug) => (
        <HorizonShipBlock
          key={slug}
          slug={slug}
          name={projectMap.get(slug)?.name ?? slug}
          items={roadmapBySlug.get(slug) ?? []}
        />
      ))}
      {slugs.length > HORIZON_LIMIT_BEFORE_TOGGLE && (
        <details className="space-y-4">
          <summary className="cursor-pointer rounded-md border border-border bg-card px-3 py-2 text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground">
            Show {slugs.length - HORIZON_LIMIT_BEFORE_TOGGLE} more ships
          </summary>
          <div className="space-y-4 pt-2">
            {slugs.slice(HORIZON_LIMIT_BEFORE_TOGGLE).map((slug) => (
              <HorizonShipBlock
                key={slug}
                slug={slug}
                name={projectMap.get(slug)?.name ?? slug}
                items={roadmapBySlug.get(slug) ?? []}
              />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function HorizonShipBlock({
  slug,
  name,
  items,
}: {
  slug: string;
  name: string;
  items: RoadmapEntry[];
}) {
  const phases = new Map<string, RoadmapEntry[]>();
  for (const i of items) {
    const arr = phases.get(i.phase_name) ?? [];
    arr.push(i);
    phases.set(i.phase_name, arr);
  }
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <Link
        href={`/ship/${slug}`}
        className="text-sm font-semibold text-accent hover:underline"
      >
        {name}
      </Link>
      <div className="space-y-3">
        {Array.from(phases.entries()).map(([phase, phaseItems]) => (
          <div key={phase} className="space-y-1.5">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-gold">
              {phase}
            </h4>
            <ul className="space-y-1">
              {phaseItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start gap-2 text-xs text-foreground"
                >
                  <span className="mt-0.5 shrink-0 font-mono">☐</span>
                  <span className="flex-1">
                    {item.item_text.replace(/\*\*/g, '')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
