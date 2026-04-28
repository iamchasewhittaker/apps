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

// ── Themes (auto-generated) ───────────────────────────────────────────────────
// Detect shared services (Common Inputs) and shared stacks (Cross-App Patterns)
// per app, then aggregate into rows for the `themes` table after the scan loop.

interface ThemeCtx {
  slug: string;
  type: string;
  claudeMd: string;
  deps: Record<string, string>;
  localStorageKeys: string[];
  hasLiveVercelUrl: boolean;
}

function hasDep(deps: Record<string, string>, name: string): boolean {
  return name in deps;
}

interface ServiceRule {
  id: string;
  title: string;
  description: string;
  keywords: string[]; // for usage-context heuristic
  doc_url: string;
  auth_method: string;
  env_vars: string[];
  cost_tier: string;
  match: (c: ThemeCtx) => boolean;
}

const SERVICE_RULES: ServiceRule[] = [
  {
    id: 'supabase',
    title: 'Supabase',
    description: 'Auth + Postgres + Storage. Shared project across most portfolio apps.',
    keywords: ['Supabase'],
    doc_url: 'https://supabase.com/dashboard/project/unqtnnxlltiadzbqpyhh',
    auth_method: 'Anon key (browser) + Service Role (server) + email/password or OTP',
    env_vars: ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'REACT_APP_SUPABASE_URL', 'REACT_APP_SUPABASE_ANON_KEY'],
    cost_tier: 'Free tier (shared project unqtnnxlltiadzbqpyhh)',
    match: (c) =>
      hasDep(c.deps, '@supabase/supabase-js') ||
      hasDep(c.deps, '@supabase/ssr') ||
      /\bSupabase\b/.test(c.claudeMd),
  },
  {
    id: 'ynab',
    title: 'YNAB',
    description: 'You Need A Budget API — budget reads + transaction PATCH.',
    keywords: ['YNAB'],
    doc_url: 'https://api.ynab.com/',
    auth_method: 'Personal Access Token (Bearer)',
    env_vars: ['YNAB_TOKEN', 'REACT_APP_YNAB_TOKEN'],
    cost_tier: 'Requires paid YNAB subscription',
    match: (c) => /\bYNAB\b/.test(c.claudeMd),
  },
  {
    id: 'gmail',
    title: 'Gmail',
    description: 'Gmail API + OAuth for inbox parsing, receipts, and job-search emails.',
    keywords: ['Gmail'],
    doc_url: 'https://developers.google.com/gmail/api',
    auth_method: 'OAuth 2.0 (installed app or web flow); refresh token encrypted in Supabase',
    env_vars: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'],
    cost_tier: 'Free (Google quota: 1B units/day)',
    match: (c) => /\bGmail\b/.test(c.claudeMd),
  },
  {
    id: 'anthropic',
    title: 'Anthropic / Claude API',
    description: 'Direct Claude API calls for chat, classification, and generation.',
    keywords: ['Anthropic', 'Claude API'],
    doc_url: 'https://docs.anthropic.com/',
    auth_method: 'API key (x-api-key header)',
    env_vars: ['ANTHROPIC_API_KEY', 'chase_anthropic_key (localStorage)'],
    cost_tier: 'Pay-per-token (Sonnet ~$3/M in, $15/M out)',
    match: (c) =>
      hasDep(c.deps, '@anthropic-ai/sdk') ||
      /\bAnthropic\b|Claude API/.test(c.claudeMd),
  },
  {
    id: 'privacy-com',
    title: 'Privacy.com',
    description: 'Virtual cards + transaction sync.',
    keywords: ['Privacy.com'],
    doc_url: 'https://docs.privacy.com/',
    auth_method: 'API key (Bearer); encrypted at rest in Supabase',
    env_vars: ['PRIVACY_API_KEY'],
    cost_tier: 'Free tier (limited transaction volume)',
    match: (c) => /Privacy\.com/.test(c.claudeMd),
  },
  {
    id: 'vercel',
    title: 'Vercel',
    description: 'Hosting + Functions + Cron. Auto-deploy on push to main.',
    keywords: ['Vercel', 'vercel.app'],
    doc_url: 'https://vercel.com/iamchasewhittakers-projects',
    auth_method: 'CLI token (vercel login) + GitHub auto-deploy',
    env_vars: ['VERCEL_TOKEN', 'VERCEL_ORG_ID', 'VERCEL_PROJECT_ID'],
    cost_tier: 'Hobby plan (free, with limits: 1 cron/day max)',
    match: (c) => c.hasLiveVercelUrl || /\bVERCEL_|vercel\.app/.test(c.claudeMd),
  },
  {
    id: 'linear',
    title: 'Linear',
    description: 'Issue + project tracking under team Whittaker.',
    keywords: ['Linear', 'linear.app'],
    doc_url: 'https://linear.app/whittaker',
    auth_method: 'Personal API key',
    env_vars: ['LINEAR_API_KEY'],
    cost_tier: 'Free plan (single user)',
    match: (c) => /linear\.app\/whittaker|LINEAR_API_KEY/.test(c.claudeMd),
  },
  {
    id: 'stripe',
    title: 'Stripe',
    description: 'Payments + subscriptions.',
    keywords: ['Stripe'],
    doc_url: 'https://docs.stripe.com/',
    auth_method: 'Secret key + webhook signing secret',
    env_vars: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'],
    cost_tier: '2.9% + 30¢ per transaction',
    match: (c) => hasDep(c.deps, 'stripe') || /\bStripe\b/.test(c.claudeMd),
  },
  {
    id: 'rachio',
    title: 'Rachio',
    description: 'Smart sprinkler API for irrigation control.',
    keywords: ['Rachio'],
    doc_url: 'https://rachio.readme.io/',
    auth_method: 'Personal API key (Bearer)',
    env_vars: ['RACHIO_API_KEY'],
    cost_tier: 'Free (requires Rachio device)',
    match: (c) => /\bRachio\b/.test(c.claudeMd),
  },
];

