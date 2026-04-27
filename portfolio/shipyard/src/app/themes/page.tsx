export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { readVisibleSetFromCookie } from '@/lib/visible-projects-server';
import type { Theme, ThemeKind } from '@/lib/types';
import { ModeHeading } from '@/components/ModeHeading';
import { ThesisEditor } from './ThesisEditor';

const SECTION_META: Record<
  ThemeKind,
  { title: string; description: string }
> = {
  portfolio_thesis: {
    title: 'Portfolio Thesis',
    description:
      'Your north star. The single sentence that ties everything together.',
  },
  narrative_thread: {
    title: 'Narrative Threads',
    description:
      'The stories you tell through your work. Each thread connects multiple ships.',
  },
  cross_app_pattern: {
    title: 'Cross-App Patterns',
    description:
      'Shared patterns and approaches that recur across different projects.',
  },
  common_input: {
    title: 'Common Inputs',
    description:
      'Shared data sources, APIs, and inputs used by multiple ships.',
  },
};

const KIND_ORDER: ThemeKind[] = [
  'portfolio_thesis',
  'narrative_thread',
  'cross_app_pattern',
  'common_input',
];

export default async function ThemesPage() {
  const supabase = await createServerClient();

  const [{ data: allThemes }, visibleSet] = await Promise.all([
    supabase
      .from('themes')
      .select('*')
      .order('kind')
      .order('title'),
    readVisibleSetFromCookie(),
  ]);

  const rawThemes: Theme[] = allThemes ?? [];
  const themes: Theme[] = visibleSet
    ? rawThemes.map((t) => ({
        ...t,
        project_slugs: t.project_slugs.filter((s) => visibleSet.has(s)),
      }))
    : rawThemes;

  const grouped = KIND_ORDER.reduce(
    (acc, kind) => {
      acc[kind] = themes.filter((t) => t.kind === kind);
      return acc;
    },
    {} as Record<ThemeKind, Theme[]>,
  );

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <ModeHeading
        labelKey="analyticsHeading"
        subtitle="Themes, patterns, and the narrative threads that connect your fleet."
      />


      {/* Portfolio Thesis */}
      <ThesisSection themes={grouped.portfolio_thesis} />

      {/* Narrative Threads */}
      <ThemeSection kind="narrative_thread" themes={grouped.narrative_thread} />

      {/* Cross-App Patterns */}
      <ThemeSection
        kind="cross_app_pattern"
        themes={grouped.cross_app_pattern}
      />

      {/* Common Inputs */}
      <ThemeSection kind="common_input" themes={grouped.common_input} />
    </div>
  );
}

function ThesisSection({ themes }: { themes: Theme[] }) {
  const meta = SECTION_META.portfolio_thesis;
  const thesis = themes[0];

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          {meta.title}
        </h2>
        <p className="text-xs text-muted/70">{meta.description}</p>
      </div>

      <div className="rounded-lg border border-accent/30 bg-accent/5 p-6">
        <ThesisEditor initialText={thesis?.description ?? null} />
      </div>
    </div>
  );
}

function ThemeSection({
  kind,
  themes,
}: {
  kind: ThemeKind;
  themes: Theme[];
}) {
  const meta = SECTION_META[kind];

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          {meta.title}
        </h2>
        <p className="text-xs text-muted/70">{meta.description}</p>
      </div>

      {themes.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted">
            No {meta.title.toLowerCase()} defined yet.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {themes.map((theme) => (
            <div
              key={theme.id}
              className="rounded-lg border border-border bg-card p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {theme.title}
                </h3>
                {theme.auto_generated && (
                  <span className="shrink-0 rounded-full border border-purple-500/30 bg-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-400">
                    auto-generated
                  </span>
                )}
              </div>

              <p className="text-sm text-muted leading-relaxed">
                {theme.description}
              </p>

              {theme.project_slugs.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {theme.project_slugs.map((slug) => (
                    <Link
                      key={slug}
                      href={`/ship/${slug}`}
                      className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
                    >
                      {slug}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
