'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase';

export interface RankEntry {
  slug: string;
  priority_rank: number;
}

export async function updateRanks(entries: RankEntry[]) {
  if (entries.length === 0) return { ok: true };

  const supabase = await createServerClient();

  for (const entry of entries) {
    const { error } = await supabase
      .from('projects')
      .update({ priority_rank: entry.priority_rank })
      .eq('slug', entry.slug);
    if (error) {
      return { ok: false, error: error.message };
    }
  }

  revalidatePath('/wip');
  return { ok: true };
}

export async function seedRanksByCommit(slugs: string[]) {
  if (slugs.length === 0) return { ok: true };

  const supabase = await createServerClient();
  const entries = slugs.map((slug, idx) => ({
    slug,
    priority_rank: (idx + 1) * 10,
  }));

  for (const entry of entries) {
    const { error } = await supabase
      .from('projects')
      .update({ priority_rank: entry.priority_rank })
      .eq('slug', entry.slug);
    if (error) {
      return { ok: false, error: error.message };
    }
  }

  revalidatePath('/wip');
  return { ok: true };
}
