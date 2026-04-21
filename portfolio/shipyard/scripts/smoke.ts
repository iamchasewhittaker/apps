#!/usr/bin/env tsx
/**
 * Route smoke test: hits every page route and fails on non-2xx/3xx.
 *
 * Expects a live server at BASE_URL (default http://localhost:3005).
 *
 *   npm run dev          # in one shell
 *   npm run smoke        # in another — hits localhost
 *
 *   BASE_URL=https://shipyard-sandy-seven.vercel.app npm run smoke
 *
 * Auto-discovers routes from src/app/(*)/page.tsx. Resolves [slug] to
 * a real slug from Supabase so dynamic detail pages get tested too.
 */

import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { config as loadEnv } from 'dotenv';

loadEnv({ path: '.env.local' });
loadEnv();

const BASE_URL = (process.env.BASE_URL || 'http://localhost:3005').replace(/\/$/, '');
const APP_DIR = new URL('../src/app', import.meta.url).pathname;

async function findRoutes(dir: string, prefix = ''): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const routes: string[] = [];

  if (entries.some((e) => e.isFile() && e.name === 'page.tsx')) {
    routes.push(prefix || '/');
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'api') continue;
    if (entry.name.startsWith('_')) continue;
    if (entry.name.startsWith('(') && entry.name.endsWith(')')) {
      routes.push(...(await findRoutes(join(dir, entry.name), prefix)));
      continue;
    }
    routes.push(...(await findRoutes(join(dir, entry.name), `${prefix}/${entry.name}`)));
  }

  return routes;
}

async function resolveDynamicRoutes(routes: string[]): Promise<string[]> {
  if (!routes.some((r) => r.includes('[slug]'))) return routes;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('⚠ Skipping [slug] routes — missing NEXT_PUBLIC_SUPABASE_URL or service/anon key');
    return routes.filter((r) => !r.includes('[slug]'));
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase.from('projects').select('slug').limit(1);
  if (error || !data?.[0]?.slug) {
    console.warn('⚠ Skipping [slug] routes — no projects found');
    return routes.filter((r) => !r.includes('[slug]'));
  }
  const slug = data[0].slug;
  return routes.map((r) => r.replaceAll('[slug]', slug));
}

function statusSymbol(code: number): string {
  if (code >= 200 && code < 400) return '\x1b[32m✓\x1b[0m';
  return '\x1b[31m✗\x1b[0m';
}

async function main() {
  let routes = await findRoutes(APP_DIR);
  routes = await resolveDynamicRoutes(routes);
  routes = Array.from(new Set(routes)).sort();

  console.log(`\nSmoke test: ${routes.length} routes against ${BASE_URL}\n`);

  let failures = 0;
  for (const route of routes) {
    const url = `${BASE_URL}${route}`;
    try {
      const res = await fetch(url, { redirect: 'manual' });
      const ok = res.status >= 200 && res.status < 400;
      console.log(`  ${statusSymbol(res.status)} ${String(res.status).padEnd(3)}  ${route}`);
      if (!ok) failures++;
    } catch (e) {
      console.log(`  \x1b[31m✗\x1b[0m ERR  ${route} — ${(e as Error).message}`);
      failures++;
    }
  }

  console.log();
  if (failures > 0) {
    console.error(`\x1b[31m${failures} route(s) failed\x1b[0m`);
    process.exit(1);
  }
  console.log('\x1b[32mAll routes green\x1b[0m');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
