export const dynamic = 'force-dynamic';

import { createServerClient } from '@/lib/supabase';
import type { Project } from '@/lib/types';

export default async function LinearPage() {
  const supabase = await createServerClient();

  const { data: allProjects } = await supabase
    .from('projects')
    .select('slug, name, linear_project_url, status')
    .order('name');

  const projects: Pick<Project, 'slug' | 'name' | 'linear_project_url' | 'status'>[] =
    allProjects ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-accent">
          Harbor Master
        </h1>
        <p className="text-sm text-muted">
          Sync your fleet with Linear. Each ship gets a matching Linear project.
        </p>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ActionCard
          title="Create Missing in Linear"
          description="Scan fleet and create Linear projects for any unlinked ships."
        />
        <ActionCard
          title="Push Statuses"
          description="Update Linear project statuses to match current fleet state."
        />
        <ActionCard
          title="Pull Updates"
          description="Fetch latest Linear issue counts and sync back to Shipyard."
        />
      </div>

      {/* Sync overview table */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
          Sync Overview
        </h2>

        {projects.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <p className="text-sm text-muted">No projects found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-card text-xs uppercase tracking-wider text-muted">
                  <th className="px-4 py-2.5 font-medium">Ship</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium">Linear</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((p) => (
                  <tr key={p.slug} className="bg-card/50">
                    <td className="px-4 py-2.5 font-medium text-foreground">
                      {p.name}
                    </td>
                    <td className="px-4 py-2.5 text-muted">{p.status}</td>
                    <td className="px-4 py-2.5">
                      {p.linear_project_url ? (
                        <a
                          href={p.linear_project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent hover:text-accent-hover underline underline-offset-2 transition-colors"
                        >
                          Linked
                        </a>
                      ) : (
                        <span className="text-muted/60">Not linked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-5 space-y-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="flex-1 text-xs text-muted leading-relaxed">
        {description}
      </p>
      <button
        disabled
        className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-muted/50 cursor-not-allowed"
      >
        Run
        <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent">
          Phase 2
        </span>
      </button>
    </div>
  );
}
