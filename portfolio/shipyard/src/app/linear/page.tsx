export const dynamic = 'force-dynamic';

import { createServerClient } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import HarborClient from './HarborClient';

export default async function LinearPage() {
  const supabase = await createServerClient();

  const { data: allProjects } = await supabase
    .from('projects')
    .select('slug, name, linear_project_url, linear_issue_count, status')
    .order('name');

  const projects: Pick<
    Project,
    'slug' | 'name' | 'linear_project_url' | 'linear_issue_count' | 'status'
  >[] = allProjects ?? [];

  const linked = projects.filter((p) => p.linear_project_url).length;
  const unlinked = projects.filter((p) => !p.linear_project_url && p.status !== 'archived').length;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-accent">Harbor Master</h1>
        <p className="text-sm text-muted">
          Sync your fleet with Linear. Each ship gets a matching Linear project.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex gap-6 text-sm">
        <span className="text-foreground">
          <span className="font-semibold text-accent">{linked}</span>{' '}
          <span className="text-muted">linked</span>
        </span>
        <span className="text-foreground">
          <span className="font-semibold text-foreground">{unlinked}</span>{' '}
          <span className="text-muted">unlinked</span>
        </span>
      </div>

      <HarborClient />

      {/* Sync overview table */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Sync Overview</h2>

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
                  <th className="px-4 py-2.5 font-medium text-right">Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {projects.map((p) => (
                  <tr key={p.slug} className="bg-card/50">
                    <td className="px-4 py-2.5 font-medium text-foreground">{p.name}</td>
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
                        <span className="text-muted/60">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right text-muted">
                      {p.linear_issue_count != null ? p.linear_issue_count : '—'}
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
