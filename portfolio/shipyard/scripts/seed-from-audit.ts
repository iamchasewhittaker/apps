import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import { createClient } from '@supabase/supabase-js';
import { parse } from 'csv-parse/sync';

// Load .env.local
const envPath = resolve(__dirname, '../.env.local');
try {
  const envContent = readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
} catch {}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const HOME = process.env.HOME || '/Users/chase';
const CSV_PATH = join(HOME, 'Developer/audits/2026-04-15-app-inventory.csv');

function toBool(val: string | undefined | null): boolean {
  if (!val) return false;
  return val.trim().toLowerCase() === 'yes';
}

function toNumber(val: string | undefined | null): number | null {
  if (!val || val.trim() === '') return null;
  const n = Number(val.trim());
  return isNaN(n) ? null : n;
}

function toStr(val: string | undefined | null): string | null {
  if (!val || val.trim() === '') return null;
  return val.trim();
}

function toArray(val: string | undefined | null): string[] {
  if (!val || val.trim() === '') return [];
  return val
    .split(/[;,]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

async function main() {
  console.log(`Reading CSV: ${CSV_PATH}`);

  let csvContent: string;
  try {
    csvContent = readFileSync(CSV_PATH, 'utf-8');
  } catch (err) {
    console.error(`Cannot read CSV: ${err instanceof Error ? err.message : err}`);
    process.exit(1);
  }

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    relax_column_count: true,
  }) as Record<string, string>[];

  console.log(`Parsed ${records.length} rows\n`);

  const projects: Record<string, unknown>[] = [];

  for (const row of records) {
    const slug = slugify(row.app_name || '');
    if (!slug) {
      console.log(`  [SKIP] Empty app_name`);
      continue;
    }

    const compliance = {
      has_readme: toBool(row.has_readme),
      has_claude_md: toBool(row.has_claude_md),
      has_mvp_audit: toBool(row.has_mvp_audit),
      has_changelog: toBool(row.has_changelog),
      has_handoff: toBool(row.has_handoff),
      has_agents: false,
      has_project_instructions: false,
    };

    // Normalize type from CSV values (web_app → web, ios_app → ios, etc.)
    const rawType = toStr(row.type) || 'web';
    const typeMap: Record<string, string> = {
      web_app: 'web', ios_app: 'ios', library: 'library',
      cli_tool: 'cli', desktop_app: 'desktop', lib_shared: 'library',
      macos_app: 'desktop', automation: 'cli', infrastructure: 'cli',
    };
    const normalizedType = typeMap[rawType] || rawType;

    // Normalize status
    const rawStatus = toStr(row.status) || 'active';
    const statusMap: Record<string, string> = {
      'active': 'active', 'stalled': 'stalled', 'frozen': 'frozen',
      'archived': 'archived', 'archive': 'archived',
    };
    const normalizedStatus = statusMap[rawStatus] || 'active';

    // Normalize family
    const rawFamily = toStr(row.family) || 'standalone';
    const familyMap: Record<string, string> = {
      clarity: 'clarity', standalone: 'standalone', portfolio: 'portfolio', archived: 'archived',
    };
    const normalizedFamily = familyMap[rawFamily] || 'standalone';

    const project: Record<string, unknown> = {
      slug,
      name: titleCase(slug),
      type: normalizedType,
      family: normalizedFamily,
      status: normalizedStatus,
      location: toStr(row.location) || `portfolio/${slug}`,
      tech_stack: toStr(row.tech_stack) || 'unknown',
      compliance,
      compliance_score: toNumber(row.compliance_score) ?? 0,
      mvp_step_claimed: toStr(row.mvp_step_claimed),
      mvp_step_actual: toNumber(row.mvp_step_actual),
      mvp_step: toNumber(row.mvp_step_actual),
      last_commit_date: toStr(row.last_commit_date),
      has_live_url: toBool(row.has_live_url),
      live_url: toStr(row.live_url),
      feature_count: toNumber(row.feature_count),
      loc_count: toNumber(row.loc_count),
      features_list: toStr(row.features_list),
      localstorage_keys: toArray(row.localStorage_keys),
      supabase_tables: toArray(row.supabase_tables),
      external_apis: toArray(row.external_apis),
      jtbd_primary: toStr(row.jtbd_primary),
      recommendation: toStr(row.recommendation),
      vercel_project: toStr(row.vercel_project),
      secrets_p0_count: toNumber(row.secrets_p0_count) ?? 0,
      breaking_change_risk: toStr(row.breaking_change_risk),
    };

    projects.push(project);
    console.log(`  [OK] ${slug}`);
  }

  // Upsert projects
  console.log(`\nUpserting ${projects.length} projects...`);
  const { error: upsertErr } = await supabase
    .from('projects')
    .upsert(projects, { onConflict: 'slug' });

  if (upsertErr) {
    console.error('Upsert error:', upsertErr.message);
    process.exit(1);
  }

  console.log(`Upserted ${projects.length} projects`);

  // Set review cadence
  console.log('\nSetting quarterly review cadence...');
  const cadenceRow = {
    kind: 'quarterly',
    cadence_days: 90,
    last_review_at: '2026-04-15',
    reminded_at: null,
  };

  const { error: cadenceErr } = await supabase
    .from('review_cadences')
    .upsert(cadenceRow, { onConflict: 'kind' });

  if (cadenceErr) {
    console.error('Cadence error:', cadenceErr.message);
  } else {
    console.log('Set quarterly last_review_at = 2026-04-15');
  }

  // Summary
  console.log('\n--- Seed Summary ---');
  console.log(`  CSV rows:          ${records.length}`);
  console.log(`  Projects upserted: ${projects.length}`);
  console.log(`  Review cadence:    quarterly (last 2026-04-15)`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
