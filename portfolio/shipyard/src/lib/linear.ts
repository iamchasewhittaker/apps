import { LinearClient } from '@linear/sdk';

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
