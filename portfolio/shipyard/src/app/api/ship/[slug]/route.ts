import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import type { ProjectStatus } from '@/lib/types';

const ALLOWED_STATUS = new Set<ProjectStatus>(['active', 'stalled', 'frozen', 'archived']);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await request.json();
  const updates: Record<string, string | null> = {};

  if ('status' in body && ALLOWED_STATUS.has(body.status)) {
    updates.status = body.status;
  }
  if ('next_action' in body && (typeof body.next_action === 'string' || body.next_action === null)) {
    updates.next_action = body.next_action || null;
  }
  if ('recommendation' in body && (typeof body.recommendation === 'string' || body.recommendation === null)) {
    updates.recommendation = body.recommendation || null;
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 400 });
  }

  const supabase = await createServerClient();
  const { error } = await supabase.from('projects').update(updates).eq('slug', slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
