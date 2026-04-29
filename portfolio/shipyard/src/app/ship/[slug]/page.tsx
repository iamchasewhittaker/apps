export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase';
import { STEP_LABELS, STEP_NAUTICAL } from '@/lib/mvp-step';
import { EditableText, EditableStatus, EditableNumber, BlockerManager } from '@/components/EditableField';
import { RetireButton } from './RetireButton';
import { CopyDevCommand } from './CopyDevCommand';
import type { Project, Blocker, Compliance, ChangelogEntry, RoadmapEntry, LinearIssue } from '@/lib/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ShipDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createServerClient();

  const [
    { data: project },
    { data: blockers },
    { data: changelog },
    { data: roadmap },
    { data: linearIssues },
  ] = await Promise.all([
    supabase.from('projects').select('*').eq('slug', slug).single(),
    supabase
      .from('blockers')
      .select('*')
      .eq('project_slug', slug)
      .order('resolved_at', { ascending: true, nullsFirst: true })
      .order('created_at', { ascending: false }),
    supabase
      .from('changelog_entries')
      .select('*')
      .eq('project_slug', slug)
      .order('sort_index', { ascending: true }),
    supabase
      .from('roadmap_entries')
      .select('*')
      .eq('project_slug', slug)
      .order('sort_index', { ascending: true }),
    supabase
      .from('linear_issues')
      .select('*')
      .eq('project_slug', slug)
      .order('priority', { ascending: true })
      .order('updated_at', { ascending: false }),
  ]);

  if (!project) notFound();

  const p = project as Project;
  const blockerList: Blocker[] = blockers ?? [];
  const changelogList: ChangelogEntry[] = changelog ?? [];
  const roadmapList: RoadmapEntry[] = roadmap ?? [];
  const issueList: LinearIssue[] = (linearIssues ?? []) as LinearIssue[];
  const step = p.mvp_step_actual ?? p.mvp_step ?? 0;

  const changelogByVersion = new Map<string, ChangelogEntry[]>();
  for (const c of changelogList) {
    const key = c.version ?? '—';
    const arr = changelogByVersion.get(key) ?? [];
    arr.push(c);
    changelogByVersion.set(key, arr);
  }

  const roadmapByPhase = new Map<string, RoadmapEntry[]>();
  for (const r of roadmapList) {
    const arr = roadmapByPhase.get(r.phase_name) ?? [];
    arr.push(r);
    roadmapByPhase.set(r.phase_name, arr);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted hover:text-accent transition-colors"
      >
        &larr; Back to fleet
      </Link>

      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-2xl font-bold text-foreground">{p.name}</h1>

        <div className="flex flex-wrap gap-2">
          <Badge color={TYPE_COLORS[p.type]}>{p.type}</Badge>
          <Badge color="border-border text-muted">{p.family}</Badge>
          <EditableStatus slug={p.slug} value={p.status} />
          <Badge color="border-accent/30 bg-accent/10 text-accent">
            Step {step}: {STEP_LABELS[step] ?? '?'} &middot;{' '}
            {STEP_NAUTICAL[step] ?? ''}
          </Badge>
        </div>

        {(p.type === 'web' || p.live_url) && (
          <div className="flex flex-wrap items-center gap-4">
            {p.type === 'web' && <CopyDevCommand slug={p.slug} />}
            {p.live_url && (
              <a
                href={p.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-success hover:underline"
              >
                <span className="inline-block h-2 w-2 rounded-full bg-success" />
                {p.live_url}
              </a>
            )}
          </div>
        )}
      </header>

      {/* Next Action */}
      <Section title="Next Action">
        <EditableText slug={p.slug} field="next_action" value={p.next_action} placeholder="No next action set. Click to add…" />
      </Section>

      {/* Money */}
      <Section title="Money">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-medium text-muted">Revenue potential (1–5)</p>
            <EditableNumber
              slug={p.slug}
              field="revenue_potential"
              value={p.revenue_potential}
              min={1}
              max={5}
              step={1}
              placeholder="Unrated"
            />
          </div>
          <div>
            <p className="mb-1 text-xs font-medium text-muted">Monthly revenue (USD)</p>
            <EditableNumber
              slug={p.slug}
              field="monthly_revenue_usd"
              value={p.monthly_revenue_usd}
              min={0}
              step={1}
              prefix="$"
              suffix="/mo"
              placeholder="$0"
            />
          </div>
        </div>
      </Section>

      {/* Blockers */}
      <Section title="Blockers">
        <BlockerManager slug={p.slug} initialBlockers={blockerList} />
      </Section>

      {/* Compliance Checklist */}
      <Section title="Compliance Checklist">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {COMPLIANCE_ITEMS.map(({ key, label }) => {
            const met = p.compliance[key as keyof Compliance];
            return (
              <div
                key={key}
                className={`flex items-center gap-2 rounded-md border px-3 py-2 text-xs ${
                  met
                    ? 'border-success/30 bg-success/10 text-success'
                    : 'border-border bg-card text-muted'
                }`}
              >
                <span>{met ? '\u2713' : '\u2717'}</span>
                <span>{label}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted">
          Score:{' '}
          <span
            className={
              p.compliance_score >= 80
                ? 'text-success font-medium'
                : p.compliance_score >= 50
                  ? 'text-warning font-medium'
                  : 'text-danger font-medium'
            }
          >
            {Math.round(p.compliance_score)}%
          </span>
        </p>
      </Section>

      {/* Integrations */}
      <Section title="Integrations">
        <div className="space-y-3">
          {p.localstorage_keys.length > 0 && (
            <PillGroup label="localStorage" items={p.localstorage_keys} color="bg-blue-500/20 text-blue-400" />
          )}
          {p.supabase_tables.length > 0 && (
            <PillGroup label="Supabase Tables" items={p.supabase_tables} color="bg-emerald-500/20 text-emerald-400" />
          )}
          {p.external_apis.length > 0 && (
            <PillGroup label="External APIs" items={p.external_apis} color="bg-purple-500/20 text-purple-400" />
          )}
          {p.localstorage_keys.length === 0 &&
            p.supabase_tables.length === 0 &&
            p.external_apis.length === 0 && (
              <p className="text-sm italic text-muted">
                No integrations recorded.
              </p>
            )}
        </div>
      </Section>

      {/* Links */}
      <Section title="Links">
        <div className="flex flex-wrap gap-2">
          {p.github_url && (
            <LinkButton href={p.github_url} label="GitHub" />
          )}
          {p.vercel_project && (
            <LinkButton
              href={`https://vercel.com/iamchasewhittakers-projects/${p.vercel_project}`}
              label="Vercel"
            />
          )}
          {p.type === 'web' && <CopyDevCommand slug={p.slug} variant="button" />}
          {p.linear_project_url && (
            <LinkButton href={p.linear_project_url} label="Linear" />
          )}
          {p.live_url && (
            <LinkButton href={p.live_url} label="Live" />
          )}
          {!p.github_url &&
            !p.vercel_project &&
            p.type !== 'web' &&
            !p.linear_project_url &&
            !p.live_url && (
              <p className="text-sm italic text-muted">No links available.</p>
            )}
        </div>
      </Section>

      {/* Linear Issues */}
      {p.linear_project_url && (
        <Section title="Linear Issues">
          {issueList.length === 0 ? (
            <p className="text-sm italic text-muted">
              No issues synced yet. Pull issues from{' '}
              <Link href="/linear" className="text-accent hover:underline">
                Harbor Master
              </Link>
              .
            </p>
          ) : (
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-border/50">
                {issueList.map((issue) => (
                  <tr key={issue.linear_id}>
                    <td className="w-20 py-2 pr-2 font-mono text-xs text-muted">
                      {issue.url ? (
                        <a
                          href={issue.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-accent transition-colors"
                        >
                          {issue.identifier}
                        </a>
                      ) : (
                        issue.identifier
                      )}
                    </td>
                    <td className="w-6 py-2">
                      {issue.priority > 0 && issue.priority <= 4 && (
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${ISSUE_PRIORITY_DOTS[issue.priority] ?? ''}`}
                          title={`Priority ${issue.priority}`}
                        />
                      )}
                    </td>
                    <td className="py-2 text-sm text-foreground">
                      {issue.title}
                    </td>
                    <td className="w-28 py-2 text-right text-xs">
                      <span
                        className={
                          ISSUE_STATUS_COLORS[issue.status_type ?? ''] ?? 'text-muted'
                        }
                      >
                        {issue.status_name ?? '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>
      )}

      {/* Changelog */}
      <Section title="Changelog">
        {changelogList.length === 0 ? (
          <p className="text-sm italic text-muted">
            No changelog parsed. Add a <code className="text-xs">CHANGELOG.md</code> in the app and run{' '}
            <code className="text-xs">npx tsx scripts/scan.ts</code>.
          </p>
        ) : (
          <div className="space-y-5">
            {Array.from(changelogByVersion.entries()).map(([version, entries]) => (
              <div key={version} className="space-y-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">
                  {version}
                </h3>
                <div className="space-y-3">
                  {entries.map((e) => (
                    <ChangelogEntryCard key={e.id} entry={e} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Roadmap */}
      <Section title="Roadmap">
        {roadmapList.length === 0 ? (
          <p className="text-sm italic text-muted">
            No roadmap parsed. Add a <code className="text-xs">ROADMAP.md</code> with{' '}
            <code className="text-xs">## Phase</code> sections and{' '}
            <code className="text-xs">- [ ]</code> items, then run the scanner.
          </p>
        ) : (
          <div className="space-y-5">
            {Array.from(roadmapByPhase.entries()).map(([phase, items]) => {
              const status = items[0]?.phase_status;
              const done = items.filter((i) => i.item_done).length;
              return (
                <div key={phase} className="space-y-2">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-gold">
                      {phase}
                    </h3>
                    {status && (
                      <span className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] font-medium text-muted">
                        {status}
                      </span>
                    )}
                    <span className="text-[10px] text-muted">
                      {done}/{items.length} done
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {items.map((item) => (
                      <li
                        key={item.id}
                        className={`flex items-start gap-2 text-sm ${
                          item.item_done ? 'text-muted line-through' : 'text-foreground'
                        }`}
                      >
                        <span className="mt-0.5 shrink-0 font-mono text-xs">
                          {item.item_done ? '☑' : '☐'}
                        </span>
                        <span className="flex-1">{stripBoldMarkers(item.item_text)}</span>
                        {item.item_date && (
                          <span className="shrink-0 text-[10px] text-muted">
                            {item.item_date}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      {/* Danger zone — only shown for non-archived projects */}
      {p.status !== 'archived' && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-danger/70">
            Danger Zone
          </h2>
          <div className="rounded-lg border border-danger/20 bg-danger/5 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Decommission this ship</p>
              <p className="text-xs text-muted mt-0.5">
                Archives in Supabase, cancels Linear project, shows manual steps for git + docs.
              </p>
            </div>
            <RetireButton slug={p.slug} name={p.name} hasLinear={!!p.linear_project_url} />
          </div>
        </section>
      )}
    </div>
  );
}

/* ── Helpers ────────────────────────────────────────────────── */

const COMPLIANCE_ITEMS = [
  { key: 'has_readme', label: 'README' },
  { key: 'has_claude_md', label: 'CLAUDE.md' },
  { key: 'has_mvp_audit', label: 'MVP Audit' },
  { key: 'has_changelog', label: 'Changelog' },
  { key: 'has_handoff', label: 'Handoff' },
  { key: 'has_agents', label: 'Agents' },
  { key: 'has_project_instructions', label: 'Project Instructions' },
];

const ISSUE_STATUS_COLORS: Record<string, string> = {
  completed: 'text-green-400',
  started: 'text-accent',
  canceled: 'text-muted line-through',
  duplicate: 'text-muted line-through',
};

const ISSUE_PRIORITY_DOTS: Record<number, string> = {
  1: 'bg-red-400',
  2: 'bg-orange-400',
  3: 'bg-yellow-400',
  4: 'bg-blue-400',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-steel/20 text-steel border-steel/30',
  stalled: 'bg-gold/20 text-gold border-gold/30',
  frozen: 'bg-dim/20 text-dim border-dim/30',
  archived: 'bg-ghost/60 text-dim border-dimmer/60',
};

const TYPE_COLORS: Record<string, string> = {
  web: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  ios: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  library: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  cli: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  desktop: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">
        {title}
      </h2>
      <div className="rounded-lg border border-border bg-card p-4">
        {children}
      </div>
    </section>
  );
}

function Badge({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string;
}) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${color ?? ''}`}
    >
      {children}
    </span>
  );
}

function PillGroup({
  label,
  items,
  color,
}: {
  label: string;
  items: string[];
  color: string;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function stripBoldMarkers(text: string): string {
  return text.replace(/\*\*/g, '');
}

function ChangelogEntryCard({ entry }: { entry: ChangelogEntry }) {
  const lines = entry.body_md.split('\n');
  const bullets: string[] = [];
  let buffer: string[] = [];
  for (const line of lines) {
    if (/^\s*-\s+/.test(line)) {
      if (buffer.length) {
        bullets[bullets.length - 1] += '\n' + buffer.join('\n');
        buffer = [];
      }
      bullets.push(line.replace(/^\s*-\s+/, '').trim());
    } else if (line.trim()) {
      buffer.push(line);
    }
  }

  return (
    <div className="rounded-md border border-border bg-card/50 p-3 space-y-2">
      <div className="flex flex-wrap items-baseline gap-2">
        <h4 className="text-sm font-semibold text-foreground">
          {stripBoldMarkers(entry.heading)}
        </h4>
        {entry.entry_date && (
          <span className="text-[10px] text-muted">{entry.entry_date}</span>
        )}
      </div>
      {bullets.length > 0 ? (
        <ul className="list-disc space-y-1 pl-5 text-xs text-muted">
          {bullets.map((b, i) => (
            <li key={i}>{stripBoldMarkers(b)}</li>
          ))}
        </ul>
      ) : entry.body_md ? (
        <p className="text-xs text-muted whitespace-pre-line">
          {stripBoldMarkers(entry.body_md)}
        </p>
      ) : null}
    </div>
  );
}

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-accent hover:text-accent"
    >
      {label}
      <span className="text-muted">&nearr;</span>
    </a>
  );
}
