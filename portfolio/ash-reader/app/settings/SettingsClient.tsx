"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  exportAll, importAll,
  getPromptPrefix, setPromptPrefix,
  isPromptPrefixEnabled, setPromptPrefixEnabled,
} from "@/lib/progress";

const DEFAULT_PREFIX = "Here's a section from my capture system conversation. Walk me through it like a therapist and help me process what I was feeling and what I learned:";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "#1a1a1a",
      border: "1px solid #2e2e2e",
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
    }}>
      <h2 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700 }}>{title}</h2>
      {children}
    </div>
  );
}

export default function SettingsClient() {
  const [prefixOn, setPrefixOn] = useState(false);
  const [prefix, setPrefix] = useState(DEFAULT_PREFIX);
  const [importMsg, setImportMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPrefixOn(isPromptPrefixEnabled());
    setPrefix(getPromptPrefix());
  }, []);

  const handlePrefixToggle = useCallback(() => {
    const next = !prefixOn;
    setPrefixOn(next);
    setPromptPrefixEnabled(next);
  }, [prefixOn]);

  const handlePrefixChange = useCallback((val: string) => {
    setPrefix(val);
    setPromptPrefix(val);
  }, []);

  const handleExport = useCallback(() => {
    const data = exportAll();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ash-reader-progress.json";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const { chunks, actions } = importAll(ev.target?.result as string);
        setImportMsg(`Restored — ${chunks} chunks marked, ${actions} actions complete`);
        setTimeout(() => setImportMsg(""), 4000);
      } catch {
        setImportMsg("Error: invalid file format");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  return (
    <div>
      {/* Export / Import */}
      <Section title="Progress Sync">
        <p style={{ color: "#777", fontSize: 14, margin: "0 0 16px" }}>
          Export your progress to transfer it to another device (e.g., from desktop to iPhone).
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={handleExport}
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              border: "1px solid #3d4f80",
              background: "transparent",
              color: "#7c9cff",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            ↓ Export Progress
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            style={{
              padding: "12px 20px",
              borderRadius: 10,
              border: "none",
              background: "#3d4f80",
              color: "#fff",
              cursor: "pointer",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            ↑ Import Progress
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: "none" }} />
        </div>
        {importMsg && (
          <p style={{ color: "#6dbf6d", fontSize: 14, marginTop: 12, marginBottom: 0 }}>
            ✓ {importMsg}
          </p>
        )}
      </Section>

      {/* Prompt prefix */}
      <Section title="Ash Prompt Prefix">
        <p style={{ color: "#777", fontSize: 14, margin: "0 0 16px" }}>
          When enabled, copying a chunk prepends this message — so you can paste directly into Ash without typing anything.
        </p>
        <div
          onClick={handlePrefixToggle}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 16,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <div style={{
            width: 48,
            height: 28,
            borderRadius: 14,
            background: prefixOn ? "#3d4f80" : "#2e2e2e",
            position: "relative",
            transition: "background 0.2s",
            flexShrink: 0,
          }}>
            <div style={{
              position: "absolute",
              top: 3,
              left: prefixOn ? 23 : 3,
              width: 22,
              height: 22,
              borderRadius: 11,
              background: prefixOn ? "#7c9cff" : "#666",
              transition: "left 0.2s",
            }} />
          </div>
          <span style={{ fontSize: 15, color: prefixOn ? "#e8e8e8" : "#777" }}>
            {prefixOn ? "Enabled" : "Disabled"}
          </span>
        </div>
        {prefixOn && (
          <>
            <textarea
              value={prefix}
              onChange={(e) => handlePrefixChange(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                background: "#111",
                border: "1px solid #2e2e2e",
                borderRadius: 8,
                color: "#e8e8e8",
                fontSize: 14,
                padding: 12,
                lineHeight: 1.6,
                resize: "vertical",
                fontFamily: "inherit",
              }}
            />
            <button
              onClick={() => handlePrefixChange(DEFAULT_PREFIX)}
              style={{
                marginTop: 8,
                background: "none",
                border: "none",
                color: "#555",
                cursor: "pointer",
                fontSize: 13,
                padding: 0,
              }}
            >
              Reset to default
            </button>
          </>
        )}
      </Section>

      {/* App info */}
      <div style={{ color: "#444", fontSize: 13, textAlign: "center", marginTop: 24 }}>
        Ash Reader · {new Date().getFullYear()} · Progress stored locally in browser
      </div>
    </div>
  );
}
