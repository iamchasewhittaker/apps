import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug } = body as { slug: string };

    if (!slug || typeof slug !== 'string') {
      return Response.json(
        { error: 'Missing or invalid slug' },
        { status: 400 },
      );
    }

    const supabase = await createServerClient();

    // 1. Set chosen project to active
    const { error: activateError } = await supabase
      .from('projects')
      .update({ status: 'active' })
      .eq('slug', slug);

    if (activateError) {
      return Response.json(
        { error: activateError.message },
        { status: 500 },
      );
    }

    // 2. Find all OTHER projects at mvp_step_actual=4 AND status='active' (excluding the chosen one)
    const { data: toStall, error: fetchError } = await supabase
      .from('projects')
      .select('slug')
      .eq('mvp_step_actual', 4)
      .eq('status', 'active')
      .neq('slug', slug);

    if (fetchError) {
      return Response.json(
        { error: fetchError.message },
        { status: 500 },
      );
    }

    const stalledSlugs = (toStall ?? []).map((p) => p.slug);

    // 3. Set those projects to stalled
    if (stalledSlugs.length > 0) {
      const { error: stallError } = await supabase
        .from('projects')
        .update({ status: 'stalled' })
        .in('slug', stalledSlugs);

      if (stallError) {
        return Response.json(
          { error: stallError.message },
          { status: 500 },
        );
      }
    }

    // 4. Insert wip_decisions row
    const { error: decisionError } = await supabase
      .from('wip_decisions')
      .insert({
        active_slug: slug,
        stalled_slugs: stalledSlugs,
        decided_at: new Date().toISOString(),
      });

    if (decisionError) {
      return Response.json(
        { error: decisionError.message },
        { status: 500 },
      );
    }

    return Response.json({ success: true });
  } catch {
    return Response.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }
}
