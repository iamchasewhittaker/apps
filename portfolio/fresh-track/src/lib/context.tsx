"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { AppState } from "./types";
import { load, save } from "./store";

interface AppContextType {
  state: AppState;
  update: (fn: (prev: AppState) => AppState) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    items: [],
    customShelfLife: {},
    settings: { warningDays: 2, defaultStorage: "fridge" },
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(load());
    setLoaded(true);
  }, []);

  const update = useCallback((fn: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = fn(prev);
      save(next);
      return next;
    });
  }, []);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950 text-zinc-500">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{ state, update }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
