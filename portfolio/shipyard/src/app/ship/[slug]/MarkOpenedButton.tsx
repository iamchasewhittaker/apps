'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function MarkOpenedButton({ slug }: { slug: string }) {
  const router = useRouter();
  const [marking, setMarking] = useState(false);
  const [markedAt, setMarkedAt] = useState<string | null>(null);

  async function markOpened() {
    setMarking(true);
    const res = await fetch(`/api/ship/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ last_opened_at: 'now' }),
    });
    if (res.ok) {
      setMarkedAt(new Date().toLocaleTimeString());
      router.refresh();
    }
    setMarking(false);
  }

  return (
    <button
      onClick={markOpened}
      disabled={marking}
      className="mt-3 rounded-md border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold hover:bg-gold/20 transition-colors disabled:opacity-50"
    >
      {markedAt ? `Marked at ${markedAt}` : marking ? 'Marking...' : 'Mark as opened now'}
    </button>
  );
}
