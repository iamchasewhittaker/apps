export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase';
import { STEP_LABELS, STEP_NAUTICAL } from '@/lib/mvp-step';
import type { Project, Blocker, Compliance } from '@/lib/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ShipDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createServerClient();

  const [{ data: project }, { data: blockers }] = await Promise.all([
    supabase.from('projects').select('*').eq('slug', slug).single(),
    supabase
      .from('blockers')
      .select('*')
      .eq('project_slug', slug)
      .order('resolved_at', { ascending: true, nullsFirst: true })
      .order('created_at', { ascending: false }),
  ]);

  if (!project) notFound();

  const p = project as Project;
  const blockerList: Blocker[] = blockers ?? [];
  const step = p.mvp_step_actual ?? p.mvp_step ?? 0;

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
          <Badge color={STATUS_COLORS[p.status]}>{p.status}</Badge>
          <Badge color="border-accent/30 bg-accent/10 text-accent">
            Step {step}: {STEP_LABELS[step] ?? '?'} &middot;{' '}
            {STEP_NAUTICAL[step] ?? ''}
          </Badge>
        </div>

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
      </header>

      {/* Next Action */}
      <Section title="Next Action">
        {p.next_action ? (
          <p className="text-sm text-foreground">{p.next_action}</p>
        ) : (
          <p className="text-sm italic text-muted">No next action set.</p>
        )}
      </Section>

      {/* Blockers */}
      <Section title="Blockers">
        {blockerList.length === 0 ? (
          <p className="text-sm italic text-muted">No blockers recorded.</p>
        ) : (
          <ul className="space-y-2">
            {blockerList.map((b) => (
              <li
                key={b.id}
                className={`flex items-start gap-2 rounded-md border px-3 py-2 text-sm ${
                  b.resolved_at
                    ? 'border-border bg-card/50 text-muted line-through'
                    : 'border-danger/30 bg-danger/5 text-foreground'
                }`}
              >
                <span className="mt-0.5 shrink-0">
                  {b.resolved_at ? '\u2713' : '\u25CF'}
                </span>
                <span>{b.text}</span>
              </li>
            ))}
          </ul>
        )}
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
          {p.linear_project_url && (
            <LinkButton href={p.linear_project_url} label="Linear" />
          )}
          {p.live_url && (
            <LinkButton href={p.live_url} label="Live" />
          )}
          {!p.github_url &&
            !p.vercel_project &&
            !p.linear_project_url &&
            !p.live_url && (
              <p className="text-sm italic text-muted">No links available.</p>
            )}
        </div>
      </Section>
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

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-success/20 text-success border-success/30',
  stalled: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  frozen: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  archived: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
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
