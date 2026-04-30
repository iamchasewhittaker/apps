'use client';

import { useEffect, useState } from 'react';
import type { ThemeMode } from './labels';

const STORAGE_KEY = 'shipyard_theme_mode';
const DEFAULT_MODE: ThemeMode = 'regular';
const VALID_MODES: ThemeMode[] = ['regular', 'nautical', 'rct'];

function isValidMode(value: unknown): value is ThemeMode {
  return typeof value === 'string' && (VALID_MODES as string[]).includes(value);
}

export function readMode(): ThemeMode {
  if (typeof window === 'undefined') return DEFAULT_MODE;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isValidMode(stored) ? stored : DEFAULT_MODE;
}

export function writeMode(mode: ThemeMode) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, mode);
  window.dispatchEvent(new CustomEvent('shipyard:theme-change', { detail: mode }));
}

export function useThemeMode(): [ThemeMode, (mode: ThemeMode) => void] {
  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);

  useEffect(() => {
    setModeState(readMode());
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ThemeMode>).detail;
      if (isValidMode(detail)) setModeState(detail);
    };
    window.addEventListener('shipyard:theme-change', handler);
    return () => window.removeEventListener('shipyard:theme-change', handler);
  }, []);

  const setMode = (next: ThemeMode) => {
    writeMode(next);
    setModeState(next);
  };

  return [mode, setMode];
}