const PATTERN_RULES: Array<{
  id: string;
  title: string;
  description: string;
  match: (c: ThemeCtx) => boolean;
}> = [
  {
    id: 'nextjs-tailwind-supabase',
    title: 'Next.js + Tailwind + Supabase',
    description: 'App Router web stack — server components, Tailwind utilities, Supabase data.',
    match: (c) =>
      hasDep(c.deps, 'next') &&
      hasDep(c.deps, 'tailwindcss') &&
      (hasDep(c.deps, '@supabase/supabase-js') || hasDep(c.deps, '@supabase/ssr')),
  },
  {
    id: 'cra-localstorage',
    title: 'CRA + localStorage',
    description: 'Create React App with one big chase_* JSON blob per app — the portfolio web baseline.',
    match: (c) => hasDep(c.deps, 'react-scripts') && c.localStorageKeys.length > 0,
  },
  {
    id: 'swiftui-observable',
    title: 'SwiftUI + @Observable',
    description: 'iOS apps using the modern @Observable macro for state stores.',
    match: (c) => c.type === 'ios' && /@Observable/.test(c.claudeMd),
  },
  {
    id: 'swiftui-swiftdata',
    title: 'SwiftUI + SwiftData',
    description: 'iOS apps persisting via SwiftData @Model containers.',
    match: (c) => c.type === 'ios' && /SwiftData/.test(c.claudeMd),
  },
  {
    id: 'swiftui-supabase',
    title: 'SwiftUI + supabase-swift',
    description: 'iOS apps syncing through the supabase-swift v2 client.',
    match: (c) => c.type === 'ios' && /supabase-swift/.test(c.claudeMd),
  },
  {
    id: 'apps-script-sheets',
    title: 'Apps Script + Sheets',
    description: 'Google Apps Script backends with Sheets tabs as the data store.',
    match: (c) => /Apps Script/.test(c.claudeMd),
  },
  {
    id: 'electron-react-ts',
    title: 'Electron + React + TS',
    description: 'Desktop apps with Electron main process + React renderer.',
    match: (c) => hasDep(c.deps, 'electron'),
  },
  {
    id: 'python-cli',
    title: 'Python CLI',
    description: 'Standalone Python tooling outside the React/iOS stack.',
    match: (c) => c.type !== 'web' && /\bPython\b/.test(c.claudeMd),
  },
];

