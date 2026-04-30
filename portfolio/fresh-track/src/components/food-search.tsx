"use client";

import { useState, useRef, useEffect } from "react";
import { searchFoods } from "@/lib/foodkeeper";
import { FoodKeeperEntry } from "@/lib/types";

interface FoodSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (entry: FoodKeeperEntry) => void;
  placeholder?: string;
}

export function FoodSearch({
  value,
  onChange,
  onSelect,
  placeholder = "Type a food name...",
}: FoodSearchProps) {
  const [results, setResults] = useState<FoodKeeperEntry[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (value.length >= 2) {
      setResults(searchFoods(value));
      setShowResults(true);
      setActiveIndex(-1);
    } else {
      setResults([]);
      setShowResults(false);
    }
  }, [value]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showResults || results.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      onSelect(results[activeIndex]);
      setShowResults(false);
    } else if (e.key === "Escape") {
      setShowResults(false);
    }
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => value.length >= 2 && setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-50 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-600 text-base"
        autoComplete="off"
      />
      {showResults && results.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full mt-1 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden shadow-lg max-h-60 overflow-y-auto"
        >
          {results.map((entry, i) => (
            <li
              key={entry.name}
              onMouseDown={() => {
                onSelect(entry);
                setShowResults(false);
              }}
              className={`px-4 py-3 cursor-pointer transition-colors ${
                i === activeIndex
                  ? "bg-emerald-950 text-emerald-300"
                  : "hover:bg-zinc-800"
              }`}
            >
              <div className="font-medium">{entry.name}</div>
              <div className="text-xs text-zinc-500">
                {entry.category} · Fridge: {entry.fridgeDaysMin}-{entry.fridgeDaysMax}d
                {entry.freezerMonthsMax > 0 &&
                  ` · Freezer: ${entry.freezerMonthsMax}mo`}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
