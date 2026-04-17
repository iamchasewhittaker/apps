"use client";
import { useState, useEffect, useCallback } from "react";
import { chunkSmart, stripMarkdown, wordCount, charCount } from "@/lib/chunker";
import { markSent, isSent, getSentCount, resetProgress, getPromptPrefix, isPromptPrefixEnabled } from "@/lib/progress";

interface Props {
  text: string;
  storageKey: string;
  defaultSize?: number;
}

const SIZES = [1000, 1500, 2000];

export default function ChunkReader({ text, storageKey, defaultSize = 2000 }: Props) {
  const [size, setSize] = useState(defaultSize);
  const [idx, setIdx] = useState(0);
  const [chunks, setChunks] = useState<string[]>([]);
  const [sentMap, setSentMap] = useState<boolean[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const c = chunkSmart(text, size);
    setChunks(c);
    setIdx(0);
    // Find first unsent chunk
    const firstUnsent = c.findIndex((_, i) => !isSent(storageKey, i));
    setIdx(firstUnsent >= 0 ? firstUnsent : 0);
    setSentMap(c.map((_, i) => isSent(storageKey, i)));
  }, [text, size, storageKey]);

  const toggleSent = useCallback((i: number) => {
    const next = !sentMap[i];
    markSent(storageKey, i, next);
    setSentMap((prev) => {
      const updated = [...prev];
      updated[i] = next;
      return updated;
    });
  }, [sentMap, storageKey]);

  const handleCopy = useCallback(async () => {
    if (!chunks[idx]) return;
    const clean = stripMarkdown(chunks[idx]);
    const prefixOn = isPromptPrefixEnabled();
    const prefix = prefixOn ? getPromptPrefix() : "";
    const content = prefixOn ? `${prefix}\n\n${clean}` : clean;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [chunks, idx]);

  const handleReset = useCallback(() => {
    if (!confirm("Reset all progress for this section?")) return;
    resetProgress(storageKey, chunks.length);
    setSentMap(chunks.map(() => false));
    setIdx(0);
  }, [storageKey, chunks]);

  if (!chunks.length) return <p style={{ color: "#777" }}>Loading…</p>;

  const chunk = chunks[idx];
  const sent = sentMap[idx] ?? false;
  const sentCount = sentMap.filter(Boolean).length;
  const wc = wordCount(chunk);
  const cc = charCount(stripMarkdown(chunk));

  return (
    <div>
      {/* Size selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {SIZES.map((s) => (
          <button
            key={s}
            onClick={() => setSize(s)}
            style={{
              padding: "6px 14px",
              borderRadius: 20,
              border: "1px solid",
              borderColor: size === s ? "#7c9cff" : "#2e2e2e",
              background: size === s ? "#3d4f80" : "transparent",
              color: size === s ? "#fff" : "#777",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: size === s ? 600 : 400,
            }}
          >
            {s.toLocaleString()}w
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, color: "#777" }}>
          <span>{sentCount} / {chunks.length} sent</span>
          <button
            onClick={handleReset}
            style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 13 }}
          >
            Reset
          </button>
        </div>
        <div style={{ height: 4, background: "#2e2e2e", borderRadius: 2 }}>
          <div style={{
            height: "100%",
            width: `${(sentCount / chunks.length) * 100}%`,
            background: "#7c9cff",
            borderRadius: 2,
            transition: "width 0.3s",
          }} />
        </div>
      </div>

      {/* Chunk header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
        flexWrap: "wrap",
        gap: 8,
      }}>
        <div>
          <span style={{ fontWeight: 600, fontSize: 15 }}>
            Chunk {idx + 1} of {chunks.length}
          </span>
          <span style={{ color: "#777", fontSize: 13, marginLeft: 8 }}>
            {wc.toLocaleString()} words · ~{cc.toLocaleString()} chars
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleCopy}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              border: "none",
              background: copied ? "#2a3a2a" : "#3d4f80",
              color: copied ? "#6dbf6d" : "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              minWidth: 90,
            }}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
          <button
            onClick={() => toggleSent(idx)}
            style={{
              padding: "7px 16px",
              borderRadius: 8,
              border: "1px solid",
              borderColor: sent ? "#6dbf6d" : "#2e2e2e",
              background: sent ? "#1a2e1a" : "transparent",
              color: sent ? "#6dbf6d" : "#777",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {sent ? "Sent ✓" : "Mark sent"}
          </button>
        </div>
      </div>

      {/* Chunk text */}
      <div style={{
        background: sent ? "#141f14" : "#1a1a1a",
        border: "1px solid",
        borderColor: sent ? "#2a3a2a" : "#2e2e2e",
        borderRadius: 12,
        padding: "20px 20px",
        marginBottom: 20,
        whiteSpace: "pre-wrap",
        lineHeight: 1.75,
        fontSize: 16,
        opacity: sent ? 0.6 : 1,
        minHeight: 200,
      }}>
        {chunk}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 12, justifyContent: "space-between" }}>
        <button
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: 12,
            border: "1px solid #2e2e2e",
            background: "transparent",
            color: idx === 0 ? "#444" : "#e8e8e8",
            cursor: idx === 0 ? "default" : "pointer",
            fontSize: 17,
            fontWeight: 600,
          }}
        >
          ← Prev
        </button>
        <button
          onClick={() => setIdx((i) => Math.min(chunks.length - 1, i + 1))}
          disabled={idx === chunks.length - 1}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: 12,
            border: "none",
            background: idx === chunks.length - 1 ? "#252525" : "#3d4f80",
            color: idx === chunks.length - 1 ? "#444" : "#fff",
            cursor: idx === chunks.length - 1 ? "default" : "pointer",
            fontSize: 17,
            fontWeight: 600,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
