'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useThemeMode } from '@/lib/theme-mode';
import {
  resolveLabel,
  resolveStep,
  type LabelKey,
  type ThemeMode,
} from '@/lib/labels';

interface ModeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useThemeMode();
  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) {
    return {
      mode: 'regular',
      setMode: () => {},
    };
  }
  return ctx;
}

export function useLabel(key: LabelKey): string {
  const { mode } = useMode();
  return resolveLabel(key, mode);
}

export function useStepLabel(step: number): string {
  const { mode } = useMode();
  return resolveStep(step, mode);
}
