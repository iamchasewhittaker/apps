"use client";

import { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/context";
import {
  addItem,
  deleteItem,
  getInboxItems,
  updateItemText,
} from "@/lib/store";
import type { Item } from "@/lib/types";

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
          aria-label="Add item"
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
            <InboxRow
              key={item.id}
              item={item}
              onSave={(text) =>
                update((s) => updateItemText(s, item.id, text))
              }
              onDelete={() => update((s) => deleteItem(s, item.id))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function InboxRow({
  item,
  onSave,
  onDelete,
}: {
  item: Item;
  onSave: (text: string) => void;
  onDelete: () => void;
}) {
  const [mode, setMode] = useState<"view" | "edit" | "confirm-delete">("view");
  const [draft, setDraft] = useState(item.text);
  const editRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === "edit") {
      editRef.current?.focus();
      editRef.current?.select();
    }
  }, [mode]);

  useEffect(() => {
    if (mode !== "confirm-delete") return;
    const t = setTimeout(() => setMode("view"), 3000);
    return () => clearTimeout(t);
  }, [mode]);

  function commit() {
    if (!draft.trim()) {
      setMode("view");
      setDraft(item.text);
      return;
    }
    onSave(draft);
    setMode("view");
  }

  function cancel() {
    setDraft(item.text);
    setMode("view");
  }

  if (mode === "edit") {
    return (
      <div className="bg-zinc-900 border border-amber-500/40 rounded-xl px-3 py-2 flex items-center gap-2">
        <input
          ref={editRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") cancel();
          }}
          className="flex-1 bg-transparent border-none outline-none text-zinc-100 text-sm px-1 py-2"
          autoComplete="off"
          autoCorrect="off"
          aria-label="Edit item text"
        />
        <button
          type="button"
          onClick={commit}
          className="min-w-[44px] h-11 px-3 rounded-lg bg-amber-500 text-zinc-950 text-sm font-semibold active:scale-95 transition-transform"
          aria-label="Save edit"
        >
          Save
        </button>
        <button
          type="button"
          onClick={cancel}
          className="min-w-[44px] h-11 px-3 rounded-lg border border-zinc-700 text-zinc-400 text-sm active:scale-95 transition-transform"
          aria-label="Cancel edit"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (mode === "confirm-delete") {
    return (
      <div className="bg-red-950/40 border border-red-500/50 rounded-xl px-3 py-2 flex items-center gap-2">
        <p className="flex-1 text-red-300 text-sm px-1">
          Tap trash again to delete
        </p>
        <button
          type="button"
          onClick={onDelete}
          className="w-11 h-11 flex items-center justify-center rounded-lg bg-red-600 text-white text-base active:scale-95 transition-transform"
          aria-label="Confirm delete"
        >
          {trashIcon}
        </button>
        <button
          type="button"
          onClick={() => setMode("view")}
          className="min-w-[44px] h-11 px-3 rounded-lg border border-zinc-700 text-zinc-400 text-sm active:scale-95 transition-transform"
          aria-label="Cancel delete"
        >
          Keep
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 flex items-center gap-2">
      <p className="flex-1 text-zinc-300 text-sm px-1 py-2 break-words min-w-0">
        {item.text}
      </p>
      <button
        type="button"
        onClick={() => setMode("edit")}
        className="w-11 h-11 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-200 active:scale-95 transition-transform"
        aria-label={`Edit "${item.text}"`}
      >
        {pencilIcon}
      </button>
      <button
        type="button"
        onClick={() => setMode("confirm-delete")}
        className="w-11 h-11 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 active:scale-95 transition-transform"
        aria-label={`Delete "${item.text}"`}
      >
        {trashIcon}
      </button>
    </div>
  );
}

const pencilIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </svg>
);

const trashIcon = (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);
