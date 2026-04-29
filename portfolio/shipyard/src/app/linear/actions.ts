'use server';

import { createServerClient } from '@/lib/supabase';
import {
  createMissingProjects,
  pushProjectStatuses,
  pullProjectCounts,
} from '@/lib/linear';

export type ActionResult = {
  ok: boolean;
  message: string;
  detail?: string;
};

export async function createMissingAction(): Promise<ActionResult> {
  const supabase = await createServerClient();

  const { data: ships, error } = await supabase
    .from('projects')
    .select('slug, name, tagline, status')
    .is('linear_project_url', null)
    .neq('status', 'archived')
    .order('name');

  if (error) return { ok: false, message: 'Failed to fetch ships', detail: error.message };
  if (!ships || ships.length === 0) return { ok: true, message: 'All ships already linked', detail: '0 created' };

  const results = await createMissingProjects(ships);

  let created = 0;
  let failed = 0;
  for (const r of results) {
    if (r.url) {
      await supabase
        .from('projects')
        .update({ linear_project_url: r.url })
        .eq('slug', r.slug);
      created++;
    } else {
      failed++;
    }
  }

  const detail = `${created} created${failed > 0 ? ` · ${failed} failed` : ''}`;
  return { ok: failed === 0, message: detail, detail };
}

export async function pushStatusesAction(): Promise<ActionResult> {
  const supabase = await createServerClient();

  const { data: ships, error } = await supabase
    .from('projects')
    .select('slug, linear_project_url, status')
    .not('linear_project_url', 'is', null)
    .order('name');

  if (error) return { ok: false, message: 'Failed to fetch ships', detail: error.message };
  if (!ships || ships.length === 0) return { ok: true, message: 'No linked ships', detail: '0 updated' };

  const results = await pushProjectStatuses(
    ships as Array<{ slug: string; linear_project_url: string; status: string }>,
  );

  const succeeded = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  const detail = `${succeeded} updated${failed > 0 ? ` · ${failed} failed` : ''}`;
  return { ok: failed === 0, message: detail, detail };
}

export async function pullUpdatesAction(): Promise<ActionResult> {
  const supabase = await createServerClient();

  const { data: ships, error } = await supabase
    .from('projects')
    .select('slug, linear_project_url')
    .not('linear_project_url', 'is', null)
    .order('name');

  if (error) return { ok: false, message: 'Failed to fetch ships', detail: error.message };
  if (!ships || ships.length === 0) return { ok: true, message: 'No linked ships', detail: '0 updated' };

  const counts = await pullProjectCounts(
    ships as Array<{ slug: string; linear_project_url: string }>,
  );

  let updated = 0;
  for (const { slug, count } of counts) {
    await supabase
      .from('projects')
      .update({ linear_issue_count: count })
      .eq('slug', slug);
    updated++;
  }

  return { ok: true, message: `${updated} ships updated`, detail: `${updated} issue counts synced` };
}
