#!/usr/bin/env tsx
/**
 * Sync portfolio metadata from CLAUDE.md → Supabase `projects` table.
 *
 * Reads:
 *   - /Users/chase/Developer/chase/CLAUDE.md  (metadata table + main portfolio table)
 *   - portfolio/<slug>/CLAUDE.md              (for "What This App Is" summary)
 *
 * Writes:
 *   - Updates Supabase `projects` rows (matched by name).
 *
 * Run: npx tsx scripts/sync-projects.ts
 * Requires: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config } from 'dotenv';

const REPO_ROOT = resolve(__dirname, '..', '..', '..');
const ROOT_CLAUDE_MD = resolve(REPO_ROOT, 'CLAUDE.md');
const PORTFOLIO_DIR = resolve(REPO_ROOT, 'portfolio');

config({ path: resolve(__dirname, '..', '.env.local') });
config({ path: resolve(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

interface MetadataRow {
  name: string;
  category: string | null;
  tagline: string | null;
  github_url: string | null;
  linear_project_url: string | null;
}

interface OverviewRow {
  name: string;
  storage_key: string | null;
  live_url: string | null;
}

function stripMarkdownLink(cell: string): string | null {
  const trimmed = cell.trim();
  if (!trimmed || trimmed === '—' || trimmed === '-') return null;
  // Extract href from [label](href) if present; else return literal
  const mdLink = trimmed.match(/\[[^\]]*\]\(([^)]+)\)/);
  if (mdLink) return mdLink[1];
  return trimmed;
}

function cleanCell(cell: string): string | null {
  const trimmed = cell.trim();
  if (!trimmed || trimmed === '—' || trimmed === '-') return null;
  return trimmed;
}

function parseMetadataTable(markdown: string): MetadataRow[] {
  const lines = markdown.split('\n');
  const headerIdx = lines.findIndex((l) =>
    l.includes('### Portfolio metadata (Shipyard sync)'),
  );
  if (headerIdx === -1) return [];

  const rows: MetadataRow[] = [];
  let inTable = false;
  let skipNext = false; // skip the '| --- | --- |' separator row

  for (let i = headerIdx; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('## ') && i !== headerIdx) break; // next top-level section
    if (!line.trim().startsWith('|')) {
      if (inTable) break; // end of table
      continue;
    }
    if (!inTable) {
      inTable = true;
      skipNext = true;
      continue; // header row
    }
    if (skipNext) {
      skipNext = false;
      continue;
    }

    const cells = line
      .split('|')
      .slice(1, -1) // drop leading/trailing empty
      .map((c) => c.trim());
    if (cells.length < 5) continue;

    const [name, category, tagline, github, linear] = cells;
    rows.push({
      name: name.trim(),
      category: cleanCell(category),
      tagline: cleanCell(tagline),
      github_url: stripMarkdownLink(github),
      linear_project_url: stripMarkdownLink(linear),
    });
  }

  return rows;
}

function parseOverviewTable(markdown: string): OverviewRow[] {
  const lines = markdown.split('\n');
  const headerIdx = lines.findIndex((l) => l.includes('## Portfolio Overview'));
  if (headerIdx === -1) return [];

  const rows: OverviewRow[] = [];
  let inTable = false;
  let skipNext = false;

  for (let i = headerIdx; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('### ') || (line.startsWith('## ') && i !== headerIdx)) break;
    if (!line.trim().startsWith('|')) {
      if (inTable) break;
      continue;
    }
    if (!inTable) {
      inTable = true;
      skipNext = true;
      continue;
    }
    if (skipNext) {
      skipNext = false;
      continue;
    }

    const cells = line
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length < 5) continue;

    const [name, _version, storageKey, urlCell] = cells;
    let liveUrl: string | null = null;
    const urlText = urlCell.trim();
    if (
      urlText &&
      urlText !== 'local' &&
      urlText !== 'local Xcode' &&
      urlText !== 'local Electron' &&
      urlText !== 'local Python' &&
      urlText !== 'Apps Script backend' &&
      urlText !== 'n/a' &&
      urlText !== '—' &&
      !urlText.startsWith('pending')
    ) {
      // strip wrapping markdown link if any
      const mdLink = urlText.match(/\[[^\]]*\]\(([^)]+)\)/);
      liveUrl = mdLink ? mdLink[1] : `https://${urlText}`;
    }

    rows.push({
      name: name.trim(),
      storage_key: cleanCell(storageKey),
      live_url: liveUrl,
    });
  }

  return rows;
}

function extractSummary(claudeMdPath: string): string | null {
  if (!existsSync(claudeMdPath)) return null;
  const content = readFileSync(claudeMdPath, 'utf8');
  const lines = content.split('\n');
  const headingIdx = lines.findIndex((l) => /^##\s+What This App Is/i.test(l));
  if (headingIdx === -1) return null;

  const paraLines: string[] = [];
  for (let i = headingIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s/.test(line)) break;
    if (line.trim()) paraLines.push(line.trim());
    else if (paraLines.length > 0) break; // stop at first blank line after content
  }
  if (paraLines.length === 0) return null;
  return paraLines.join(' ').trim();
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, (m) => (m.includes('ios') ? '-ios' : m.includes('web') ? '-web' : ''))
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function main() {
  console.log('→ Reading', ROOT_CLAUDE_MD);
  const markdown = readFileSync(ROOT_CLAUDE_MD, 'utf8');

  const metadata = parseMetadataTable(markdown);
  const overview = parseOverviewTable(markdown);
  console.log(`  Parsed ${metadata.length} metadata rows, ${overview.length} overview rows`);

  // Fetch existing Supabase projects
  const { data: existingProjects, error: fetchErr } = await supabase
    .from('projects')
    .select('slug, name, location');
  if (fetchErr) {
    console.error('Failed to fetch projects:', fetchErr.message);
    process.exit(1);
  }
  const bySlug = new Map(existingProjects?.map((p) => [p.slug, p]) ?? []);
  const byName = new Map(existingProjects?.map((p) => [p.name.toLowerCase(), p]) ?? []);
  console.log(`  Found ${existingProjects?.length ?? 0} existing projects in Supabase`);

  const overviewByName = new Map(overview.map((r) => [r.name.toLowerCase(), r]));

  let updated = 0;
  let skipped = 0;
  const unmatched: string[] = [];

  for (const row of metadata) {
    const nameLc = row.name.toLowerCase();
    const existing = byName.get(nameLc);
    if (!existing) {
      unmatched.push(row.name);
      skipped++;
      continue;
    }

    // Look up portfolio app directory for summary extraction
    const slug = existing.slug;
    const appDir = resolve(PORTFOLIO_DIR, slug);
    const claudeMd = resolve(appDir, 'CLAUDE.md');
    const summary = extractSummary(claudeMd);

    const overviewRow = overviewByName.get(nameLc);

    const updates: Record<string, unknown> = {};
    if (row.category !== null) updates.category = row.category;
    if (row.tagline !== null) updates.tagline = row.tagline;
    if (row.github_url !== null) updates.github_url = row.github_url;
    if (row.linear_project_url !== null) updates.linear_project_url = row.linear_project_url;
    if (summary !== null) updates.summary = summary;
    if (overviewRow?.live_url !== undefined && overviewRow.live_url !== null) {
      updates.live_url = overviewRow.live_url;
      updates.has_live_url = true;
    }

    if (Object.keys(updates).length === 0) {
      skipped++;
      continue;
    }

    const { error: updateErr } = await supabase
      .from('projects')
      .update(updates)
      .eq('slug', slug);

    if (updateErr) {
      console.error(`  ✗ ${row.name}: ${updateErr.message}`);
      continue;
    }
    updated++;
    console.log(`  ✓ ${row.name} (${Object.keys(updates).join(', ')})`);
  }

  console.log('\nDone.');
  console.log(`  Updated: ${updated}`);
  console.log(`  Skipped (no-op): ${skipped}`);
  if (unmatched.length > 0) {
    console.log(`  Unmatched (not in Supabase, run scan first): ${unmatched.length}`);
    unmatched.forEach((n) => console.log(`    - ${n}`));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
