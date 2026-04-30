'use client';

import { useMode } from '@/components/ModeProvider';
import type { ThemeMode } from '@/lib/labels';

const MODES: { value: ThemeMode; label: string; hint: string }[] = [
  {
    value: 'regular',
    label: 'Regular',
    hint: 'Dashboard · In Progress · Step 1 — Definition',
  },
  {
    value: 'nautical',
    label: 'Nautical',
    hint: 'Fleet · Drydock Gate · Blueprint / Charting / Launched',
  },
  {
    value: 'rct',
    label: 'Roller Coaster Tycoon',
    hint: 'Park Map · Workshop · Drafting / Building / Open',
  },
];

export function ThemeModeToggle() {
  const { mode, setMode } = useMode();

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
      {MODES.map((opt) => {
        const active = opt.value === mode;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setMode(opt.value)}
            className={`flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors min-h-[120px] ${
              active
                ? 'border-gold bg-gold/10 text-white'
                : 'border-dimmer bg-surface text-steel hover:border-gold/60 hover:text-white'
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-base font-bold tracking-wide text-white">
                {opt.label}
              </span>
              {active && (
                <span className="rounded-full border border-gold/40 bg-gold/20 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-gold">
                  Active
                </span>
              )}
            </div>
            <span className="text-sm leading-relaxed">{opt.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
