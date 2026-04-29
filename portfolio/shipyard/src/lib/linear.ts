import { LinearClient, ProjectStatusType } from '@linear/sdk';

function getClient(): LinearClient | null {
  if (!process.env.LINEAR_API_KEY) return null;
  return new LinearClient({ apiKey: process.env.LINEAR_API_KEY });
}

export async function cancelLinearProject(
  projectUrl: string,
): Promise<{ ok: boolean; message: string }> {
  const client = getClient();
  if (!client) return { ok: false, message: 'LINEAR_API_KEY not configured' };

  try {
    const result = await client.projects();
    const urlSlug = projectUrl.split('/').pop() ?? '';
    const match = result.nodes.find(
      (p) => p.url === projectUrl || p.url?.split('/').pop() === urlSlug,
    );

    if (!match) {
      return { ok: false, message: `No Linear project found matching ${projectUrl}` };
    }

    await client.archiveProject(match.id);
    return { ok: true, message: `Archived Linear project: ${match.name}` };
  } catch (e) {
    return { ok: false, message: `Linear API error: ${(e as Error).message}` };
  }
}

async function getWhittakerTeamId(client: LinearClient): Promise<string | null> {
  const teams = await client.teams();
  return teams.nodes.find((t) => t.key === 'WHI')?.id ?? null;
}

export async function createMissingProjects(
  ships: Array<{ slug: string; name: string; tagline: string | null }>,
): Promise<Array<{ slug: string; url: string | null; error?: string }>> {
  const client = getClient();
  if (!client) {
    return ships.map((s) => ({ slug: s.slug, url: null, error: 'LINEAR_API_KEY not configured' }));
  }

  const teamId = await getWhittakerTeamId(client);
  if (!teamId) {
    return ships.map((s) => ({ slug: s.slug, url: null, error: 'WHI team not found in Linear' }));
  }

  const results: Array<{ slug: string; url: string | null; error?: string }> = [];
  for (const ship of ships) {
    try {
      const payload = await client.createProject({
        name: ship.name,
        description: ship.tagline ?? '',
        teamIds: [teamId],
      });
      const project = await payload.project;
      results.push({ slug: ship.slug, url: project?.url ?? null });
    } catch (e) {
      results.push({ slug: ship.slug, url: null, error: (e as Error).message });
    }
  }
  return results;
}

const STATUS_TYPE_MAP: Record<string, string> = {
  active: ProjectStatusType.Started,
  stalled: ProjectStatusType.Paused,
  frozen: ProjectStatusType.Paused,
};

export async function pushProjectStatuses(
  ships: Array<{ slug: string; linear_project_url: string; status: string }>,
): Promise<Array<{ slug: string; ok: boolean; message: string }>> {
  const client = getClient();
  if (!client) {
    return ships.map((s) => ({ slug: s.slug, ok: false, message: 'LINEAR_API_KEY not configured' }));
  }

  const [allProjects, statusesResult] = await Promise.all([
    client.projects(),
    client.projectStatuses(),
  ]);

  // Build type → first matching statusId map
  const statusIdByType: Record<string, string> = {};
  for (const s of statusesResult.nodes) {
    if (!statusIdByType[s.type]) statusIdByType[s.type] = s.id;
  }

  const results: Array<{ slug: string; ok: boolean; message: string }> = [];
  for (const ship of ships) {
    try {
      const urlSlug = ship.linear_project_url.split('/').pop() ?? '';
      const match = allProjects.nodes.find(
        (p) => p.url === ship.linear_project_url || p.url?.split('/').pop() === urlSlug,
      );
      if (!match) {
        results.push({ slug: ship.slug, ok: false, message: 'Linear project not found' });
        continue;
      }

      if (ship.status === 'archived') {
        await client.archiveProject(match.id);
        results.push({ slug: ship.slug, ok: true, message: 'Archived' });
        continue;
      }

      const targetType = STATUS_TYPE_MAP[ship.status];
      const statusId = targetType ? statusIdByType[targetType] : null;
      if (!statusId) {
        results.push({ slug: ship.slug, ok: false, message: `No status ID for type '${targetType}'` });
        continue;
      }

      await client.updateProject(match.id, { statusId });
      results.push({ slug: ship.slug, ok: true, message: `Set to ${targetType}` });
    } catch (e) {
      results.push({ slug: ship.slug, ok: false, message: (e as Error).message });
    }
  }
  return results;
}

export async function pullProjectCounts(
  ships: Array<{ slug: string; linear_project_url: string }>,
): Promise<Array<{ slug: string; count: number }>> {
  const client = getClient();
  if (!client) return [];

  const allProjects = await client.projects();
  const results: Array<{ slug: string; count: number }> = [];

  for (const ship of ships) {
    const urlSlug = ship.linear_project_url.split('/').pop() ?? '';
    const match = allProjects.nodes.find(
      (p) => p.url === ship.linear_project_url || p.url?.split('/').pop() === urlSlug,
    );
    if (match) {
      const history = match.issueCountHistory;
      const count = history.length > 0 ? history[history.length - 1] : 0;
      results.push({ slug: ship.slug, count });
    }
  }
  return results;
}

export interface LinearIssueRow {
  project_slug: string;
  linear_id: string;
  identifier: string;
  title: string;
  status_name: string | null;
  status_type: string | null;
  priority: number;
  url: string;
  updated_at: string;
}

export async function pullIssues(
  ships: Array<{ slug: string; linear_project_url: string }>,
): Promise<LinearIssueRow[]> {
  const client = getClient();
  if (!client) return [];

  const allProjects = await client.projects();
  const rows: LinearIssueRow[] = [];

  for (const ship of ships) {
    const urlSlug = ship.linear_project_url.split('/').pop() ?? '';
    const match = allProjects.nodes.find(
      (p) => p.url === ship.linear_project_url || p.url?.split('/').pop() === urlSlug,
    );
    if (!match) continue;

    const issueConn = await match.issues();
    for (const issue of issueConn.nodes) {
      const state = await issue.state;
      rows.push({
        project_slug: ship.slug,
        linear_id: issue.id,
        identifier: issue.identifier,
        title: issue.title,
        status_name: state?.name ?? null,
        status_type: state?.type ?? null,
        priority: issue.priority,
        url: issue.url,
        updated_at: issue.updatedAt.toISOString(),
      });
    }
  }
  return rows;
}
