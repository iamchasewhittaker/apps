import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// POST — add a new blocker
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const { text } = await request.json();
  if (!text?.trim()) {
    return NextResponse.json({ error: 'text required' }, { status: 400 });
  }

  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('blockers')
    .insert({ project_slug: slug, text: text.trim() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ blocker: data });
}
