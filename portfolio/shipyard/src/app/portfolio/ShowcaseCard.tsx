'use client';

import Link from 'next/link';
import type { Project } from '@/lib/types';

function typeBadge(type: string): { label: string; className: string } {
  const base = 'rounded-full px-2 py-0.5 text-[10px] font-medium';
  switch (type) {
    case 'web':
      return { label: 'web', className: `${base} border border-gold/40 bg-gold/10 text-gold` };
    case 'ios':
      return { label: 'iOS', className: `${base} border border-gold/40 bg-gold/10 text-gold` };
    case 'library':
      return { label: 'lib', className: `${base} border border-steel/40 bg-steel/10 text-steel` };
    case 'cli':
      return { label: 'cli', className: `${base} border border-dim/40 bg-dim/10 text-dim` };
    case 'desktop':
      return { label: 'desktop', className: `${base} border border-success/40 bg-success/10 text-success` };
    default:
      return { label: type, className: `${base} border border-dimmer bg-surface/80 backdrop-blur-sm text-steel` };
  }
}

export function ShowcaseCard({ ship }: { ship: Project }) {
  const t = typeBadge(ship.type);
  const hasLive = Boolean(ship.live_url);
  const isIos = ship.type === 'ios';

  return (
    <Link
      href={`/portfolio/${ship.slug}`}
      className="group flex flex-col gap-4 rounded-2xl border border-dimmer bg-surface/80 backdrop-blur-sm p-5 transition-colors hover:border-gold/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="truncate text-sm font-semibold text-white group-hover:text-gold">
            {ship.name}
          </h3>
          {ship.tagline && (
            <p className="text-xs text-steel leading-relaxed line-clamp-2">
              {ship.tagline}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className={t.className}>{t.label}</span>
          {ship.category && (
            <span className="rounded-full border border-dimmer bg-surface/80 backdrop-blur-sm px-2 py-0.5 text-[10px] text-steel">
              {ship.category}
            </span>
          )}
        </div>
      </div>

      {ship.jtbd_primary && (
        <p className="text-xs text-steel/80 leading-relaxed line-clamp-2">
          {ship.jtbd_primary}
        </p>
      )}

      {ship.tech_stack && (
        <div className="flex flex-wrap gap-1.5">
          {ship.tech_stack
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
            .slice(0, 4)
            .map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-dimmer bg-surface/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-steel"
              >
                {tech}
              </span>
            ))}
        </div>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        {hasLive ? (
          <LinkChip
            href={ship.live_url!.startsWith('http') ? ship.live_url! : `https://${ship.live_url}`}
            label="Live"
            tone="success"
          />
        ) : isIos ? (
          <span className="inline-flex items-center rounded-md border border-gold/40 bg-gold/10 px-2.5 py-1 text-[11px] font-medium text-gold">
            Local Xcode
          </span>
        ) : null}
        {ship.github_url && (
          <LinkChip href={ship.github_url} label="GitHub" tone="neutral" />
        )}
        {ship.linear_project_url && (
          <LinkChip href={ship.linear_project_url} label="Linear" tone="accent" />
        )}
      </div>
    </Link>
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
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-[11px] font-medium transition-colors ${toneClass}`}
    >
      {label} <span aria-hidden>↗</span>
    </a>
  );
}
