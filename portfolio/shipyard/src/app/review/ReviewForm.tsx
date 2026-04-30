'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ReviewKind } from '@/lib/types';

const PROMPTS = [
  { key: 'wins', label: 'Wins', placeholder: 'What shipped, advanced a step, or moved forward?' },
  { key: 'blockers', label: 'Blockers', placeholder: 'What stuck you, and what\u2019s the plan to unblock?' },
  { key: 'learnings', label: 'Learnings', placeholder: 'One sentence: what did you learn?' },
  { key: 'next_focus', label: 'Next focus', placeholder: 'Your #1 focus for the next window' },
  { key: 'scripture', label: 'Scripture or principle', placeholder: 'The verse grounding you' },
  { key: 'honest_check', label: 'Honest check', placeholder: 'Are you being urgent enough? What would your wife\u2019s letter say?' },
] as const;

type FieldKey = (typeof PROMPTS)[number]['key'];

export default function ReviewForm({ kind }: { kind: ReviewKind }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<FieldKey, string>>({
    wins: '',
    blockers: '',
    learnings: '',
    next_focus: '',
    scripture: '',
    honest_check: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(key: FieldKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, ...values }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      setSuccess(true);
      setValues({
        wins: '',
        blockers: '',
        learnings: '',
        next_focus: '',
        scripture: '',
        honest_check: '',
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {PROMPTS.map(({ key, label, placeholder }) => (
        <div key={key}>
          <label className="mb-1 block text-sm font-medium text-white">
            {label}
          </label>
          <textarea
            value={values[key]}
            onChange={(e) => update(key, e.target.value)}
            placeholder={placeholder}
            rows={3}
            className="w-full rounded border border-dimmer bg-surface/50 px-3 py-2 text-sm text-white placeholder:text-steel/60 focus:border-gold focus:outline-none resize-y"
          />
        </div>
      ))}

      {error && (
        <p className="rounded border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400">
          Review saved successfully.
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded border border-gold bg-gold/20 px-5 py-2 text-sm font-medium text-gold hover:bg-gold/30 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Saving...' : `Complete ${kind} review`}
      </button>
    </form>
  );
}
