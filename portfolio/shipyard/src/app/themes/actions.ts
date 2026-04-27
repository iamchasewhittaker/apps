'use server';

import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase';

const THESIS_SLUG = 'portfolio-thesis';

export async function updateThesis(text: string) {
  const trimmed = text.trim();
  const supabase = await createServerClient();

  if (!trimmed) {
    const { error } = await supabase
      .from('themes')
      .delete()
      .eq('slug', THESIS_SLUG);
    if (error) return { ok: false, error: error.message };
    revalidatePath('/themes');
    return { ok: true };
  }

  const { error } = await supabase.from('themes').upsert(
    {
      slug: THESIS_SLUG,
      title: 'Portfolio Thesis',
      kind: 'portfolio_thesis',
      description: trimmed,
      project_slugs: [],
      auto_generated: false,
    },
    { onConflict: 'slug' },
  );

  if (error) return { ok: false, error: error.message };
  revalidatePath('/themes');
  return { ok: true };
}
