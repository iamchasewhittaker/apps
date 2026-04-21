'use client';

import { useState } from 'react';

interface Props {
  slug: string;
  variant?: 'pill' | 'button';
}

export function CopyDevCommand({ slug, variant = 'pill' }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const cmd = `cd ~/Developer/chase/portfolio/${slug} && npm run dev`;
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard API unavailable — no-op */
    }
  }

  if (variant === 'button') {
    return (
      <button
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-gold hover:text-gold"
      >
        <span className={`inline-block h-2 w-2 rounded-full ${copied ? 'bg-success' : 'bg-gold'}`} />
        {copied ? 'Copied — paste in terminal' : 'Start local dev'}
      </button>
    );
  }

  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 font-mono text-sm text-gold hover:underline"
    >
      <span className={`inline-block h-2 w-2 rounded-full ${copied ? 'bg-success' : 'bg-gold'}`} />
      {copied ? 'Copied — paste in terminal' : 'Start local dev'}
    </button>
  );
}
