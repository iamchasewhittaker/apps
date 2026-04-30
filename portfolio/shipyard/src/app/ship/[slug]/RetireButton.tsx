'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  slug: string;
  name: string;
  hasLinear: boolean;
}

type RetireResult = {
  steps: {
    supabase: string;
    linear: { ok: boolean; message: string };
  };
};

export function RetireButton({ slug, name, hasLinear }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RetireResult | null>(null);

  async function confirm() {
    setLoading(true);
    const res = await fetch(`/api/ship/${slug}/retire`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: reason || null }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setResult(data);
      router.refresh();
    }
  }

  function close() {
    setOpen(false);
    setResult(null);
    setReason('');
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md border border-danger/40 bg-danger/5 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/15 transition-colors"
      >
        Decommission Ship
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="mx-4 w-full max-w-md rounded-xl border border-dimmer bg-surface p-6 shadow-2xl space-y-4">
            {!result ? (
              <>
                <div>
                  <h2 className="text-base font-semibold text-white">
                    Decommission {name}?
                  </h2>
                  <p className="mt-1 text-sm text-steel">
                    Marks the ship as archived in Supabase and cancels its Linear project if configured.
                  </p>
                </div>

                <div className="rounded-md border border-dimmer bg-surface/80 px-4 py-3 space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-steel">What happens</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2 text-white">
                      <span className="text-success text-xs">✓</span>
                      Supabase status → archived, retired_at recorded
                    </li>
                    <li className={`flex items-center gap-2 text-sm ${hasLinear ? 'text-white' : 'text-steel'}`}>
                      <span className={`text-xs ${hasLinear ? 'text-gold' : ''}`}>{hasLinear ? '→' : '–'}</span>
                      {hasLinear ? 'Linear project archived (requires LINEAR_API_KEY)' : 'No Linear project linked'}
                    </li>
                    <li className="flex items-center gap-2 text-steel">
                      <span className="text-xs">–</span>
                      Filesystem + docs: manual (git mv, CLAUDE.md, ROADMAP.md)
                    </li>
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-steel">Retire reason (optional)</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Superseded by Spend Clarity"
                    rows={2}
                    className="w-full rounded-md border border-dimmer bg-surface/80 px-3 py-2 text-sm text-white placeholder:text-steel focus:border-gold focus:outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={close}
                    className="rounded-md border border-dimmer px-3 py-1.5 text-xs font-medium text-steel hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirm}
                    disabled={loading}
                    className="rounded-md border border-danger/50 bg-danger/10 px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/20 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Decommissioning…' : 'Confirm'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-base font-semibold text-white">{name} decommissioned</h2>

                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-success">
                    <span className="text-xs">✓</span> Supabase: archived
                  </li>
                  <li className={`flex items-center gap-2 ${result.steps.linear.ok ? 'text-success' : 'text-steel'}`}>
                    <span className="text-xs">{result.steps.linear.ok ? '✓' : '–'}</span>
                    {result.steps.linear.message}
                  </li>
                </ul>

                <div className="rounded-md border border-gold/20 bg-gold/5 px-4 py-3 space-y-1.5">
                  <p className="text-xs font-medium uppercase tracking-wider text-gold">Manual steps</p>
                  <ul className="space-y-1 text-xs text-steel font-mono">
                    <li>git mv portfolio/{slug} portfolio/archive/{slug}</li>
                    <li>Update root CLAUDE.md + ROADMAP.md</li>
                    {hasLinear && !result.steps.linear.ok && (
                      <li>Cancel Linear project manually</li>
                    )}
                  </ul>
                </div>

                <button
                  onClick={close}
                  className="w-full rounded-md border border-dimmer px-3 py-1.5 text-xs font-medium text-steel hover:text-white transition-colors"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
