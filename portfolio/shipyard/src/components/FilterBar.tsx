'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const TYPE_OPTIONS = ['all', 'web', 'ios', 'library', 'cli'] as const;
const FAMILY_OPTIONS = ['all', 'clarity', 'standalone', 'portfolio', 'archived'] as const;
const STATUS_OPTIONS = ['all', 'active', 'stalled', 'frozen', 'archived'] as const;
const LIVE_OPTIONS = ['all', 'yes', 'no'] as const;

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const set = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  const current = (key: string) => searchParams.get(key) ?? 'all';

  return (
    <div className="flex flex-wrap items-center gap-4">
      <FilterSelect
        label="Type"
        value={current('type')}
        options={TYPE_OPTIONS}
        onChange={(v) => set('type', v)}
      />
      <FilterSelect
        label="Family"
        value={current('family')}
        options={FAMILY_OPTIONS}
        onChange={(v) => set('family', v)}
      />
      <FilterSelect
        label="Status"
        value={current('status')}
        options={STATUS_OPTIONS}
        onChange={(v) => set('status', v)}
      />
      <FilterSelect
        label="Live URL"
        value={current('live')}
        options={LIVE_OPTIONS}
        onChange={(v) => set('live', v)}
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-steel">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-dimmer bg-surface/80 px-3 py-2.5 text-sm text-white outline-none focus:border-gold/50 min-h-[44px] transition-colors"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
