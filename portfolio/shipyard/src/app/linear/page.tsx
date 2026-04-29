export const dynamic = 'force-dynamic';

import { createServerClient } from '@/lib/supabase';
import type { Project, LinearIssue } from '@/lib/types';
import HarborClient from './HarborClient';

const STATUS_COLORS: Record<string, string> = {
  completed: 'text-green-400',
  started: 'text-accent',
  canceled: 'text-muted line-through',
  duplicate: 'text-muted line-through',
};

const PRIORITY_DOTS: Record<number, string> = {
  1: 'bg-red-400',
  2: 'bg-orange-400',
  3: 'bg-yellow-400',
  4: 'bg-blue-400',
};

export default async function LinearPage() {
  const supabase = await createServerClient();

  const [{ data: allProjects }, { data: issueRows }] = await Promise.all([
    supabase
      .from('projects')
      .select('slug, name, linear_project_url, linear_issue_count, status')
      .order('name'),
    supabase
      .from('linear_issues')
      .select('*')
      .order('project_slug')
      .order('priority', { ascending: true })
      .order('updated_at', { ascending: false }),
  ]);

  const projects: Pick<
    Project,
    'slug' | 'name' | 'linear_project_url' | 'linear_issue_count' | 'status'
  >[] = allProjects ?? [];

  const issues: LinearIssue[] = (issueRows ?? []) as LinearIssue[];

  const issuesByProject = new Map<string, LinearIssue[]>();
  for (const issue of issues) {
    const list = issuesByProject.get(issue.project_slug) ?? [];
    list.push(issue);
    issuesByProject.set(issue.project_slug, list);
  }

  const projectNameBySlug = new Map(projects.map((p) => [p.slug, p.name]));

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
        {issues.length > 0 && (
          <span className="text-foreground">
            <span className="font-semibold text-foreground">{issues.length}</span>{' '}
            <span className="text-muted">issues synced</span>
          </span>
        )}
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

      {/* Issue Snapshots */}
      {issuesByProject.size > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
            Issue Snapshots
          </h2>

          <div className="space-y-2">
            {Array.from(issuesByProject.entries()).map(([slug, projectIssues]) => (
              <details
                key={slug}
                className="rounded-lg border border-border bg-card/50"
              >
                <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-card transition-colors">
                  <span>{projectNameBySlug.get(slug) ?? slug}</span>
                  <span className="text-xs text-muted">{projectIssues.length} issues</span>
                </summary>
                <div className="border-t border-border">
                  <table className="w-full text-left text-sm">
                    <tbody className="divide-y divide-border/50">
                      {projectIssues.map((issue) => (
                        <tr key={issue.linear_id} className="group">
                          <td className="w-20 px-4 py-2 font-mono text-xs text-muted">
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
                          <td className="px-2 py-2">
                            {issue.priority > 0 && issue.priority <= 4 && (
                              <span
                                className={`inline-block h-2 w-2 rounded-full ${PRIORITY_DOTS[issue.priority] ?? ''}`}
                                title={`Priority ${issue.priority}`}
                              />
                            )}
                          </td>
                          <td className="px-2 py-2 text-sm text-foreground">
                            {issue.title}
                          </td>
                          <td className="w-28 px-4 py-2 text-right text-xs">
                            <span
                              className={
                                STATUS_COLORS[issue.status_type ?? ''] ?? 'text-muted'
                              }
                            >
                              {issue.status_name ?? '—'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
