'use client';

import Link from 'next/link';
import type { Project } from '@/lib/types';

const TYPE_COLORS: Record<string, string> = {
  web: 'bg-blue-500/15 text-blue-300',
  ios: 'bg-purple-500/15 text-purple-300',
  library: 'bg-teal-500/15 text-teal-300',
  cli: 'bg-orange-500/15 text-orange-300',
  desktop: 'bg-pink-500/15 text-pink-300',
};

export function ShowcaseCard({ ship }: { ship: Project }) {
  const hasLive = Boolean(ship.live_url);
  const isIos = ship.type === 'ios';

  return (
    <Link
      href={`/portfolio/${ship.slug}`}
      className="group relative overflow-hidden flex flex-col rounded-xl border border-dimmer bg-surface/80 backdrop-blur-sm p-6 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:border-gold/30"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <h3 className="font-bold text-lg text-white leading-snug group-hover:text-gold transition-colors truncate min-w-0">
            {ship.name}
          </h3>
          {ship.tagline && (
            <p className="text-xs text-steel leading-relaxed line-clamp-2">
              {ship.tagline}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className={`shrink-0 rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${TYPE_COLORS[ship.type] ?? 'bg-dimmer text-steel'}`}>
            {ship.type}
          </span>
          {ship.category && (
            <span className="rounded-full border border-dimmer bg-surface/80 backdrop-blur-sm px-2 py-0.5 text-[10px] text-steel">
              {ship.category}
            </span>
          )}
        </div>
      </div>

      {ship.jtbd_primary && (
        <p className="mb-4 text-xs text-steel/80 leading-relaxed line-clamp-2">
          {ship.jtbd_primary}
        </p>
      )}

      {ship.tech_stack && (
        <div className="mb-4 flex flex-wrap gap-1.5">
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

      <div className="mt-auto flex flex-wrap gap-2">
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
