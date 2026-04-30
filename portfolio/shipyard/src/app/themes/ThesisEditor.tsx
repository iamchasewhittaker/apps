'use client';

import { useState, useTransition } from 'react';
import { updateThesis } from './actions';

interface Props {
  initialText: string | null;
}

export function ThesisEditor({ initialText }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialText ?? '');
  const [text, setText] = useState(initialText ?? '');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    const next = draft.trim();
    startTransition(async () => {
      const result = await updateThesis(next);
      if (!result.ok) {
        setError(result.error ?? 'Save failed');
        return;
      }
      setText(next);
      setEditing(false);
    });
  }

  function cancel() {
    setDraft(text);
    setError(null);
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <textarea
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) save();
            if (e.key === 'Escape') cancel();
          }}
          rows={3}
          placeholder="One sentence. The north star that ties every app together."
          className="w-full rounded-md border border-gold/50 bg-surface/80 px-3 py-2 text-sm text-white placeholder:text-steel focus:outline-none focus:border-gold resize-none"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={save}
            disabled={isPending}
            className="rounded-md border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold hover:bg-gold/20 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={cancel}
            disabled={isPending}
            className="rounded-md border border-dimmer px-3 py-1 text-xs font-medium text-steel hover:text-white transition-colors"
          >
            Cancel
          </button>
          {error && <span className="text-xs text-danger">{error}</span>}
          <span className="ml-auto text-[10px] text-steel">⌘+Enter to save · Esc to cancel</span>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="w-full text-left group"
    >
      {text ? (
        <p className="text-sm text-white leading-relaxed group-hover:text-gold transition-colors">
          {text}
        </p>
      ) : (
        <p className="text-sm italic text-steel group-hover:text-gold/60 transition-colors">
          No thesis set yet. Click to define your north star.
        </p>
      )}
      <span className="mt-2 inline-block text-[10px] uppercase tracking-wider text-steel opacity-0 group-hover:opacity-100 transition-opacity">
        edit
      </span>
    </button>
  );
}
