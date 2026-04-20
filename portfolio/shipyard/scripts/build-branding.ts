#!/usr/bin/env tsx
/**
 * Walks `/Users/chase/Developer/chase/portfolio/* /docs/BRANDING.md` and extracts
 * colors, fonts, and icon paths into `src/data/branding.json` for per-app
 * design-system panels in Shipyard's portfolio detail pages.
 *
 * Copies found icons into `public/branding/<slug>/icon.png`.
 * Best-effort — apps without a BRANDING.md get an empty entry so the
 * detail page can render a "no brand data yet" fallback.
 *
 * Run: npx tsx scripts/build-branding.ts
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, join, basename } from 'node:path';

const REPO_ROOT = resolve(__dirname, '..', '..', '..');
const PORTFOLIO_DIR = resolve(REPO_ROOT, 'portfolio');
const SHIPYARD_DIR = resolve(REPO_ROOT, 'portfolio', 'shipyard');
const OUTPUT_JSON = resolve(SHIPYARD_DIR, 'src', 'data', 'branding.json');
const OUTPUT_PUBLIC = resolve(SHIPYARD_DIR, 'public', 'branding');

interface ColorEntry {
  hex: string;
  name?: string;
  usage?: string;
}

interface FontEntry {
  family: string;
  role?: string;
}

interface BrandingEntry {
  slug: string;
  appName?: string;
  colors: ColorEntry[];
  fonts: FontEntry[];
  iconPath?: string;
  notes?: string;
  sourceFile: string;
  missing?: boolean;
}

function normalizeHex(hex: string): string {
  const clean = hex.replace('#', '').toLowerCase();
  if (clean.length === 3) {
    return '#' + clean.split('').map((c) => c + c).join('');
  }
  return '#' + clean;
}

function extractColors(markdown: string): ColorEntry[] {
  const out = new Map<string, ColorEntry>();

  const tableRegex = /^\|([^|\n]+)\|([^|\n]+)\|([^|\n]*)\|?/gm;
  let match: RegExpExecArray | null;
  while ((match = tableRegex.exec(markdown))) {
    const [, col1, col2, col3] = match;
    const hexMatch = col2.match(/#[0-9a-fA-F]{3,8}\b/);
    if (!hexMatch) continue;
    const hex = normalizeHex(hexMatch[0]);
    const name = col1.trim().replace(/[`*]/g, '');
    const usage = (col3 ?? '').trim().replace(/[`*]/g, '') || undefined;
    if (!out.has(hex)) {
      out.set(hex, { hex, name: name || undefined, usage });
    }
  }

  const inlineRegex = /#[0-9a-fA-F]{3,8}\b/g;
  let inline: RegExpExecArray | null;
  while ((inline = inlineRegex.exec(markdown))) {
    const hex = normalizeHex(inline[0]);
    if (!out.has(hex)) out.set(hex, { hex });
  }

  return Array.from(out.values()).slice(0, 32);
}

function extractFonts(markdown: string): FontEntry[] {
  const fonts = new Map<string, FontEntry>();

  const typographyMatch = markdown.match(/###?\s+Typography[\s\S]*?(?=\n##\s|\n#\s|$)/i);
  const section = typographyMatch ? typographyMatch[0] : markdown;

  const knownFonts = [
    'DM Sans', 'DM Mono', 'DM Serif Display',
    'Cormorant Garamond', 'Cormorant',
    'Instrument Sans', 'Instrument Serif',
    'Big Shoulders Display', 'Big Shoulders Text',
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat',
    'SF Pro', 'SF Mono', 'SF Rounded',
    'Helvetica Neue', 'Helvetica',
    'Arial', 'Georgia', 'Times New Roman',
    'Space Grotesk', 'Space Mono',
    'JetBrains Mono', 'Fira Code', 'IBM Plex',
    'Playfair Display', 'Merriweather',
    'Nunito', 'Poppins', 'Raleway',
    'Source Sans Pro', 'Source Code Pro',
  ];

  for (const family of knownFonts) {
    const re = new RegExp(`\\b${family.replace(/\s+/g, '\\s+')}\\b`, 'i');
    if (re.test(section) || re.test(markdown)) {
      if (!fonts.has(family.toLowerCase())) {
        fonts.set(family.toLowerCase(), { family });
      }
    }
  }

  if (/\bsystem\b|SF \(system\)|system-ui|-apple-system/i.test(section)) {
    if (!fonts.has('system')) fonts.set('system', { family: 'System (SF)', role: 'UI' });
  }

  return Array.from(fonts.values()).slice(0, 6);
}

function extractNotes(markdown: string): string | undefined {
  const lines = markdown.split('\n');
  const start = lines.findIndex((l) => /^>/.test(l));
  if (start >= 0) {
    return lines[start].replace(/^>\s*/, '').trim();
  }
  const firstPara = markdown
    .split('\n\n')
    .map((p) => p.trim())
    .find((p) => p && !p.startsWith('#') && !p.startsWith('|') && !p.startsWith('---'));
  return firstPara?.slice(0, 280);
}

