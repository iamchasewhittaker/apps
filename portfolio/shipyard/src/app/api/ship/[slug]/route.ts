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
  const updates: Record<string, string | number | null> = {};

  if ('status' in body && ALLOWED_STATUS.has(body.status)) {
    updates.status = body.status;
  }
  if ('next_action' in body && (typeof body.next_action === 'string' || body.next_action === null)) {
    updates.next_action = body.next_action || null;
  }
  if ('recommendation' in body && (typeof body.recommendation === 'string' || body.recommendation === null)) {
    updates.recommendation = body.recommendation || null;
  }
  if ('revenue_potential' in body) {
    const v = body.revenue_potential;
    if (v === null || v === '' || typeof v === 'undefined') {
      updates.revenue_potential = null;
    } else {
      const n = Number(v);
      if (Number.isInteger(n) && n >= 1 && n <= 5) {
        updates.revenue_potential = n;
      } else {
        return NextResponse.json({ error: 'revenue_potential must be 1-5' }, { status: 400 });
      }
    }
  }
  if ('monthly_revenue_usd' in body) {
    const v = body.monthly_revenue_usd;
    if (v === null || v === '' || typeof v === 'undefined') {
      updates.monthly_revenue_usd = null;
    } else {
      const n = Number(v);
      if (Number.isFinite(n) && n >= 0) {
        updates.monthly_revenue_usd = n;
      } else {
        return NextResponse.json({ error: 'monthly_revenue_usd must be a non-negative number' }, { status: 400 });
      }
    }
  }

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: 'No valid fields' }, { status: 400 });
  }

  const supabase = await createServerClient();
  const { error } = await supabase.from('projects').update(updates).eq('slug', slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
