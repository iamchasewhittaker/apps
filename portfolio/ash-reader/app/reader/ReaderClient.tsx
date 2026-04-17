"use client";
import { useState, useEffect, useRef } from "react";
import ChunkReader from "@/components/ChunkReader";
import { wordCount } from "@/lib/chunker";

const PASTE_KEY = "ash_reader_pasted_text";

interface Props {
  fileText: string | null;
}

type Tab = "file" | "paste";

export default function ReaderClient({ fileText }: Props) {
  const defaultTab: Tab = fileText ? "file" : "paste";
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [draft, setDraft] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Restore pasted text from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(PASTE_KEY);
    if (saved) {
      setDraft(saved);
      setSubmitted(saved);
    }
  }, []);

  function handleDraftChange(val: string) {
    setDraft(val);
    localStorage.setItem(PASTE_KEY, val);
    // Reset submitted so ChunkReader clears until user re-submits
    setSubmitted(null);
  }

  function handleSubmit() {
    if (!draft.trim()) return;
    setSubmitted(draft);
  }

  function handleClear() {
    setDraft("");
    setSubmitted(null);
    localStorage.removeItem(PASTE_KEY);
    textareaRef.current?.focus();
  }

  const wc = wordCount(draft);

  const tabBtn = (t: Tab, label: string) => (
    <button
      onClick={() => setTab(t)}
      style={{
        padding: "7px 16px",
        borderRadius: 20,
        border: "1px solid",
        borderColor: tab === t ? "#7c9cff" : "#2e2e2e",
        background: tab === t ? "#3d4f80" : "transparent",
        color: tab === t ? "#fff" : "#777",
        cursor: "pointer",
        fontSize: 14,
        fontWeight: tab === t ? 600 : 400,
      }}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {fileText && tabBtn("file", "📂 Load File")}
        {tabBtn("paste", "📋 Paste Text")}
      </div>

      {tab === "file" && fileText && (
        <ChunkReader text={fileText} storageKey="reader_file" defaultSize={2000} />
      )}

      {tab === "paste" && (
        <div>
          {submitted ? (
            <>
              {/* Back to paste button */}
              <button
                onClick={() => setSubmitted(null)}
                style={{
                  marginBottom: 16,
                  background: "none",
                  border: "none",
                  color: "#7c9cff",
                  cursor: "pointer",
                  fontSize: 13,
                  padding: 0,
                }}
              >
                ← Edit text
              </button>
              <ChunkReader text={submitted} storageKey="reader_paste" defaultSize={2000} />
            </>
          ) : (
            <div>
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => handleDraftChange(e.target.value)}
                placeholder="Paste your ChatGPT conversation here…"
                style={{
                  width: "100%",
                  minHeight: 320,
                  background: "#1a1a1a",
                  border: "1px solid #2e2e2e",
                  borderRadius: 12,
                  padding: 16,
                  color: "#e8e8e8",
                  fontSize: 15,
                  fontFamily: "monospace",
                  lineHeight: 1.6,
                  resize: "vertical",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 12,
                  gap: 12,
                }}
              >
                <span style={{ fontSize: 13, color: "#555" }}>
                  {wc.toLocaleString()} words
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  {draft && (
                    <button
                      onClick={handleClear}
                      style={{
                        padding: "10px 18px",
                        borderRadius: 10,
                        border: "1px solid #2e2e2e",
                        background: "transparent",
                        color: "#777",
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={handleSubmit}
                    disabled={!draft.trim()}
                    style={{
                      padding: "10px 20px",
                      borderRadius: 10,
                      border: "none",
                      background: draft.trim() ? "#3d4f80" : "#252525",
                      color: draft.trim() ? "#fff" : "#444",
                      cursor: draft.trim() ? "pointer" : "default",
                      fontSize: 14,
                      fontWeight: 600,
                    }}
                  >
                    Read Chunks →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
