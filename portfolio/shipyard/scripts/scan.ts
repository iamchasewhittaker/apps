import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { resolve, join } from 'path';
import { execSync } from 'child_process';
import { createHash } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { inferMvpStep } from '../src/lib/mvp-step';
import type { Compliance } from '../src/lib/types';

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
// Use service role key to bypass RLS (required after 0002_rls.sql is applied).
// Add SUPABASE_SERVICE_ROLE_KEY to .env.local from Supabase → Settings → API.
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not set — using anon key. Writes will fail if RLS is enabled.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const HOME = process.env.HOME || '/Users/chase';
const DEV_ROOT = process.env.DEVELOPER_ROOT || join(HOME, 'Developer/chase/portfolio');

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function execSafe(cmd: string, cwd: string): string | null {
  try {
    return execSync(cmd, { cwd, encoding: 'utf-8', timeout: 10_000 }).trim();
  } catch {
    return null;
  }
}

function detectType(dir: string): string {
  const entries = readdirSync(dir);
  if (entries.some((e) => e.endsWith('.xcodeproj'))) return 'ios';
  if (entries.includes('Package.swift')) return 'library';
  if (entries.includes('bin') || entries.some((e) => e.endsWith('.sh'))) return 'cli';
  return 'web';
}

function readPackageJson(dir: string): Record<string, unknown> | null {
  const pkgPath = join(dir, 'package.json');
  if (!existsSync(pkgPath)) return null;
  try {
    return JSON.parse(readFileSync(pkgPath, 'utf-8'));
  } catch {
    return null;
  }
}

function buildTechStack(dir: string, pkg: Record<string, unknown> | null): string {
  const parts: string[] = [];
  const entries = readdirSync(dir);

  if (entries.some((e) => e.endsWith('.xcodeproj'))) {
    parts.push('SwiftUI', 'Xcode');
    if (entries.includes('Package.swift')) parts.push('SPM');
    return parts.join(', ');
  }

  if (!pkg) return 'unknown';

  const deps = { ...(pkg.dependencies as Record<string, string> || {}), ...(pkg.devDependencies as Record<string, string> || {}) };

  if (deps['next']) parts.push(`Next.js`);
  else if (deps['react-scripts']) parts.push('CRA');
  if (deps['react']) parts.push('React');
  if (deps['typescript']) parts.push('TypeScript');
  if (deps['tailwindcss']) parts.push('Tailwind');
  if (deps['@supabase/supabase-js']) parts.push('Supabase');
  if (deps['electron']) parts.push('Electron');
  if (deps['vite']) parts.push('Vite');

  return parts.length ? parts.join(', ') : 'JavaScript';
}

function checkCompliance(dir: string): Compliance {
  return {
    has_readme: existsSync(join(dir, 'README.md')),
    has_claude_md: existsSync(join(dir, 'CLAUDE.md')),
    has_mvp_audit: existsSync(join(dir, 'MVP-AUDIT.md')),
    has_changelog: existsSync(join(dir, 'CHANGELOG.md')),
    has_handoff: existsSync(join(dir, 'HANDOFF.md')),
    has_agents: existsSync(join(dir, 'AGENTS.md')),
    has_project_instructions: existsSync(join(dir, '.claude', 'instructions.md')),
  };
}

function complianceScore(c: Compliance): number {
  const vals = Object.values(c);
  return Math.round((vals.filter(Boolean).length / vals.length) * 100);
}

function parseMvpStepClaimed(dir: string): string | null {
  const auditPath = join(dir, 'MVP-AUDIT.md');
  if (!existsSync(auditPath)) return null;
  try {
    const content = readFileSync(auditPath, 'utf-8');
    const match = content.match(/Step\s*\d/i);
    return match ? match[0] : null;
  } catch {
    return null;
  }
}

function detectLocalPort(dir: string, pkg: Record<string, unknown> | null, type: string): number | null {
  if (type !== 'web') return null;
  if (!pkg) return null;

  const scripts = (pkg.scripts as Record<string, string>) ?? {};
  const devScript = scripts['dev'] ?? scripts['start'] ?? '';

  const portMatch = devScript.match(/(?:-p|--port)\s+(\d+)/);
  if (portMatch) return parseInt(portMatch[1], 10);

  const deps = { ...(pkg.dependencies as Record<string, string> || {}), ...(pkg.devDependencies as Record<string, string> || {}) };
  if (deps['next']) return 3000;
  if (deps['vite']) return 5173;
  if (deps['react-scripts']) return 3000;

  return 3000;
}

