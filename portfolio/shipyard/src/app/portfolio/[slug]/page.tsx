export const dynamic = 'force-dynamic';

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createServerClient } from '@/lib/supabase';
import branding from '@/data/branding.json';
import type { Project } from '@/lib/types';

interface ColorEntry {
  hex: string;
  name?: string;
  usage?: string;
}

interface FontEntry {
  family: string;
  role?: string;
}

interface BrandingEntry {
  slug: string;
  appName?: string;
  colors: ColorEntry[];
  fonts: FontEntry[];
  iconPath?: string;
  notes?: string;
  sourceFile: string;
  missing?: boolean;
}

const BRANDING = branding as Record<string, BrandingEntry>;

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single<Project>();

  if (!project) {
    notFound();
  }

  const brand = BRANDING[slug];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/portfolio"
          className="text-xs text-steel hover:text-gold"
        >
          ← Back to Fleet Showcase
        </Link>
        <div className="flex items-center gap-2">
          <StatusPill status={project.status} />
          {project.category && (
            <span className="rounded-full border border-dimmer bg-surface/80 backdrop-blur-sm px-2.5 py-0.5 text-[11px] text-steel">
              {project.category}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-start gap-5">
        {brand?.iconPath ? (
          <Image
            src={brand.iconPath}
            alt={`${project.name} icon`}
            width={96}
            height={96}
            className="rounded-2xl border border-dimmer"
            unoptimized
          />
        ) : (
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm text-2xl font-bold text-steel">
            {project.name.charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-gold">
            {project.name}
          </h1>
          {project.tagline && (
            <p className="text-sm text-white">{project.tagline}</p>
          )}
          {project.jtbd_primary && (
            <p className="text-xs text-steel">{project.jtbd_primary}</p>
          )}
          <div className="flex flex-wrap gap-2 pt-1">
            {project.live_url && (
              <LinkChip
                href={project.live_url.startsWith('http') ? project.live_url : `https://${project.live_url}`}
                label="Live"
                tone="success"
              />
            )}
            {project.github_url && (
              <LinkChip href={project.github_url} label="GitHub" tone="neutral" />
            )}
            {project.linear_project_url && (
              <LinkChip href={project.linear_project_url} label="Linear" tone="accent" />
            )}
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-5 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">
          About
        </h2>
        {project.summary ? (
          <p className="text-sm leading-relaxed text-white">
            {project.summary}
          </p>
        ) : (
          <p className="text-xs text-steel/70">
            No summary yet. Add a <code className="text-gold">## What This App Is</code> section to{' '}
            <code className="text-gold">portfolio/{slug}/CLAUDE.md</code>, then run{' '}
            <code className="text-gold">npm run sync:projects</code>.
          </p>
        )}
      </section>

      {brand && !brand.missing && (brand.colors.length > 0 || brand.fonts.length > 0) ? (
        <section className="rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-5 space-y-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">
            Design System
          </h2>

          {brand.colors.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-steel/80">
                Palette
              </h3>
              <div className="grid grid-cols-4 gap-3 md:grid-cols-8">
                {brand.colors.map((c) => (
                  <ColorSwatch key={c.hex} color={c} />
                ))}
              </div>
            </div>
          )}

          {brand.fonts.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-steel/80">
                Typography
              </h3>
              <div className="flex flex-wrap gap-3">
                {brand.fonts.map((f) => (
                  <div
                    key={f.family}
                    className="rounded-md border border-dimmer bg-surface/50 px-3 py-2"
                  >
                    <div className="text-sm text-white">{f.family}</div>
                    {f.role && <div className="text-[11px] text-steel">{f.role}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {brand.notes && (
            <p className="text-xs text-steel/80 leading-relaxed italic">
              {brand.notes}
            </p>
          )}

          <div className="text-[10px] text-steel/60">
            Source:{' '}
            <code className="text-steel">
              {brand.sourceFile}
            </code>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-dimmer bg-surface/50 backdrop-blur-sm p-5">
          <p className="text-xs text-steel/70">
            No brand data yet. Add{' '}
            <code className="text-gold">portfolio/{slug}/docs/BRANDING.md</code>{' '}
            (copy from{' '}
            <code className="text-gold">docs/templates/PORTFOLIO_APP_BRANDING.md</code>
            ), then run <code className="text-gold">npm run build:branding</code>.
          </p>
        </section>
      )}

      <section className="rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-5 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-steel">
          Tech Details
        </h2>
        <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
          <DetailRow label="Stack" value={project.tech_stack} />
          <DetailRow label="Type" value={project.type} />
          <DetailRow label="Family" value={project.family} />
          <DetailRow
            label="MVP Step"
            value={
              project.mvp_step_actual !== null
                ? `Step ${project.mvp_step_actual}`
                : '—'
            }
          />
          <DetailRow
            label="Compliance"
            value={`${Math.round(project.compliance_score)}%`}
          />
          <DetailRow
            label="Last commit"
            value={
              project.days_since_commit !== null
                ? project.days_since_commit === 0
                  ? 'Today'
                  : `${project.days_since_commit} days ago`
                : '—'
            }
          />
          {project.localstorage_keys.length > 0 && (
            <DetailRow
              label="Storage keys"
              value={project.localstorage_keys.join(', ')}
            />
          )}
          {project.supabase_tables.length > 0 && (
            <DetailRow
              label="Supabase tables"
              value={project.supabase_tables.join(', ')}
            />
          )}
          {project.external_apis.length > 0 && (
            <DetailRow
              label="External APIs"
              value={project.external_apis.join(', ')}
            />
          )}
        </div>
      </section>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const tone =
    status === 'active'
      ? 'border-success/40 bg-success/10 text-success'
      : status === 'stalled'
        ? 'border-warning/40 bg-warning/10 text-warning'
        : status === 'frozen'
          ? 'border-steel/40 bg-steel/10 text-steel'
          : 'border-dimmer bg-surface/80 backdrop-blur-sm text-steel';
  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${tone}`}
    >
      {status}
    </span>
  );
}

function ColorSwatch({ color }: { color: ColorEntry }) {
  return (
    <div className="space-y-1">
      <div
        className="aspect-square w-full rounded-md border border-dimmer"
        style={{ backgroundColor: color.hex }}
        title={color.name ? `${color.name} — ${color.hex}` : color.hex}
      />
      <div className="min-w-0">
        <div className="truncate text-[10px] font-mono uppercase text-steel">
          {color.hex}
        </div>
        {color.name && (
          <div className="truncate text-[10px] text-steel/70">{color.name}</div>
        )}
      </div>
    </div>
  );
}

function LinkChip({
  href,
  label,
  tone,
}: {
  href: string;
  label: string;
  tone: 'success' | 'accent' | 'neutral';
}) {
  const toneClass =
    tone === 'success'
      ? 'border-success/40 bg-success/10 text-success hover:bg-success/20'
      : tone === 'accent'
        ? 'border-gold/40 bg-gold/10 text-gold hover:bg-gold/20'
        : 'border-dimmer bg-surface/80 backdrop-blur-sm text-steel hover:border-gold/30 hover:text-white';
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors ${toneClass}`}
    >
      {label} <span aria-hidden>↗</span>
    </a>
  );
}

function DetailRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-md border border-dimmer bg-surface/50 px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-steel">
        {label}
      </div>
      <div className="text-sm text-white">{value ?? '—'}</div>
    </div>
  );
}