function readClaudeMd(dir: string): string {
  const path = join(dir, 'CLAUDE.md');
  if (!existsSync(path)) return '';
  try {
    return readFileSync(path, 'utf-8');
  } catch {
    return '';
  }
}

function buildThemeCtx(
  slug: string,
  dir: string,
  type: string,
  pkg: Record<string, unknown> | null,
  claudeData: ReturnType<typeof parseClaudeMd>,
): ThemeCtx {
  const deps: Record<string, string> = {
    ...((pkg?.dependencies as Record<string, string> | undefined) ?? {}),
    ...((pkg?.devDependencies as Record<string, string> | undefined) ?? {}),
  };
  return {
    slug,
    type,
    claudeMd: readClaudeMd(dir),
    deps,
    localStorageKeys: claudeData.localstorage_keys,
    hasLiveVercelUrl: !!claudeData.live_url,
  };
}

function detectServices(ctx: ThemeCtx): string[] {
  return SERVICE_RULES.filter((r) => r.match(ctx)).map((r) => r.id);
}

function detectPatterns(ctx: ThemeCtx): string[] {
  return PATTERN_RULES.filter((r) => r.match(ctx)).map((r) => r.id);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function stripMarkdown(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // [text](url) → text
    .replace(/[`*_#>]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractUsageContext(claudeMd: string, keywords: string[], maxLen = 160): string {
  if (!claudeMd) return '';
  for (const kw of keywords) {
    const re = new RegExp(`[^.!?\\n]*\\b${escapeRegex(kw)}\\b[^.!?\\n]*[.!?]?`, 'i');
    const m = re.exec(claudeMd);
    if (!m) continue;
    let s = stripMarkdown(m[0]);
    if (s.length < 20) continue; // too tiny to be useful
    if (s.length > maxLen) s = s.slice(0, maxLen - 1).trimEnd() + '…';
    return s;
  }
  return '';
}

const SOURCE_SKIP_DIRS = new Set([
  'node_modules', '.next', '.git', 'build', 'dist', 'coverage',
  'public', 'archive', 'Pods', '.vercel', '.turbo', 'out',
]);

function walkSourceFiles(dir: string, exts: string[], maxDepth = 4, maxFiles = 500): string[] {
  const out: string[] = [];
  function walk(d: string, depth: number): void {
    if (depth > maxDepth || out.length >= maxFiles) return;
    let entries: import('fs').Dirent[];
    try {
      entries = readdirSync(d, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (out.length >= maxFiles) return;
      if (e.name.startsWith('.') && depth === 0) continue;
      const full = join(d, e.name);
      if (e.isDirectory()) {
        if (SOURCE_SKIP_DIRS.has(e.name) || e.name.startsWith('.')) continue;
        walk(full, depth + 1);
      } else if (e.isFile() && exts.some((x) => e.name.endsWith(x))) {
        out.push(full);
      }
    }
  }
  walk(dir, 0);
  return out;
}

interface PromptHit {
  slug: string;
  title: string;
  source_kind: 'system_prompt' | 'session_template' | 'slash_command' | 'prompt_md';
  source_path: string; // relative to repo
  excerpt: string;
  project_slug?: string;
}

function relFromHome(p: string): string {
  return p.startsWith(HOME) ? p.replace(HOME, '~') : p;
}

function snippetSlug(prefix: string, raw: string): string {
  const hash = createHash('sha1').update(raw).digest('hex').slice(0, 10);
  return `${prefix}:${hash}`;
}

const SYSTEM_PROMPT_PATTERNS: RegExp[] = [
  /system\s*:\s*(`([^`]{40,800})`|"([^"\\]{40,800})"|'([^'\\]{40,800})')/g,
  /callClaude\s*\(\s*(`([^`]{40,800})`|"([^"\\]{40,800})"|'([^'\\]{40,800})')/g,
];

function parsePromptsForProject(slug: string, dir: string): PromptHit[] {
  const hits: PromptHit[] = [];
  const seen = new Set<string>();
  const sourceFiles = walkSourceFiles(dir, ['.ts', '.tsx', '.js', '.jsx'], 4, 200);
  for (const file of sourceFiles) {
    let content: string;
    try {
      content = readFileSync(file, 'utf-8');
    } catch {
      continue;
    }
    if (content.length > 400_000) continue; // skip giant bundles
    for (const pat of SYSTEM_PROMPT_PATTERNS) {
      pat.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = pat.exec(content)) !== null) {
        const raw = (m[2] ?? m[3] ?? m[4] ?? '').trim();
        if (raw.length < 40) continue;
        const fingerprint = raw.slice(0, 80);
        if (seen.has(fingerprint)) continue;
        seen.add(fingerprint);
        const excerpt = raw.length > 320 ? raw.slice(0, 317) + '…' : raw;
        const relFile = file.replace(dir, '').replace(/^\//, '');
        const titleSeed = excerpt.split(/\s+/).slice(0, 6).join(' ');
        hits.push({
          slug: snippetSlug(`prompt:sys:${slug}`, fingerprint),
          title: `${titleCase(slug)} — ${titleSeed}`,
          source_kind: 'system_prompt',
          source_path: `portfolio/${slug}/${relFile}`,
          excerpt,
          project_slug: slug,
        });
        if (hits.length >= 10) return hits; // cap per project
      }
    }
  }
  // PROMPT.md
  const promptMdPath = join(dir, 'PROMPT.md');
  if (existsSync(promptMdPath)) {
    try {
      const content = readFileSync(promptMdPath, 'utf-8');
      const heading = (content.match(/^#\s+(.+)$/m)?.[1] ?? `${titleCase(slug)} — PROMPT.md`).trim();
      const body = stripMarkdown(content.replace(/^#.*$/m, '').trim());
      const excerpt = body.length > 320 ? body.slice(0, 317) + '…' : body;
      hits.push({
        slug: snippetSlug(`prompt:md:${slug}`, heading),
        title: heading,
        source_kind: 'prompt_md',
        source_path: `portfolio/${slug}/PROMPT.md`,
        excerpt,
        project_slug: slug,
      });
    } catch {}
  }
  return hits;
}

function parsePortfolioTemplates(rootDocs: string): PromptHit[] {
  const dir = join(rootDocs, 'templates');
  if (!existsSync(dir)) return [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  const hits: PromptHit[] = [];
  for (const name of entries) {
    if (!name.startsWith('SESSION_START_') || !name.endsWith('.md')) continue;
    const full = join(dir, name);
    try {
      const content = readFileSync(full, 'utf-8');
      const heading = (content.match(/^#\s+(.+)$/m)?.[1] ?? name.replace(/\.md$/, '')).trim();
      const firstPara = content
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .find((p) => p && !p.startsWith('#') && !p.startsWith('>')) ?? '';
      const cleaned = stripMarkdown(firstPara);
      const excerpt = cleaned.length > 320 ? cleaned.slice(0, 317) + '…' : cleaned;
      hits.push({
        slug: snippetSlug('prompt:tpl', name.replace(/\.md$/, '')),
        title: heading,
        source_kind: 'session_template',
        source_path: relFromHome(full),
        excerpt,
      });
    } catch {}
  }
  return hits;
}

function parseSlashCommands(): PromptHit[] {
  const dir = join(HOME, '.claude', 'commands');
  if (!existsSync(dir)) return [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  const hits: PromptHit[] = [];
  for (const name of entries) {
    if (!name.endsWith('.md')) continue;
    const full = join(dir, name);
    try {
      const content = readFileSync(full, 'utf-8');
      const heading = (content.match(/^#\s+(.+)$/m)?.[1] ?? `/${name.replace(/\.md$/, '')}`).trim();
      const firstPara = content
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .find((p) => p && !p.startsWith('#') && !p.startsWith('---')) ?? '';
      const cleaned = stripMarkdown(firstPara);
      const excerpt = cleaned.length > 320 ? cleaned.slice(0, 317) + '…' : cleaned;
      hits.push({
        slug: snippetSlug('prompt:cmd', name.replace(/\.md$/, '')),
        title: `/${name.replace(/\.md$/, '')}`,
        source_kind: 'slash_command',
        source_path: relFromHome(full),
        excerpt: excerpt || heading,
      });
    } catch {}
  }
  return hits;
}

interface GlossaryHit {
  slug: string;
  term: string;
  definition: string;
  raw: string;
}

function parseGlossary(rootDocs: string): GlossaryHit[] {
  const path = join(rootDocs, 'GLOSSARY.md');
  if (!existsSync(path)) return [];
  let content: string;
  try {
    content = readFileSync(path, 'utf-8');
  } catch {
    return [];
  }
  const hits: GlossaryHit[] = [];
  const lines = content.split('\n');
  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    if (/^\|\s*-+/.test(line)) continue; // table separator row
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 2) continue;
    const termRaw = cells[0];
    const defRaw = cells[1];
    if (!termRaw || !defRaw) continue;
    if (/^term$/i.test(stripMarkdown(termRaw))) continue; // header row
    const term = stripMarkdown(termRaw);
    const definition = stripMarkdown(defRaw);
    if (!term || !definition || definition.length < 10) continue;
    hits.push({
      slug: snippetSlug('glossary', term),
      term,
      definition: definition.length > 400 ? definition.slice(0, 397) + '…' : definition,
      raw: defRaw,
    });
  }
  return hits;
}

function buildThemeRows(
  servicesByApp: Map<string, Set<string>>,
  patternsByApp: Map<string, Set<string>>,
  usageNotesByApp: Map<string, Map<string, string>>,
  promptHits: PromptHit[],
  glossaryHits: GlossaryHit[],
): Array<Record<string, unknown>> {
  const rows: Array<Record<string, unknown>> = [];

  // Common Inputs — one row per service, listing apps that use it
  for (const rule of SERVICE_RULES) {
    const apps = [...servicesByApp.entries()]
      .filter(([, ids]) => ids.has(rule.id))
      .map(([slug]) => slug)
      .sort();
    if (apps.length === 0) continue;

    const per_project_notes: Record<string, string> = {};
    for (const slug of apps) {
      const note = usageNotesByApp.get(slug)?.get(rule.id);
      if (note) per_project_notes[slug] = note;
    }

    rows.push({
      slug: `common-input-${rule.id}`,
      title: rule.title,
      kind: 'common_input',
      description: rule.description,
      project_slugs: apps,
      auto_generated: true,
      metadata: {
        auth_method: rule.auth_method,
        env_vars: rule.env_vars,
        doc_url: rule.doc_url,
        cost_tier: rule.cost_tier,
        per_project_notes,
      },
    });
  }

  // Cross-App Patterns — one row per pattern, listing apps that match
  for (const rule of PATTERN_RULES) {
    const apps = [...patternsByApp.entries()]
      .filter(([, ids]) => ids.has(rule.id))
      .map(([slug]) => slug)
      .sort();
    if (apps.length < 2) continue; // a "shared" pattern needs 2+ apps
    rows.push({
      slug: `pattern-${rule.id}`,
      title: rule.title,
      kind: 'cross_app_pattern',
      description: rule.description,
      project_slugs: apps,
      auto_generated: true,
    });
  }

  // Common Prompts — one row per discovered prompt
  for (const hit of promptHits) {
    rows.push({
      slug: hit.slug,
      title: hit.title,
      kind: 'common_prompt',
      description: hit.excerpt,
      project_slugs: hit.project_slug ? [hit.project_slug] : [],
      auto_generated: true,
      metadata: {
        source_kind: hit.source_kind,
        source_path: hit.source_path,
        excerpt: hit.excerpt,
      },
    });
  }

  // Glossary — one row per parsed term
  for (const hit of glossaryHits) {
    rows.push({
      slug: hit.slug,
      title: hit.term,
      kind: 'glossary_term',
      description: hit.definition,
      project_slugs: [],
      auto_generated: true,
      metadata: {
        definition_md: hit.raw,
      },
    });
  }

  // Final guard: dedupe by slug (insert would fail on UNIQUE collision)
  const bySlug = new Map<string, Record<string, unknown>>();
  for (const r of rows) bySlug.set(r.slug as string, r);
  return [...bySlug.values()];
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
  const servicesByApp = new Map<string, Set<string>>();
  const patternsByApp = new Map<string, Set<string>>();
  const usageNotesByApp = new Map<string, Map<string, string>>();
  const promptHits: PromptHit[] = [];
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

      const themeCtx = buildThemeCtx(name, dir, type, pkg, claudeData);
      const services = detectServices(themeCtx);
      const patterns = detectPatterns(themeCtx);
      if (services.length > 0) servicesByApp.set(name, new Set(services));
      if (patterns.length > 0) patternsByApp.set(name, new Set(patterns));

      if (services.length > 0) {
        const noteMap = new Map<string, string>();
        for (const id of services) {
          const rule = SERVICE_RULES.find((r) => r.id === id);
          if (!rule) continue;
          const note = extractUsageContext(themeCtx.claudeMd, rule.keywords);
          if (note) noteMap.set(id, note);
        }
        if (noteMap.size > 0) usageNotesByApp.set(name, noteMap);
      }

      try {
        promptHits.push(...parsePromptsForProject(name, dir));
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`  [WARN] ${name}: prompt parse failed — ${msg}`);
      }

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

  // Global prompt sources (templates + slash commands) and glossary
  const rootDocs = resolve(DEV_ROOT, '..', 'docs');
  try {
    promptHits.push(...parsePortfolioTemplates(rootDocs));
  } catch (err) {
    console.warn(`Templates parse failed: ${err instanceof Error ? err.message : err}`);
  }
  try {
    promptHits.push(...parseSlashCommands());
  } catch (err) {
    console.warn(`Slash command parse failed: ${err instanceof Error ? err.message : err}`);
  }

  let glossaryHits: GlossaryHit[] = [];
  try {
    glossaryHits = parseGlossary(rootDocs);
  } catch (err) {
    console.warn(`Glossary parse failed: ${err instanceof Error ? err.message : err}`);
  }

  // Sync auto-generated themes — delete all auto rows, insert fresh.
  // Manual rows (auto_generated = false, e.g. portfolio_thesis) are preserved.
  const themeRows = buildThemeRows(
    servicesByApp,
    patternsByApp,
    usageNotesByApp,
    promptHits,
    glossaryHits,
  );
  let themesUpdated = 0;
  console.log(
    `\nSyncing ${themeRows.length} auto-generated themes ` +
      `(${promptHits.length} prompts, ${glossaryHits.length} glossary terms)…`,
  );
  const { error: tDelErr } = await supabase
    .from('themes')
    .delete()
    .eq('auto_generated', true);
  if (tDelErr) {
    console.error('Themes delete error:', tDelErr.message);
  } else if (themeRows.length > 0) {
    const { error: tInsErr } = await supabase.from('themes').insert(themeRows);
    if (tInsErr) {
      console.error('Themes insert error:', tInsErr.message);
    } else {
      themesUpdated = themeRows.length;
      console.log(`Inserted ${themeRows.length} themes (auto-generated)`);
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
    themes_updated: themesUpdated,
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
  console.log(`  Themes upserted:     ${themesUpdated}`);
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