function parseClaudeMd(dir: string): {
  live_url: string | null;
  vercel_project: string | null;
  localstorage_keys: string[];
  supabase_tables: string[];
  features_list: string | null;
} {
  const result = {
    live_url: null as string | null,
    vercel_project: null as string | null,
    localstorage_keys: [] as string[],
    supabase_tables: [] as string[],
    features_list: null as string | null,
  };

  const claudePath = join(dir, 'CLAUDE.md');
  if (!existsSync(claudePath)) return result;

  try {
    const content = readFileSync(claudePath, 'utf-8');

    // Live URL: look for vercel.app URLs or other deployment URLs
    const urlMatch = content.match(/https?:\/\/[\w-]+\.vercel\.app/);
    if (urlMatch) result.live_url = urlMatch[0];

    // Vercel project
    const vercelMatch = content.match(/vercel[\s_-]*project[:\s]+[`"']?([\w-]+)[`"']?/i);
    if (vercelMatch) result.vercel_project = vercelMatch[1];

    // localStorage keys
    const storageRe = /[`"'](chase_[\w]+)[`"']/g;
    let sm: RegExpExecArray | null;
    while ((sm = storageRe.exec(content)) !== null) {
      if (!result.localstorage_keys.includes(sm[1])) {
        result.localstorage_keys.push(sm[1]);
      }
    }

    // Supabase tables
    const tableRe = /supabase.*?table[s]?[:\s]+[`"']?([\w_,\s]+)[`"']?/gi;
    let tm: RegExpExecArray | null;
    while ((tm = tableRe.exec(content)) !== null) {
      const tables = tm[1].split(/[,\s]+/).filter(Boolean);
      for (const t of tables) {
        if (!result.supabase_tables.includes(t)) result.supabase_tables.push(t);
      }
    }

    // Features list: look for a features section
    const featuresMatch = content.match(/##\s*Features?\s*\n([\s\S]*?)(?=\n##|\n$|$)/i);
    if (featuresMatch) {
      const items = featuresMatch[1]
        .split('\n')
        .map((l) => l.replace(/^[\s*-]+/, '').trim())
        .filter(Boolean);
      if (items.length) result.features_list = items.join('; ');
    }

    return result;
  } catch {
    return result;
  }
}

function parseChangelog(dir: string, slug: string): Array<Record<string, unknown>> {
  const path = join(dir, 'CHANGELOG.md');
  if (!existsSync(path)) return [];

  let content: string;
  try {
    content = readFileSync(path, 'utf-8');
  } catch {
    return [];
  }

  const out: Array<Record<string, unknown>> = [];
  const versionBlocks = content.split(/\n(?=##\s)/g).filter((b) => /^##\s+(\[|v\d)/i.test(b.trim()));
  let sortIndex = 0;
  const versionCounts = new Map<string, number>();
  const usedKeys = new Set<string>();

  for (const block of versionBlocks) {
    const lines = block.split('\n');
    const versionLine = lines[0].replace(/^##\s+/, '').trim();
    const versionMatch = versionLine.match(/^(?:\[([^\]]+)\]|(v[\d.]+))(?:\s+[—-]\s+(\d{4}-\d{2}-\d{2}))?/);
    if (!versionMatch) continue;
    const baseVersion = (versionMatch[1] ?? versionMatch[2] ?? '').trim();
    const versionDate = versionMatch[3] ?? null;
    const versionCount = versionCounts.get(baseVersion) ?? 0;
    versionCounts.set(baseVersion, versionCount + 1);
    const fullVersionLabel =
      versionLine.length > baseVersion.length
        ? versionLine.replace(/^\[/, '').replace(/\]/, '')
        : baseVersion;
    const version =
      versionCount === 0 && fullVersionLabel === baseVersion
        ? baseVersion
        : fullVersionLabel;

    const rest = lines.slice(1).join('\n');
    const entryBlocks = rest.split(/\n(?=###\s)/g);
    const headingCounts = new Map<string, number>();

    for (const entryBlock of entryBlocks) {
      const trimmed = entryBlock.trim();
      if (!trimmed) continue;

      let heading: string;
      let body: string;
      if (trimmed.startsWith('### ')) {
        const elines = trimmed.split('\n');
        heading = elines[0].replace(/^###\s+/, '').trim();
        body = elines.slice(1).join('\n').trim();
      } else {
        if (entryBlocks.indexOf(entryBlock) !== 0) continue;
        heading = `[${version}]${versionDate ? ` — ${versionDate}` : ''}`;
        body = trimmed;
      }

      if (!heading) continue;

      const seenCount = headingCounts.get(heading) ?? 0;
      headingCounts.set(heading, seenCount + 1);
      let dedupedHeading = seenCount === 0 ? heading : `${heading} (#${seenCount + 1})`;
      let key = `${version}|${dedupedHeading}`;
      let suffix = 2;
      while (usedKeys.has(key)) {
        dedupedHeading = `${heading} (#${suffix++})`;
        key = `${version}|${dedupedHeading}`;
      }
      usedKeys.add(key);

      const dateMatch = heading.match(/(\d{4}-\d{2}-\d{2})/);
      const entryDate = dateMatch?.[1] ?? versionDate ?? null;

      out.push({
        project_slug: slug,
        version,
        entry_date: entryDate,
        heading: dedupedHeading,
        body_md: body,
        sort_index: sortIndex++,
      });
    }
  }

  return out;
}

function parseRoadmap(dir: string, slug: string): Array<Record<string, unknown>> {
  const path = join(dir, 'ROADMAP.md');
  if (!existsSync(path)) return [];

  let content: string;
  try {
    content = readFileSync(path, 'utf-8');
  } catch {
    return [];
  }

  const out: Array<Record<string, unknown>> = [];
  const sections = content.split(/\n(?=##\s)/g);
  let sortIndex = 0;
  const seen = new Set<string>();

  for (const section of sections) {
    const trimmed = section.trim();
    if (!trimmed.startsWith('##')) continue;
    const lines = trimmed.split('\n');
    const heading = lines[0].replace(/^##\s+/, '').trim();
    if (!/phase/i.test(heading)) continue;

    const phaseName = heading.replace(/\s*\(.*\)\s*$/, '').trim();
    const parenMatch = heading.match(/\(([^)]+)\)/);
    let phaseStatus: string | null = null;
    if (parenMatch) {
      const inside = parenMatch[1].trim();
      if (/complete|in progress|deferred|planning|done|shipped/i.test(inside)) {
        phaseStatus = inside;
      }
    }
    if (!phaseStatus) {
      const dashStatus = heading.match(/[—-]\s*(Complete|In Progress|Deferred|Planning|Done|Shipped)\b/i);
      if (dashStatus) phaseStatus = dashStatus[1];
    }

    for (const line of lines.slice(1)) {
      const m = line.match(/^\s*-\s+\[([ xX])\]\s+(.+)$/);
      if (!m) continue;
      const done = m[1].toLowerCase() === 'x';
      const itemText = m[2].trim();
      if (!itemText) continue;

      const dedupKey = `${phaseName}::${itemText}`;
      if (seen.has(dedupKey)) continue;
      seen.add(dedupKey);

      const dateMatch = itemText.match(/\((\d{4}-\d{2}-\d{2})\)/);
      const itemDate = dateMatch?.[1] ?? null;

      out.push({
        project_slug: slug,
        phase_name: phaseName,
        phase_status: phaseStatus,
        item_text: itemText,
        item_done: done,
        item_date: itemDate,
        sort_index: sortIndex++,
      });
    }
  }

  return out;
}

function parseLearnings(dir: string, slug: string): Array<Record<string, unknown>> {
  const learningsPath = join(dir, 'LEARNINGS.md');
  if (!existsSync(learningsPath)) return [];

  let content: string;
  try {
    content = readFileSync(learningsPath, 'utf-8');
  } catch {
    return [];
  }

  // Split by ## headings; each section becomes one learning entry
  const sections = content.split(/\n(?=## )/g).filter((s) => s.trim().startsWith('## '));

  return sections.map((section) => {
    const lines = section.split('\n');
    const heading = lines[0].replace(/^##\s*/, '').trim();
    const body = lines.slice(1).join('\n').trim();
    const text = body ? `${heading}\n\n${body}` : heading;
    const rawRef = createHash('md5').update(`${slug}::${heading}`).digest('hex').slice(0, 16);

    return {
      project_slug: slug,
      text,
      tags: ['auto:scan'],
      source: 'auto:audit',
      reviewed: false,
      raw_source_ref: rawRef,
    };
  });
}

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return Math.floor((Date.now() - d.getTime()) / 86_400_000);
}

async function main() {
  const startedAt = new Date().toISOString();
  console.log(`Scanning ${DEV_ROOT}...`);

  let entries: string[];
  try {
    entries = readdirSync(DEV_ROOT).filter((name) => {
      const full = join(DEV_ROOT, name);
      try {
        return statSync(full).isDirectory() && !name.startsWith('.');
      } catch {
        return false;
      }
    });
  } catch (err) {
    console.error(`Cannot read ${DEV_ROOT}:`, err);
    process.exit(1);
  }

  console.log(`Found ${entries.length} directories\n`);

  const projects: Record<string, unknown>[] = [];
  const allLearnings: Record<string, unknown>[] = [];
  const allChangelog: Record<string, unknown>[] = [];
  const allRoadmap: Record<string, unknown>[] = [];
  const slugsWithChangelog = new Set<string>();
  const slugsWithRoadmap = new Set<string>();
  const errors: Record<string, string>[] = [];

  for (const name of entries) {
    const dir = join(DEV_ROOT, name);
    try {
      const pkg = readPackageJson(dir);
      const type = detectType(dir);
      const family = name.startsWith('clarity') ? 'clarity' : 'standalone';
      const compliance = checkCompliance(dir);
      const mvp_step_claimed = parseMvpStepClaimed(dir);
      const claudeData = parseClaudeMd(dir);

      const lastCommit = execSafe('git log -1 --format=%ci', dir);
      const dsc = daysSince(lastCommit);

      const locRaw = execSafe('git ls-files | wc -l', dir);
      const loc = locRaw ? parseInt(locRaw.trim(), 10) : null;

      const githubUrl = execSafe('git remote get-url origin', dir);

      const { step: mvp_step_actual, status } = inferMvpStep({
        has_live_url: !!claudeData.live_url,
        last_commit_date: lastCommit,
        compliance,
        mvp_step_claimed,
      });

      const relPath = `portfolio/${name}`;

      const learningRows = parseLearnings(dir, name);

      let changelogRows: Array<Record<string, unknown>> = [];
      try {
        changelogRows = parseChangelog(dir, name);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`  [WARN] ${name}: changelog parse failed — ${msg}`);
      }

      let roadmapRows: Array<Record<string, unknown>> = [];
      try {
        roadmapRows = parseRoadmap(dir, name);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`  [WARN] ${name}: roadmap parse failed — ${msg}`);
      }

      projects.push({
        slug: name,
        name: titleCase(name),
        type,
        family,
        status,
        location: relPath,
        tech_stack: buildTechStack(dir, pkg),
        mvp_step_claimed,
        mvp_step_actual,
        mvp_step: mvp_step_actual,
        last_commit_date: lastCommit,
        days_since_commit: dsc,
        loc_count: loc,
        compliance,
        compliance_score: complianceScore(compliance),
        live_url: claudeData.live_url,
        has_live_url: !!claudeData.live_url,
        local_port: detectLocalPort(dir, pkg, type),
        vercel_project: claudeData.vercel_project,
        github_url: githubUrl,
        localstorage_keys: claudeData.localstorage_keys,
        supabase_tables: claudeData.supabase_tables,
        features_list: claudeData.features_list,
        feature_count: claudeData.features_list
          ? claudeData.features_list.split(';').length
          : null,
        external_apis: [],
        secrets_p0_count: 0,
      });

      if (learningRows.length > 0) {
        allLearnings.push(...learningRows);
      }

      if (changelogRows.length > 0) {
        allChangelog.push(...changelogRows);
        slugsWithChangelog.add(name);
      }
      if (roadmapRows.length > 0) {
        allRoadmap.push(...roadmapRows);
        slugsWithRoadmap.add(name);
      }

      const tags = [
        learningRows.length ? `${learningRows.length} learnings` : null,
        changelogRows.length ? `${changelogRows.length} changelog` : null,
        roadmapRows.length ? `${roadmapRows.length} roadmap` : null,
      ].filter(Boolean);
      console.log(`  [OK] ${name} (${type}, step ${mvp_step_actual}, ${status}${tags.length ? `, ${tags.join(', ')}` : ''})`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push({ project: name, error: msg });
      console.log(`  [ERR] ${name}: ${msg}`);
    }
  }

  // Upsert projects
  console.log(`\nUpserting ${projects.length} projects...`);
  const { error: upsertErr, count } = await supabase
    .from('projects')
    .upsert(projects, { onConflict: 'slug' });

  if (upsertErr) {
    console.error('Upsert error:', upsertErr.message);
  } else {
    console.log(`Upserted ${projects.length} projects`);
  }

  // Upsert learnings
  let learningsCaptured = 0;
  if (allLearnings.length > 0) {
    console.log(`\nUpserting ${allLearnings.length} learnings...`);
    const { error: lErr, count: lCount } = await supabase
      .from('learnings')
      .upsert(allLearnings, { onConflict: 'project_slug,source,raw_source_ref', ignoreDuplicates: true });
    if (lErr) {
      console.error('Learnings upsert error:', lErr.message);
    } else {
      learningsCaptured = allLearnings.length;
      console.log(`Upserted ${allLearnings.length} learnings (deduped)`);
    }
  }

  // Sync changelog entries — delete then insert per project (idempotent + handles removals)
  if (slugsWithChangelog.size > 0) {
    console.log(`\nSyncing changelog entries for ${slugsWithChangelog.size} projects…`);
    const slugList = Array.from(slugsWithChangelog);
    const { error: delErr } = await supabase
      .from('changelog_entries')
      .delete()
      .in('project_slug', slugList);
    if (delErr) {
      console.error('Changelog delete error:', delErr.message);
    } else {
      const { error: insErr } = await supabase
        .from('changelog_entries')
        .insert(allChangelog);
      if (insErr) {
        console.error('Changelog insert error:', insErr.message);
      } else {
        console.log(`Inserted ${allChangelog.length} changelog entries`);
      }
    }
  }

  // Sync roadmap entries — delete then insert per project
  if (slugsWithRoadmap.size > 0) {
    console.log(`\nSyncing roadmap entries for ${slugsWithRoadmap.size} projects…`);
    const slugList = Array.from(slugsWithRoadmap);
    const { error: delErr } = await supabase
      .from('roadmap_entries')
      .delete()
      .in('project_slug', slugList);
    if (delErr) {
      console.error('Roadmap delete error:', delErr.message);
    } else {
      const { error: insErr } = await supabase
        .from('roadmap_entries')
        .insert(allRoadmap);
      if (insErr) {
        console.error('Roadmap insert error:', insErr.message);
      } else {
        console.log(`Inserted ${allRoadmap.length} roadmap entries`);
      }
    }
  }

  // Write scan row
  const finishedAt = new Date().toISOString();
  const scanRow = {
    started_at: startedAt,
    finished_at: finishedAt,
    projects_found: entries.length,
    projects_updated: upsertErr ? 0 : projects.length,
    learnings_captured: learningsCaptured,
    themes_updated: 0,
    errors: errors.length ? errors : null,
  };

  const { error: scanErr } = await supabase.from('scans').insert(scanRow);
  if (scanErr) {
    console.error('Scan row error:', scanErr.message);
  }

  // Summary
  console.log('\n--- Scan Summary ---');
  console.log(`  Directories scanned: ${entries.length}`);
  console.log(`  Projects upserted:   ${projects.length}`);
  console.log(`  Errors:              ${errors.length}`);
  console.log(`  Duration:            ${((new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000).toFixed(1)}s`);

  if (errors.length) {
    console.log('\n  Errors:');
    for (const e of errors) {
      console.log(`    ${e.project}: ${e.error}`);
    }
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
