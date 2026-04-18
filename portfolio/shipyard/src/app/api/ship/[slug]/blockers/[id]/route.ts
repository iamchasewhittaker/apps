import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// DELETE — resolve a blocker (sets resolved_at)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> },
) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { error } = await supabase
    .from('blockers')
    .update({ resolved_at: new Date().toISOString() })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
