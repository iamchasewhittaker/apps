'use client';

import { useMode } from '@/components/ModeProvider';
import type { ThemeMode } from '@/lib/labels';

const MODES: { value: ThemeMode; label: string; hint: string }[] = [
  {
    value: 'nautical',
    label: 'Nautical',
    hint: 'Fleet · Drydock Gate · Harbor · Blueprint / Charting / Launched',
  },
  {
    value: 'regular',
    label: 'Regular',
    hint: 'Dashboard · In Progress · Linear · Step 1 / Step 2 / Shipped',
  },
];

export default function SettingsPage() {
  const { mode, setMode } = useMode();

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-accent">Settings</h1>
        <p className="text-sm text-muted">
          Personal preferences, persisted in this browser.
        </p>
      </div>

      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="font-mono-label text-[11px] text-muted">Theme mode</h2>
          <p className="text-sm text-foreground">
            Switch between nautical vocabulary and plain project names. Colors and layout stay the same.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {MODES.map((opt) => {
            const active = opt.value === mode;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setMode(opt.value)}
                className={`flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors ${
                  active
                    ? 'border-accent bg-accent/10 text-foreground'
                    : 'border-border bg-card text-muted hover:border-accent/60 hover:text-foreground'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-display text-lg uppercase tracking-wider text-white">
                    {opt.label}
                  </span>
                  {active && (
                    <span className="rounded-full border border-accent/40 bg-accent/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                      Active
                    </span>
                  )}
                </div>
                <span className="text-xs leading-relaxed">{opt.hint}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
