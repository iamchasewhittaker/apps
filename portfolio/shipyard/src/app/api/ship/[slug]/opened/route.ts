import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await request.json().catch(() => ({}));
  const source: string = body.source ?? 'manual';

  const now = new Date().toISOString();
  const updates: Record<string, unknown> = {
    last_opened_at: now,
    days_since_opened: 0,
  };

  if (source === 'device') {
    updates.last_device_deploy_at = now;
    updates.last_built_at = now;
  } else if (source === 'app_launch') {
    updates.last_built_at = now;
  }

  const supabase = await createServerClient();
  const { error } = await supabase.from('projects').update(updates).eq('slug', slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, recorded_at: now });
}
