"use client";
import { useState, useCallback } from "react";
import type { ThemeSection } from "@/lib/themes";
import ChunkReader from "@/components/ChunkReader";
import { stripMarkdown } from "@/lib/chunker";
import { getPromptPrefix, isPromptPrefixEnabled } from "@/lib/progress";

interface Props {
  sections: ThemeSection[];
  summary: Record<string, string> | null;
}

const SIZES = [1000, 1500, 2000];

function SummaryBlock({ summary }: { summary: Record<string, string> }) {
  const [size, setSize] = useState(2000);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const text = summary[String(size)] ?? "";
    const prefixOn = isPromptPrefixEnabled();
    const prefix = prefixOn ? getPromptPrefix() : "";
    const content = prefixOn ? `${prefix}\n\n${text}` : text;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [summary, size]);

  return (
    <div style={{
      background: "#1a1a1a",
      border: "1px solid #2e2e2e",
      borderRadius: 12,
      padding: 20,
      marginBottom: 32,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 15 }}>📋 Document Summary</span>
        <div style={{ display: "flex", gap: 8 }}>
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              style={{
                padding: "4px 10px",
                borderRadius: 16,
                border: "1px solid",
                borderColor: size === s ? "#7c9cff" : "#2e2e2e",
                background: size === s ? "#3d4f80" : "transparent",
                color: size === s ? "#fff" : "#777",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              {s}w
            </button>
          ))}
          <button
            onClick={handleCopy}
            style={{
              padding: "4px 12px",
              borderRadius: 16,
              border: "none",
              background: copied ? "#2a3a2a" : "#3d4f80",
              color: copied ? "#6dbf6d" : "#fff",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
      </div>
      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 15, color: "#ddd" }}>
        {summary[String(size)] ?? "Summary not available for this length."}
      </div>
    </div>
  );
}

function ThemeAccordion({ section, index }: { section: ThemeSection; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      border: "1px solid #2e2e2e",
      borderRadius: 12,
      marginBottom: 10,
      overflow: "hidden",
    }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          padding: "14px 16px",
          background: open ? "#1e1e2e" : "#1a1a1a",
          border: "none",
          color: "#e8e8e8",
          textAlign: "left",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 15,
          fontWeight: 600,
        }}
      >
        <span>{index + 1}. {section.title}</span>
        <span style={{ color: "#777", fontSize: 18 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div style={{ padding: "16px", borderTop: "1px solid #2e2e2e", background: "#111" }}>
          <ChunkReader
            text={section.content}
            storageKey={`theme_${section.id}`}
            defaultSize={2000}
          />
        </div>
      )}
    </div>
  );
}

export default function ThemesClient({ sections, summary }: Props) {
  return (
    <div>
      {summary && <SummaryBlock summary={summary} />}
      {!summary && (
        <div style={{
          background: "#1a1a1a",
          border: "1px dashed #2e2e2e",
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          color: "#777",
          fontSize: 14,
        }}>
          📋 Summary not generated yet. Run <code style={{ color: "#aaa" }}>pnpm generate-summary</code> to create it.
        </div>
      )}
      {sections.map((s, i) => (
        <ThemeAccordion key={s.id} section={s} index={i} />
      ))}
    </div>
  );
}
