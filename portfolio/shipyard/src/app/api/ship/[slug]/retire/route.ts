import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { cancelLinearProject } from '@/lib/linear';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await request.json();
  const reason: string | null = body.reason || null;

  const supabase = await createServerClient();

  const { data: project, error: fetchErr } = await supabase
    .from('projects')
    .select('slug, name, status, linear_project_url')
    .eq('slug', slug)
    .single();

  if (fetchErr || !project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  if (project.status === 'archived') {
    return NextResponse.json({ error: 'Already archived' }, { status: 400 });
  }

  let { error: updateErr } = await supabase
    .from('projects')
    .update({ status: 'archived', retired_at: new Date().toISOString(), retire_reason: reason })
    .eq('slug', slug);

  if (
    updateErr?.message?.includes('retired_at') ||
    updateErr?.message?.includes('retire_reason')
  ) {
    ({ error: updateErr } = await supabase
      .from('projects')
      .update({ status: 'archived' })
      .eq('slug', slug));
  }

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  let linear: { ok: boolean; message: string };
  if (project.linear_project_url) {
    linear = await cancelLinearProject(project.linear_project_url);
  } else {
    linear = { ok: false, message: 'No Linear project URL' };
  }

  return NextResponse.json({ ok: true, steps: { supabase: 'archived', linear } });
}
