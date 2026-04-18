import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { ReviewKind } from '@/lib/types';

const VALID_KINDS = new Set<ReviewKind>(['weekly', 'monthly', 'quarterly']);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { kind, wins, blockers, learnings, next_focus, scripture, honest_check } =
      body as {
        kind: ReviewKind;
        wins: string;
        blockers: string;
        learnings: string;
        next_focus: string;
        scripture: string;
        honest_check: string;
      };

    if (!kind || !VALID_KINDS.has(kind)) {
      return Response.json(
        { error: 'Invalid review kind' },
        { status: 400 },
      );
    }

    const supabase = await createServerClient();
    const now = new Date().toISOString();

    // 1. Create review row
    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        kind,
        started_at: now,
        finished_at: now,
        stats: null,
      })
      .select('id')
      .single();

    if (reviewError || !review) {
      return Response.json(
        { error: reviewError?.message ?? 'Failed to create review' },
        { status: 500 },
      );
    }

    // 2. Build reflection text as formatted markdown
    const reflectionText = [
      `## ${kind.charAt(0).toUpperCase() + kind.slice(1)} Review`,
      '',
      `### Wins`,
      wins || '_(none)_',
      '',
      `### Blockers`,
      blockers || '_(none)_',
      '',
      `### Learnings`,
      learnings || '_(none)_',
      '',
      `### Next Focus`,
      next_focus || '_(none)_',
      '',
      `### Scripture or Principle`,
      scripture || '_(none)_',
      '',
      `### Honest Check`,
      honest_check || '_(none)_',
    ].join('\n');

    // 3. Create learning row
    const { data: learning, error: learningError } = await supabase
      .from('learnings')
      .insert({
        text: reflectionText,
        tags: [`review:${kind}`],
        scripture_ref: scripture || null,
        source: 'manual',
        reviewed: true,
        review_id: review.id,
      })
      .select('id')
      .single();

    if (learningError || !learning) {
      return Response.json(
        { error: learningError?.message ?? 'Failed to create learning' },
        { status: 500 },
      );
    }

    // 4. Update review with reflection_id
    await supabase
      .from('reviews')
      .update({ reflection_id: learning.id })
      .eq('id', review.id);

    // 5. Update cadence last_review_at
    await supabase
      .from('review_cadence')
      .update({ last_review_at: now })
      .eq('kind', kind);

    return Response.json({ success: true, review_id: review.id });
  } catch {
    return Response.json(
      { error: 'Invalid request body' },
      { status: 400 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const kind = searchParams.get('kind') as ReviewKind | null;

  const supabase = await createServerClient();

  let query = supabase
    .from('reviews')
    .select('*')
    .order('started_at', { ascending: false });

  if (kind && VALID_KINDS.has(kind)) {
    query = query.eq('kind', kind);
  }

  const { data, error } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ reviews: data ?? [] });
}
