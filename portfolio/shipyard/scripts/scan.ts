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

      console.log(`  [OK] ${name} (${type}, step ${mvp_step_actual}, ${status}${learningRows.length ? `, ${learningRows.length} learnings` : ''})`);
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
