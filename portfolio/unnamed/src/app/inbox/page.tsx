"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/context";
import { addItem, getInboxItems } from "@/lib/store";

export default function InboxPage() {
  const { state, update } = useApp();
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const items = getInboxItems(state);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    update((s) => addItem(s, text));
    setText("");
    inputRef.current?.focus();
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto px-4 pt-12">
      <h1 className="text-2xl font-bold text-zinc-100 mb-1">Capture</h1>
      <p className="text-sm text-zinc-500 mb-6">
        Dump it here. Don&apos;t think. Don&apos;t organize.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 text-base"
          autoComplete="off"
          autoCorrect="off"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="bg-amber-500 text-zinc-950 font-semibold rounded-xl px-5 py-3.5 disabled:opacity-30 active:scale-95 transition-transform text-base"
        >
          +
        </button>
      </form>

      {items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-zinc-600 text-center">
            Nothing in the inbox.
            <br />
            <span className="text-zinc-700 text-sm">
              That&apos;s either great or suspicious.
            </span>
          </p>
        </div>
      ) : (
        <div className="space-y-2 overflow-y-auto flex-1">
          <p className="text-xs text-zinc-600 uppercase tracking-wider mb-3">
            {items.length} unsorted {items.length === 1 ? "item" : "items"}
          </p>
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 text-sm"
            >
              {item.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
