#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'node:path';

config({ path: resolve(__dirname, '..', '.env.local') });
config({ path: resolve(__dirname, '..', '.env') });

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const projectRef = new URL(SUPABASE_URL).hostname.split('.')[0];

const SQL_STATEMENTS = [
  'alter table projects add column if not exists retired_at timestamptz',
  'alter table projects add column if not exists retire_reason text',
];

async function runViaManagementApi(sql: string): Promise<void> {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Management API error (${res.status}): ${body}`);
  }
}

async function main() {
  console.log('→ Applying retirement migration…');

  const { error: rpcErr } = await (supabase.rpc as any)('query', {
    query: SQL_STATEMENTS.join(';\n'),
  });

  if (!rpcErr) {
    console.log('✓ Migration applied via RPC');
    return;
  }

  console.log('  RPC not available, trying management API…');
  try {
    for (const stmt of SQL_STATEMENTS) {
      await runViaManagementApi(stmt);
      console.log(`  ✓ ${stmt}`);
    }
    console.log('✓ Migration applied via management API');
  } catch (e) {
    console.error('Management API failed:', (e as Error).message);
    console.log('\n→ Run this SQL manually in Supabase SQL Editor:\n');
    SQL_STATEMENTS.forEach((s) => console.log(s + ';'));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
