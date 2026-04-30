'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Props {
  slug: string;
  isActive: boolean;
}

export default function WipActions({ slug, isActive }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePick() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/wip/pick', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `Request failed (${res.status})`);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  if (isActive) {
    return (
      <span className="shrink-0 text-xs text-gold font-medium">
        Current focus
      </span>
    );
  }

  return (
    <div className="flex shrink-0 flex-col items-end gap-1">
      <button
        onClick={handlePick}
        disabled={loading}
        className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-background transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Setting...' : 'Set as active focus'}
      </button>
      {error && (
        <p className="max-w-[200px] text-right text-[11px] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
