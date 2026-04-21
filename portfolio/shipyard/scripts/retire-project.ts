#!/usr/bin/env tsx
/**
 * CLI: retire a project in Supabase and optionally cancel its Linear project.
 *
 * Usage: npx tsx scripts/retire-project.ts <slug> [reason]
 *
 * Example:
 *   npx tsx scripts/retire-project.ts money "Superseded by Spend Clarity"
 *   npx tsx scripts/retire-project.ts growth-tracker "Merged into Wellness GrowthTab"
 */
import { createClient } from '@supabase/supabase-js';
import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';
import { resolve } from 'node:path';

config({ path: resolve(__dirname, '..', '.env.local') });
config({ path: resolve(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const [, , slug, ...reasonParts] = process.argv;
const reason = reasonParts.join(' ') || null;

if (!slug) {
  console.error('Usage: npx tsx scripts/retire-project.ts <slug> [reason]');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  console.log(`→ Retiring project: ${slug}`);

  const { data: project, error: fetchErr } = await supabase
    .from('projects')
    .select('slug, name, status, linear_project_url')
    .eq('slug', slug)
    .single();

  if (fetchErr || !project) {
    console.error(`Project not found: ${slug}`);
    process.exit(1);
  }

  if (project.status === 'archived') {
    console.log(`  Already archived: ${project.name}`);
    process.exit(0);
  }

  // 1. Update Supabase (try with retirement columns first; fall back if migration not run yet)
  const retiredAt = new Date().toISOString();
  let { error: updateErr } = await supabase
    .from('projects')
    .update({ status: 'archived', retired_at: retiredAt, retire_reason: reason })
    .eq('slug', slug);

  if (updateErr?.message?.includes('retired_at') || updateErr?.message?.includes('retire_reason')) {
    console.log('  ⚠ retirement columns not found — run migration first. Setting status only.');
    ({ error: updateErr } = await supabase
      .from('projects')
      .update({ status: 'archived' })
      .eq('slug', slug));
  }

  if (updateErr) {
    console.error('Supabase update failed:', updateErr.message);
    process.exit(1);
  }
  console.log(`  ✓ Supabase: ${project.name} → archived${reason ? ` (${reason})` : ''}`);

  // 2. Cancel Linear project
  if (!project.linear_project_url) {
    console.log('  – Linear: no project URL, skipping');
    return;
  }

  if (!LINEAR_API_KEY) {
    console.log('  – Linear: LINEAR_API_KEY not set, skipping');
    console.log(`    Manual: ${project.linear_project_url}`);
    return;
  }

  try {
    const client = new LinearClient({ apiKey: LINEAR_API_KEY });
    const result = await client.projects();
    const urlSlug = project.linear_project_url.split('/').pop() ?? '';
    const match = result.nodes.find(
      (p) => p.url === project.linear_project_url || p.url?.split('/').pop() === urlSlug,
    );

    if (!match) {
      console.log(`  – Linear: no project found matching ${project.linear_project_url}`);
      return;
    }

    await client.archiveProject(match.id);
    console.log(`  ✓ Linear: archived "${match.name}"`);
  } catch (e) {
    console.error('  ✗ Linear error:', (e as Error).message);
    console.log(`    Manual: ${project.linear_project_url}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
