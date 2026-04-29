export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServerClient } from '@/lib/supabase';
import { readVisibleSetFromCookie } from '@/lib/visible-projects-server';
import type {
  Theme,
  ThemeKind,
  CommonInputMetadata,
  CommonPromptMetadata,
  GlossaryTermMetadata,
  PromptSourceKind,
} from '@/lib/types';
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
      'Shared data sources, APIs, and inputs used by multiple ships. Each row shows the auth method, env vars, docs link, cost tier, and per-project usage notes.',
  },
  common_prompt: {
    title: 'Common Prompts',
    description:
      'LLM system prompts, Claude Code session-start templates, slash commands, and PROMPT.md files scanned across the portfolio.',
  },
  glossary_term: {
    title: 'Glossary',
    description:
      'Terms used across docs, Vercel, Supabase, and Cursor. Auto-pulled from docs/GLOSSARY.md.',
  },
  mastery_tip: {
    title: 'Mastery Tips',
    description:
      'AI workflow tips and Claude mastery patterns discovered across sessions.',
  },
};

const KIND_ORDER: ThemeKind[] = [
  'portfolio_thesis',
  'narrative_thread',
  'cross_app_pattern',
  'common_input',
  'common_prompt',
  'glossary_term',
  'mastery_tip',
];

const PROMPT_KIND_LABEL: Record<PromptSourceKind, string> = {
  system_prompt: 'system prompt',
  session_template: 'session template',
  slash_command: 'slash command',
  prompt_md: 'PROMPT.md',
};

const PROMPT_KIND_CHIP: Record<PromptSourceKind, string> = {
  system_prompt: 'border-teal-500/30 bg-teal-500/15 text-teal-300',
  session_template: 'border-yellow-500/30 bg-yellow-500/15 text-yellow-300',
  slash_command: 'border-sky-500/30 bg-sky-500/15 text-sky-300',
  prompt_md: 'border-purple-500/30 bg-purple-500/15 text-purple-300',
};

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
        subtitle="Themes, patterns, prompts, and the shared vocabulary that connects your fleet."
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

      {/* Common Prompts */}
      <ThemeSection kind="common_prompt" themes={grouped.common_prompt} />

      {/* Glossary */}
      <ThemeSection kind="glossary_term" themes={grouped.glossary_term} />
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
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeCard({ theme }: { theme: Theme }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">
          {theme.kind === 'glossary_term' ? (
            <span className="font-mono text-foreground">{theme.title}</span>
          ) : (
            theme.title
          )}
        </h3>
        <div className="flex shrink-0 items-center gap-1.5">
          {theme.kind === 'common_prompt' && (
            <PromptKindChip metadata={theme.metadata as CommonPromptMetadata | undefined} />
          )}
          {theme.auto_generated && (
            <span className="rounded-full border border-purple-500/30 bg-purple-500/20 px-2 py-0.5 text-[10px] font-medium text-purple-400">
              auto-generated
            </span>
          )}
        </div>
      </div>

      <p className="text-sm text-muted leading-relaxed">{theme.description}</p>

      {theme.kind === 'common_input' && (
        <CommonInputDetail
          metadata={theme.metadata as CommonInputMetadata | undefined}
          projectSlugs={theme.project_slugs}
        />
      )}

      {theme.kind === 'common_prompt' && (
        <CommonPromptDetail metadata={theme.metadata as CommonPromptMetadata | undefined} />
      )}

      {theme.kind === 'glossary_term' && (
        <GlossaryDetail metadata={theme.metadata as GlossaryTermMetadata | undefined} />
      )}

      {theme.kind !== 'common_input' && theme.project_slugs.length > 0 && (
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
  );
}

function PromptKindChip({ metadata }: { metadata: CommonPromptMetadata | undefined }) {
  if (!metadata?.source_kind) return null;
  const cls = PROMPT_KIND_CHIP[metadata.source_kind];
  const label = PROMPT_KIND_LABEL[metadata.source_kind];
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${cls}`}>
      {label}
    </span>
  );
}

function CommonInputDetail({
  metadata,
  projectSlugs,
}: {
  metadata: CommonInputMetadata | undefined;
  projectSlugs: string[];
}) {
  if (!metadata) {
    return projectSlugs.length > 0 ? (
      <div className="flex flex-wrap gap-1.5">
        {projectSlugs.map((slug) => (
          <Link
            key={slug}
            href={`/ship/${slug}`}
            className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            {slug}
          </Link>
        ))}
      </div>
    ) : null;
  }

  const { auth_method, env_vars, doc_url, cost_tier, per_project_notes } = metadata;
  const notes = per_project_notes ?? {};

  return (
    <div className="space-y-3">
      <dl className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
        {auth_method && (
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted/70">Auth</dt>
            <dd className="text-foreground/90">{auth_method}</dd>
          </div>
        )}
        {cost_tier && (
          <div>
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted/70">Cost</dt>
            <dd className="text-foreground/90">{cost_tier}</dd>
          </div>
        )}
        {doc_url && (
          <div className="sm:col-span-2">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted/70">Docs</dt>
            <dd>
              <a
                href={doc_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline break-all"
              >
                {doc_url}
              </a>
            </dd>
          </div>
        )}
      </dl>

      {env_vars && env_vars.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted/70">Env vars</p>
          <div className="flex flex-wrap gap-1.5">
            {env_vars.map((v) => (
              <span
                key={v}
                className="rounded border border-border/80 bg-bg/50 px-1.5 py-0.5 font-mono text-[10px] text-foreground/80"
              >
                {v}
              </span>
            ))}
          </div>
        </div>
      )}

      {projectSlugs.length > 0 && (
        <div className="space-y-2 border-t border-border/60 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted/70">
            Used by
          </p>
          <ul className="space-y-1.5">
            {projectSlugs.map((slug) => {
              const note = notes[slug];
              return (
                <li key={slug} className="flex flex-wrap items-baseline gap-2">
                  <Link
                    href={`/ship/${slug}`}
                    className="shrink-0 rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
                  >
                    {slug}
                  </Link>
                  {note ? (
                    <span className="text-xs text-muted leading-snug">{note}</span>
                  ) : (
                    <span className="text-xs text-muted/50 italic">no usage note</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function CommonPromptDetail({ metadata }: { metadata: CommonPromptMetadata | undefined }) {
  if (!metadata) return null;
  return (
    <div className="space-y-2">
      {metadata.source_path && (
        <p className="font-mono text-[10px] text-muted/70 break-all">{metadata.source_path}</p>
      )}
      {metadata.excerpt && (
        <pre className="whitespace-pre-wrap break-words rounded-md border border-border/60 bg-bg/40 p-3 text-xs text-foreground/90 leading-relaxed line-clamp-6">
          {metadata.excerpt}
        </pre>
      )}
    </div>
  );
}

function GlossaryDetail({ metadata }: { metadata: GlossaryTermMetadata | undefined }) {
  // description already shows the parsed definition; skip duplicating raw markdown.
  void metadata;
  return null;
}