function extractAppName(markdown: string): string | undefined {
  const heading = markdown.match(/^#\s+(.+?)\s*$/m);
  if (heading) {
    return heading[1].replace(/[—–-]\s*branding.*$/i, '').replace(/branding\s*[—–-]/i, '').trim();
  }
  return undefined;
}

function findIcon(portfolioDir: string, slug: string): string | undefined {
  const candidates: string[] = [];
  try {
    const entries = readdirSync(portfolioDir);
    for (const entry of entries) {
      const full = join(portfolioDir, entry);
      if (!statSync(full).isDirectory()) continue;
      if (entry === 'Assets.xcassets' || entry.endsWith('.xcassets')) {
        const appIconDir = join(full, 'AppIcon.appiconset');
        if (existsSync(appIconDir)) {
          const files = readdirSync(appIconDir).filter((f) => f.endsWith('.png'));
          const ranked = files
            .map((f) => ({ f, size: parseInt((f.match(/(\d+)/)?.[1] ?? '0'), 10) }))
            .sort((a, b) => b.size - a.size);
          if (ranked.length > 0) candidates.push(join(appIconDir, ranked[0].f));
        }
      }
    }
  } catch {
    // ignore
  }

  try {
    for (const sub of ['public', 'build']) {
      const pubDir = join(portfolioDir, sub);
      if (!existsSync(pubDir)) continue;
      for (const candidate of ['logo512.png', 'apple-touch-icon.png', 'logo192.png', 'icon.png']) {
        const full = join(pubDir, candidate);
        if (existsSync(full)) {
          candidates.push(full);
          break;
        }
      }
    }
  } catch {
    // ignore
  }

  try {
    const walk = (dir: string, depth: number): void => {
      if (depth > 3) return;
      const entries = readdirSync(dir);
      for (const entry of entries) {
        if (entry === 'node_modules' || entry.startsWith('.')) continue;
        const full = join(dir, entry);
        const s = statSync(full);
        if (s.isDirectory() && entry === 'AppIcon.appiconset') {
          const files = readdirSync(full).filter((f) => f.endsWith('.png'));
          const ranked = files
            .map((f) => ({ f, size: parseInt((f.match(/(\d+)/)?.[1] ?? '0'), 10) }))
            .sort((a, b) => b.size - a.size);
          if (ranked.length > 0) candidates.push(join(full, ranked[0].f));
        } else if (s.isDirectory()) {
          walk(full, depth + 1);
        }
      }
    };
    walk(portfolioDir, 0);
  } catch {
    // ignore
  }

  return candidates[0];
}

function copyIcon(src: string, slug: string): string | undefined {
  const destDir = join(OUTPUT_PUBLIC, slug);
  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
  const ext = src.toLowerCase().endsWith('.svg') ? 'svg' : 'png';
  const dest = join(destDir, `icon.${ext}`);
  try {
    copyFileSync(src, dest);
    return `/branding/${slug}/icon.${ext}`;
  } catch (e) {
    console.warn(`  ! Failed to copy ${basename(src)} for ${slug}: ${(e as Error).message}`);
    return undefined;
  }
}

function main() {
  console.log('→ Walking', PORTFOLIO_DIR);

  if (!existsSync(resolve(SHIPYARD_DIR, 'src', 'data'))) {
    mkdirSync(resolve(SHIPYARD_DIR, 'src', 'data'), { recursive: true });
  }
  if (!existsSync(OUTPUT_PUBLIC)) {
    mkdirSync(OUTPUT_PUBLIC, { recursive: true });
  }

  const entries: Record<string, BrandingEntry> = {};
  const slugs = readdirSync(PORTFOLIO_DIR).filter((s) => {
    if (s === 'shipyard' || s === 'archive' || s.startsWith('.')) return false;
    return statSync(join(PORTFOLIO_DIR, s)).isDirectory();
  });

  for (const slug of slugs) {
    const portfolioDir = join(PORTFOLIO_DIR, slug);
    const brandingPath = join(portfolioDir, 'docs', 'BRANDING.md');

    if (!existsSync(brandingPath)) {
      entries[slug] = {
        slug,
        colors: [],
        fonts: [],
        sourceFile: 'missing',
        missing: true,
      };
      console.log(`  · ${slug}: no BRANDING.md`);
      continue;
    }

    const markdown = readFileSync(brandingPath, 'utf8');
    const colors = extractColors(markdown);
    const fonts = extractFonts(markdown);
    const notes = extractNotes(markdown);
    const appName = extractAppName(markdown);

    const iconSrc = findIcon(portfolioDir, slug);
    const iconPath = iconSrc ? copyIcon(iconSrc, slug) : undefined;

    entries[slug] = {
      slug,
      appName,
      colors,
      fonts,
      iconPath,
      notes,
      sourceFile: `portfolio/${slug}/docs/BRANDING.md`,
    };

    console.log(
      `  ✓ ${slug}: ${colors.length} colors, ${fonts.length} fonts${iconPath ? ', icon' : ''}`,
    );
  }

  writeFileSync(OUTPUT_JSON, JSON.stringify(entries, null, 2) + '\n', 'utf8');
  console.log(`\nWrote ${Object.keys(entries).length} entries to ${OUTPUT_JSON}`);
}

main();
